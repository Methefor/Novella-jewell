import { loadEnvConfig } from '@next/env';
import { sql } from 'drizzle-orm';

async function main() {
  loadEnvConfig(process.cwd(), false);
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  const { db } = await import('../src/db');
  const result = await db.transaction(async (tx) => {
    const first = await tx.execute(sql`select current_setting('transaction_read_only') as read_only`);
    if (first.rows[0]?.read_only !== 'on') throw new Error('Read-only transaction required');
    const second = await tx.execute(sql`select 1 as ok`);
    return second.rows[0]?.ok === 1;
  }, { accessMode: 'read only' });
  if (!result) throw new Error('Unexpected transaction result');
  console.log('PASS: two queries in one read-only transaction; connection closed.');
}
void main().catch(() => { console.error('FAIL: read-only transaction check. No writes were requested.'); process.exitCode = 1; });
