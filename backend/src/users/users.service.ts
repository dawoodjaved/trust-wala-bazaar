import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ProductsService } from '../products/products.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
    private aiService: AiService,
  ) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        products: true,
        reviews: true,
      },
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateVerification(id: string, data: { cnicVerified?: boolean; videoVerified?: boolean }) {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        verificationStatus: data.cnicVerified && data.videoVerified ? 'VERIFIED' : 'PENDING',
      },
    });

    // Recalculate trust scores for all products by this seller
    if (data.cnicVerified !== undefined || data.videoVerified !== undefined) {
      const products = await this.prisma.product.findMany({
        where: { sellerId: id },
        select: { id: true },
      });

      products.forEach((product) => {
        this.productsService.recalculateTrustScore(product.id).catch((error) => {
          console.error('Error recalculating trust score after verification update:', error);
        });
      });
    }

    return updated;
  }

  async verifyVideo(userId: string, videoUrl: string): Promise<{
    verified: boolean;
    confidence: number;
    faceDetected: boolean;
    livenessScore?: number;
    matchWithCNIC?: boolean;
    reasons: string[];
  }> {
    // Get user's CNIC image for comparison
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { cnicImage: true, cnicVerified: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Perform face recognition and verification
    const verificationResult = await this.aiService.verifyVideoWithFaceRecognition(
      videoUrl,
      user.cnicImage || undefined,
    );

    // Update user's video verification status if verified
    if (verificationResult.verified && verificationResult.confidence >= 0.7) {
      await this.updateVerification(userId, {
        videoVerified: true,
      });
    } else {
      // Store video URL even if not verified yet (for manual review)
      await this.prisma.user.update({
        where: { id: userId },
        data: { videoUrl },
      });
    }

    return verificationResult;
  }

  async checkLiveness(userId: string, videoUrl: string): Promise<{
    isLive: boolean;
    score: number;
    indicators: string[];
  }> {
    return this.aiService.detectLiveness(videoUrl);
  }
}

