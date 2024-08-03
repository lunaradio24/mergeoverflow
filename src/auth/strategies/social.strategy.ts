import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile as GoogleProfile, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GooglePassportStrategy extends PassportStrategy(GoogleStrategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: GoogleProfile) {
    const { id } = profile;
    return {
      provider: 'google',
      providerId: id,
    };
  }
}

@Injectable()
export class GithubPassportStrategy extends PassportStrategy(GithubStrategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id } = profile;
    return {
      provider: 'github',
      providerId: id,
    };
  }
}
