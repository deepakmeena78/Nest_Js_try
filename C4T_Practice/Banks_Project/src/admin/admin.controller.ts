import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AccessGuard,
  AuthenticatedRequest,
  BaseController,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserType,
} from '@Common';
import { AdminService } from './admin.service';
import {
  AuthenticateRequestDto,
  ChangePasswordRequestDto,
  ChangeUserPasswordRequestDto,
  UpdateProfileDetailsRequestDto,
  UpdateProfileImageRequestDto,
  CreateSubUserRequestDto,
  UpdateUserRequestDto,
} from './dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UsersService } from 'src/users';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserType.Admin)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('admin')
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    return await this.adminService.getProfile(ctx.user.id);
  }

  @Patch()
  async updateProfileDetails(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProfileDetailsRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.updateProfileDetails(ctx.user.id, {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
    });
    return { status: 'success' };
  }

  @Post('profile-image')
  updateProfileImage(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProfileImageRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.adminService.updateProfileImage(ctx.user.id, data.profileImage);
  }

  @Post('change-password')
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() data: ChangePasswordRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.changePassword(
      ctx.user.id,
      data.oldPassword,
      data.newPassword,
    );
    return { status: 'success' };
  }

  @Patch('change-user-password')
  async changeUserPassword(
    @Req() req: AuthenticatedRequest,
    @Body() data: ChangeUserPasswordRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.changeUserPassword(
      ctx.user.id,
      data.userId,
      data.newPassword,
      data.newConfirmPassword,
    );
    return { status: 'success' };
  }

  @Patch('update-user-status')
  async updateUserStatus(
    @Req() req: AuthenticatedRequest,
    @Query() query: UpdateUserStatusDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.updateUserStatus(query.userId, query.status);
    return { status: 'success' };
  }

  @Post('authenticate')
  async authenticate(
    @Req() req: AuthenticatedRequest,
    @Body() data: AuthenticateRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.authenticate(ctx.user.id, data.password);
    return { status: 'success' };
  }

  @Post('create-user')
  async createSubUser(@Body() data: CreateSubUserRequestDto) {
    await this.adminService.createUser({
      firstName: data.firstname,
      lastName: data.lastname,
      userName: data.userName,
      email: data.email,
      password: data.password,
      country: data.country,
    });

    return { status: 'success' };
  }

  @Patch('update-user-by-admin/:userId')
  async updateUserByAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: UpdateUserRequestDto,
  ) {
    console.log('userId', userId);
    await this.adminService.updateUserByAdmin({
      userId,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      dialCode: data.dialCode,
      mobile: data.mobile,
    });

    return { status: 'success' };
  }
}
