import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Create User
  async createUser(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return this.prisma.user.create({ data });
  }

  //  Get Users
  async getUser() {
    return this.prisma.user.findMany();
  }

  //Login User
  async loginUser(@Body() data: { email: string; password: string }) {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalide Email...........');
    }

    const validePassword = bcrypt.compareSync(data.password, user.password);

    if (!validePassword) {
      throw new UnauthorizedException('Invalide Password...........');
    }
    return { message: 'Login Successfully ', user };
  }

  // Update User
  async updateUser(
    @Body() data: { id: number; name: string; email: string; password: string },
  ) {
    return this.prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  // Delete User
  async deleteUser(@Body() id: number) {
    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}
