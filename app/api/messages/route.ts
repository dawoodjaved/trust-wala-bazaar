import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { getAiService } from '@/lib/server/ai';
import { requireUser } from '@/lib/server/jwt';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

function generateConversationId(userId1: string, userId2: string, productId?: string): string {
  const sortedIds = [userId1, userId2].sort();
  return productId
    ? `${sortedIds[0]}-${sortedIds[1]}-${productId}`
    : `${sortedIds[0]}-${sortedIds[1]}`;
}

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'messages-send', 30, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();
    const receiverId = dto?.receiverId;
    if (!receiverId || typeof receiverId !== 'string') {
      return error('receiverId is required', 400);
    }
    if (receiverId === auth.id) {
      return error('Cannot message yourself', 400);
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });
    if (!receiver) {
      return error('Receiver not found', 404);
    }

    const content =
      typeof dto.content === 'string' ? dto.content.slice(0, 5000) : '';
    if (!content.trim() && !dto.imageUrl) {
      return error('content or imageUrl is required', 400);
    }

    const productId =
      typeof dto.productId === 'string' ? dto.productId : undefined;
    // IDOR / injection fix: never trust client conversationId
    const conversationId = generateConversationId(auth.id, receiverId, productId);

    const ai = getAiService();

    let detectedLanguage = dto.originalLanguage;
    if (content && !detectedLanguage) {
      detectedLanguage = await ai.detectLanguage(content);
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        receiverId,
        type: dto.type || 'TEXT',
        content: content || '',
        imageUrl: typeof dto.imageUrl === 'string' ? dto.imageUrl : undefined,
        offerPrice: dto.offerPrice != null ? Number(dto.offerPrice) : undefined,
        senderId: auth.id,
        originalLanguage: detectedLanguage,
      },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        receiverId: true,
        type: true,
        content: true,
        offerPrice: true,
        translatedContent: true,
        aiTranslated: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (content && detectedLanguage) {
      try {
        const translated = await ai.translate(content, 'en');
        if (translated !== content) {
          await prisma.message.update({
            where: { id: message.id },
            data: { translatedContent: translated, aiTranslated: true },
          });
          message.translatedContent = translated;
          message.aiTranslated = true;
        }
      } catch (err) {
        console.error('Translation error:', err);
      }
    }

    return json(message);
  } catch (e) {
    console.error('messages POST error:', e);
    return error('Failed to send message', 500);
  }
}
