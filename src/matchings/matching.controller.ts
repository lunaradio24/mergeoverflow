import { Controller, Get, Post, Body, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Request } from 'express';

@UseGuards(AccessTokenGuard)
@Controller('matchings')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  // 매칭 상대 정보를 10명씩 조회 (interactionType이 null인 유저들)
  @Get()
  async getMatchingUsers(@Req() req: Request) {
    const userId = req.user['id']; // 인증된 유저의 ID 가져오기
    return this.matchingService.getMatchingUsers(userId);
  }

  // 좋아요 처리
  @Post('like')
  async likeUser(@Req() req: Request, @Body('targetUserId', ParseIntPipe) targetUserId: number) {
    const userId = req.user['id']; // 인증된 유저의 ID 가져오기
    await this.matchingService.likeUser(userId, targetUserId);
  }

  // 싫어요 처리
  @Post('dislike')
  async dislikeUser(@Req() req: Request, @Body('targetUserId', ParseIntPipe) targetUserId: number) {
    const userId = req.user['id']; // 인증된 유저의 ID 가져오기
    await this.matchingService.dislikeUser(userId, targetUserId);
  }
}
