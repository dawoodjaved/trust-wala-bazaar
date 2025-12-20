import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        user: true,
        product: true,
      },
    });

    // Generate AI summary
    const summary = await this.aiService.generateReviewSummary([review]);
    await this.prisma.review.update({
      where: { id: review.id },
      data: { aiSummary: summary.summary },
    });

    return review;
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

