import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { CreateStudentDto } from './dto/create.dto';
import { UpdateStudentDto } from './dto/update.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  async CreateUser(@Body() data: CreateStudentDto) {
    const salt = 10;
    const hashpassword = bcrypt.hashSync(data.password, salt);
    return this.userService.createUser({ ...data, password: hashpassword });
  }

  @Get('/get')
  async GetUsers() {
    return this.userService.getUser();
  }

  @Post('/login')
  async Login(@Body() data: { email: string; password: string }) {
    return this.userService.loginUser(data);
  }

  @Post('/update')
  async Update(@Body() data: UpdateStudentDto) {
    const salt = 10;
    const hashpassword = bcrypt.hashSync(data?.password, salt);
    return this.userService.updateUser({ ...data});
  }
  

  @Post('delete/:id') 
  async Delete(@Param('id') id: number) {
    return this.userService.deleteUser(Number(id));
  }
}
