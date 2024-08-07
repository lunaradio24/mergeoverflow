import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { LocalPayload } from '../interfaces/local-payload.interface';
import { AUTH_MESSAGES } from '../constants/auth.message.constant';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'access-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: LocalPayload) {
    const userId = payload.userId;
    const user = await this.authService.findUserByUserId(userId);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.COMMON.JWT.NO_USER);
    }

    return user;
  }
}
