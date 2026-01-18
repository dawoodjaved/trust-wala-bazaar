import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(clerkId: string, email: string, firstName?: string, lastName?: string) {
    let user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await this.usersService.create({
        clerkId,
        email,
        firstName: firstName || email.split('@')[0],
        lastName: lastName || '',
      });
    } else {
      // Update user info if provided
      if (firstName || lastName || email !== user.email) {
        user = await this.usersService.update(user.id, {
          email,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
        });
      }
    }

    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, clerkId: user.clerkId };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

