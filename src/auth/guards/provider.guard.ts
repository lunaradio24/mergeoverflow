import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ALLOWED_PROVIDERS_KEY } from 'src/utils/decorators/providers.decorator';
import { AccessTokenGuard } from './access-token.guard';

@Injectable()
export class ProviderGuard extends AccessTokenGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  // 기본 JWT 인증. 인증 실패 시 false 반환
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      return false;
    }

    // Reflector를 사용해 허용된 providers 메타데이터 읽어옴
    const allowedProviders = this.reflector.getAllAndOverride<string[]>(ALLOWED_PROVIDERS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 허용된 provider가 없다면 기본적으로 허용
    if (!allowedProviders) {
      return true;
    }

    // 요청한 사용자 정보 추출
    const { user } = context.switchToHttp().getRequest();

    // 사용자 provider가 허용된 목록에 없는 경우 차단
    if (!allowedProviders.includes(user.account.provider)) {
      return false;
    }

    return true;
  }
}
