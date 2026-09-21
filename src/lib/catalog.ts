import 'server-only';

import { db } from '@/db';
import { catalogProducts } from '@/db/schema';
import type { Product } from '@/types/product';
import { eq } from 'drizzle-orm';

/**
 * Katalog tek kaynağı: Neon Postgres → catalogProducts (ADR-013).
 *
 * Üç durum KESİNLİKLE ayrı tutulur:
 *  - Veritabanı erişilemiyor → CatalogUnavailableError fırlatılır. Sessiz
 *    fallback yoktur; ISR yenilemesinde hata, son başarılı sayfanın
 *    sunulmaya devam etmesini sağlar.
 *  - Veritabanı erişilebilir, katalog boş → normal `[]`.
 *  - Veritabanı erişilebilir, istenen ürün yok → `undefined` (çağıran 404 verir).
 */
export class CatalogUnavailableError extends Error {
  constructor(options?: { cause?: unknown }) {
    super('Ürün kataloğu şu anda kullanılamıyor.', options);
    this.name = 'CatalogUnavailableError';
  }
}

/** Testlerde gerçek bağlantı yerine geçirilebilir; varsayılan uygulama bağlantısıdır. */
type CatalogDatabase = typeof db;

function connection(database: CatalogDatabase): NonNullable<CatalogDatabase> {
  if (!database) throw new CatalogUnavailableError();
  return database;
}

async function read<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (cause) {
    throw new CatalogUnavailableError({ cause });
  }
}

function hydrate(data: typeof catalogProducts.$inferSelect.data): Product {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export async function getCatalogProducts(
  options?: { includeHidden?: boolean },
  database: CatalogDatabase = db
): Promise<Product[]> {
  const conn = connection(database);
  const rows = await read(() =>
    conn
      .select({ data: catalogProducts.data, published: catalogProducts.published })
      .from(catalogProducts)
  );
  return rows
    .filter(({ published, data }) => published && !data.deletedAt && (options?.includeHidden || !data.hidden))
    .map(({ data }) => hydrate(data));
}

export async function getCatalogProductBySlug(
  slug: string,
  database: CatalogDatabase = db
): Promise<Product | undefined> {
  const conn = connection(database);
  const [row] = await read(() =>
    conn
      .select({ data: catalogProducts.data, published: catalogProducts.published })
      .from(catalogProducts)
      .where(eq(catalogProducts.slug, slug))
      .limit(1)
  );
  return row && row.published && !row.data.deletedAt ? hydrate(row.data) : undefined;
}

export async function getCatalogProductById(
  id: string,
  database: CatalogDatabase = db
): Promise<Product | undefined> {
  const conn = connection(database);
  const [row] = await read(() =>
    conn
      .select({ data: catalogProducts.data, published: catalogProducts.published })
      .from(catalogProducts)
      .where(eq(catalogProducts.id, id))
      .limit(1)
  );
  return row && row.published && !row.data.deletedAt ? hydrate(row.data) : undefined;
}
