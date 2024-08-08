import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { MatchingService } from './matching.service';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from 'src/users/entities/user.entity';

@UseGuards(AccessTokenGuard)
@Controller('matchings')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  // 매칭 상대 정보를 10명씩 조회 (interactionType이 null인 유저들)
  @Get()
  async getMatchingUsers(@UserInfo() user: User) {
    const userId = user.id;
    return this.matchingService.getMatchingUsers(userId);
  }

  // 좋아요 처리
  @Post('like')
  async likeUser(@UserInfo() user: User, @Body() targetUserId: number) {
    const userId = user.id;
    await this.matchingService.likeUser(userId, targetUserId);
  }

  // 싫어요 처리
  @Post('dislike')
  async dislikeUser(@UserInfo() user: User, @Body() targetUserId: number) {
    const userId = user.id;
    await this.matchingService.dislikeUser(userId, targetUserId);
  }
}
