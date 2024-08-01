import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@UseGuards(AccessTokenGuard)
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}
  @Get()
  async getUserChatRooms(@Request() req) {
    const userId = req.user.id;
    return await this.chatRoomsService.getUserChatRooms(userId);
  }

  @Post(':roomId')
  async joinChatRoom(@Param('roomId') roomId: number, @Request() req) {
    const userId = req.user.id;
    return await this.chatRoomsService.joinChatRoom(userId, roomId);
  }

  @Delete(':roomId')
  async exitChatRoom(@Param('roomId') roomId: number, @Request() req) {
    const userId = req.user.id;
    await this.chatRoomsService.exitChatRoom(userId, roomId);
    return { message: `${roomId}번 채팅방에서 퇴장했습니다.` };
  }
}
