import { createClient, type Client } from '@clickhouse/client';

const globalForClickHouse = global as unknown as {
  clickhouse: Client | undefined;
};

export const clickhouse = globalForClickHouse.clickhouse || createClient({
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || '',
  database: process.env.CLICKHOUSE_DB || 'default',
  clickhouse_settings: {
    max_execution_time: 30, // 30-second analytical query timeout safety
    send_progress_in_http_headers: 1,
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForClickHouse.clickhouse = clickhouse;
}

/**
 * Checks connection health to determine if hybrid queries should utilize 
 * ClickHouse analytical paths or PostgreSQL fallback paths.
 */
export async function isClickHouseConnected(): Promise<boolean> {
  try {
    const result = await clickhouse.ping();
    return result.success;
  } catch (error) {
    console.warn('⚠️ ClickHouse is offline or unreachable. Falling back to local PostgreSQL engine.');
    return false;
  }
}