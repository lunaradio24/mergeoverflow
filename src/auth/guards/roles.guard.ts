import { Role } from '../types/role.type';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('access-token') implements CanActivate {
  constructor(private reflector: Reflector) {
    //super() 호출로 AuthGuard호출
    super();
  }

  //기본 JWT인증. 인증 실패하면 false 반환
  async canActivate(context: ExecutionContext) {
    const authenticated = await super.canActivate(context);
    if (!authenticated) {
      // throw new NotFoundException("허가받지 않은 사용자입니다.")
      return false;
    }

    //Reflector를 사용해 정의된 roles 읽어옮
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);
    //딱히 정의되어 있지 않으면 true반환
    if (!requiredRoles) {
      return true;
    }

    //api를 요청한 사용자 정보를 추출. 필요한 역활과 일치하는지 확인
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.account.role === role);
  }
}
