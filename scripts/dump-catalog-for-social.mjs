import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import { neon } from '@neondatabase/serverless';

loadEnvConfig(process.cwd(), false);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL eksik.');
const sql = neon(process.env.DATABASE_URL);

const rows = await sql.query(
  'select id, slug, published, data from catalog_products order by (data->>\'category\'), slug'
);

const summary = rows.map((r) => {
  const d = r.data;
  const imgs = d.images || (d.variants?.[0]?.images) || [];
  return {
    slug: r.slug,
    published: r.published,
    category: d.category,
    collection: d.collection,
    name: d.name,
    price: d.price,
    stock: d.variants?.[0]?.stock ?? null,
    deletedAt: d.deletedAt ?? null,
    hidden: d.hidden ?? false,
    imageCount: imgs.length,
    images: imgs,
  };
});

const byCat = {};
for (const s of summary) {
  const k = `${s.category} | published=${s.published} | deleted=${!!s.deletedAt}`;
  byCat[k] = (byCat[k] || 0) + 1;
}

console.log('=== COUNTS ===');
console.log(JSON.stringify(byCat, null, 2));
console.log('=== FULL ===');
console.log(JSON.stringify(summary, null, 2));
