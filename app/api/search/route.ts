import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/server/prisma';
import { json, error } from '@/lib/server/http';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const filters = Object.fromEntries(searchParams.entries());
    const { q: _q, query: _query, minPrice, maxPrice, categoryId, category, slug, city } =
      filters as Record<string, string>;
    void _q;
    void _query;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    const cleaned = query.trim();
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
      where.city = { contains: String(city), mode: Prisma.QueryMode.insensitive };
    }

    const catKey = categoryId || category || slug;
    if (catKey) {
      const cat = await prisma.category.findFirst({
        where: { OR: [{ id: String(catKey) }, { slug: String(catKey) }] },
      });
      if (cat) where.categoryId = cat.id;
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
    console.error('search GET error:', e);
    return error('Failed to search', 500);
  }
}
