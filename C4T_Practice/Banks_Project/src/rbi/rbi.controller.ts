import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { RbiService } from './rbi.service';
import { JwtAuthGuard, Roles, RolesGuard, UserType } from '@Common';
import { ApproveRequestDto } from './dto/Approve.status';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('RBI')
@ApiBearerAuth()
@Controller('rbi')
export class RbiController {
  constructor(private rbiServise: RbiService) {}

  @Roles(UserType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/get-all-request')
  async getApproveRequest() {
    return this.rbiServise.getallRequest();
  }

  @Roles(UserType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/get-by-id/:id')
  async getByIdApproveRequest(@Param('id') id: string) {
    return this.rbiServise.RequestGetByaId(+id);
  }  

  @Roles(UserType.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/change-status')
  async ApproveRequestById(@Query() data: ApproveRequestDto) {
    return this.rbiServise.ApproveRequest(data);
  }
}
