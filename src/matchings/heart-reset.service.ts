import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Heart } from './entities/heart.entity';
import { RESET_HEART_COUNT } from './constants/constants';

@Injectable()
export class HeartResetService {
  constructor(
    @InjectRepository(Heart)
    private readonly heartRepository: Repository<Heart>,
  ) {}

  //   @Cron('0 0 9 * * *') // 매일 아침 9시에 실행
  //   async resetHearts() {
  //     await this.heartRepository.update({}, { remainHearts: RESET_HEART_COUNT });
  //     console.log('All hearts have been reset to', RESET_HEART_COUNT);
  //   }
  // }
  @Cron('0 0 9 * * *') // 매일 오전 9시에 실행
  async handleCron() {
    await this.resetHearts();
  }

  async resetHearts() {
    await this.heartRepository.createQueryBuilder().update(Heart).set({ remainHearts: RESET_HEART_COUNT }).execute();
  }
}
