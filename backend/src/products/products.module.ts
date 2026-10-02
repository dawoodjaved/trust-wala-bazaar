import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [AiModule],
  exports: [ProductsService],
})
export class ProductsModule {}

