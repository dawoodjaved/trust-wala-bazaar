import { prisma } from '@/lib/server/prisma';
import { json, error } from '@/lib/server/http';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  try {
    const { id: idOrSlug } = await context.params;

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        children: true,
        products: {
          where: { isActive: true },
          take: 50,
          include: {
            seller: true,
            category: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return error('Category not found', 404);
    }

    return json(category);
  } catch (e) {
    console.error('categories/[id] GET error:', e);
    return error('Failed to fetch category', 500);
  }
}
