import { IsString, IsNotEmpty, IsInt, Matches } from 'class-validator';
import { SendSmsCodeDto } from './send-sms-code.dto';

export class VerifySmsCodeDto extends SendSmsCodeDto {
  @IsInt()
  @IsNotEmpty()
  code: string;
}
