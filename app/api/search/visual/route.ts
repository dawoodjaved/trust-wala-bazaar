import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/server/prisma';
import { getAiService } from '@/lib/server/ai';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-visual-search', 8, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    const imageUrl = body?.imageUrl;
    if (!imageUrl) {
      return error('imageUrl is required', 400);
    }

    const ai = getAiService();
    const analysis = await ai.analyzeImageForVisualSearch(imageUrl);
    const searchTerms = [...(analysis.labels || []), analysis.description]
      .filter(Boolean)
      .map((t) => String(t).trim())
      .filter((t) => t.length > 2);

    const include = {
      seller: true,
      category: true,
      reviews: { take: 5 },
    } as const;

    if (searchTerms.length === 0) {
      const fallback = await prisma.product.findMany({
        where: { isActive: true },
        include,
        take: 12,
        orderBy: { trustScore: 'desc' },
      });
      return json(fallback);
    }

    const results = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: searchTerms.flatMap((term) => [
          { title: { contains: term, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: term, mode: Prisma.QueryMode.insensitive } },
        ]),
      },
      include,
      take: 20,
    });

    if (results.length > 0) return json(results);

    const fallback = await prisma.product.findMany({
      where: { isActive: true },
      include,
      take: 12,
      orderBy: { trustScore: 'desc' },
    });
    return json(fallback);
  } catch (e) {
    console.error('search/visual error:', e);
    try {
      const fallback = await prisma.product.findMany({
        where: { isActive: true },
        include: { seller: true, category: true, reviews: { take: 5 } },
        take: 12,
        orderBy: { trustScore: 'desc' },
      });
      return json(fallback);
    } catch {
      return error('Visual search failed', 500);
    }
  }
}
