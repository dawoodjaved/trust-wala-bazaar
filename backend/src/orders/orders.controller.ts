import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order' })
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get my orders' })
  findByUser(@Request() req) {
    return this.ordersService.findByUser(req.user.id);
  }
}

