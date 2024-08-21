import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { SocialSignInDto } from '../dto/social-sign-in.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'], // 필수 스코프
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<SocialSignInDto> {
    const user = { provider: 'google', providerId: profile.id, email: profile.emails?.[0]?.value || null, accessToken };
    return user;
  }
}
