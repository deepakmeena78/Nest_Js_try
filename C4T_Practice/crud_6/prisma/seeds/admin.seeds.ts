import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const saltRounds = 10;
const passwordSalt = bcrypt.genSaltSync(saltRounds);
const passwordHash = bcrypt.hashSync('MySecurePassword', passwordSalt);

export const admin: Prisma.AdminCreateInput = {
  firstname: 'Admin',
  lastname: 'User',
  email: process.env.ADMIN_EMAIL || 'deepakmeenaa78@example.com',
  meta: {
    create: {
      passwordSalt: passwordSalt,
      passwordHash: passwordHash,
    },
  },
};
