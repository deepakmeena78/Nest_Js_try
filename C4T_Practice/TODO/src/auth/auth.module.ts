import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'meenaji',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UserService, PrismaService,JwtService],
  exports: [AuthService,JwtService],
})
export class UserModule {}
