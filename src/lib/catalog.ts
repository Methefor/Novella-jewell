import 'server-only';

import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { PRODUCTS } from '@/data/products';
import type { Product } from '@/types/product';
import { eq, sql } from 'drizzle-orm';

function hydrate(data: typeof catalogProducts.$inferSelect.data): Product {
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export async function getCatalogProducts(options?: {
  includeHidden?: boolean;
}): Promise<Product[]> {
  const staticProducts = options?.includeHidden
    ? PRODUCTS
    : PRODUCTS.filter((product) => !product.hidden);

  if (dbYok) return staticProducts;

  const rows = await db
    .select({
      data: catalogProducts.data,
      published: catalogProducts.published,
    })
    .from(catalogProducts);
  const dynamicProducts = rows
    .filter(({ published }) => published)
    .map(({ data }) => hydrate(data));
  if (rows.length > 0) return dynamicProducts;
  return staticProducts;
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<Product | undefined> {
  if (!dbYok) {
    const [row] = await db
      .select({
        data: catalogProducts.data,
        published: catalogProducts.published,
      })
      .from(catalogProducts)
      .where(eq(catalogProducts.slug, slug))
      .limit(1);
    if (row) return row.published ? hydrate(row.data) : undefined;
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(catalogProducts);
    if (count > 0) return undefined;
  }
  return PRODUCTS.find((product) => product.slug === slug);
}

export async function getCatalogProductById(
  id: string
): Promise<Product | undefined> {
  if (!dbYok) {
    const [row] = await db
      .select({
        data: catalogProducts.data,
        published: catalogProducts.published,
      })
      .from(catalogProducts)
      .where(eq(catalogProducts.id, id))
      .limit(1);
    if (row) return row.published ? hydrate(row.data) : undefined;
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(catalogProducts);
    if (count > 0) return undefined;
  }
  return PRODUCTS.find((product) => product.id === id);
}
