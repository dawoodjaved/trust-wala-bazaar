import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [AiModule],
})
export class SearchModule {}

