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
import { Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SocketGateway } from 'src/common/sockets/gateway';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './types/notification-type.type';

@WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
export class NotificationsGateway
  extends SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {
    super({ jwtService, name: 'notificaction' });
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const decoded = this.parseToken(socket);
    const userNickname = this.notificationsService.findByUserId(decoded.id);
    socket.data = { userId: decoded.id, nickname: userNickname };
    socket.join(socket.data.userId.toString());
    this.logger.log(`[알림 서버 연결] 소켓 ID : ${socket.id}`);
  }

  @SubscribeMessage('notify')
  async sendNotification(@ConnectedSocket() socket: Socket, @MessageBody() data: { type: NotificationType }) {
    let message;
    const { type } = data;
    switch (type) {
      case NotificationType.CHAT:
        message = '새로운 메세지가 왔습니다.';
        break;
      case NotificationType.LIKE:
        message = '누군가가 당신에게 좋아요를 눌렀습니다.';
        break;
      case NotificationType.MERGED:
        message = '새로운 이와 Merge 되었습니다 !';
        break;
    }

    await this.notificationsService.saveNotification(socket.data.userId, message, type);
    // this.server.to(socket.data.userId.toString()).emit('notify', { type, message });
    this.logger.log(`[알림]${await socket.data.nickname}:[${type}]${message}`);
  }
}
