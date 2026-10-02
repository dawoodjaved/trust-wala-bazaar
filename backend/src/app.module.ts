import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { MessagesModule } from './messages/messages.module';
import { AiModule } from './ai/ai.module';
import { SearchModule } from './search/search.module';
import { UploadModule } from './upload/upload.module';
import { TokenRateLimitModule } from './common/token-rate-limit/token-rate-limit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../.env.local'],
    }),
    TokenRateLimitModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ReviewsModule,
    OrdersModule,
    MessagesModule,
    AiModule,
    SearchModule,
    UploadModule,
  ],
})
export class AppModule {}

