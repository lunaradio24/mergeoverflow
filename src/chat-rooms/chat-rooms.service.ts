import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { NotificationType } from 'src/notifications/types/notification-type.type';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly chatRoomsGateway: ChatRoomsGateway,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createChatRoom(user1Id: number, user2Id: number): Promise<void> {
    const chatRoom = await this.chatRoomRepository.save({ user1Id, user2Id });
    this.chatRoomsGateway.server.emit('createChatRoom', { chatRoomId: chatRoom.id, user1Id, user2Id });
  }

  async exitChatRoom(userId: number, roomId: number): Promise<void> {
    await this.isUserInChatRoom(userId, roomId);
    const relationId = await this.findPartnerUserId(roomId);
    this.notificationsGateway.server.emit('exitNotify', { relationId, type: NotificationType.EXIT });
    this.chatRoomsGateway.server.emit('exit', { roomId });
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

  async findPartnerUserId(roomId: number): Promise<{ user1Id: number; user2Id: number }> {
    const { user1Id, user2Id } = await this.chatRoomRepository.findOne({
      where: { id: roomId },
      select: { user1Id: true, user2Id: true },
    });
    return { user1Id, user2Id };
  }

  async getUserChatRooms(userId: number): Promise<ChatRoom[]> {
    return await this.chatRoomRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
    });
  }

  async findNicknameByUserId(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['nickname'] });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }
    return user.nickname;
  }
}
