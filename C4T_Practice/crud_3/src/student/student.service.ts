import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  // Create a new student
  async createStudent(data: { name: string; email: string; password: string }) {
    const hashpasword = bcrypt.hashSync(data.password, 10);
    const userexist = await this.prisma.student.findUnique({
      where: { email: data.email },
    });
    if (userexist) {
      throw new BadRequestException('Email Already Exist');
    }
    return this.prisma.student.create({
      data: { ...data, password: hashpasword },
    });
  }

  // Get all students
  async getStudents() {
    return this.prisma.student.findMany();
  }

  async updateStudent(
    id: number,
    data: {
      name: string;
      email: string;
      password: string;
    },
  ) {
    const exituser = await this.prisma.student.findUnique({ where: { id } });
    if (!exituser) {
      throw new BadRequestException('User ID Dort Not Match In The Database');
    }
    return this.prisma.student.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  async deleteStudent(id: number) {
    try {
      const existuser = await this.prisma.student.findUnique({ where: { id } });
      if (!existuser) {
        throw new BadRequestException('User ID Dort Not Match In The Database');
      }
      return await this.prisma.student.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
