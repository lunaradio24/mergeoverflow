import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_MESSAGES } from '../constants/auth.message.constant';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(AUTH_MESSAGES.COMMON.JWT.NO_TOKEN);
    }

    if (!authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException(AUTH_MESSAGES.COMMON.JWT.NOT_SUPPORTED_TYPE);
    }

    return super.canActivate(context);
  }
}
