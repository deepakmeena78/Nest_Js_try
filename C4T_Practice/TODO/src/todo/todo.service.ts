import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // Create Task
  async createtask(data: {
    title: string;
    description: string;
    status: string;
    priority: string;
    userId: number;
  }) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { id: data.userId },
      });
      if (!existingUser) {
        throw new BadRequestException(
          `User with ID ${data.userId} does not exist`,
        );
      }
      return this.prisma.task.create({ data });
    } catch (error) {
      console.log('Task Create Error : ', error);
      // throw error;
    }
  }
 
  // Get All Task
  async gettask() {
    return this.prisma.task.findMany({
      include: {
        user: true,
      },
    });
  }

  async updatetask(
    id: number,
    data: {
      title: string;
      description: string;
      status: string;
      priority: string;
      userId: number;
    },
  ) {
    const updateTask = await this.prisma.task.update({
      where: { id },
      data,
    });
    console.log('Updated Task : ', updateTask);
    return updateTask;
  }

  // Delete Task
  async deletetask(id: number) {
    const result = this.prisma.task.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException('Wrong User Id User Not Found');
    }
    await this.prisma.task.delete({ where: { id } });
    return { message: `Delete SuccessFully :` };
  }
}
