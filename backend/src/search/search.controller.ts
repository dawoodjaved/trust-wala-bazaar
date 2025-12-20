import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Text search' })
  textSearch(@Query('q') query: string, @Query() filters: any) {
    return this.searchService.textSearch(query, filters);
  }

  @Post('visual')
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

