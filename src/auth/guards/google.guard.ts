import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  canActivate(context: ExecutionContext) {
    console.log('GoogleAuthGuard: canActivate called');
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    console.log('GoogleAuthGuard: handleRequest called');
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
