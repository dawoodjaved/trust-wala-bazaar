import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [AiModule],
  exports: [ReviewsService],
})
export class ReviewsModule {}

