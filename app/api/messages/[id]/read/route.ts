import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { requireUser } from '@/lib/server/jwt';
import { json, error } from '@/lib/server/http';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Ctx) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;

    const result = await prisma.message.updateMany({
      where: {
        id,
        receiverId: auth.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return json(result);
  } catch (e) {
    console.error('messages/[id]/read error:', e);
    return error('Failed to mark message as read', 500);
  }
}
