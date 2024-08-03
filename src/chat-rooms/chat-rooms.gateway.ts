import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomsService } from './chat-rooms.service';
import { Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocketGateway } from 'src/common/sockets/gateway';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatRoomsGateway extends SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ChatRoomsService))
    private readonly chatRoomsService: ChatRoomsService,
    jwtService: JwtService,
  ) {
    super({ jwtService, name: 'chat' });
  }
  async handleConnection(@ConnectedSocket() socket: Socket, server: Server) {
    const decoded = this.parseToken(socket);
    const userNickname = this.chatRoomsService.findNicknameByUserId(decoded.id);
    socket.data = { userId: decoded.id, nickname: userNickname };
    this.logger.log(`[채팅 서버 연결] 소켓 ID : ${socket.id}`);
  }

  @SubscribeMessage('createChatRoom')
  async handleCreateChatRoom(
    @MessageBody() data: { chatRoomId: number; user1Id: number; user2Id: number },
    @ConnectedSocket() socket: Socket,
  ) {
    const { chatRoomId, user1Id, user2Id } = data;
    socket.join(chatRoomId.toString());
    this.logger.log(`유저 ${user1Id}번님과 유저 ${user2Id}번님이 ${chatRoomId}번방에 머지하였습니다.`);
  }

  @SubscribeMessage('join')
  async handleJoinChatRoom(
    @MessageBody() data: { roomId: number; joinCheck: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    let { roomId, joinCheck } = data;
    await this.chatRoomsService.isUserInChatRoom(socket.data.userId, roomId);
    if (!joinCheck) {
      socket.join(roomId.toString());
      this.server.to(roomId.toString()).emit('join', { roomId, nickname: await socket.data.nickname });
      this.logger.log(`${await socket.data.nickname}님께서 ${roomId}번 방에 입장했습니다.`);
    }
  }

  @SubscribeMessage('requestHistory')
  async handleRequestHistory(@MessageBody() data: { roomId: number }, @ConnectedSocket() socket: Socket) {
    const { roomId } = data;
    const messages = await this.chatRoomsService.getRoomMessage(roomId);
    const checkhistory = true;
    this.server.to(roomId.toString()).emit('history', { messages, roomId, checkhistory });
  }

  @SubscribeMessage('exit')
  async handleExitChatRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() socket: Socket) {
    const { roomId } = data;
    socket.leave(roomId.toString());
    this.logger.log(`${await socket.data.nickname}님께서 ${roomId}번 방에서 퇴장하셨습니다.`);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: { roomId: number; message: string }, @ConnectedSocket() socket: Socket) {
    const { roomId, message } = data;
    await this.chatRoomsService.saveMessage(socket.data.userId, roomId, message);
    this.server.to(roomId.toString()).emit('message', { nickname: await socket.data.nickname, text: message });
    this.logger.log(`방번호:${roomId}번 / ${await socket.data.nickname}:${message}`);
  }
}
