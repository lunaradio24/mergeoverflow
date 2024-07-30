import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { MatchingService } from '../matchings/matchings.service';

@Controller('matchings')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  // 매칭 상대 정보를 10명씩 조회 (interactionType이 null인 유저들)
  @Get()
  async getMatchingUsers(@Query('userId', ParseIntPipe) userId: number) {
    return this.matchingService.getMatchingUsers(userId);
  }

  // 좋아요 처리
  @Post('like')
  async likeUser(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('targetUserId', ParseIntPipe) targetUserId: number,
  ) {
    await this.matchingService.likeUser(userId, targetUserId);
  }

  // 싫어요 처리
  @Post('dislike')
  async dislikeUser(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('targetUserId', ParseIntPipe) targetUserId: number,
  ) {
    await this.matchingService.dislikeUser(userId, targetUserId);
  }
}
