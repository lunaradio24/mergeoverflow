import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SmsService } from './sms/sms.service';
import { RedisService } from '../redis/redis.service';
import { Account } from './entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly smsService: SmsService,
    private readonly redisService: RedisService,
  ) {}

  async sendSmsForVerification(phoneNum: string) {
    const formattedPhoneNum = phoneNum.replace(/-/g, '');

    const foundAccount = await this.accountRepository.findOne({ where: { phoneNum: formattedPhoneNum } });
    if (!foundAccount) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }

    const verificationCode = this.createVerificationCode();
    await this.smsService.sendOne(formattedPhoneNum, verificationCode);

    // 인증코드 유효기간 5분 설정
    const expireAt = Math.floor(Date.now() / 1000) + 60 * 5;
    await this.redisService.set(verificationCode, formattedPhoneNum);
    await this.redisService.expireAt(verificationCode, expireAt);

    return { message: 'SMS 전송 성공' };
  }

  createVerificationCode(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
