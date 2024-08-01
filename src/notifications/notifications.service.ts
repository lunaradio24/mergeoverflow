import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { NotificationType } from './types/notification-type.type';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async saveNotification(userId: number, message: string, type: NotificationType): Promise<void> {
    await this.notificationRepository.save({ userId, message, type });
  }

  async findByUserId(userId: number): Promise<String> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['nickname'] });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 유저입니다.');
    }
    return user.nickname;
  }
}
