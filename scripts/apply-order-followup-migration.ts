import { loadEnvConfig } from '@next/env';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';

async function main() {
  loadEnvConfig(process.cwd(), false);
  if (process.argv[2] !== '--apply') throw new Error('Explicit --apply required');
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required');
  const query = neon(process.env.DATABASE_URL);
  // Existing migration ledger predates the live schema. Apply this additive,
  // idempotent migration only; do not replay the old migration history.
  const statements = readFileSync('drizzle/0017_order_followup.sql', 'utf8').split('--> statement-breakpoint').map((s) => s.trim()).filter(Boolean);
  await query.transaction(statements.map((statement) => query.query(statement)));
  const columns = await query`SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name IN ('provider_checked_at','provider_check_note')`;
  const [outbox] = await query`SELECT to_regclass('public.email_outbox') AS name`;
  if (columns.length !== 2 || !outbox.name) throw new Error('Migration verification failed');
  console.log('PASS: follow-up columns and email_outbox exist. No orders changed or historical emails enqueued.');
}
void main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('Follow-up migration failed:', message.replace(/postgres(?:ql)?:\/\/[^\s'"\)]+/gi, '[redacted]'));
  process.exitCode = 1;
});
