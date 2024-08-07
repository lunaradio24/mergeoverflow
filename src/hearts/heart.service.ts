import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Heart } from './entities/heart.entity';
import { Cron } from '@nestjs/schedule';
import { RESET_HEART_COUNT } from './constants/heart.constant';

@Injectable()
export class HeartService {
  constructor(
    @InjectRepository(Heart)
    private readonly heartRepository: Repository<Heart>,
  ) {}

  private readonly logger = new Logger();

  // 매일 오전 9시에 초기화
  @Cron('0 0 9 * * *', { timeZone: 'Asia/Seoul' })
  async handleCron(): Promise<void> {
    await this.resetHearts();
    const now = new Date().toISOString();
    this.logger.log(`${now}: 모든 하트가 ${RESET_HEART_COUNT}개로 초기화되었습니다.`);
  }

  async resetHearts(): Promise<void> {
    await this.heartRepository.createQueryBuilder().update(Heart).set({ remainHearts: RESET_HEART_COUNT }).execute();
  }
}
