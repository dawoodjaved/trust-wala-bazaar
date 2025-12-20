import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: {
          take: 20,
        },
      },
    });
  }
}

