import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async CreateUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async getuser() {
    return this.prisma.user.findMany();
  }
}
