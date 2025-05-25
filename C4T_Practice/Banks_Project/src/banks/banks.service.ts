// src/bank/bank.service.ts
import { Injectable } from '@nestjs/common';
import { Bank, BankStatus, Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import { CreateBankDto } from './dto/bank.create';

@Injectable()
export class BankService {
  constructor(private prisma: PrismaService) {}

  // Create Bank
  async createBank(data: CreateBankDto) {
    const existUser = await this.prisma.bank.findFirst({
      where: {
        ownerId: data.ownerId,
        bank_name: data.bank_name,
      },
    });
    if (existUser) {
      throw new Error('Bank already exists for this user');
    }
    return this.prisma.bank.create({ data });
  }

  //   Get all banks
  async getBankProfile(): Promise<Bank[]> {
    return this.prisma.bank.findMany();
  }

  //   Get a single bank by ID clokyfy
  async getmyaccount(id: number): Promise<Bank | null> {
    return this.prisma.bank.findUnique({
      where: { id },
    });
  }

  //   // Update bank status
  //   async updateBankStatus(
  //     id: number,
  //     status: BankStatus,
  //     reason?: string,
  //   ): Promise<Bank> {
  //     return this.prisma.bank.update({
  //       where: { id },
  //       data: {
  //         status,
  //         reason,
  //       },
  //     });
  //   }

  //   // Create a transaction between two accounts
  //   async createTransaction(
  //     fromAccountId: number,
  //     toAccountId: number,
  //     amount: number,
  //     userId: number,
  //   ): Promise<Transaction> {
  //     return this.prisma.transaction.create({
  //       data: {
  //         amount,
  //         fromAccount: { connect: { id: fromAccountId } },
  //         toAccount: { connect: { id: toAccountId } },
  //         user: { connect: { id: userId } },
  //       },
  //     });
  //   }

  //   // Freeze/unfreeze an account
  //   async updateAccountFreezeStatus(
  //     accountId: number,
  //     isFrozen: boolean,
  //   ): Promise<void> {
  //     await this.prisma.bankAccount.update({
  //       where: { id: accountId },
  //       data: { isFrozen },
  //     });
  //   }
}
