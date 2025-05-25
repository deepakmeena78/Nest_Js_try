import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest, JwtAuthGuard, Roles, RolesGuard, UserType } from '@Common';
import { CreateBankAccountDto } from './dto/create.account';

@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Roles(UserType.Admin, UserType.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/create')
  async createAccount(@Body() data:CreateBankAccountDto,@Req() req: AuthenticatedRequest) {
    return this.accountService.createaccount(req.user.id,data);
  }
}
