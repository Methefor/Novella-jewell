import 'server-only';

import { db, dbYok } from '@/db';
import { catalogProducts } from '@/db/schema';
import { PRODUCTS } from '@/data/products';
import type { Product } from '@/types/product';
import { eq } from 'drizzle-orm';

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
    .select({ data: catalogProducts.data })
    .from(catalogProducts)
    .where(eq(catalogProducts.published, true));
  const dynamicProducts = rows.map(({ data }) => hydrate(data));
  const dynamicIds = new Set(dynamicProducts.map((product) => product.id));

  return [
    ...dynamicProducts,
    ...staticProducts.filter((product) => !dynamicIds.has(product.id)),
  ];
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<Product | undefined> {
  if (!dbYok) {
    const [row] = await db
      .select({ data: catalogProducts.data })
      .from(catalogProducts)
      .where(eq(catalogProducts.slug, slug))
      .limit(1);
    if (row) return hydrate(row.data);
  }
  return PRODUCTS.find((product) => product.slug === slug);
}

export async function getCatalogProductById(
  id: string
): Promise<Product | undefined> {
  if (!dbYok) {
    const [row] = await db
      .select({ data: catalogProducts.data })
      .from(catalogProducts)
      .where(eq(catalogProducts.id, id))
      .limit(1);
    if (row) return hydrate(row.data);
  }
  return PRODUCTS.find((product) => product.id === id);
}
