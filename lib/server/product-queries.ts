import type { Prisma } from "@prisma/client";

/** Lean fields for product cards / grids — no full seller row, no review payloads. */
export const productListSelect = {
  id: true,
  title: true,
  slug: true,
  price: true,
  originalPrice: true,
  condition: true,
  city: true,
  province: true,
  images: true,
  thumbnail: true,
  trustScore: true,
  ptaVerified: true,
  isActive: true,
  createdAt: true,
  categoryId: true,
  sellerId: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      rating: true,
      cnicVerified: true,
      videoVerified: true,
    },
  },
  _count: {
    select: { reviews: true },
  },
} satisfies Prisma.ProductSelect;

export const productDetailSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  price: true,
  originalPrice: true,
  condition: true,
  city: true,
  province: true,
  latitude: true,
  longitude: true,
  images: true,
  videos: true,
  thumbnail: true,
  specifications: true,
  trustScore: true,
  ptaVerified: true,
  ptaStatus: true,
  aiPriceSuggestion: true,
  aiPriceConfidence: true,
  views: true,
  likes: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  sellerId: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  seller: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      rating: true,
      totalReviews: true,
      cnicVerified: true,
      videoVerified: true,
      verificationStatus: true,
      city: true,
      responseTime: true,
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      title: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" as const },
    take: 20,
  },
} satisfies Prisma.ProductSelect;

export function clampLimit(raw: string | null | undefined, fallback = 20, max = 40): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.floor(n), max);
}
