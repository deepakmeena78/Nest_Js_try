import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      console.log('Not Defind Roles -=-=-=-=-=---=-=-=-');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token =
      request.cookies?.token || request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'meenaji',
      });
      console.log('Decoded Token:', decoded);

      const userRole = decoded.role;
      if (!roles.includes(userRole)) {
        throw new UnauthorizedException(
          'Access Denied: You do not have the right role',
        );
      }

      return true;
    } catch (error) {
      console.error('Token Verification Error:', error);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
