import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  async create(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return this.userService.CreateUser(data);
  }

  @Get("/get")
  async Getdata(){
    return this.userService.getuser();
  }
}
