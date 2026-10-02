import { SetMetadata } from '@nestjs/common';

export const TOKEN_RATE_LIMIT_KEY = 'token_rate_limit';

export type TokenRateLimitOptions = {
  /** Bucket name (combined with client id). */
  bucket: string;
  /** Max requests per window. */
  limit: number;
  /** Window length in seconds. */
  ttlSec: number;
};

export const TokenRateLimit = (options: TokenRateLimitOptions) =>
  SetMetadata(TOKEN_RATE_LIMIT_KEY, options);
