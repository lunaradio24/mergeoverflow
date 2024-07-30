import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'phoneNum' });
  }

  async validate(phoneNum: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(phoneNum, password);
    if (!user) {
      throw new UnauthorizedException('잘못된 전화번호 또는 비밀번호입니다.');
    }
    return user;
  }
}
