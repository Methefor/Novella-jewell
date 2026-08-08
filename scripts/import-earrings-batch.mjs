import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { readFile, readdir, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceRoot = path.join(root, 'gelen-gorseller', 'earrings-0807');
const manifestPath = path.join(root, 'docs', 'imports', 'earrings-2026-08-07.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const dryRun = process.argv.includes('--dry-run');

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL eksik.');
if (!dryRun && !process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN eksik.');

const sql = neon(process.env.DATABASE_URL);
const existing = await sql.query('select slug from catalog_products where slug = any($1::text[])', [manifest.map((item) => item.slug)]);
const existingSlugs = new Set(existing.map((row) => row.slug));
const duplicates = manifest.filter((item) => existingSlugs.has(item.slug));
if (duplicates.length) throw new Error(`Kullanılan bağlantı adları: ${duplicates.map((item) => item.slug).join(', ')}`);

const prepared = [];
for (const item of manifest) {
  const setDir = path.join(sourceRoot, item.set);
  const sourceFiles = (await readdir(setDir))
    .filter((filename) => filename.toLowerCase().endsWith('.png'))
    .sort()
    .map((filename) => path.join(setDir, filename));
  if (sourceFiles.length < 3) throw new Error(`${item.set} için en az 3 görsel gerekli.`);
  prepared.push({ ...item, sourceFiles });
}

console.log(JSON.stringify({ products: prepared.length, images: prepared.reduce((sum, item) => sum + item.sourceFiles.length, 0), incomplete: prepared.filter((item) => item.sourceFiles.length < 4).map((item) => item.set), dryRun }, null, 2));
if (dryRun) process.exit(0);

const labels = ['flatlay', 'model-closeup', 'model-lifestyle', 'editorial'];
for (const item of prepared) {
  const urls = [];
  for (let index = 0; index < item.sourceFiles.length; index += 1) {
    const source = item.sourceFiles[index];
    const filename = `${item.slug}-${String(index + 1).padStart(2, '0')}-${labels[index]}.png`;
    const renamed = path.join(path.dirname(source), filename);
    if (source !== renamed && !existsSync(renamed)) await rename(source, renamed);
    const body = await readFile(renamed);
    const blob = await put(`products/${item.slug}/${filename}`, body, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'image/png',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    urls.push(blob.url);
  }

  const id = `product-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const features = ['316L paslanmaz çelik', 'Suya dayanıklı', 'Kararmaya karşı dirençli', 'Günlük kullanıma uygun'];
  const data = {
    id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    story: item.detail,
    collection: item.collection,
    category: 'kupe',
    price: 0,
    variants: [{ id: 'v1', color: item.color, material: 'celik', stock: 0, images: urls }],
    defaultVariant: 'v1',
    images: urls,
    features,
    material: 'celik',
    isNew: true,
    isBestSeller: false,
    isCustomizable: false,
    adChecklist: { visualMatchApproved: urls.length === 4, copyApproved: true, priceStockApproved: false, landingPageApproved: false },
    createdAt: now,
    updatedAt: now,
  };

  await sql.query(`
    with created_product as (
      insert into catalog_products (id, slug, data, published)
      values ($1, $2, $3::jsonb, false)
      returning id
    ), created_inventory as (
      insert into inventory (product_id, variant_id, stock)
      select id, 'v1', 0 from created_product
    )
    insert into stock_movements (
      product_id, variant_id, delta, previous_stock, new_stock,
      source, reason, created_by
    )
    select id, 'v1', 0, 0, 0, 'earrings_batch_import',
      'Fiyat ve stok onayı bekleyen küpe taslağı', 'batch-import'
    from created_product
  `, [id, item.slug, JSON.stringify(data)]);
  console.log(`created ${item.set} ${item.slug} (${urls.length} images)`);
}
