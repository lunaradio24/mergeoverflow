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

  @Cron('0 0 9 * * *') // 매일 오전 9시에 초기화
  async handleCron() {
    await this.resetHearts();
  }

  async resetHearts() {
    await this.heartRepository.createQueryBuilder().update(Heart).set({ remainHearts: RESET_HEART_COUNT }).execute();
    console.log(`모든 하트가 ${RESET_HEART_COUNT}개로 초기화되었습니다.`);
  }
}
