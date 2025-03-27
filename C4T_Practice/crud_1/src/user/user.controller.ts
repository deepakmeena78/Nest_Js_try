import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly useService: UserService) {}

  @Get()
  async Tets(@Req() req, @Res() res) {
    try {
      return res.status(201).json({
        status: 'success',
        data: 'i user get method',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'success',
        data: 'server error',
      });
    }
  }

  @Post('/sign-up')
  async sohan(@Req() req, @Res() res) {
    try {
      const data = await this.useService.ankit(req);
      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'success',
        data: 'server error',
      });
    }
  }

  @Get('/sign')
  async mohan(@Req() req, @Res() res) {
    try {
      const data = await this.useService.mohan(req);
      return res.status(201).json({
        status: 'success',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'success',
        data: 'server error',
      });
    }
  }
}
