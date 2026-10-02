import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/server/prisma';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const transcript = body?.transcript || '';

    const cleanedTranscript = String(transcript)
      .toLowerCase()
      .replace(/\b(um|uh|ah|like|you know)\b/gi, '')
      .trim();

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (cleanedTranscript) {
      where.OR = [
        { title: { contains: cleanedTranscript, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: cleanedTranscript, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    const results = await prisma.product.findMany({
      where,
      include: {
        seller: true,
        category: true,
        reviews: { take: 5 },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return json(results);
  } catch (e) {
    console.error('search/voice error:', e);
    return error('Voice search failed', 500);
  }
}
