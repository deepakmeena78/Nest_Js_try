import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BankService } from './banks.service';
import {
  AuthenticatedRequest,
  BaseController,
  JwtAuthGuard,
  Roles,
  UserType,
} from '@Common';
import { CreateBankDto } from './dto/bank.create';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Bank')
@ApiBearerAuth()
@Controller('banks')
export class BanksController extends BaseController {
  constructor(private bankService: BankService) {
    super();
  }
  
  @Roles(UserType.User, UserType.Admin)
  @UseGuards(JwtAuthGuard)
  @Post('/create-bank')
  async CreateBank(@Body() data: CreateBankDto) {
    return this.bankService.createBank(data);
  }

  @Roles(UserType.Admin)
  @UseGuards(JwtAuthGuard)
  @Get('/get-all-bank')
  async getAllbank() {
    return this.bankService.getBankProfile();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-account')
  async getmyAccount(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    return this.bankService.getmyaccount(ctx.user.id);
  }
}
