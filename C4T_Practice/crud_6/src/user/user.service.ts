import { Injectable, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  async getusers() {
    return this.prisma.user.findMany();
  }

  async updateUser(data: {
    id: number;
    name: string;
    email: string;
    password: string;
  }) {
    return this.prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  async deleteTask(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('User Is Not Deleted');
    }
  }
}
