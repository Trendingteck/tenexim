import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedUsers(prisma: PrismaClient) {
  console.log(' Seeding Users & Admins...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tenexim.com' },
    update: {},
    create: {
      email: 'admin@tenexim.com',
      name: 'Super Admin',
      passwordHash,
      role: Role.ADMIN,
      avatar: 'https://github.com/shadcn.png'
    },
  });

  // 2. Create Demo Client
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@client.com' },
    update: {},
    create: {
      email: 'demo@client.com',
      name: 'Demo Client',
      passwordHash,
      role: Role.USER,
    },
  });

  console.log(`    Created Admin: ${admin.email}`);
  console.log(`    Created User: ${demoUser.email}`);
}
