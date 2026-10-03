import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { json, error } from "@/lib/server/http";
import { clampLimit, productListSelect } from "@/lib/server/product-queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const city = searchParams.get("city");
    const catKey =
      searchParams.get("categoryId") ||
      searchParams.get("category") ||
      searchParams.get("slug");
    const limit = clampLimit(searchParams.get("limit"), 24, 40);

    const and: Prisma.ProductWhereInput[] = [{ isActive: true }];

    const cleaned = query.trim();
    if (cleaned) {
      and.push({
        OR: [
          { title: { contains: cleaned, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: cleaned, mode: Prisma.QueryMode.insensitive } },
        ],
      });
    }

    if (minPrice || maxPrice) {
      const price: Prisma.FloatFilter = {};
      if (minPrice) price.gte = Number(minPrice);
      if (maxPrice) price.lte = Number(maxPrice);
      and.push({ price });
    }

    if (city) {
      and.push({ city: { contains: city, mode: Prisma.QueryMode.insensitive } });
    }

    if (catKey) {
      and.push({
        OR: [{ categoryId: catKey }, { category: { slug: catKey } }],
      });
    }

    const results = await prisma.product.findMany({
      where: { AND: and },
      select: productListSelect,
      orderBy: [{ trustScore: "desc" }, { createdAt: "desc" }],
      take: limit,
    });

    return json(results);
  } catch (e) {
    console.error("search GET error:", e);
    return error("Failed to search", 500);
  }
}
