import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Neon Postgres bağlantısı (Drizzle, neon-http driver).
 *
 * neon-http her sorguyu tek HTTP isteğiyle çalıştırır — Vercel serverless
 * fonksiyonları için ideal (kalıcı bağlantı havuzu gerektirmez).
 *
 * DATABASE_URL Vercel Storage (Neon) tarafından sağlanır. Lokal için:
 *   vercel env pull .env.local
 *
 * dbYok(): DATABASE_URL tanımsızsa DB'siz ortamda (ör. ilk kurulum) sipariş
 * akışı çökmesin diye kontrol edilir; çağıranlar buna göre davranır.
 */
export const dbYok = !process.env.DATABASE_URL;

export const db = dbYok
  ? // Tip uyumu için; dbYok true iken hiç kullanılmaz.
    (null as unknown as ReturnType<typeof drizzle<typeof schema>>)
  : drizzle(neon(process.env.DATABASE_URL!), { schema });

export { schema };
