import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  phoneNum: string;

  @IsString()
  password: string;
}
