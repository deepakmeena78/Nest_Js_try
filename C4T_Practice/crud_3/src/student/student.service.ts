import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  // Create a new student
  async createStudent(data: Prisma.StudentCreateInput) {
    return this.prisma.student.create({ data });
  }

  // Get all students
  async getStudents() {
    return this.prisma.student.findMany();
  }

  async updateStudent(data: {
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
      return await this.prisma.student.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error('Student Is Not Deleted ');
    }
  }
}
