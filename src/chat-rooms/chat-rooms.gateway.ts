import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomsService } from './chat-rooms.service';
import { Inject, Logger, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: 'chat', cors: { origin: '*' } })
export class ChatRoomsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => ChatRoomsService))
    private readonly chatRoomsService: ChatRoomsService,
    private jwtService: JwtService,
  ) {}

  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('chatGateWay');

  afterInit(server: Server) {
    this.logger.log(`chat ${server} init`);
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        throw new UnauthorizedException('토큰이 유효하지 않습니다.');
      }
      const decoded = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET_KEY });
      const userNickname = await this.chatRoomsService.findByUserId(decoded.id);

      socket.data = { userId: decoded.id, nickname: userNickname };

      this.logger.log(`[채팅 서버 연결] 소켓 ID: ${socket.id}`);
    } catch (error) {
      this.logger.error(`[연결 강제 종료] 소켓 ID: ${socket.id} / status: ${error.status}, ${error.message}`);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`[채팅 서버 연결 해제] 소켓 ID: ${socket.id}`);
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
  async handleJoinChatRoom(@MessageBody() data: { userId: number; roomId: number }, @ConnectedSocket() socket: Socket) {
    const { userId, roomId } = data;
    socket.join(roomId.toString());
    this.logger.log(`${userId}님께서 ${roomId}번 방에 입장했습니다.`);
  }

  @SubscribeMessage('exit')
  async handleExitChatRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() socket: Socket) {
    const { roomId } = data;
    socket.leave(roomId.toString());
    this.logger.log(`${socket.data.nickname}님께서  ${roomId}번 방에서 퇴장하셨습니다.`);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: { roomId: number; message: string }, @ConnectedSocket() socket: Socket) {
    const { roomId, message } = data;
    const chatMessage = await this.chatRoomsService.saveMessage(socket.data.userId, roomId, message);
    this.server.to(roomId.toString()).emit('message', chatMessage);
    this.logger.log(`방번호:${roomId}번 / ${socket.data.nickname}:${message}`);
  }
}
