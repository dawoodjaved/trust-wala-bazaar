import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
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

