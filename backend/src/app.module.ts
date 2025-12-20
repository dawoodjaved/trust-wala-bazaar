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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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

