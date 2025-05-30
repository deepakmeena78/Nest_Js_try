import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [PrismaModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
