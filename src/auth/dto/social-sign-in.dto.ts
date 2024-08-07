import { IsNotEmpty, IsString } from 'class-validator';

export class SocialSignInDto {
  @IsNotEmpty()
  @IsString()
  provider: string;

  @IsNotEmpty()
  @IsString()
  providerId: string;
}
