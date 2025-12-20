import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review' })
  create(@Request() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.id, dto);
  }
}

