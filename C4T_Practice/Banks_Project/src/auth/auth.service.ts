import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { OtpTransport, User, UserStatus } from '@prisma/client';
import { JwtPayload, UserType } from '@Common';
import { UsersService } from '../users';
import {
  OtpContext,
  OtpService,
  SendCodeResponse,
  VerifyCodeResponse,
} from '../otp';
import { use } from 'passport';
import { SendCodeRequestType } from './dto';

export type ValidAuthResponse = {
  accessToken: string;
  type: UserType;
};

export type InvalidVerifyCodeResponse = {
  email?: VerifyCodeResponse;
  mobile?: VerifyCodeResponse;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
  ) {}

  private generateJwt(payload: JwtPayload, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  async sendCode(
    target: string,
    transport: OtpTransport,
    type: SendCodeRequestType,
  ): Promise<SendCodeResponse> {
    const dltTeIdMapping: { [key: string]: string | undefined } = {
      register: OtpContext.Register,
      reset_password: OtpContext.ResetPassword,
      forgot_password: OtpContext.ForgotPassword,
    };

    const contextType = dltTeIdMapping[type];

    if (type === SendCodeRequestType.Register) {
      if (
        transport === OtpTransport.Email &&
        (await this.usersService.isEmailExist(target))
      ) {
        throw new Error('Email already in use');
      }
      if (
        transport === OtpTransport.Mobile &&
        (await this.usersService.isMobileExist(target))
      ) {
        throw new Error('Mobile already in use');
      }
    }

    return await this.otpService.send({
      context: contextType as unknown as OtpContext,
      target,
      ...(transport === OtpTransport.Email
        ? {
            transport,
            transportParams: {
              username: 'User',
            },
          }
        : { transport }),
    });

    // throw new Error('Unknown send code request type found');
  }

  async login(userId: number, type: UserType): Promise<ValidAuthResponse> {
    if (type == UserType.User) {
      const user = await this.usersService.getById(userId);

      if (user.status === UserStatus.Blocked) {
        throw new Error('User account is blocked , please contact admin');
      }
    }

    return {
      accessToken: this.generateJwt({
        sub: userId,
        type,
      }),
      type,
    };
  }

  async registerUser(data: {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    dialCode?: string;
    roleName?: string;
    parentId?: number;
    mobile?: string;
    country: string;
    emailVerificationCode: string;
    mobileVerificationCode?: string;
    addedBy?: string;
  }): Promise<InvalidVerifyCodeResponse | ValidAuthResponse> {
    if (!data.parentId && !data.roleName) {
      const [verifyEmailOtpResponse] = await Promise.all([
        this.otpService.verify(
          data.emailVerificationCode,
          data.email,
          OtpTransport.Email,
        ),
      ]);
      if (!verifyEmailOtpResponse.status) {
        return {
          email: verifyEmailOtpResponse,
        };
      }
    }
    const user = await this.usersService.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      username: data.username,
      password: data.password,
      roleName: data.roleName,
      parentId: data.parentId,
      dialCode: data.dialCode,
      mobile: data.mobile,
      country: data.country,
    });

    return {
      accessToken: this.generateJwt({
        sub: user.id,
        type: UserType.User,
      }),
      type: UserType.User,
    };
  }

  async authenticate(data: {
    dialCode: string;
    mobile: string;
    country: string;
    mobileVerificationCode: string;
  }): Promise<InvalidVerifyCodeResponse | ValidAuthResponse> {
    const verifyMobileOtpResponse = await this.otpService.verify(
      data.mobileVerificationCode,
      data.mobile,
      OtpTransport.Mobile,
    );
    if (!verifyMobileOtpResponse.status) {
      return { mobile: verifyMobileOtpResponse };
    }

    let user = await this.usersService.getByMobile(data.mobile);
    if (!user) {
      user = await this.usersService.create({
        dialCode: data.dialCode,
        mobile: data.mobile,
        country: data.country,
      });
    }

    return {
      accessToken: this.generateJwt({
        sub: user.id,
        type: UserType.User,
        mobile: user.mobile,
      }),
      type: UserType.User,
    };
  }

  async forgotPassword(
    email?: string,
    mobile?: string,
  ): Promise<{ email?: SendCodeResponse; mobile?: SendCodeResponse }> {
    return await this.usersService.sendResetPasswordVerificationCode(
      email,
      mobile,
    );
  }

  async resetPassword(
    code: string,
    newPassword: string,
    mobile?: string,
    email?: string,
  ): Promise<User> {
    return await this.usersService.resetPassword(
      code,
      newPassword,
      mobile,
      email,
    );
  }
}
