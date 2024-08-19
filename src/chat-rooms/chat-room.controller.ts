import { Controller, Get, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CHATROOM_MESSAGES } from './constants/chat-room.message.constant';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AccessTokenGuard)
@Controller('chat-rooms')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}
  @Get()
  async getUserChatRooms(@UserInfo() user: User) {
    const userId = user.id;
    const chatRooms = await this.chatRoomService.getUserChatRooms(userId);
    return {
      statusCode: HttpStatus.OK,
      message: CHATROOM_MESSAGES.READ_ALL.SUCCEED,
      data: chatRooms,
    };
  }

  @Delete(':roomId')
  async exitChatRoom(@Param('roomId') roomId: number, @UserInfo() user: User): Promise<ApiResponse<null>> {
    const userId = user.id;
    await this.chatRoomService.exitChatRoom(userId, roomId);
    return {
      statusCode: HttpStatus.OK,
      message: roomId + CHATROOM_MESSAGES.EXIT_ROOM.SUCCEED,
      data: null,
    };
  }
}
