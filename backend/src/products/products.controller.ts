import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TokenRateLimit } from '../common/token-rate-limit/token-rate-limit.decorator';
import { TokenRateLimitGuard } from '../common/token-rate-limit/token-rate-limit.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  findAll(@Query() filters: any) {
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TokenRateLimitGuard)
  @TokenRateLimit({ bucket: 'ai-listing', limit: 6, ttlSec: 60 })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  create(@Request() req, @Body() dto: CreateProductDto) {
    return this.productsService.create(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  delete(@Request() req, @Param('id') id: string) {
    return this.productsService.delete(id, req.user.id);
  }
}

