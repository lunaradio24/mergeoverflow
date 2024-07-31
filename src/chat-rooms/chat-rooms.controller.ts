import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Get(':userId')
  getUserChatRooms(@Param('userId') userId: number) {
    return this.chatRoomsService.getUserChatRooms(userId);
  }

  @Post(':roomId')
  joinChatRoom(@Param('roomId') roomId: number) {
    const userId = 1;
    return this.chatRoomsService.joinChatRoom(userId, roomId);
  }

  @Delete(':roomId')
  exitChatRoom(@Param('roomId') roomId: number) {
    const userId = 1;
    return this.chatRoomsService.exitChatRoom(userId, roomId);
  }
}
