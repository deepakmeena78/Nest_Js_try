import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { OtpTransport, User } from '@prisma/client';
import { JwtPayload, UserType } from '@Common';
import { UsersService } from '../users';
import {
  OtpContext,
  OtpService,
  SendCodeResponse,
  VerifyCodeResponse,
} from '../otp';

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
  ): Promise<SendCodeResponse> {
    return await this.otpService.send({
      context: OtpContext.Auth,
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
  }

  async login(userId: number, type: UserType): Promise<ValidAuthResponse> {
    return {
      accessToken: this.generateJwt({
        sub: userId,
        type,
      }),
      type,
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
