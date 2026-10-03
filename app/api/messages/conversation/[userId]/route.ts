import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireUser } from "@/lib/server/jwt";
import { json, error } from "@/lib/server/http";

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
    const productId = searchParams.get("productId") || undefined;
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 100, 1), 200);

    const conversationId = generateConversationId(auth.id, userId, productId);

    const messages = await prisma.message.findMany({
      where: { conversationId },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        receiverId: true,
        type: true,
        content: true,
        imageUrl: true,
        offerPrice: true,
        translatedContent: true,
        aiTranslated: true,
        isRead: true,
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
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    return json(messages);
  } catch (e) {
    console.error("messages/conversation error:", e);
    return error("Failed to fetch conversation", 500);
  }
}
