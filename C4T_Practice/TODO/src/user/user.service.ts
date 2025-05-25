import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  // Sign Up User
  async signUP(
    @Body()
    data: {
      name: string;
      email: string;
      password: string;
      role: string;
    },
  ) {
    const check = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (check) {
      throw new BadRequestException('Email Already in Use');
    }
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const newUser = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    };
    const createdUser = await this.prisma.user.create({
      data: newUser,
    });
    const token = this.authService.generateToken({ role: createdUser.role });
    return token;
  }

  // Sign IN User
  async signIn(data: { email: string; password: string }) {
    try {
      const result = await this.prisma.user.findFirst({
        where: { email: data.email },
      });
      if (!result) {
        throw new NotFoundException('Invalid Email');
      }
      const validPassword = await bcrypt.compare(
        data.password,
        result.password,
      );
      if (!validPassword) {
        throw new UnauthorizedException('Invalid Password');
      }
      const token = this.authService.generateToken({ role: result.role });
      return token;
    } catch (error) {
      console.log('Error in SignIn Route:', error);
      throw error;
    }
  }

  // Get Profile
  async getprofile() {
    const query = await this.prisma.$queryRaw`select * from "User"`;
    return query;
  }

  // Update User Profile
  async updateUser(
    id: number,
    data: { name: string; email: string; password: string; city: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const hashpassword = bcrypt.hashSync(data.password, 10);
    await this.prisma.user.update({
      where: { id },
      data: { ...data, password: hashpassword },
    });
    const token = this.authService.generateToken({ role: user.role });
    return token;
  }

  async deleteuser(id: number) {
    const result = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException('Wrong User Id User Not Found');
    }
    await this.prisma.user.delete({ where: { id } });
    return { message: `Delete SuccessFully :` };
  }
}
