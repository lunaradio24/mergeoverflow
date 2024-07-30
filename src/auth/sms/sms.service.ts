import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import coolsms from 'coolsms-node-sdk';
import { RedisService } from '../../redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { VERIFICATION_CODE_EXPIRATION } from '../constants/sms.constants';

@Injectable()
export class SmsService implements OnModuleInit {
  private messageService: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('COOLSMS_API_KEY');
    const apiSecret = this.configService.get<string>('COOLSMS_API_SECRET');
    this.messageService = new coolsms(apiKey, apiSecret);
  }

  async sendOne(to: string, text: string): Promise<any> {
    try {
      const from = this.configService.get<string>('COOLSMS_FROM'); // 발신번호는 환경 변수에서 가져옵니다
      const response = await this.messageService.sendOne({
        to: to,
        from: from,
        text: text,
      });
      return response;
    } catch (error) {
      throw new Error(`SMS 전송 실패: ${error.message}`);
    }
  }

  async sendSmsForVerification(phoneNum: string): Promise<any> {
    const formattedPhoneNum = phoneNum.replace(/-/g, '');

    const foundAccount = await this.accountRepository.findOne({ where: { phoneNum: formattedPhoneNum } });
    if (!foundAccount) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }

    const verificationCode = this.createVerificationCode();
    await this.sendOne(formattedPhoneNum, `[Moyiza] 인증번호를 입력해주세요\n${verificationCode}`);

    // 인증코드 유효기간 설정
    const expireAt = Math.floor(Date.now() / 1000) + VERIFICATION_CODE_EXPIRATION;
    await this.redisService.set(verificationCode, formattedPhoneNum);
    await this.redisService.expireAt(verificationCode, expireAt);

    return { message: 'SMS 전송 성공' };
  }

  private createVerificationCode(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
