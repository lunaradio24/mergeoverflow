import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { ChatRoomGateway } from './chat-room.gateway';
import { NotificationType } from 'src/notifications/types/notification-type.type';
import { NotificationGateway } from 'src/notifications/notification.gateway';
import { UserService } from 'src/users/user.service';
import { NotificationService } from 'src/notifications/notification.service';
import { PartnersRO } from './ro/partners.ro';

@Injectable()
export class ChatRoomService {
  private logger: Logger;
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    private readonly chatRoomGateway: ChatRoomGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {
    this.logger = new Logger('chat');
  }

  async createChatRoom(user1Id: number, user2Id: number): Promise<number> {
    const chatRoom = await this.chatRoomRepository.save({ user1Id, user2Id });
    const chatRoomId = chatRoom.id;
    return chatRoomId;
  }

  async exitChatRoom(userId: number, roomId: number): Promise<void> {
    // 존재하는 채팅방인지 확인
    await this.isUserInChatRoom(userId, roomId);

    // 채팅방에 속한 유저 아이디 가져오기
    const { user1Id, user2Id } = await this.findUserIdsInChatRoom(roomId);

    // 내 닉네임과 상대방 닉네임 가져오기
    const user1Nickname = await this.userService.findNicknameByUserId(user1Id);
    const user2Nickname = await this.userService.findNicknameByUserId(user2Id);

    // 채팅방 퇴장 알림 메시지 저장
    const messageToUser1 = `${user2Nickname}님과의 연결이 끊어졌습니다.`;
    const messageToUser2 = `${user1Nickname}님과의 연결이 끊어졌습니다.`;
    await this.notificationService.saveNotification(user1Id, messageToUser1, NotificationType.EXIT);
    await this.notificationService.saveNotification(user2Id, messageToUser2, NotificationType.EXIT);

    // 채팅방 퇴장 알림 메시지 전송
    this.notificationGateway.server
      .to(user1Id.toString())
      .emit('exitNotify', { userId: user1Id, type: NotificationType.EXIT, message: messageToUser1 });

    this.notificationGateway.server
      .to(user2Id.toString())
      .emit('exitNotify', { userId: user2Id, type: NotificationType.EXIT, message: messageToUser2 });

    // chat socket에서 퇴장
    this.chatRoomGateway.server.emit('exit', { roomId });
    this.logger.log(`${userId}번 user가 ${roomId}번 방에서 퇴장하셨습니다.`);

    // 채팅방 삭제
    await this.chatRoomRepository.delete({ id: roomId });
    this.logger.log(`${user1Id}번 user와 ${user2Id}번 user의 채팅방 #${roomId}이 삭제되었습니다.`);
  }

  async getRoomMessage(roomId: number) {
    const data = await this.chatMessageRepository.find({
      where: { roomId },
      select: { text: true, senderId: true, sender: { nickname: true } },
      order: { createdAt: 'ASC' },
      relations: ['sender'],
    });
    const messages = data.map((msg) => ({
      nickname: msg.sender.nickname,
      text: msg.text,
    }));
    return messages;
  }

  async saveMessage(userId: number, roomId: number, message: string): Promise<void> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });
    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 방이거나 접근 권한이 없습니다.');
    }
    await this.chatMessageRepository.save({ roomId, senderId: userId, text: message });
  }

  async isUserInChatRoom(userId: number, roomId: number): Promise<boolean> {
    // 존재하는 채팅방인지 확인
    const room = await this.findChatRoom(roomId);
    const { user1Id, user2Id } = room;
    const userIdsInChatRoom = [user1Id, user2Id];

    // 해당 채팅방에 속한 유저인지 확인
    const isUserInChatRoom = userIdsInChatRoom.includes(userId);
    if (!isUserInChatRoom) {
      throw new UnauthorizedException('해당 채팅방에 접근 권한이 없습니다.');
    }
    return true;
  }

  async findChatRoom(roomId: number): Promise<ChatRoom | null> {
    const room = await this.chatRoomRepository.findOneBy({ id: roomId });
    if (!room) {
      throw new NotFoundException('존재하지 않는 채팅방입니다.');
    }
    return room;
  }

  async findUserIdsInChatRoom(roomId: number): Promise<PartnersRO> {
    const { user1Id, user2Id } = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      select: { user1Id: true, user2Id: true },
    });
    return { user1Id, user2Id };
  }

  async getUserChatRooms(userId: number) {
    const chatRooms = await this.chatRoomRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ['messages', 'user1', 'user2', 'user1.images', 'user2.images'],
      select: {
        id: true,
        createdAt: true,
        user1: {
          id: true,
          nickname: true,
          images: { imageUrl: true },
        },
        user2: {
          id: true,
          nickname: true,
          images: { imageUrl: true },
        },
        messages: true,
      },
      order: {
        messages: {
          createdAt: 'DESC',
        },
      },
    });

    const returnData = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        const otherUser = chatRoom.user1.id === userId ? chatRoom.user2 : chatRoom.user1;
        const otherUserImages = otherUser.images.map((image) => image.imageUrl);
        const sortedMessages = chatRoom.messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const latestMessage = sortedMessages[0];
        return {
          id: chatRoom.id,
          createdAt: chatRoom.createdAt,
          otherUser: { id: otherUser.id, nickname: otherUser.nickname, images: otherUserImages },
          latestMessageText: { text: latestMessage?.text, createdAt: latestMessage?.createdAt },
        };
      }),
    );
    return returnData;
  }
}
