import nextEnv from '@next/env';
import { neon } from '@neondatabase/serverless';

const { loadEnvConfig } = nextEnv;

async function main() {
  loadEnvConfig(process.cwd(), false);
  if (process.argv[2] !== '--apply') throw new Error('Explicit --apply flag required');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  const query = neon(process.env.DATABASE_URL);
  const [before] = await query`SELECT count(*)::integer AS pending FROM orders WHERE status='pending'`;
  if (before.pending !== 0) throw new Error(`Refusing migration: ${before.pending} pending orders require reconciliation`);
  await query.transaction([
    query`ALTER TABLE orders ADD COLUMN IF NOT EXISTS legal_acceptance jsonb`,
    query`ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_reserved boolean DEFAULT false NOT NULL`,
    query`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_ready_at timestamp with time zone`,
    query`CREATE INDEX IF NOT EXISTS orders_pending_stock_idx ON orders (status) WHERE status='pending'`,
  ]);
  const columns = await query`SELECT column_name FROM information_schema.columns
    WHERE table_schema='public' AND table_name='orders'
      AND column_name IN ('legal_acceptance','checkout_reserved','payment_ready_at') ORDER BY column_name`;
  if (columns.length !== 3) throw new Error('Migration verification failed');
  console.log('PASS: three order fields and the pending-stock index are present; no order rows changed.');
}
void main().catch((error) => { console.error(error instanceof Error ? error.message : 'Migration failed'); process.exitCode = 1; });
