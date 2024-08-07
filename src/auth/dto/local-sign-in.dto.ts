import { IsString, Matches } from 'class-validator';

export class LocalSignInDto {
  @IsString()
  @Matches(/^010-\d{4}-\d{4}$/, { message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)' })
  phoneNum: string;

  @IsString()
  password: string;
}
