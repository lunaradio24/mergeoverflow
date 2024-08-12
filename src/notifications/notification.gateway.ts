import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { SocketGateway } from 'src/common/sockets/gateway';
import { NotificationService } from './notification.service';
import { NotificationType } from './types/notification-type.type';
import { UserService } from 'src/users/user.service';

@WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
export class NotificationGateway
  extends SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) {
    super({ jwtService, name: 'notification' });
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const decoded = this.parseToken(socket);
    const userNickname = this.userService.findNicknameByUserId(decoded.userId);
    socket.data = { userId: decoded.userId, nickname: userNickname };
    socket.join(socket.data.userId.toString());
    this.logger.log(`[알림 서버 연결] 소켓 ID : ${socket.id}`);
  }

  @SubscribeMessage('mergeNotify')
  async mergeNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { type: NotificationType; userId: number; targetUserId: number },
  ) {
    const { type, userId, targetUserId } = data;
    const targetUserNickname = await this.userService.findNicknameByUserId(targetUserId);
    const message = `${targetUserNickname}님과 Merge 되었습니다!`;
    this.server.to(userId.toString()).emit('reception', { type, message });
    await this.notificationService.saveNotification(userId, message, type);
    this.logger.log(`[알림]${await socket.data.nickname}:[${type}]${message}`);
  }

  @SubscribeMessage('likeNotify')
  async likeNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { type: NotificationType; userId: number; mergeRequesterId: number },
  ) {
    const { type, userId, mergeRequesterId } = data;
    const mergeRequester = await this.userService.findNicknameByUserId(mergeRequesterId);
    const message = `${mergeRequester}님께서 당신에게 좋아요를 눌렀어요 !`;

    this.server.to(userId.toString()).emit('reception', { type, message });
    await this.notificationService.saveNotification(userId, message, type);
    this.logger.log(`[알림]${await socket.data.nickname}:[${type}]${message}`);
  }

  @SubscribeMessage('exitNotify')
  async exitNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { partnerId: number; type: NotificationType; partnerNickname: string },
  ) {
    const { type, partnerId, partnerNickname } = data;

    let message = `${await socket.data.nickname}님과의 연결이 끊어졌습니다.`;
    this.server.to(partnerId.toString()).emit('reception', { type, message });
    await this.notificationService.saveNotification(partnerId, message, type);

    message = `${partnerNickname}님과의 연결이 끊어졌습니다.`;
    this.server.to(socket.data.userId.toString()).emit('reception', { type, message });
    await this.notificationService.saveNotification(socket.data.userId, message, type);

    this.logger.log(`[알림][${type}]${await socket.data.nickname}님께서 ${partnerNickname}님과의 연결을 끊으셨습니다.`);
  }
}
