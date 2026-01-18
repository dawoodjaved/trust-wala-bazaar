import { Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { AiModule } from '../ai/ai.module';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [AiModule, forwardRef(() => ProductsModule)],
  exports: [ReviewsService],
})
export class ReviewsModule {}

