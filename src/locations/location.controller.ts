import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post()
  async addLocation(@Body() body: { userId: number; latitude: number; longitude: number }) {
    const { userId, latitude, longitude } = body;
    return this.locationService.addLocation(userId, latitude, longitude);
  }

  // 거리 계산을 위한 엔드포인트 추가
  @Get('calculate-distance')
  async calculateDistance(@Query('userId1') userId1: number, @Query('userId2') userId2: number) {
    const distance = await this.locationService.testCalculateDistance(userId1, userId2);
    return { message: `User ${userId1}와 User ${userId2} 간의 거리: ${distance} km`, distance };
  }
}
