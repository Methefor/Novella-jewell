import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import pkg from '@next/env';
import { neon } from '@neondatabase/serverless';

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd(), false);

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL eksik.');

const outputArgument = process.argv.find((argument) =>
  argument.startsWith('--output=')
);
const outputPath = path.resolve(
  outputArgument?.slice('--output='.length) || 'tmp/remove-bg-queue.csv'
);
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://novellajewell.com')
  .replace(/\/$/, '');
const sql = neon(process.env.DATABASE_URL);

const rows = await sql.query(
  `select id, slug, published, data
   from catalog_products
   order by (data->>'category'), slug`
);

function csv(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

const queue = rows
  .filter((row) => {
    const data = row.data;
    return row.published && !data.deletedAt && !data.hidden;
  })
  .map((row) => {
    const data = row.data;
    const images = data.images?.length
      ? data.images
      : (data.variants?.flatMap((variant) => variant.images) ?? []);
    const sourceImage = images.find(Boolean) ?? '';
    const sourceImageUrl = sourceImage.startsWith('/')
      ? `${siteUrl}${sourceImage}`
      : sourceImage;
    const driveFolder =
      data.category === 'bilezik'
        ? 'Bilezik'
        : data.category === 'kupe'
          ? 'Küpe'
          : data.category === 'yuzuk'
            ? 'Yüzük'
            : data.category;

    return {
      productId: row.id,
      slug: row.slug,
      name: data.name,
      category: data.category,
      collection: data.collection,
      sourceImageUrl,
      outputFilename: `${row.slug}-remove-bg.png`,
      driveFolder,
      status: sourceImageUrl ? 'pending' : 'missing-source',
      qa: '',
    };
  });

const headers = [
  'product_id',
  'slug',
  'name',
  'category',
  'collection',
  'source_image_url',
  'output_filename',
  'drive_folder',
  'status',
  'qa',
];
const lines = [
  headers.map(csv).join(','),
  ...queue.map((item) =>
    [
      item.productId,
      item.slug,
      item.name,
      item.category,
      item.collection,
      item.sourceImageUrl,
      item.outputFilename,
      item.driveFolder,
      item.status,
      item.qa,
    ]
      .map(csv)
      .join(',')
  ),
];

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${lines.join('\n')}\n`, 'utf8');

const counts = queue.reduce((result, item) => {
  result[item.category] = (result[item.category] ?? 0) + 1;
  return result;
}, {});

console.log(
  JSON.stringify(
    {
      outputPath,
      total: queue.length,
      counts,
      pending: queue.filter((item) => item.status === 'pending').length,
    },
    null,
    2
  )
);
