import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { LocalPayload } from '../interfaces/local-payload.interface';
import { AUTH_MESSAGES } from '../constants/auth.message.constant';
import { UserService } from 'src/users/user.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
    });
  }

  async validate(payload: LocalPayload) {
    const userId = payload.userId;
    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.COMMON.JWT.NO_USER);
    }

    return user;
  }
}
