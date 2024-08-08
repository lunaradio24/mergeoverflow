import { IsString, IsNotEmpty } from 'class-validator';
import { SendSmsCodeDto } from './send-sms-code.dto';

export class VerifySmsCodeDto extends SendSmsCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
