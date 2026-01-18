import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override to make authentication optional
  canActivate(context: ExecutionContext) {
    // Call parent canActivate but don't throw if unauthorized
    return super.canActivate(context).catch(() => {
      // If auth fails, allow request but without user
      return true;
    });
  }

  handleRequest(err: any, user: any) {
    // Return user if exists, otherwise return null (don't throw)
    return user || null;
  }
}
