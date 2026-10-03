import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { getAiService } from "@/lib/server/ai";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { json, error } from "@/lib/server/http";
import { productListSelect } from "@/lib/server/product-queries";

async function topTrusted(take = 12) {
  return prisma.product.findMany({
    where: { isActive: true },
    select: productListSelect,
    take,
    orderBy: { trustScore: "desc" },
  });
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "ai-visual-search", 8, 60);
  if (limited) return limited;

  try {
    const body = await request.json();
    const imageUrl = body?.imageUrl;
    if (!imageUrl) {
      return error("imageUrl is required", 400);
    }

    const ai = getAiService();
    const analysis = await ai.analyzeImageForVisualSearch(imageUrl);

    // Cap terms so the OR clause stays small and index-friendly
    const searchTerms = [...(analysis.labels || []), analysis.description]
      .filter(Boolean)
      .map((t) => String(t).trim())
      .filter((t) => t.length > 2)
      .slice(0, 5);

    if (searchTerms.length === 0) {
      return json(await topTrusted(12));
    }

    const results = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: searchTerms.flatMap((term) => [
          { title: { contains: term, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: term, mode: Prisma.QueryMode.insensitive } },
        ]),
      },
      select: productListSelect,
      take: 20,
      orderBy: { trustScore: "desc" },
    });

    if (results.length > 0) return json(results);
    return json(await topTrusted(12));
  } catch (e) {
    console.error("search/visual error:", e);
    try {
      return json(await topTrusted(12));
    } catch {
      return error("Visual search failed", 500);
    }
  }
}
