import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { LocationService } from './location.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Request } from 'express';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async addLocation(@Req() req: Request, @Body() body: { latitude: number; longitude: number }) {
    const userId = req.user['id']; // 인증된 유저의 ID 가져오기
    const { latitude, longitude } = body;
    return this.locationService.addLocation(userId, latitude, longitude);
  }
}
