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
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocketGateway } from 'src/common/sockets/gateway';

@WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
export class NotificationsGateway
  extends SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(jwtService: JwtService) {
    super(jwtService, 'notificaction');
  }

  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('notifications');

  afterInit(server: Server) {
    this.logger.log(`notifications ${server} init`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const decoded = this.parseToken(socket);
    this.logger.log(`[알림 서버 연결] 소켓 ID : ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`[알림 서버 연결 해제] 소켓 ID : ${socket.id}`);
  }

  @SubscribeMessage('notify')
  async handleNotification(
    @MessageBody() data: { userId: number; message: string; type: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { userId, message, type } = data;
    socket.join(userId.toString());
    this.server.to(userId.toString()).emit('reception', { type, message });
    this.logger.log(`알림 : ${userId}:${message},${type}`);
  }
}
