import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async create(senderId: string, dto: CreateMessageDto) {
    const message = await this.prisma.message.create({
      data: {
        ...dto,
        senderId,
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

    // Auto-translate if needed
    if (dto.content && dto.originalLanguage) {
      const translated = await this.aiService.translate(dto.content, 'en');
      await this.prisma.message.update({
        where: { id: message.id },
        data: { translatedContent: translated, aiTranslated: true },
      });
    }

    return message;
  }

  async getConversation(userId1: string, userId2: string, productId?: string) {
    const conversationId = this.generateConversationId(userId1, userId2, productId);

    return this.prisma.message.findMany({
      where: {
        conversationId,
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
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
  }

  async markAsRead(messageId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        id: messageId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  private generateConversationId(userId1: string, userId2: string, productId?: string): string {
    const sortedIds = [userId1, userId2].sort();
    return productId
      ? `${sortedIds[0]}-${sortedIds[1]}-${productId}`
      : `${sortedIds[0]}-${sortedIds[1]}`;
  }
}

