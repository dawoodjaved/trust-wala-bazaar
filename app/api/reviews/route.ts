import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { getAiService } from '@/lib/server/ai';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';
import { recalculateTrustScore } from '@/lib/server/trust-score';

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();

    const review = await prisma.review.create({
      data: {
        ...dto,
        userId: auth.id,
      },
      include: {
        user: true,
        product: true,
      },
    });

    const summary = await getAiService().generateReviewSummary([review]);
    await prisma.review.update({
      where: { id: review.id },
      data: { aiSummary: summary.summary },
    });

    recalculateTrustScore(prisma, dto.productId).catch((err) => {
      console.error('Error recalculating trust score after review:', err);
    });

    return json({ ...review, aiSummary: summary.summary });
  } catch (e) {
    console.error('reviews POST error:', e);
    return error('Failed to create review', 500);
  }
}
