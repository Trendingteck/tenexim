import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '@tenexim/auth/src/crypto';
import { seedShipments } from './seed-shipments';

const prisma = new PrismaClient();

async function seedUsers(prisma: PrismaClient) {
  console.log('👥 Seeding Users & Admins...');

  const passwordHash = hashPassword('password123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tenexim.com' },
    update: {
      passwordHash,
      emailVerified: new Date()
    },
    create: {
      email: 'admin@tenexim.com',
      name: 'Super Admin',
      passwordHash,
      role: Role.ADMIN,
      avatar: 'https://github.com/shadcn.png',
      emailVerified: new Date()
    },
  });

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@client.com' },
    update: {
      passwordHash,
      emailVerified: new Date()
    },
    create: {
      email: 'demo@client.com',
      name: 'Demo Client',
      passwordHash,
      role: Role.USER,
      emailVerified: new Date()
    },
  });

  console.log(`   ✅ Admin account resolved: ${admin.email}`);
  console.log(`   ✅ User account resolved:  ${demoUser.email}`);
}

async function main() {
  const startTime = performance.now();
  console.log("\n🚀 Starting Database Seed Engine...\n");

  try {
    await seedUsers(prisma);
    await seedShipments(prisma);
  } catch (e) {
    console.error("❌ Seeding transaction failed:", e);
    process.exit(1);
  }

  const endTime = performance.now();
  console.log(`\n✨ Seeding completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
  console.log("\n=======================================================");
  console.log("🔑 PLATFORM DEVELOPMENT LOGIN CREDENTIALS");
  console.log("=======================================================");
  console.log("  Role       : ADMIN");
  console.log("  Email      : admin@tenexim.com");
  console.log("  Password   : password123");
  console.log("-------------------------------------------------------");
  console.log("  Role       : USER");
  console.log("  Email      : demo@client.com");
  console.log("  Password   : password123");
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });