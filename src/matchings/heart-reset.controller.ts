import { Controller, Post, UseGuards } from '@nestjs/common';
import { HeartResetService } from './heart-reset.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('heart-reset')
export class HeartResetController {
  constructor(private readonly heartResetService: HeartResetService) {}

  // 수동으로 하트 카운트를 초기화합니다.
  // 호출 시 모든 사용자의 하트가 초기화됩니다.
  @UseGuards(AccessTokenGuard)
  @Post('reset')
  async resetHearts() {
    await this.heartResetService.resetHearts();
    return { message: '모든 하트가 초기화되었습니다.' };
  }
}
