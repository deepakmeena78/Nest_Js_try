import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './Schema/user.schema';

@Controller('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/sign-up')
  async signUp(@Body() userData: Partial<User>) {
    try {
      const data = await this.usersService.signupUser(userData);
      return {
        status: 'Successfully',
        data: data,
      };
    } catch (error) {
      return {
        status: 'Server Error',
        error: error.message,
      };
    }
  }

  @Get('/get-user')
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('/update')
  async UpdateUser(@Body() userData: Partial<User>) {
    try {
      const data = await this.usersService.updateUser(userData);
      return {
        status: 'Successfully Update',
        data: data,
      };
    } catch (error) {
      return {
        status: 'Server Error',
        error: error.message,
      };
    }
  }

  @Post('/delete')
  async deleteUser(@Body() userData: { id: number }) {
    if (!userData.id) {
      throw new Error('User ID is required');
    }
    return this.usersService.deleteUser({ id: Number(userData.id) });
  }
}
