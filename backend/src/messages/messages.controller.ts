import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TokenRateLimit } from '../common/token-rate-limit/token-rate-limit.decorator';
import { TokenRateLimitGuard } from '../common/token-rate-limit/token-rate-limit.guard';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  @UseGuards(TokenRateLimitGuard)
  @TokenRateLimit({ bucket: 'ai-message-translate', limit: 25, ttlSec: 60 })
  @ApiOperation({ summary: 'Send a message' })
  create(@Request() req, @Body() dto: CreateMessageDto) {
    return this.messagesService.create(req.user.id, dto);
  }

  @Get('conversation/:userId')
  @ApiOperation({ summary: 'Get conversation with user' })
  getConversation(@Request() req, @Param('userId') userId: string, @Query('productId') productId?: string) {
    return this.messagesService.getConversation(req.user.id, userId, productId);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.messagesService.markAsRead(id, req.user.id);
  }
}

