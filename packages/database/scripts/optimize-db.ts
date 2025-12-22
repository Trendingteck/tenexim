import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Optimizing Database with Trigram Indexes...');

    try {
        // 1. Enable pg_trgm extension
        await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
        console.log('✅ pg_trgm extension enabled.');

        // 2. Create GIN indexes for fuzzy search on main columns
        // We use the @map names from schema.prisma
        const indexes = [
            { name: 'idx_shipment_product_trgm', table: 'Shipment', column: 'item_description' },
            { name: 'idx_shipment_supplier_trgm', table: 'Shipment', column: 'supplier' },
            { name: 'idx_shipment_importer_trgm', table: 'Shipment', column: 'importer' },
            { name: 'idx_shipment_hscode_trgm', table: 'Shipment', column: 'ritc_8' }
        ];

        for (const idx of indexes) {
            console.log(`⏳ Creating index ${idx.name} on ${idx.table}(${idx.column})...`);
            await prisma.$executeRawUnsafe(`
        CREATE INDEX IF NOT EXISTS "${idx.name}" 
        ON "${idx.table}" 
        USING gin ("${idx.column}" gin_trgm_ops);
      `);
            console.log(`✅ Index ${idx.name} created.`);
        }

        console.log('✨ All optimizations applied successfully!');
    } catch (error) {
        console.error('❌ Optimization failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
