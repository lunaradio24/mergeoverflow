import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { ChatRoomGateway } from './chat-room.gateway';
import { NotificationType } from 'src/notifications/types/notification-type.type';
import { NotificationGateway } from 'src/notifications/notification.gateway';
import { UserService } from 'src/users/user.service';
import { PartnersRO } from './ro/partners.ro';
import { aw } from '@upstash/redis/zmscore-80635339';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,

    private readonly chatRoomGateway: ChatRoomGateway,
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
  ) {}

  async createChatRoom(user1Id: number, user2Id: number): Promise<void> {
    const chatRoom = await this.chatRoomRepository.save({ user1Id, user2Id });
    this.chatRoomGateway.server.emit('createChatRoom', { chatRoomId: chatRoom.id, user1Id, user2Id });
  }

  async exitChatRoom(userId: number, roomId: number): Promise<void> {
    await this.isUserInChatRoom(userId, roomId);
    const relationId = await this.findPartnerUserId(roomId);
    const partnerId = userId === relationId.user1Id ? relationId.user2Id : relationId.user1Id;

    const partnerNickname = await this.userService.findNicknameByUserId(partnerId);
    this.notificationGateway.server
      .to(userId.toString())
      .emit('exitNotify', { partnerId, type: NotificationType.EXIT, partnerNickname });
    this.chatRoomGateway.server.emit('exit', { roomId });
    await this.chatRoomRepository.delete({ id: roomId });
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
    const chatRoom = await this.chatRoomRepository.findOne({
      where: [
        { id: roomId, user1Id: userId },
        { id: roomId, user2Id: userId },
      ],
    });
    if (!chatRoom) {
      throw new UnauthorizedException('해당 채팅방에 접근 권한이 없습니다.');
    }
    return true;
  }

  async findPartnerUserId(roomId: number): Promise<PartnersRO> {
    const { user1Id, user2Id } = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      select: { user1Id: true, user2Id: true },
    });
    return { user1Id, user2Id };
  }

  async getUserChatRooms(userId: number) {
    const chatRooms = await this.chatRoomRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ['user1', 'user2', 'user1.images', 'user2.images'],
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
      },
    });

    const returnData = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        const otherUser = chatRoom.user1.id === userId ? chatRoom.user2 : chatRoom.user1;
        const otherUserImages = otherUser.images.map((image) => image.imageUrl);
        const latestMessage = await this.chatMessageRepository.findOne({
          where: { roomId: chatRoom.id },
          order: { createdAt: 'DESC' },
          select: { text: true, createdAt: true },
        });
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
