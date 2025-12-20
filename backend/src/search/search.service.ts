import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async textSearch(query: string, filters: any) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        ...filters,
      },
      include: {
        seller: true,
        category: true,
      },
      take: 50,
    });
  }

  async visualSearch(imageUrl: string) {
    // TODO: Implement visual search using AI
    // For now, return empty results
    return [];
  }

  async voiceSearch(transcript: string) {
    // Process voice search transcript
    return this.textSearch(transcript, {});
  }
}

