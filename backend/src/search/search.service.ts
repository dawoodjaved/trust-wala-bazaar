import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async textSearch(query: string, filters: any = {}) {
    const { q, query: _q, minPrice, maxPrice, categoryId, category, slug, city, ...rest } = filters || {};
    void rest;
    void q;
    void _q;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    const cleaned = (query || '').trim();
    if (cleaned) {
      where.OR = [
        { title: { contains: cleaned, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: cleaned, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    if (minPrice !== undefined && minPrice !== '') {
      where.price = { ...(where.price as object), gte: Number(minPrice) };
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      where.price = { ...(where.price as any), lte: Number(maxPrice) };
    }
    if (city) {
      where.city = { contains: String(city), mode: 'insensitive' };
    }

    const catKey = categoryId || category || slug;
    if (catKey) {
      const cat = await this.prisma.category.findFirst({
        where: { OR: [{ id: String(catKey) }, { slug: String(catKey) }] },
      });
      if (cat) where.categoryId = cat.id;
    }

    return this.prisma.product.findMany({
      where,
      include: {
        seller: true,
        category: true,
        reviews: { take: 5 },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async visualSearch(imageUrl: string) {
    try {
      const analysis = await this.aiService.analyzeImageForVisualSearch(imageUrl);
      const searchTerms = [...(analysis.labels || []), analysis.description]
        .filter(Boolean)
        .map((t) => String(t).trim())
        .filter((t) => t.length > 2);

      if (searchTerms.length === 0) {
        // No AI labels — return a sensible sample of active products
        return this.prisma.product.findMany({
          where: { isActive: true },
          include: { seller: true, category: true, reviews: { take: 5 } },
          take: 12,
          orderBy: { trustScore: 'desc' },
        });
      }

      const results = await this.prisma.product.findMany({
        where: {
          isActive: true,
          OR: searchTerms.flatMap((term) => [
            { title: { contains: term, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: term, mode: Prisma.QueryMode.insensitive } },
          ]),
        },
        include: {
          seller: true,
          category: true,
          reviews: { take: 5 },
        },
        take: 20,
      });

      if (results.length > 0) return results;

      return this.prisma.product.findMany({
        where: { isActive: true },
        include: { seller: true, category: true, reviews: { take: 5 } },
        take: 12,
        orderBy: { trustScore: 'desc' },
      });
    } catch (error) {
      console.error('Visual search error:', error);
      return this.prisma.product.findMany({
        where: { isActive: true },
        include: { seller: true, category: true, reviews: { take: 5 } },
        take: 12,
        orderBy: { trustScore: 'desc' },
      });
    }
  }

  async voiceSearch(transcript: string) {
    const cleanedTranscript = transcript
      .toLowerCase()
      .replace(/\b(um|uh|ah|like|you know)\b/gi, '')
      .trim();

    return this.textSearch(cleanedTranscript, {});
  }

  async semanticSearch(query: string, filters: any) {
    try {
      const queryEmbedding = await this.aiService.generateEmbedding(query);
      if (queryEmbedding.length === 0) {
        return this.textSearch(query, filters);
      }
      const expandedQuery = await this.expandQueryWithAI(query);
      return this.textSearch(expandedQuery, filters);
    } catch (error) {
      console.error('Semantic search error:', error);
      return this.textSearch(query, filters);
    }
  }

  private async expandQueryWithAI(query: string): Promise<string> {
    try {
      const prompt = `Expand this search query with related terms and synonyms for a marketplace search:
Original query: "${query}"

Provide 3-5 related search terms separated by spaces. Only return the terms, nothing else.`;

      const expanded = await this.aiService.chat(prompt);
      if (expanded && expanded !== query) {
        return `${query} ${expanded}`;
      }
    } catch (error) {
      console.error('Query expansion error:', error);
    }
    return query;
  }
}
