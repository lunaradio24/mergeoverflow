import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { LocationService } from './location.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async updateLocation(@Request() req: any, @Body() body: { latitude: number; longitude: number }) {
    const userId = req.user.id;
    const { latitude, longitude } = body;
    return this.locationService.updateLocation(userId, latitude, longitude);
  }
}
