import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(userId: string, dto: CreateProductDto) {
    // Generate slug
    const slug = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Get AI price suggestion
    const aiPrice = await this.aiService.suggestPrice(dto);

    const product = await this.prisma.product.create({
      data: {
        ...dto,
        slug,
        sellerId: userId,
        aiPriceSuggestion: aiPrice.suggestedPrice,
        aiPriceConfidence: aiPrice.confidence,
      },
      include: {
        seller: true,
        category: true,
      },
    });

    return product;
  }

  async findAll(filters: any) {
    const where: any = {
      isActive: true,
    };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        seller: true,
        category: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: filters.sortBy || { createdAt: 'desc' },
      take: filters.limit || 20,
      skip: filters.skip || 0,
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            rating: true,
            cnicVerified: true,
            videoVerified: true,
            verificationStatus: true,
          },
        },
        category: true,
        reviews: {
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
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment views
    await this.prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // Calculate trust score
    const trustScore = await this.calculateTrustScore(product);
    product.trustScore = trustScore;

    return product;
  }

  async update(id: string, userId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.sellerId !== userId) {
      throw new NotFoundException('Product not found or unauthorized');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        seller: {
          select: {
            id: true,
            cnicVerified: true,
            videoVerified: true,
          },
        },
        reviews: true,
      },
    });

    // Recalculate trust score after update
    await this.recalculateTrustScore(id);

    return updated;
  }

  async delete(id: string, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product || product.sellerId !== userId) {
      throw new NotFoundException('Product not found or unauthorized');
    }

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async recalculateTrustScore(productId: string): Promise<number> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            cnicVerified: true,
            videoVerified: true,
          },
        },
        reviews: true,
      },
    });

    if (!product) {
      return 0;
    }

    const trustScore = await this.calculateTrustScore(product);
    
    // Update trust score in database
    await this.prisma.product.update({
      where: { id: productId },
      data: { trustScore },
    });

    return trustScore;
  }

  private async calculateTrustScore(product: any): Promise<number> {
    let score = 0;
    let factors = 0;

    // Seller verification (40%)
    if (product.seller.cnicVerified) score += 20;
    if (product.seller.videoVerified) score += 20;
    factors += 40;

    // Product authenticity (30%)
    if (product.ptaVerified) score += 15;
    if (product.specifications) score += 15;
    factors += 30;

    // Reviews (20%)
    if (product.reviews.length > 0) {
      const avgRating = product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / product.reviews.length;
      score += (avgRating / 5) * 20;
    }
    factors += 20;

    // Price fairness (10%)
    if (product.aiPriceSuggestion) {
      const priceDiff = Math.abs(product.price - product.aiPriceSuggestion) / product.aiPriceSuggestion;
      score += Math.max(0, (1 - priceDiff) * 10);
    }
    factors += 10;

    return Math.round((score / factors) * 100);
  }
}

