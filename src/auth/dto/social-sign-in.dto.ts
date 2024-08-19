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

//https://accounts.google.com/o/oauth2/v2/auth?client_id=844120614051-h9d5iv2v7ig01ukslillgde88qru5b23.apps.googleusercontent.com&redirect_uri=https://thdtkandpf.bubbleapps.io/version-test/google-callback?debug_mode=true&response_type=code&scope=profile email&access_type=offline&prompt=consent
