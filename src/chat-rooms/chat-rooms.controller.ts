import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  @Get(':id')
  findAllChatRoom(@Param('id') id: number) {
    return this.chatRoomsService.getUserChatRooms(id);
  }

  @Post(':id')
  joinChatRoom(@Param('id') id: number) {
    return this.chatRoomsService.joinChatRoom(id);
  }
}
