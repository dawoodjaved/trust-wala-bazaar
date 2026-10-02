import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { getAiService } from '@/lib/server/ai';
import { requireUser } from '@/lib/server/jwt';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { json, error } from '@/lib/server/http';

export async function POST(request: Request) {
  const limited = enforceRateLimit(request, 'ai-message-translate', 25, 60);
  if (limited) return limited;

  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const dto = await request.json();
    const ai = getAiService();

    let detectedLanguage = dto.originalLanguage;
    if (dto.content && !detectedLanguage) {
      detectedLanguage = await ai.detectLanguage(dto.content);
    }

    const message = await prisma.message.create({
      data: {
        ...dto,
        senderId: auth.id,
        originalLanguage: detectedLanguage,
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
    });

    if (dto.content && detectedLanguage) {
      try {
        const translated = await ai.translate(dto.content, 'en');
        if (translated !== dto.content) {
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
