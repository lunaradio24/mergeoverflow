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
    const userNickname = this.notificationsService.findNicknameByUserId(decoded.id);
    socket.data = { userId: decoded.id, nickname: userNickname };
    socket.join(socket.data.userId.toString());
    this.logger.log(`[알림 서버 연결] 소켓 ID : ${socket.id}`);
  }

  @SubscribeMessage('mergeNotify')
  async mergeNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { type: NotificationType; userId: number; targetUserId: number },
  ) {
    const { type, userId, targetUserId } = data;
    const targetUserNickname = await this.notificationsService.findNicknameByUserId(targetUserId);
    const message = `${targetUserNickname}님과 Merge 되었습니다!`;
    this.server.to(userId.toString()).emit('reception', { type, message });
    await this.notificationsService.saveNotification(userId, message, type);
    this.logger.log(`[알림]${await socket.data.nickname}:[${type}]${message}`);
  }

  @SubscribeMessage('likeNotify')
  async likeNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { type: NotificationType; userId: number; mergeRequesterId: number },
  ) {
    const { type, userId, mergeRequesterId } = data;
    const mergeRequester = await this.notificationsService.findNicknameByUserId(mergeRequesterId);
    const message = `${mergeRequester}님께서 당신에게 좋아요를 눌렀어요 !`;

    this.server.to(userId.toString()).emit('reception', { type, message });
    await this.notificationsService.saveNotification(userId, message, type);
    this.logger.log(`[알림]${await socket.data.nickname}:[${type}]${message}`);
  }

  @SubscribeMessage('exitNotify')
  async exitNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { relationId: { user1Id: number; user2Id: number }; type: NotificationType },
  ) {
    const { type, relationId } = data;
    const partnerId = socket.data.userId === relationId.user1Id ? relationId.user2Id : relationId.user1Id;

    const message = `[알림]${await socket.data.nickname}님과의 연결이 끊어졌습니다.`;
    this.server.to(partnerId.toString()).emit('reception', { type, message });
    await this.notificationsService.saveNotification(socket.data.userId, message, type);
    this.logger.log(`[알림]${await socket.data.nickname}:[${type}]${message}`);
  }
}
