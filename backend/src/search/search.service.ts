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
    // Hybrid search: text + semantic (if embeddings available)
    const textResults = await this.prisma.product.findMany({
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

    // Try semantic search if AI service is available
    try {
      const queryEmbedding = await this.aiService.generateEmbedding(query);
      if (queryEmbedding.length > 0) {
        // Note: This requires pgvector extension in PostgreSQL
        // For now, we'll use text search and enhance with AI understanding
        // In production, you'd query vector database here
      }
    } catch (error) {
      console.error('Semantic search error:', error);
    }

    return textResults;
  }

  async visualSearch(imageUrl: string) {
    try {
      // Analyze image to get labels and description
      const analysis = await this.aiService.analyzeImageForVisualSearch(imageUrl);
      
      if (analysis.labels.length === 0 && !analysis.description) {
        return [];
      }

      // Search products by labels and description
      const searchTerms = [...analysis.labels, analysis.description].filter(Boolean);
      
      const results = await this.prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            ...searchTerms.map(term => ({
              title: { contains: term, mode: 'insensitive' },
            })),
            ...searchTerms.map(term => ({
              description: { contains: term, mode: 'insensitive' },
            })),
          ],
        },
        include: {
          seller: true,
          category: true,
        },
        take: 20,
      });

      return results;
    } catch (error) {
      console.error('Visual search error:', error);
      return [];
    }
  }

  async voiceSearch(transcript: string) {
    // Process voice search transcript with better handling
    // Clean up transcript (remove filler words, etc.)
    const cleanedTranscript = transcript
      .toLowerCase()
      .replace(/\b(um|uh|ah|like|you know)\b/gi, '')
      .trim();

    return this.textSearch(cleanedTranscript, {});
  }

  async semanticSearch(query: string, filters: any) {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.aiService.generateEmbedding(query);
      
      if (queryEmbedding.length === 0) {
        // Fallback to text search
        return this.textSearch(query, filters);
      }

      // For now, use text search enhanced with AI understanding
      // In production with pgvector, you'd do:
      // SELECT * FROM products 
      // ORDER BY embedding <=> $1::vector 
      // LIMIT 50

      // Enhanced text search with AI-expanded terms
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

