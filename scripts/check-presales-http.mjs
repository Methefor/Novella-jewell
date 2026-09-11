import { writeFile } from 'node:fs/promises';

// Read-only: never submit checkout, callback or admin requests.
const base = process.argv[2] || 'http://localhost:3001';
const output = process.argv[3] || 'docs/audits/2026-09-01-after-http.json';
async function get(path) {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(45000) });
  return { path, status: response.status, body: await response.text() };
}
const catalogResponse = await get('/api/katalog');
if (catalogResponse.status !== 200) throw new Error(`Catalog: HTTP ${catalogResponse.status}`);
const catalog = JSON.parse(catalogResponse.body);
const products = Array.isArray(catalog) ? catalog : catalog.products;
const productPaths = new Set(products.map((p) => `/urun/${p.slug}`));
const sitemap = await get('/sitemap.xml');
const sitemapPaths = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const paths = [...new Set([...sitemapPaths, '/on-bilgilendirme', '/mesafeli-satis-sozlesmesi', '/robots.txt', '/arama?q=Celeste', '/presales-missing-page', '/urun/new-york-edge-zincir-bileklik'])];
const pages = [];
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < paths.length) {
    const path = paths[next++];
    const { status, body } = await get(path);
    const links = [...new Set([...body.matchAll(/href="(\/urun\/[^"?#]+)"/g)].map((m) => m[1]))];
    const schemas = [...body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const plain = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
    pages.push({
      path, status,
      title: /<title>(.*?)<\/title>/.exec(body)?.[1],
      h1Count: [...plain.matchAll(/<h1(?:\s|>)/g)].length,
      noindex: /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(body),
      schemaTypes: schemas.map((s) => s['@type']),
      brokenCatalogLinks: links.filter((p) => !productPaths.has(p)),
      ...(productPaths.has(path) ? { hasReturnPolicy: schemas.some((s) => s['@type'] === 'Product' && !!s.offers?.hasMerchantReturnPolicy) } : {}),
    });
  }
}));
const failures = [];
for (const p of pages) {
  if (sitemapPaths.includes(p.path) && (p.status !== 200 || p.noindex || p.h1Count !== 1)) failures.push({ path: p.path, issue: 'indexable page status/H1/robots', status: p.status, h1: p.h1Count, noindex: p.noindex });
  if (p.brokenCatalogLinks.length) failures.push({ path: p.path, issue: 'stale product links', links: p.brokenCatalogLinks });
  if (productPaths.has(p.path) && ((!p.hasReturnPolicy) || (p.title.match(/NOVELLA/g) || []).length !== 1)) failures.push({ path: p.path, issue: 'product title/return policy' });
}
const missingFromSitemap = [...productPaths].filter((p) => !sitemapPaths.includes(p));
if (missingFromSitemap.length) failures.push({ issue: 'missing sitemap products', paths: missingFromSitemap });
const report = { checkedAt: new Date().toISOString(), base, catalogProducts: products.length, sitemapUrls: sitemapPaths.length, pagesChecked: pages.length, missingFromSitemap, failures, pages: pages.sort((a, b) => a.path.localeCompare(b.path)) };
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, pages: undefined }, null, 2));
if (failures.length) process.exitCode = 1;
