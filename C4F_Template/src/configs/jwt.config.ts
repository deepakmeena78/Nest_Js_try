import * as jwt from 'jsonwebtoken';
import { registerAs } from '@nestjs/config';

export const jwtConfigFactory = registerAs('jwt', () => ({
  privateKey: process.env.JWT_PRIVATE_KEY,
  publicKey: process.env.JWT_PUBLIC_KEY,
  signOptions: { expiresIn: '24h', algorithm: 'RS256' } as jwt.SignOptions,
}));
