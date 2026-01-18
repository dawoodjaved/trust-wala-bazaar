import { PrismaService } from './prisma.service';
import { ProductsService } from '../products/products.service';

// This middleware will be used to trigger trust score recalculation
// when reviews or user verification status changes
export function setupPrismaMiddleware(
  prisma: PrismaService,
  productsService: ProductsService,
) {
  // Middleware for Review creation/update
  prisma.$use(async (params, next) => {
    const result = await next(params);

    // If a review was created or updated, recalculate trust scores for related products
    if (params.model === 'Review' && (params.action === 'create' || params.action === 'update')) {
      if (result && result.productId) {
        // Trigger trust score recalculation asynchronously
        productsService.recalculateTrustScore(result.productId).catch((error) => {
          console.error('Error recalculating trust score:', error);
        });
      }
    }

    // If user verification status changed, recalculate trust scores for all their products
    if (params.model === 'User' && params.action === 'update') {
      if (params.args?.data && (params.args.data.cnicVerified !== undefined || params.args.data.videoVerified !== undefined)) {
        // Find all products by this user and recalculate
        const userId = params.args.where?.id;
        if (userId) {
          prisma.product
            .findMany({
              where: { sellerId: userId },
              select: { id: true },
            })
            .then((products) => {
              products.forEach((product) => {
                productsService.recalculateTrustScore(product.id).catch((error) => {
                  console.error('Error recalculating trust score:', error);
                });
              });
            })
            .catch((error) => {
              console.error('Error finding products for trust score update:', error);
            });
        }
      }
    }

    return result;
  });
}
