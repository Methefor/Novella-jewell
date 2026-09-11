import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ProductCard from '../src/components/product/ProductCard';
import { PRODUCTS } from '../src/data/products';
import { getHomeCategories } from '../src/lib/home-categories';
import { getPurchasableVariant, OUT_OF_STOCK_LABEL } from '../src/lib/products';

const original = PRODUCTS.find((product) => product.category === 'yuzuk')!;
const soldOut = { ...original, hidden: false, variants: original.variants.map((variant) => ({ ...variant, stock: 0 })) };

test('sold-out products keep their detail link and show a disabled purchase button', () => {
  const html = renderToStaticMarkup(createElement(ProductCard, { product: soldOut }));
  assert.ok(html.includes(`/urun/${soldOut.slug}`));
  assert.ok(html.includes(OUT_OF_STOCK_LABEL));
  assert.match(html, /<button[^>]*disabled=""[^>]*aria-label="[^"]*Stokta yok/);
  assert.equal(getPurchasableVariant(soldOut), undefined);
});

test('an unavailable default does not block an available variant; restocking restores purchase', () => {
  const alternative = { ...soldOut.variants[0], id: 'available-alternative', stock: 2 };
  const product = { ...soldOut, variants: [...soldOut.variants, alternative] };
  assert.equal(getPurchasableVariant(product)?.id, alternative.id);
  const html = renderToStaticMarkup(createElement(ProductCard, { product }));
  assert.ok(html.includes('Sepete Ekle'));
  assert.ok(!html.includes(OUT_OF_STOCK_LABEL));
});

test('category covers use current catalog images even when sold out and exclude hidden products', () => {
  const hidden = { ...soldOut, id: 'hidden-test', slug: 'barcelona-ritm-altin-yuzuk', hidden: true, images: ['/hidden.jpg'] };
  const current = { ...soldOut, slug: 'current-ring', images: ['/current-main.jpg', '/current-model.jpg'] };
  const categories = getHomeCategories([hidden, current]);
  assert.equal(categories.length, 1);
  assert.equal(categories[0].image, '/current-model.jpg');
  assert.equal(categories[0].href, '/collections/yuzuk');
  assert.deepEqual(getHomeCategories([]), []);
});
