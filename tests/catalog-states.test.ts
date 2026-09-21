import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import CatalogEmpty from '../src/components/catalog/CatalogEmpty';
import CatalogUnavailable from '../src/components/catalog/CatalogUnavailable';

test('DB outage state is calm, actionable and does not claim the catalog is empty', () => {
  const html = renderToStaticMarkup(createElement(CatalogUnavailable, { reset: () => {} }));
  assert.match(html, /Ürünlerimiz şu anda görüntülenemiyor/);
  assert.match(html, /Geçici bir sorun yaşıyoruz\. Lütfen birkaç dakika sonra tekrar deneyin\./);
  assert.doesNotMatch(html, /bağlantı sorunu/, 'the cause is not stated as fact');
  assert.match(html, /Tekrar Dene/);
  assert.doesNotMatch(html, /ürün bulunmuyor/);
});

test('empty catalog state is a normal storefront state, not an error', () => {
  const html = renderToStaticMarkup(createElement(CatalogEmpty));
  assert.match(html, /Şu anda vitrinde ürün bulunmuyor/);
  assert.doesNotMatch(html, /role="alert"|görüntülenemiyor|hata/i);
});
