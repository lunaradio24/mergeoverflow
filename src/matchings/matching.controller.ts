import { Controller, Get, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { MatchingService } from './matching.service';
import { UserInfo } from 'src/utils/decorators/user-info.decorator';
import { User } from 'src/users/entities/user.entity';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';

@UseGuards(AccessTokenGuard)
@Controller('matchings')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  // 매칭 상대 정보를 10명씩 조회 (interactionType이 null인 유저들)
  @Get()
  async getMatchingUsers(@UserInfo() user: User): Promise<ApiResponse<User[]>> {
    const userId = user.id;
    const matchings = await this.matchingService.getMatchingUsers(userId);
    return {
      statusCode: HttpStatus.OK,
      message: '매칭 상대를 성공적으로 불러왔습니다.',
      data: matchings,
    };
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
