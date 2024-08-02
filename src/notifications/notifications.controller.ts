import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Notification } from './entities/notification.entity';

@UseGuards(AccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(@Request() req): Promise<Notification[]> {
    const userId = req.user.id;
    const notificactions = await this.notificationsService.getUserNotifications(userId);
    return notificactions;
  }

  @Get('late')
  async latestNotifications(@Request() req): Promise<Notification[]> {
    const userId = req.user.id;
    const notificactions = await this.notificationsService.latestNotifications(userId);
    return notificactions;
  }
}
