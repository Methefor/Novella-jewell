import { loadEnvConfig } from '@next/env';
import { neon } from '@neondatabase/serverless';

async function main() {
  loadEnvConfig(process.cwd(), false);
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  const query = neon(process.env.DATABASE_URL);
  // Aggregate counts and schema names only; never print customer/order details.
  const [columns, pending, history] = await query.transaction([
    query`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name IN ('legal_acceptance','checkout_reserved','payment_ready_at')`,
    query`SELECT COUNT(*)::integer AS pending_orders,
      COUNT(*) FILTER (WHERE created_at < now() - interval '1 hour')::integer AS older_than_one_hour
      FROM orders WHERE status='pending'`,
    query`SELECT to_regclass('drizzle.__drizzle_migrations') IS NOT NULL AS migration_history_exists`,
  ], { readOnly: true });
  console.log(JSON.stringify({ requiredColumns: ['legal_acceptance','checkout_reserved','payment_ready_at'], existingColumns: columns.map((r) => r.column_name), ...pending[0], ...history[0], writes: false }, null, 2));
}
void main().catch(() => { console.error('FAIL: read-only schema/preflight check. No customer data printed.'); process.exitCode = 1; });
