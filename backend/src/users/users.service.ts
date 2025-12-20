import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        products: true,
        reviews: true,
      },
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateVerification(id: string, data: { cnicVerified?: boolean; videoVerified?: boolean }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        verificationStatus: data.cnicVerified && data.videoVerified ? 'VERIFIED' : 'PENDING',
      },
    });
  }
}

