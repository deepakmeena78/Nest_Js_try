import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async create(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return this.userService.createUser(data);
  }

  @Get('/get')
  async getAll() {
    return this.userService.getusers();
  }

  @Post('/update')
  async update(
    @Body() data: { id: number; name: string; email: string; password: string },
  ) {
    return this.userService.updateUser(data);
  }

  @Post('delete/:id')
  async deleteUser(@Param('id') id: number) {
    return this.userService.deleteTask(Number(id));
  }
}
