import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { parse } from 'date-fns';

const parseCustomDate = (dateStr: string) => {
  try {
    if (!dateStr || dateStr === 'N/A') return new Date();
    // Handles format: 01/Jan/25
    return parse(dateStr, 'dd/MMM/yy', new Date());
  } catch (e) {
    return new Date();
  }
};

const cleanFloat = (val: string) => {
  const cleaned = parseFloat(val);
  return isNaN(cleaned) ? 0 : cleaned;
};

export async function seedShipments(prisma: PrismaClient) {
  console.log('🚢 Seeding Shipments...');

  const count = await prisma.shipment.count();
  if (count > 0) {
    console.log(`   ⚠️ Database already has ${count} shipments. Skipping bulk ingestion.`);
    return;
  }

  const csvPath = path.join(__dirname, '../data/shipments_dump.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`   ❌ CSV file not found at: ${csvPath}`);
    console.log('   ℹ️  Please place your CSV file in packages/database/data/shipments_dump.csv');
    return;
  }

  const results: any[] = [];
  let totalProcessed = 0;
  const BATCH_SIZE = 2000;

  const stream = fs.createReadStream(csvPath).pipe(csv());

  for await (const row of stream) {
    const shipment = {
      indianPort: row['INDIAN_PORT'] || 'Unknown',
      beType: row['BE_TYPE'],
      boeNumber: row['BOE_NUMBER'],
      boeDate: parseCustomDate(row['BOE_DATE']),
      ritc2: row['RITC_2'],
      ritc4: row['RITC_4'],
      hsCode: row['RITC_8']?.toString().replace(/\D/g, '') || '000000',
      productDesc: row['ITEM_DESCRIPTION'] || '',
      quantity: cleanFloat(row['QTY']),
      unit: row['UNIT'] || 'PCS',
      unitValueFc: cleanFloat(row['UNIT_VALUE_FC']),
      totalValueFc: cleanFloat(row['TOTAL_VALUE_FC']),
      unitValueUsd: cleanFloat(row['UNIT_VALUE_USD']),
      totalValueUsd: cleanFloat(row['TOTAL_VALUE_USD']),
      unitValueInr: cleanFloat(row['UNIT_VALUE_INR']),
      totalValueInr: cleanFloat(row['TOTAL_VALUE_INR']),
      duty: cleanFloat(row['DUTY']),
      currency: row['INVOICE_CURRENCY'] || 'USD',
      importerName: row['IMPORTER'],
      importerAddress: row['IMPORTER_ADDRESS'],
      importerCityState: row['CITY_STATE'],
      importerPin: row['PIN_CODE'],
      importerPhone: row['IMPORTER_PHONE'],
      importerEmail: row['IMPORTER_EMAIL'],
      supplierName: row['SUPPLIER'],
      supplierAddress: row['SUPPLIER_ADDRESS'],
      originCountry: row['ORIGIN_COUNTRY'] || 'Unknown',
      foreignPort: row['FOREIGN PORT']
    };

    results.push(shipment);

    if (results.length >= BATCH_SIZE) {
      await prisma.shipment.createMany({ data: results });
      totalProcessed += results.length;
      process.stdout.write(`\r    Ingested ${totalProcessed} records...`);
      results.length = 0;
    }
  }

  if (results.length > 0) {
    await prisma.shipment.createMany({ data: results });
    totalProcessed += results.length;
  }

  console.log(`\n   ✅ Successfully loaded ${totalProcessed} shipments.`);
}
