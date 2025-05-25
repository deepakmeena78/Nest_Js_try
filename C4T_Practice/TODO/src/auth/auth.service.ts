import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(payload: { [key: string]: any }) {
    try {
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'meenaji',
        expiresIn: '1h',
      });
      return token;
    } catch (error) {
      throw new Error('Error generating token: ' + error.message);
    }
  }
}
