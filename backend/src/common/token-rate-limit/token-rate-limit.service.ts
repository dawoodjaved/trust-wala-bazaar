import { Injectable } from '@nestjs/common';

type WindowEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
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
