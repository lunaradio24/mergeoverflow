import { Controller, Get, UseGuards, Request, Patch, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Notification } from './entities/notification.entity';
import { NOTIFICATION_MESSAGES } from './constants/notification.message.constant';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';

@UseGuards(AccessTokenGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@Request() req): Promise<ApiResponse<Notification[]>> {
    const userId = req.user.id;
    const notifications = await this.notificationService.getUserNotifications(userId);
    return {
      statusCode: HttpStatus.OK,
      message: NOTIFICATION_MESSAGES.READ_ALL.SUCCEED,
      data: notifications,
    };
  }

  @Get('latest')
  async latestNotifications(@Request() req): Promise<ApiResponse<Notification[]>> {
    const userId = req.user.id;
    const notifications = await this.notificationService.latestNotifications(userId);
    return {
      statusCode: HttpStatus.OK,
      message: NOTIFICATION_MESSAGES.READ_ALL.SUCCEED,
      data: notifications,
    };
  }

  @Patch()
  async readNotifications(@Request() req): Promise<Notification[]> {
    const userId = req.user.id;
    const notificactions = await this.notificationService.readNotifications(userId);
    return notificactions;
  }
}
