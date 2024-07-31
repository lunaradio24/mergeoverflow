import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createdRoom(user1Id: number, user2Id: number): Promise<void> {
    await this.chatRoomRepository.save({ user1Id, user2Id });
    return;
  }

  async savedMessage(userId: number, roomId: number, message: string) {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });
    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 방입니다.');
    }
    const newMessage = await this.chatMessageRepository.save({ roomId, senderId: userId, text: message });
    return newMessage;
  }

  async validateChatRoomToUser(userId: number, roomId: number) {
    const chatRoom = await this.chatRoomRepository.findOne({
      where: [
        { id: roomId, user1Id: userId },
        { id: roomId, user2Id: userId },
      ],
    });
    if (!chatRoom) {
      throw new UnauthorizedException('해당 채팅방에 접근 권한이 없습니다.');
    }
    return chatRoom;
  }

  async exitChatRoom(userId: number, roomId: number) {
    const chatRoom = await this.validateChatRoomToUser(userId, roomId);
    if (chatRoom) {
      await this.chatRoomRepository.delete({ id: roomId });
    }
  }

  async findAllChatRoom(userId: number) {
    return await this.chatRoomRepository.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
    });
  }

  async findUser(userId: number) {
    return await this.userRepository.findOne({ where: { id: userId }, select: ['nickname'] });
  }
}
