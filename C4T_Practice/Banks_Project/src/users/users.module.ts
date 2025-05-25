import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma';
import { OtpModule } from '../otp';
import { MailModule } from 'src/mail';

@Module({
  imports: [PrismaModule, OtpModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
