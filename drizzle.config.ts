import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle migration yapılandırması.
 *
 * Migration üret:   npm run db:generate
 * Migration çalıştır: npm run db:migrate   (DATABASE_URL gerekir)
 * Şemayı doğrudan it: npm run db:push       (dev'de hızlı)
 */
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
  strict: true,
});
