import { Global, Module } from '@nestjs/common';
import { TokenRateLimitService } from './token-rate-limit.service';
import { TokenRateLimitGuard } from './token-rate-limit.guard';

@Global()
@Module({
  providers: [TokenRateLimitService, TokenRateLimitGuard],
  exports: [TokenRateLimitService, TokenRateLimitGuard],
})
export class TokenRateLimitModule {}
