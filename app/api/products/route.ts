import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/server/prisma';
import { getAiService } from '@/lib/server/ai';
import { requireUser } from '@/lib/server/jwt';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';
import { computeTrustScore } from '@/lib/server/trust-score';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams.entries());

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (filters.categoryId || filters.category || filters.slug) {
      const key = filters.categoryId || filters.category || filters.slug;
      const category = await prisma.category.findFirst({
        where: {
          OR: [{ id: key }, { slug: key }],
        },
      });
      if (category) {
        where.categoryId = category.id;
      } else {
        where.categoryId = key;
      }
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: filters.search, mode: Prisma.QueryMode.insensitive } },
      ];
    }

    const products = await prisma.product.findMany({
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

    return json(products);
  } catch (e) {
    console.error('products GET error:', e);
    return error('Failed to fetch products', 500);
  }
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-listing', 6, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();
    const ai = getAiService();

    const slugBase = String(dto.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const aiPrice = await ai.suggestPrice(dto);
    const seller = await prisma.user.findUnique({ where: { id: auth.id } });
    const fraud = await ai.detectFraud(dto, seller || {});

    const product = await prisma.product.create({
      data: {
        ...dto,
        slug,
        sellerId: auth.id,
        aiPriceSuggestion: aiPrice.suggestedPrice,
        aiPriceConfidence: aiPrice.confidence,
      },
      include: {
        seller: true,
        category: true,
        reviews: true,
      },
    });

    const { score } = computeTrustScore(product);
    await prisma.product.update({
      where: { id: product.id },
      data: { trustScore: score },
    });

    return json({
      ...product,
      trustScore: score,
      fraudSignals: fraud,
    });
  } catch (e) {
    console.error('products POST error:', e);
    return error('Failed to create product', 500);
  }
}
