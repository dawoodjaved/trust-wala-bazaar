import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { TokenRateLimit } from '../common/token-rate-limit/token-rate-limit.decorator';
import { TokenRateLimitGuard } from '../common/token-rate-limit/token-rate-limit.guard';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Text search' })
  textSearch(@Query('q') query: string, @Query() filters: any) {
    const { q: _q, ...rest } = filters || {};
    void _q;
    return this.searchService.textSearch(query || '', rest);
  }

  @Post('visual')
  @UseGuards(TokenRateLimitGuard)
  @TokenRateLimit({ bucket: 'ai-visual-search', limit: 8, ttlSec: 60 })
  @ApiOperation({ summary: 'Visual search' })
  visualSearch(@Body() body: { imageUrl: string }) {
    return this.searchService.visualSearch(body.imageUrl);
  }

  @Post('voice')
  @ApiOperation({ summary: 'Voice search' })
  voiceSearch(@Body() body: { transcript: string }) {
    return this.searchService.voiceSearch(body.transcript);
  }
}

