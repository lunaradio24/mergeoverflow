import { Injectable, OnModuleInit, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import coolsms from 'coolsms-node-sdk';
import { RedisService } from 'src/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/auth/entities/account.entity';
import { CODE_BASE_NUMBER, CODE_MULTIPLY_NUMBER, VERIFICATION_CODE_EXPIRATION } from './constants/sms.constant';
import { formatPhoneNumber } from 'src/utils/functions/format-phone-num.function';

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

  async sendOne(to: string, text: string) {
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
    const formattedPhoneNum = formatPhoneNumber(phoneNum);

    // 해당 전화번호를 가진 사용자가 없는 경우에만 SMS를 발송합니다.
    const foundAccount = await this.accountRepository.findOne({ where: { phoneNum: formattedPhoneNum } });
    if (foundAccount) {
      throw new ConflictException('이미 존재하는 전화번호입니다.');
    }

    const verificationCode = this.createVerificationCode();
    await this.sendOne(formattedPhoneNum, `[mergeOverflow] 인증번호를 입력해주세요\n${verificationCode}`);

    // 인증코드 유효기간 설정
    const expireAt = Math.floor(Date.now() / 1000) + VERIFICATION_CODE_EXPIRATION;
    await this.redisService.set(verificationCode, formattedPhoneNum);
    await this.redisService.expireAt(verificationCode, expireAt);

    return true;
  }

  private createVerificationCode(): string {
    // 6자리 숫자를 생성
    //Math.random()이 0에서 1사이에 난수 하나를 생성->6자리 숫자를 만들기 위해 Math.floor로 소숫점 버림
    const code = Math.floor(CODE_BASE_NUMBER + Math.random() * CODE_MULTIPLY_NUMBER);
    // 숫자를 문자열로 변환하여 반환
    return code.toString();
  }
}
