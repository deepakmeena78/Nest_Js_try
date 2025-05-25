import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { SignUpUser } from './dto/signup.dto';
import { SignInUser } from './dto/signIn.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign-up')
  async signUpUser(@Body() data: SignUpUser, @Res() res: Response) {
    try {
      const token = await this.userService.signUP(data);
      res.cookie('token', token, {
        maxAge: 60 * 60 * 1000,
      });
      return res.status(201).json({ message: 'Successfully Signed Up', token });
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'Error signing up', error: error.message });
    }
  }

  @Post('/sign-in')
  async signInUser(@Body() data: SignInUser, @Res() res: Response) {
    try {
      const token = await this.userService.signIn(data);
      res.cookie('token', token, {
        maxAge: 60 * 60 * 1000,
      });
      return res.status(201).json({ message: 'Successfully Signed in', token });
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'Error signing in', error: error.message });
    }
  }

  @Get('/get-profile')
  async getProfile() {
    return this.userService.getprofile();
  }

  @Post('/update-user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    data: { name: string; email: string; password: string; city: string },
    @Res() res: Response,
  ) {
    try {
      const token = await this.userService.updateUser(parseInt(id, 10), data);
      res.cookie('token', token, {
        maxAge: 60 * 60 * 1000,
      });
      return res
        .status(201)
        .json({ message: 'Successfully Update Profile', token });
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'Error signing in', error: error.message });
    }
  }

  @Delete('/user-delete/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.deleteuser(parseInt(id));
      res.clearCookie('token', { path: '/' });
      return res.status(200).json({
        message: 'User deleted successfully and token removed from cookies',
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting user', error });
    }
  }
}
