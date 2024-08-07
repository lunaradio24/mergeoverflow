import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LocalSignInDto } from '../dto/local-sign-in.dto';
import { AUTH_MESSAGES } from '../constants/auth.message.constant';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phoneNum', passwordField: 'password' });
  }

  async validate(phoneNum: string, password: string): Promise<any> {
    const signInDto = new LocalSignInDto();
    signInDto.phoneNum = phoneNum;
    signInDto.password = password;

    const user = await this.authService.validateUserBySignInDto(signInDto);
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.SIGN_IN.FAILURE.UNAUTHORIZED);
    }
    return user;
  }
}
