import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { getClientIp } from './http';

type WindowEntry = {
  count: number;
  resetAt: number;
};

export class TokenRateLimitService {
  private readonly windows = new Map<string, WindowEntry>();

  /** Returns null if allowed; otherwise seconds until retry. */
  consume(key: string, limit: number, ttlSec: number): number | null {
    const now = Date.now();
    const entry = this.windows.get(key);

    if (!entry || now >= entry.resetAt) {
      this.windows.set(key, { count: 1, resetAt: now + ttlSec * 1000 });
      return null;
    }

    if (entry.count >= limit) {
      return Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    }

    entry.count += 1;
    return null;
  }
}

const rateLimitService = new TokenRateLimitService();

function clientKey(request: Request): string {
  const auth = request.headers.get('authorization');
  if (auth?.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim();
    if (token) {
      try {
        const payload = jwt.decode(token) as { sub?: string; id?: string } | null;
        const userId = payload?.sub || payload?.id;
        if (userId) {
          return `user:${userId}`;
        }
      } catch {
        // fall through to IP
      }
    }
  }

  return `ip:${getClientIp(request)}`;
}

/**
 * Returns a 429 NextResponse if limited; otherwise null (request allowed).
 */
export function enforceRateLimit(
  request: Request,
  bucket: string,
  limit: number,
  ttlSec: number,
): NextResponse | null {
  const key = `${bucket}:${clientKey(request)}`;
  const retryAfterSec = rateLimitService.consume(key, limit, ttlSec);

  if (retryAfterSec !== null) {
    return NextResponse.json(
      {
        statusCode: 429,
        message: `Too many AI requests. Try again in ${retryAfterSec} seconds.`,
        retryAfterSec,
      },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSec) },
      },
    );
  }

  return null;
}

export function getTokenRateLimitService(): TokenRateLimitService {
  return rateLimitService;
}
