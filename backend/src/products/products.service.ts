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
    const slugBase = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    // Get AI price suggestion
    const aiPrice = await this.aiService.suggestPrice(dto);

    const seller = await this.prisma.user.findUnique({ where: { id: userId } });
    const fraud = await this.aiService.detectFraud(dto, seller || {});

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
        reviews: true,
      },
    });

    const { score } = this.computeTrustScore(product);
    await this.prisma.product.update({
      where: { id: product.id },
      data: { trustScore: score },
    });

    return {
      ...product,
      trustScore: score,
      fraudSignals: fraud,
    };
  }

  async findAll(filters: any) {
    const where: any = {
      isActive: true,
    };

    if (filters.categoryId || filters.category || filters.slug) {
      const key = filters.categoryId || filters.category || filters.slug;
      const category = await this.prisma.category.findFirst({
        where: {
          OR: [{ id: key }, { slug: key }],
        },
      });
      if (category) {
        where.categoryId = category.id;
      } else {
        where.categoryId = key; // fall through (will return empty)
      }
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
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
      orderBy: [{ trustScore: 'desc' }, { createdAt: 'desc' }],
      take: Number(filters.limit) || 20,
      skip: Number(filters.skip) || 0,
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

    const { score, breakdown } = this.computeTrustScore(product);
    product.trustScore = score;

    return {
      ...product,
      trustBreakdown: breakdown,
    };
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

    const trustScore = this.computeTrustScore(product).score;
    
    // Update trust score in database
    await this.prisma.product.update({
      where: { id: productId },
      data: { trustScore },
    });

    return trustScore;
  }

  private computeTrustScore(product: any): {
    score: number;
    breakdown: {
      sellerVerification: number;
      productAuthenticity: number;
      reviews: number;
      priceFairness: number;
    };
  } {
    let sellerVerification = 0;
    if (product.seller?.cnicVerified) sellerVerification += 50;
    if (product.seller?.videoVerified) sellerVerification += 50;

    let productAuthenticity = 0;
    if (product.ptaVerified) productAuthenticity += 50;
    if (product.specifications) productAuthenticity += 50;

    let reviews = 0;
    if (product.reviews?.length > 0) {
      const avgRating =
        product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        product.reviews.length;
      reviews = Math.round((avgRating / 5) * 100);
    }

    let priceFairness = 50;
    if (product.aiPriceSuggestion) {
      const priceDiff =
        Math.abs(product.price - product.aiPriceSuggestion) / product.aiPriceSuggestion;
      priceFairness = Math.round(Math.max(0, (1 - priceDiff) * 100));
    }

    const score = Math.round(
      sellerVerification * 0.4 +
        productAuthenticity * 0.3 +
        reviews * 0.2 +
        priceFairness * 0.1,
    );

    return {
      score,
      breakdown: {
        sellerVerification,
        productAuthenticity,
        reviews,
        priceFairness,
      },
    };
  }

  private async calculateTrustScore(product: any): Promise<number> {
    return this.computeTrustScore(product).score;
  }
}

