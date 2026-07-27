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
    .select({
      data: catalogProducts.data,
      published: catalogProducts.published,
    })
    .from(catalogProducts);
  const dynamicProducts = rows
    .filter(({ published }) => published)
    .map(({ data }) => hydrate(data));
  // Taslak kaydı statik ürünü de bastırır; aksi halde "yayından kaldırılan"
  // statik ürün PRODUCTS listesinden tekrar görünürdü.
  const dynamicIds = new Set(rows.map(({ data }) => data.id));

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
      .select({
        data: catalogProducts.data,
        published: catalogProducts.published,
      })
      .from(catalogProducts)
      .where(eq(catalogProducts.slug, slug))
      .limit(1);
    if (row) return row.published ? hydrate(row.data) : undefined;
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
  }
  return PRODUCTS.find((product) => product.id === id);
}
