import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { ApproveRequestDto } from './dto/Approve.status';

@Injectable()
export class RbiService {
  constructor(private prisma: PrismaService) {}

  // Get All Request
  async getallRequest() {
    const data = this.prisma.bank.findMany({});
    if (!data) {
      return new NotFoundException(`Not Request`);
    }
    return data;
  }

  // Request Get By Id
  async RequestGetByaId(requestId: number) {
    const requestData = await this.FindRequest(requestId);
    if (!requestData) {
      throw new NotFoundException(`Not Found Request By Id ${requestId}`);
    }
    return requestData;
  }

  // Approve Request
  async ApproveRequest(data: ApproveRequestDto) {
    const requestData = await this.FindRequest(data.requestId);
    if (!requestData) {
      return new NotFoundException(
        `Not Found Request By Id  ${data.requestId}`,
      );
    }
    return await this.prisma.bank.update({
      where: { id: data.requestId },
      data: {
        reason: data.reason || null,
        status: data.bankstatus || 'Pending',
      },
    });
  }

  async FindRequest(RequestId: number) {
    return this.prisma.bank.findUnique({
      where: { id: RequestId },
      include: {
        owner: true,
      },
    });
  }
}
