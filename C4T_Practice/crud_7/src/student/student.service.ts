import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent(data: { name: string; email: string; password: string }) {
    return this.prisma.student.create({ data });
  }

  async getstudentdata() {
    return this.prisma.student.findMany();
  }

  async updateUser(data: {
    id: number;
    name: string;
    email: string;
    password: string;
  }) {
    return this.prisma.student.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  async deleteStudent(id: number) {
    try {
      return await this.prisma.student.delete({ where: { id } });
    } catch (error) {
      throw new Error('Stutent user ');
    }
  }
}
