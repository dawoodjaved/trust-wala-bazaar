/** Trust score helpers — batched updates avoid N+1 recalculation. */

export function computeTrustScore(product: {
  seller?: { cnicVerified?: boolean; videoVerified?: boolean } | null;
  ptaVerified?: boolean;
  specifications?: unknown;
  reviews?: Array<{ rating: number }>;
  price?: number;
  aiPriceSuggestion?: number | null;
}): {
  score: number;
  breakdown: {
    sellerVerification: number;
    productAuthenticity: number;
    reviews: number;
    priceFairness: number;
  };
} {
  let sellerVerification = 0;
  if (product.seller?.cnicVerified) sellerVerification += 50;
  if (product.seller?.videoVerified) sellerVerification += 50;

  let productAuthenticity = 0;
  if (product.ptaVerified) productAuthenticity += 50;
  if (product.specifications) productAuthenticity += 50;

  let reviews = 0;
  if (product.reviews && product.reviews.length > 0) {
    const avgRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    reviews = Math.round((avgRating / 5) * 100);
  }

  let priceFairness = 50;
  if (product.aiPriceSuggestion && product.price != null) {
    const priceDiff =
      Math.abs(product.price - product.aiPriceSuggestion) / product.aiPriceSuggestion;
    priceFairness = Math.round(Math.max(0, (1 - priceDiff) * 100));
  }

  const score = Math.round(
    sellerVerification * 0.4 +
      productAuthenticity * 0.3 +
      reviews * 0.2 +
      priceFairness * 0.1,
  );

  return {
    score,
    breakdown: {
      sellerVerification,
      productAuthenticity,
      reviews,
      priceFairness,
    },
  };
}

type PrismaLike = {
  product: {
    findUnique: (args: any) => Promise<any>;
    findMany: (args: any) => Promise<any[]>;
    update: (args: any) => Promise<any>;
  };
};

export async function recalculateTrustScore(
  prisma: PrismaLike,
  productId: string,
): Promise<number> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      seller: {
        select: {
          cnicVerified: true,
          videoVerified: true,
        },
      },
      reviews: { select: { rating: true } },
    },
  });

  if (!product) return 0;

  const trustScore = computeTrustScore(product).score;

  await prisma.product.update({
    where: { id: productId },
    data: { trustScore },
  });

  return trustScore;
}

/** One read for all seller products, then parallel score writes — no N+1 finds. */
export async function recalculateTrustScoresForSeller(
  prisma: PrismaLike,
  sellerId: string,
): Promise<void> {
  const products = await prisma.product.findMany({
    where: { sellerId, isActive: true },
    include: {
      seller: {
        select: {
          cnicVerified: true,
          videoVerified: true,
        },
      },
      reviews: { select: { rating: true } },
    },
  });

  if (products.length === 0) return;

  await Promise.all(
    products.map((product) =>
      prisma.product.update({
        where: { id: product.id },
        data: { trustScore: computeTrustScore(product).score },
      }),
    ),
  );
}
