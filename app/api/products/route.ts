import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import { getAiService } from "@/lib/server/ai";
import { requireUser } from "@/lib/server/jwt";
import { enforceRateLimit } from "@/lib/server/rate-limit";
import { json, error } from "@/lib/server/http";
import { computeTrustScore } from "@/lib/server/trust-score";
import { clampLimit, productListSelect } from "@/lib/server/product-queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams.entries());
    const limit = clampLimit(filters.limit, 20, 40);
    const skip = Math.max(0, Number(filters.skip) || 0);

    const and: Prisma.ProductWhereInput[] = [{ isActive: true }];

    const catKey = filters.categoryId || filters.category || filters.slug;
    if (catKey) {
      and.push({
        OR: [{ categoryId: catKey }, { category: { slug: catKey } }],
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      const price: Prisma.FloatFilter = {};
      if (filters.minPrice) price.gte = Number(filters.minPrice);
      if (filters.maxPrice) price.lte = Number(filters.maxPrice);
      and.push({ price });
    }

    if (filters.search) {
      and.push({
        OR: [
          { title: { contains: filters.search, mode: Prisma.QueryMode.insensitive } },
          { description: { contains: filters.search, mode: Prisma.QueryMode.insensitive } },
        ],
      });
    }

    if (filters.sellerId) {
      and.push({ sellerId: filters.sellerId });
    }

    const products = await prisma.product.findMany({
      where: { AND: and },
      select: productListSelect,
      orderBy: [{ trustScore: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip,
    });

    return json(products);
  } catch (e) {
    console.error("products GET error:", e);
    return error("Failed to fetch products", 500);
  }
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, "ai-listing", 6, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();
    const ai = getAiService();

    const slugBase = String(dto.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const [aiPrice, fraud] = await Promise.all([
      ai.suggestPrice(dto),
      ai.detectFraud(dto, auth),
    ]);

    const product = await prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: Number(dto.price),
        originalPrice: dto.originalPrice != null ? Number(dto.originalPrice) : undefined,
        condition: dto.condition,
        categoryId: dto.categoryId,
        city: dto.city,
        province: dto.province,
        latitude: dto.latitude,
        longitude: dto.longitude,
        images: dto.images || [],
        videos: dto.videos || [],
        thumbnail: dto.thumbnail,
        specifications: dto.specifications,
        // Privilege escalation: PTA flags are server/admin-only
        ptaVerified: false,
        ptaStatus: undefined,
        slug,
        sellerId: auth.id,
        aiPriceSuggestion: aiPrice.suggestedPrice,
        aiPriceConfidence: aiPrice.confidence,
      },
      select: {
        ...productListSelect,
        description: true,
        specifications: true,
        aiPriceSuggestion: true,
        ptaVerified: true,
      },
    });

    const { score } = computeTrustScore({
      ...product,
      seller: {
        cnicVerified: auth.cnicVerified,
        videoVerified: auth.videoVerified,
      },
      reviews: [],
    });

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: { trustScore: score },
      select: productListSelect,
    });

    return json({
      ...updated,
      fraudSignals: fraud,
    });
  } catch (e) {
    console.error("products POST error:", e);
    return error("Failed to create product", 500);
  }
}
