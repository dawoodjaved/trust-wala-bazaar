import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';

type Ctx = { params: Promise<{ userId: string }> };

function generateConversationId(userId1: string, userId2: string, productId?: string): string {
  const sortedIds = [userId1, userId2].sort();
  return productId
    ? `${sortedIds[0]}-${sortedIds[1]}-${productId}`
    : `${sortedIds[0]}-${sortedIds[1]}`;
}

export async function GET(request: Request, context: Ctx) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { userId } = await context.params;
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;

    const conversationId = generateConversationId(auth.id, userId, productId);

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
        OR: [
          { senderId: auth.id, receiverId: userId },
          { senderId: userId, receiverId: auth.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return json(messages);
  } catch (e) {
    console.error('messages/conversation error:', e);
    return error('Failed to fetch conversation', 500);
  }
}
