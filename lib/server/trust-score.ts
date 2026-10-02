/** Port of ProductsService.computeTrustScore / recalculateTrustScore */
export function computeTrustScore(product: any): {
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
  if (product.reviews?.length > 0) {
    const avgRating =
      product.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
      product.reviews.length;
    reviews = Math.round((avgRating / 5) * 100);
  }

  let priceFairness = 50;
  if (product.aiPriceSuggestion) {
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

export async function recalculateTrustScore(
  prisma: { product: any },
  productId: string,
): Promise<number> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      seller: {
        select: {
          id: true,
          cnicVerified: true,
          videoVerified: true,
        },
      },
      reviews: true,
    },
  });

  if (!product) {
    return 0;
  }

  const trustScore = computeTrustScore(product).score;

  await prisma.product.update({
    where: { id: productId },
    data: { trustScore },
  });

  return trustScore;
}
