import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { AUTH_MESSAGES } from '../constants/auth.message.constant';

export class LocalSignInDto {
  @IsNotEmpty({ message: AUTH_MESSAGES.COMMON.PHONE_NUM.REQUIRED })
  @IsString()
  @Matches(/^010-\d{4}-\d{4}$/, { message: AUTH_MESSAGES.COMMON.PHONE_NUM.INVALID_FORMAT })
  phoneNum: string;

  @IsNotEmpty({ message: AUTH_MESSAGES.COMMON.PASSWORD.REQUIRED })
  @IsString()
  password: string;
}
