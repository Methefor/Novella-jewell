import { loadEnvConfig } from '@next/env';
import { neon } from '@neondatabase/serverless';

async function main() {
  loadEnvConfig(process.cwd(), false);
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  const query = neon(process.env.DATABASE_URL);
  const [products, orders, migrations] = await query.transaction([
    query`SELECT data->>'name' AS name, (data->>'price')::numeric AS price
      FROM catalog_products WHERE published=true AND data->>'deletedAt' IS NULL
      ORDER BY price ASC LIMIT 5`,
    query`SELECT status, count(*)::integer AS count FROM orders GROUP BY status ORDER BY status`,
    query`SELECT count(*)::integer AS applied, max(created_at) AS latest FROM drizzle.__drizzle_migrations`,
  ], { readOnly: true });
  console.log(JSON.stringify({ lowestProducts: products, orderCounts: orders, migrations: migrations[0], writes: false }, null, 2));
}
void main().catch(() => { console.error('FAIL: read-only payment readiness check.'); process.exitCode = 1; });
