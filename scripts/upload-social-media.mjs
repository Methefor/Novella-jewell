// Hafta 1 sosyal medya asset'lerini Vercel Blob'a yükler ve herkese açık URL'leri yazar.
// Kullanım:
//   npx vercel env pull .env.blob.local --environment=production
//   node scripts/upload-social-media.mjs
// (İlk komut senin Vercel oturumunu kullanır; token bu makineden çıkmaz.)

import { readFileSync, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';

for (const f of ['.env.blob.local', '.env.import.local', '.env.local']) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error('BLOB_READ_WRITE_TOKEN yok. Önce: npx vercel env pull .env.blob.local --environment=production');
  process.exit(1);
}

const dir = 'studio/out/hafta-2026-09-08';
const names = [
  'ig-001-01.png', 'ig-001-02.png', 'ig-001-03.png', 'ig-001-04.png', 'ig-001-05.png', 'ig-001-06.png',
  'ig-002-detay-reel.mp4',
  'ig-003-01.png', 'ig-003-02.png', 'ig-003-03.png', 'ig-003-04.png', 'ig-003-05.png', 'ig-003-06.png', 'ig-003-07.png',
];

const out = {};
for (const name of names) {
  const body = await readFile(path.join(dir, name));
  const ct = name.endsWith('.mp4') ? 'video/mp4' : 'image/png';
  const blob = await put(`social/hafta-2026-09-08/${name}`, body, {
    access: 'public', addRandomSuffix: true, contentType: ct, token,
  });
  out[name] = blob.url;
  console.error(`✓ ${name}`);
}
console.log(JSON.stringify(out, null, 2));
