import { Controller, Post } from '@nestjs/common';
import { HeartResetService } from './heart-reset.service';

@Controller('heart-reset')
export class HeartResetController {
  constructor(private readonly heartResetService: HeartResetService) {}

  @Post('reset')
  async resetHearts() {
    await this.heartResetService.resetHearts();
    return { message: 'Hearts have been reset to the default count.' };
  }
}
