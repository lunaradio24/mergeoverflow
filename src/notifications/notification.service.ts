import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './types/notification-type.type';
import { MAX_NUM_LATEST_NOTIFICATIONS } from './constants/notification.constant';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getUserNotifications(userId: number): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
    return notifications;
  }

  async latestNotifications(userId: number): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: MAX_NUM_LATEST_NOTIFICATIONS,
    });
    return notifications;
  }

  async readNotifications(userId: number): Promise<Notification[]> {
    await this.notificationRepository.update({ userId }, { isRead: true });
    return await this.getUserNotifications(userId);
  }

  async saveNotification(userId: number, message: string, type: NotificationType): Promise<void> {
    await this.notificationRepository.save({ userId, message, type });
  }
}
