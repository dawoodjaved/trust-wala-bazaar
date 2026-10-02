import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override to make authentication optional
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Call parent canActivate but don't throw if unauthorized
    const result = super.canActivate(context);
    if (result instanceof Promise) {
      return result.catch(() => {
        // If auth fails, allow request but without user
        return true;
      });
    }
    if (result instanceof Observable) {
      return result.pipe(
        catchError(() => of(true)) // If auth fails, allow request but without user
      );
    }
    return result;
  }

  handleRequest(err: any, user: any) {
    // Return user if exists, otherwise return null (don't throw)
    return user || null;
  }
}
