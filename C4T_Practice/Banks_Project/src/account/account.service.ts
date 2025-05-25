import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateBankAccountDto } from './dto/create.account';
import { BankName } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async createaccount(userId: number, data: CreateBankAccountDto) {
    if (!userId) {
      throw new BadRequestException('User Id Not Found');
    }
    const bankData = await this.findBank(data.bank);
    if (bankData?.status == 'Pending') {
      throw new BadRequestException('Bank is Not Approved');
    }
    return this.prisma.bankAccount.create({
      data: {
        userId: data.userId,
        bankId: data.bankId,
        aadhar: data.aadhar,
        panCard: data.panCard,
        balance: 0,
        Acfreeze: false,
      },
    });
  }

  async findBank(bankName: BankName) {
    return this.prisma.bank.findFirst({
      where: { bank_name: bankName },
    });
  }
}
