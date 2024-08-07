import { Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { HeartService } from './heart.service';
import { ApiResponse } from 'src/common/interceptors/response/response.interface';

@Controller('hearts')
export class HeartController {
  constructor(private readonly heartService: HeartService) {}

  // 수동으로 하트 카운트를 초기화
  @UseGuards(AccessTokenGuard)
  @Post('reset')
  async resetHearts(): Promise<ApiResponse<boolean>> {
    await this.heartService.resetHearts();
    return {
      statusCode: HttpStatus.OK,
      message: '모든 하트가 초기화되었습니다.',
      data: true,
    };
  }
}
