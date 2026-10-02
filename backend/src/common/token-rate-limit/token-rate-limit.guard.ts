import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  TOKEN_RATE_LIMIT_KEY,
  TokenRateLimitOptions,
} from './token-rate-limit.decorator';
import { TokenRateLimitService } from './token-rate-limit.service';

function clientKey(req: Request): string {
  const user = (req as Request & { user?: { id?: string; sub?: string } }).user;
  const userId = user?.id || user?.sub;
  if (userId) {
    return `user:${userId}`;
  }

  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return `ip:${forwarded.split(',')[0].trim()}`;
  }

  const ip = req.ip || req.socket?.remoteAddress;
  return `ip:${ip || 'unknown'}`;
}

@Injectable()
export class TokenRateLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rateLimit: TokenRateLimitService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride<TokenRateLimitOptions | undefined>(
      TOKEN_RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const key = `${options.bucket}:${clientKey(req)}`;
    const retryAfterSec = this.rateLimit.consume(key, options.limit, options.ttlSec);

    if (retryAfterSec !== null) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many AI requests. Try again in ${retryAfterSec} seconds.`,
          retryAfterSec,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
