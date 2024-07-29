import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from './entities/chat-room.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
  ) {}
  async createdRoom(user1Id: number, user2Id: number) {
    return await this.chatRoomRepository.save({ user1Id, user2Id });
  }

  async savedMessage(userId: number, roomId: number, message: string) {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { id: roomId } });
    if (!chatRoom) {
      throw new NotFoundException('존재하지 않는 방입니다.');
    }
    const newMessage = await this.chatMessageRepository.save({ roomId, senderId: userId, text: message });
    return newMessage;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatRoom`;
  }

  update(id: number, updateChatRoomDto: UpdateChatRoomDto) {
    return `This action updates a #${id} chatRoom`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatRoom`;
  }
}
