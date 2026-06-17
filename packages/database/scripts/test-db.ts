import { PrismaClient } from '@prisma/client';
import { isClickHouseConnected } from '../src/clickhouse';

const prisma = new PrismaClient();

async function main() {
    console.log('\n🔄 Initiating Database Diagnostic Handshake...\n');
    
    // 1. Test Supabase Postgres Connection via Prisma
    try {
        console.log('📡 Pinging Supabase PostgreSQL...');
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Supabase PostgreSQL is ONLINE and accepting queries!');
        
        const userCount = await prisma.user.count();
        console.log(`📊 Database Stats: Found ${userCount} registered user node(s).`);
        
        if (userCount === 0) {
            console.log('⚠️ Warning: No users found. Run "pnpm db:seed" to initialize credentials.');
        } else {
            const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
            if (admin) {
                console.log(`👑 Development Admin Account verified: ${admin.email}`);
            } else {
                console.log('⚠️ Warning: No ADMIN role found in users table.');
            }
        }
    } catch (error: any) {
        console.error('❌ Supabase PostgreSQL connection FAILED.');
        console.error('📋 Connection Error Trace:', error.message);
        console.log('\n💡 Troubleshooting Steps:');
        console.log('  1. Check if DATABASE_URL in packages/database/.env (or root .env) is populated correctly.');
        console.log('  2. Confirm your machine\'s IP address is allowed in the Supabase Network / IP Whitelisting console.');
        console.log('  3. Ensure your DB password matches your actual Supabase database settings password.');
    }

    // 2. Test ClickHouse Connection
    try {
        console.log('\n📡 Pinging ClickHouse Analytical Engine...');
        const chActive = await isClickHouseConnected();
        if (chActive) {
            console.log('✅ ClickHouse Analytical Cluster is ONLINE!');
        } else {
            console.log('⚠️ ClickHouse Engine is offline/unreachable. Hybrid search queries will automatically fall back to Postgres.');
        }
    } catch (error) {
        console.log('⚠️ ClickHouse handshake failed. Falling back completely to PostgreSQL.');
    }

    console.log('\n✨ Handshake evaluation complete.\n');
    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error('❌ Global diagnostic failure:', e);
    await prisma.$disconnect();
    process.exit(1);
});