import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { UserType, ValidatedUser } from '@Common';
import { LOCAL_AUTH } from '../auth.constants';
import { UsersService } from '../../users';
import { AdminService } from '../../admin';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_AUTH) {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
  ) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    email: string,
    password: string,
  ): Promise<ValidatedUser> {
    const { userType } = req.body;
    if (!userType) {
      throw new UnauthorizedException('User type is required');
    }

    let user: ValidatedUser | null | false = null;

    if (userType === UserType.User) {
      user = await this.usersService.validateCredentials(email, password);
    } else if (userType === UserType.Admin) {
      user = await this.adminService.validateCredentials(email, password);
    } else {
      throw new UnauthorizedException('Invalid user type');
    }

    if (user === false) {
      throw new UnauthorizedException('Incorrect password');
    }

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
