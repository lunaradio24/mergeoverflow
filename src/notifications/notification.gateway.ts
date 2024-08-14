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

@WebSocketGateway({ namespace: 'notification', cors: { origin: '*' } })
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

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const decoded = this.parseToken(socket);
    if (!decoded) {
      return;
    }

    const userNickname = await this.userService.findNicknameByUserId(decoded.userId);
    socket.data = { userId: decoded.userId, nickname: userNickname };
    socket.join(socket.data.userId.toString());
    this.logger.log(
      `[알림 서버 연결] 소켓 ID : ${socket.id} / 소켓 유저 ID : ${socket.data.userId} / 소켓 유저 닉네임 : ${socket.data.nickname}`,
    );
  }
  @SubscribeMessage('mergeNotify')
  async mergeNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { type: NotificationType; userId: number; message: string },
  ) {
    const { type, userId, message } = data;
    this.server.to(userId.toString()).emit('reception', { type, message });
    this.logger.log(`[알림전송완료] ${await socket.data.nickname}:[${type}] ${message}`);
  }

  @SubscribeMessage('likeNotify')
  async likeNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { type: NotificationType; userId: number; message: string },
  ) {
    const { type, userId, message } = data;

    this.server.to(userId.toString()).emit('reception', { type, message });
    this.logger.log(`[알림전송완료] ${await socket.data.nickname}:[${type}] ${message}`);
  }

  @SubscribeMessage('exitNotify')
  async exitNotificationHandler(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { userId: number; type: NotificationType; message: string },
  ) {
    const { type, userId, message } = data;
    this.server.to(userId.toString()).emit('reception', { type, message });
    this.logger.log(`[알림전송완료] ${await socket.data.nickname}:[${type}] ${message}`);
  }
}
