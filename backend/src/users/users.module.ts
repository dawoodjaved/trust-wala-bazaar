import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProductsModule } from '../products/products.module';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [forwardRef(() => ProductsModule), AiModule],
  exports: [UsersService],
})
export class UsersModule {}

