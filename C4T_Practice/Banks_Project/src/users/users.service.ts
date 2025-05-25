import { join } from 'path';
import { Cache } from 'cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  OtpTransport,
  Prisma,
  User,
  UserMeta,
  UserStatus,
} from '@prisma/client';
import {
  StorageService,
  UserType,
  UtilsService,
  ValidatedUser,
  getAccessGuardCacheKey,
} from '@Common';
import { userConfigFactory } from '@Config';
import { PrismaService } from '../prisma';
import {
  OtpContext,
  OtpService,
  SendCodeResponse,
  VerifyCodeResponse,
} from '../otp';
import { MailService, SendMessagePayload } from 'src/mail';

@Injectable()
export class UsersService {
  constructor(
    @Inject(userConfigFactory.KEY)
    private readonly config: ConfigType<typeof userConfigFactory>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
    private readonly storageService: StorageService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  private getProfileImageUrl(profileImage: string): string {
    return this.storageService.getFileUrl(
      profileImage,
      this.config.profileImagePath,
    );
  }

  private hashPassword(password: string): { salt: string; hash: string } {
    const salt = this.utilsService.generateSalt(this.config.passwordSaltLength);
    const hash = this.utilsService.hashPassword(
      password,
      salt,
      this.config.passwordHashLength,
    );
    return { salt, hash };
  }

  private isValidUsername(username: string): boolean {
    return /^[a-z][a-z0-9_]{3,20}$/.test(username);
  }

  async isEmailExist(email: string, excludeUserId?: number): Promise<boolean> {
    return (
      (await this.prisma.user.count({
        where: {
          email: email.toLowerCase(),
          NOT: {
            id: excludeUserId,
          },
        },
      })) !== 0
    );
  }

  async isUsernameExist(
    username: string,
    excludeUserId?: number,
  ): Promise<boolean> {
    return (
      (await this.prisma.user.count({
        where: {
          username,
          NOT: {
            id: excludeUserId,
          },
        },
      })) !== 0
    );
  }

  async isMobileExist(
    mobile: string,
    excludeUserId?: number,
  ): Promise<boolean> {
    return (
      (await this.prisma.user.count({
        where: {
          mobile,
          NOT: {
            id: excludeUserId,
          },
        },
      })) !== 0
    );
  }

  async getById(userId: number): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async getByMobile(mobile: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        mobile,
      },
    });
  }

  async getMetaById(userId: number): Promise<UserMeta> {
    return await this.prisma.userMeta.findUniqueOrThrow({
      where: {
        userId,
      },
    });
  }

  async getMetaByEmail(email: string): Promise<UserMeta> {
    return await this.prisma.userMeta.findFirstOrThrow({
      where: {
        user: {
          email: email.toLowerCase(),
        },
      },
    });
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<ValidatedUser | false | null> {
    const user = await this.getByEmail(email);
    if (!user) return null;

    const userMeta = await this.getMetaById(user.id);
    const passwordHash = this.utilsService.hashPassword(
      password,
      userMeta.passwordSalt || '',
      userMeta.passwordHash
        ? userMeta.passwordHash.length / 2
        : this.config.passwordHashLength,
    );

    // Check if the user is blocked
    if (UserStatus.Blocked === user.status) {
      throw new Error(
        'Your account is temporarily blocked by admin, Please contact support',
      );
    }

    if (userMeta.passwordHash === passwordHash) {
      return {
        id: user.id,
        type: UserType.User,
      };
    }

    return false;
  }

  async create(data: {
    firstname?: string;
    lastname?: string;
    email?: string;
    username?: string;
    password?: string;
    roleName?: string;
    parentId?: number;
    dialCode?: string;
    mobile?: string;
    country?: string;
    googleId?: string;
    profileImage?: string;
  }): Promise<User> {
    if (data.email && (await this.isEmailExist(data.email))) {
      throw new Error('Email already exist');
    }
    if (data.mobile && (await this.isMobileExist(data.mobile))) {
      throw new Error('Mobile already exist');
    }

    if (data.username && (await this.isUsernameExist(data.username))) {
      throw new Error('Username already exist');
    }

    let passwordSalt = null;
    let passwordHash = null;
    if (data.password) {
      const { salt, hash } = this.hashPassword(data.password);
      passwordSalt = salt;
      passwordHash = hash;
    }
    
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          username: data.username,
          email: data.email?.toLowerCase(),
          mobile: data.mobile,
          roleType: data.roleName,
          country: data.country,
          meta: {
            create: {
              passwordHash,
              passwordSalt,
              googleId: data.googleId,
            },
          },
        },
      });

      if (!user || !user.id) {
        throw new HttpException(
          'User creation failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return user;
    });
  }

  async getOrCreateByGoogle(data: {
    googleId: string;
    email: string;
    firstname?: string;
    lastname?: string;
    profileImage?: string;
  }): Promise<ValidatedUser> {
    let user = await this.prisma.user.findFirst({
      where: {
        meta: {
          googleId: data.googleId,
        },
      },
    });
    if (!user) {
      const isEmailExist = await this.isEmailExist(data.email);
      if (isEmailExist) {
        user = await this.prisma.user.update({
          data: {
            meta: {
              update: {
                googleId: data.googleId,
              },
            },
          },
          where: { email: data.email.toLowerCase() },
        });
      } else {
        user = await this.create({
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          email: data.email,
          profileImage: data.profileImage,
          googleId: data.googleId,
        });
      }
    }

    return {
      id: user.id,
      type: UserType.User,
    };
  }

  async getProfile(userId: number): Promise<User> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async updateProfileDetails(
    data: {
      userId: number;
      username?: string;
      firstname?: string;
      lastname?: string;
      email?: string;
      mobile?: string;
      country?: string;
    },
    options?: { tx?: Prisma.TransactionClient },
  ): Promise<User> {
    const prismaClient = options?.tx ? options.tx : this.prisma;

    if (data.email && (await this.isEmailExist(data.email, data.userId))) {
      throw new Error('Email already exist');
    }
    if (data.username && !this.isValidUsername(data.username)) {
      throw new Error('Invalid username');
    }
    if (
      data.username &&
      (await this.isUsernameExist(data.username, data.userId))
    ) {
      throw new Error('Username already exist');
    }
    if (data.mobile && (await this.isMobileExist(data.mobile, data.userId))) {
      throw new Error('Mobile already exist');
    }

    return await prismaClient.user.update({
      data: {
        username: data.username && data.username.toLowerCase(),
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email && data.email.toLowerCase(),
        mobile: data.mobile,
        country: data.country,
      },
      where: {
        id: data.userId,
      },
    });
  }

  async updateProfileDetailsByAdministrator(data: {
    userId: number;
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    dialCode?: string;
    mobile?: string;
    country?: string;
    password?: string;
  }) {
    await this.prisma.$transaction(async (tx) => {
      const user = await this.updateProfileDetails(
        {
          userId: data.userId,
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          mobile: data.mobile,
          country: data.country,
        },
        { tx },
      );

      if (data.password) {
        const { salt, hash } = this.hashPassword(data.password);
        const passwordSalt = salt;
        const passwordHash = hash;

        await tx.userMeta.update({
          data: {
            passwordHash,
            passwordSalt,
          },
          where: {
            userId: data.userId,
          },
        });
      }

      return user;
    });
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.getById(userId);
    const userMeta = await this.getMetaById(user.id);

    const hashedPassword = this.utilsService.hashPassword(
      oldPassword,
      userMeta.passwordSalt || '',
      userMeta.passwordHash
        ? userMeta.passwordHash.length / 2
        : this.config.passwordHashLength,
    );

    if (hashedPassword !== userMeta.passwordHash)
      throw new Error('Password does not match');

    const { salt, hash } = this.hashPassword(newPassword);
    const passwordSalt = salt;
    const passwordHash = hash;

    await this.prisma.userMeta.update({
      data: {
        passwordHash,
        passwordSalt,
      },
      where: {
        userId,
      },
    });
    return user;
  }

  async sendResetPasswordVerificationCode(email?: string, mobile?: string) {
    let user: User | null | undefined;

    if (email) user = await this.getByEmail(email);
    if (!user && mobile) user = await this.getByMobile(mobile);
    if (!user) throw new Error('User does not exist');

    const response: { email?: SendCodeResponse; mobile?: SendCodeResponse } =
      {};

    if (mobile) {
      response.mobile = await this.otpService.send({
        context: OtpContext.ResetPassword,
        target: mobile,
        transport: OtpTransport.Mobile,
      });
    }
    if (email) {
      response.email = await this.otpService.send({
        context: OtpContext.ResetPassword,
        target: email,
        transport: OtpTransport.Email,
        transportParams: {
          username: user.firstname.concat(' ', user.lastname),
        },
      });
    }

    return response;
  }

  async resetPassword(
    code: string,
    newPassword: string,
    mobile?: string,
    email?: string,
  ): Promise<User> {
    // Get user
    let user: User | null | undefined;
    if (email) {
      user = await this.getByEmail(email);
    }
    if (!user && mobile) {
      user = await this.getByMobile(mobile);
    }
    if (!user) throw new Error('User not found');

    // Validate code
    let response: VerifyCodeResponse | null | undefined;

    if (mobile)
      response = await this.otpService.verify(
        code,
        mobile,
        OtpTransport.Mobile,
      );
    if (email)
      response = await this.otpService.verify(code, email, OtpTransport.Email);
    if (!response) throw new Error('Invalid email or mobile');
    if (response.status === false)
      throw new Error('Incorrect verification code');

    // Reset password
    const { salt: passwordSalt, hash: passwordHash } =
      this.hashPassword(newPassword);

    await this.prisma.userMeta.update({
      data: {
        passwordSalt,
        passwordHash,
      },
      where: { userId: user.id },
    });
    return user;
  }

  async setStatus(userId: number, status: UserStatus): Promise<User> {
    await this.cacheManager.del(
      getAccessGuardCacheKey({ id: userId, type: UserType.User }),
    );
    return await this.prisma.user.update({
      data: { status },
      where: {
        id: userId,
      },
    });
  }
}
