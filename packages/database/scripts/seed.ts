import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seed-users';
import { seedShipments } from './seed-shipments';

const prisma = new PrismaClient();

async function main() {
  const startTime = performance.now();
  console.log(" Starting Database Seed Engine...");

  try {
    await seedUsers(prisma);
    await seedShipments(prisma);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }

  const endTime = performance.now();
  console.log(` Seeding completed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
}

main()
  .catch((e) => {
    console.error(" Seeding Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
