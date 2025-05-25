import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordSalt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('MySecurePassword', passwordSalt);

  await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin@example.com',
      meta: {
        create: {
          passwordSalt,
          passwordHash,
        },
      },
    },
  });

  console.log('✅ Admin user seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
