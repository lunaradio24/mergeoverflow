import { Controller, Get, Param, Post, Body, ParseIntPipe } from '@nestjs/common';
import { MatchingService } from '../matchings/matchings.service';
import { User } from '../users/entities/user.entity';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  // 매칭 상대 정보를 10명씩 조회
  @Get(':userId')
  async getMatchingUsers(@Param('userId', ParseIntPipe) userId: number): Promise<User[]> {
    return this.matchingService.getMatchingUsers(userId);
  }

  // 매칭 결과를 저장
  @Post()
  async saveMatchingResult(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('targetUserId', ParseIntPipe) targetUserId: number,
    @Body('isMatch') isMatch: boolean,
  ): Promise<void> {
    await this.matchingService.saveMatchingResult(userId, targetUserId, isMatch);
  }
}
