import { Command } from 'commander';
import { PermissionAction, PrismaClient } from '@prisma/client';
import { isEmail } from 'class-validator';
import { admin } from './seeds';

const program = new Command();
program.option('--seed-only <name>', 'Specify a seed name').parse(process.argv);
const permissions = [
  {
    feature: 'USER_MANAGEMENT',
    action: PermissionAction.CREATE,
    desc: 'Can create users',
  },
  {
    feature: 'USER_MANAGEMENT',
    action: PermissionAction.UPDATE,
    desc: 'Can update users',
  },
  {
    feature: 'USER_MANAGEMENT',
    action: PermissionAction.DELETE,
    desc: 'Can delete users',
  },
  {
    feature: 'USER_MANAGEMENT',
    action: PermissionAction.READ,
    desc: 'Can view users',
  },
  {
    feature: 'DORE_MANAGEMENT',
    action: PermissionAction.CREATE,
    desc: 'Can create dore bar',
  },
  {
    feature: 'DORE_MANAGEMENT',
    action: PermissionAction.UPDATE,
    desc: 'Can update dore bar',
  },
  {
    feature: 'DORE_MANAGEMENT',
    action: PermissionAction.DELETE,
    desc: 'Can delete dore bar',
  },
  {
    feature: 'DORE_MANAGEMENT',
    action: PermissionAction.READ,
    desc: 'Can view dore bar',
  },
];

const prisma = new PrismaClient();

async function main() {
  const options = program.opts();

  // Seed admin default credential
  if (!options.seedOnly || options.seedOnly === 'admin') {
    if (await prisma.admin.count()) {
      console.log('⚠ Skipping seed for `admin`, due to non-empty table');
    } else {
      if (
        isEmail(admin.email) &&
        admin.meta?.create?.passwordHash &&
        admin.meta.create.passwordSalt
      ) {
        await prisma.admin.create({
          data: admin,
        });
      } else {
        console.error(new Error('Invalid default admin credentials found'));
      }
    }
  }

  const existingPermissions = await prisma.permission.findMany({
    select: { feature: true, action: true },
  });
  const existingSet = new Set(
    existingPermissions.map((p) => `${p.feature}-${p.action}`),
  );

  const newPermissions = permissions.filter(
    (perm) => !existingSet.has(`${perm.feature}-${perm.action}`),
  );

  // Insert only missing permissions
  if (newPermissions.length > 0) {
    await prisma.permission.createMany({ data: newPermissions });
    console.log('✅ Permissions added successfully.');
  } else {
    console.log('⚠ All permissions already exist.');
  }

  const administratorRole = await prisma.role.upsert({
    where: { name: 'administrator' },
    update: {},
    create: {
      name: 'administrator',
      isActive: true,
    },
  });
  console.log('✅ Administrator role seeded successfully');

  // 3️⃣ Assign all permissions to Administrator role
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.permissionRole.upsert({
      where: {
        roleId_permissionId: {
          roleId: administratorRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: administratorRole.id,
        permissionId: permission.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
