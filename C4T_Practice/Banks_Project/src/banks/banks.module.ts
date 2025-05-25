import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { BankService } from './banks.service';
import { BanksController } from './banks.controller';

@Module({
  imports: [],
  controllers: [BanksController],
  providers: [BankService, PrismaService],
})
export class BankModule {}
