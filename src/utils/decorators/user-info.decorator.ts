import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

export const UserInfo = createParamDecorator((data: unknown, ctx: ExecutionContext): User | null => {
  const request = ctx.switchToHttp().getRequest();
  return request.user ? request.user : null;
});
