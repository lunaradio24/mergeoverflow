import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { LocationService } from './location.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async addLocation(@Request() req: any, @Body() body: { latitude: number; longitude: number }) {
    const userId = req.user.id;
    const { latitude, longitude } = body;
    return this.locationService.addLocation(userId, latitude, longitude);
  }

  // 거리 계산을 위한 엔드포인트 추가
  @Get('calculate-distance')
  async calculateDistance(@Query('userId1') userId1: number, @Query('userId2') userId2: number) {
    const distance = await this.locationService.testCalculateDistance(userId1, userId2);
    return { message: `User ${userId1}와 User ${userId2} 간의 거리: ${distance} km`, distance };
  }
}
