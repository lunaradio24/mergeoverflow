import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from '../dto/send-sms.dto';
import { VerificationRequestDto } from '../dto/verification-request.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  async sendSms(@Body() sendSmsDto: SendSmsDto) {
    const { to, text } = sendSmsDto;
    const response = await this.smsService.sendOne(to, text);
    return { message: 'SMS 전송 성공', response };
  }

  @Post('send-verification')
  async sendSmsForVerification(@Body() verificationRequestDto: VerificationRequestDto) {
    const { phoneNum } = verificationRequestDto;
    const response = await this.smsService.sendSmsForVerification(phoneNum);
    return response;
  }
}
