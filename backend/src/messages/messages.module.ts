import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
  imports: [AiModule],
  exports: [MessagesService],
})
export class MessagesModule {}

