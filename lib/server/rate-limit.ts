import { NextResponse } from 'next/server';
import { getClientIp } from './http';
import { verifyAccessToken } from './jwt';

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

/** Prefer verified JWT subject; never trust jwt.decode (forgeable). */
function clientKey(request: Request): string {
  const auth = request.headers.get('authorization');
  if (auth?.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim();
    if (token) {
      try {
        const payload = verifyAccessToken(token);
        if (payload.sub) return `user:${payload.sub}`;
      } catch {
        // Invalid / non-app token — bucket by IP
      }
    }
  }

  return `ip:${getClientIp(request)}`;
}

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
        message: `Too many requests. Try again in ${retryAfterSec} seconds.`,
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
