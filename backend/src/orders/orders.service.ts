import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: string, dto: CreateOrderDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return this.prisma.order.create({
      data: {
        ...dto,
        buyerId,
        sellerId: product.sellerId,
        price: product.price,
      },
      include: {
        product: true,
        buyer: true,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        product: true,
        buyer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

