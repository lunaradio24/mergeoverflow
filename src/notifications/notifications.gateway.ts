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
import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('notifications');

  afterInit(server: Server) {
    this.logger.log(`notifications ${server} init`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const userId = 1;
    socket.join(userId.toString());
    this.logger.log(`알림 서버 입장 : ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`알림 서버 퇴장 : ${socket.id}`);
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
