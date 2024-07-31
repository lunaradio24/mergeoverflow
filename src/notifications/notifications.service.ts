import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}
  sendNotification(userId: Number, message: string, type: string) {
    this.notificationsGateway.server.to(userId.toString()).emit('reception', { type, message });
  }
}
