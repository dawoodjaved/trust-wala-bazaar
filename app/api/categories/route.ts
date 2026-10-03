import { prisma } from "@/lib/server/prisma";
import { json, error } from "@/lib/server/http";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        image: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });
    return json(categories);
  } catch (e) {
    console.error("categories GET error:", e);
    return error("Failed to fetch categories", 500);
  }
}
