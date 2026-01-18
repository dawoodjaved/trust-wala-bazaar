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
    // Auto-detect language if not provided
    let detectedLanguage = dto.originalLanguage;
    if (dto.content && !detectedLanguage) {
      detectedLanguage = await this.aiService.detectLanguage(dto.content);
    }

    const message = await this.prisma.message.create({
      data: {
        ...dto,
        senderId,
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

    // Auto-translate if content exists and language is detected
    if (dto.content && detectedLanguage) {
      try {
        // Translate to English for storage (can be extended to translate to receiver's preferred language)
        const translated = await this.aiService.translate(dto.content, 'en');
        if (translated !== dto.content) {
          await this.prisma.message.update({
            where: { id: message.id },
            data: { translatedContent: translated, aiTranslated: true },
          });
          // Update message object for response
          message.translatedContent = translated;
          message.aiTranslated = true;
        }
      } catch (error) {
        console.error('Translation error:', error);
        // Continue without translation
      }
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

