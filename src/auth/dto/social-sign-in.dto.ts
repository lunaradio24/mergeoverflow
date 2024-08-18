import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocialSignInDto {
  @IsNotEmpty()
  @IsString()
  provider: string;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @Optional()
  @IsString()
  email: string;
}
