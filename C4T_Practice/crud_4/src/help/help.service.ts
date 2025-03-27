import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  // Create a new student
  async createStudent(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  // Get all students
  async getStudents() {
    return this.prisma.user.findMany();
  }
}
