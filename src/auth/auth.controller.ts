import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms/sms.service';
import { VerificationRequestDto } from './dto/verification-request.dto';
import { Message } from './dto/message.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send-sms')
  async sendSmsForVerification(@Body() verificationRequestDto: VerificationRequestDto) {
    const { phoneNum } = verificationRequestDto;
    const response = await this.smsService.sendSmsForVerification(phoneNum);
    return new Message(response.message);
  }
}
