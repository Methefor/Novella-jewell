import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildCreativePrompt,
  CREATIVE_PRESETS,
  getCreativePreset,
} from '../src/lib/creative-studio';

const product = {
  name: 'Celeste Yüzük',
  slug: 'celeste-yuzuk',
  category: 'yuzuk',
  material: 'altin-kaplama',
  description: 'İnce formu ve dengeli taş yerleşimiyle hazırlanan yüzük.',
  story: 'Gündüzden geceye taşınan sakin bir ışıltı.',
  features: ['Ayarlanabilir form', 'Altın kaplama', 'Zirkon taş'],
};

test('her yaratıcı kullanım için ayrı bir hazır reçete sunar', () => {
  assert.deepEqual(
    CREATIVE_PRESETS.map((preset) => preset.id),
    [
      'remove-bg-master',
      'product-hero',
      'packshot',
      'luxury-ad',
      'editorial-ad',
      'scroll-stopper',
      'luxury-edition',
      '3d-billboard',
    ]
  );
  assert.equal(getCreativePreset('packshot').kind, 'studio');
  assert.equal(getCreativePreset('3d-billboard').kind, 'campaign');
});

test('remove bg master reçetesi yalnızca şeffaf ürün ana dosyasını ister', () => {
  const prompt = buildCreativePrompt({
    product,
    imageUrls: ['/media/yuzuk/celeste.jpg'],
    presetId: 'remove-bg-master',
    formats: ['story'],
    headline: 'Kullanılmamalı',
    subheadline: 'Kullanılmamalı',
    cta: 'Kullanılmamalı',
    siteUrl: 'https://novellajewell.com/',
  });

  assert.match(prompt, /full-resolution RGBA PNG/);
  assert.match(prompt, /Change only the background/);
  assert.match(prompt, /Preserve every real opening/);
  assert.doesNotMatch(prompt, /AI STORYBOARD/);
});

test('ürün bağlantılarını, kimlik kilidini ve storyboardu tek briefe toplar', () => {
  const prompt = buildCreativePrompt({
    product,
    imageUrls: [
      '/media/yuzuk/celeste.jpg',
      'https://assets.public.blob.vercel-storage.com/celeste-detail.webp',
    ],
    presetId: 'scroll-stopper',
    formats: ['story', 'feed'],
    headline: 'Işıltıyı yakala',
    subheadline: 'Yeni Celeste',
    cta: 'Keşfet',
    siteUrl: 'https://novellajewell.com/',
  });

  assert.match(
    prompt,
    /https:\/\/novellajewell\.com\/media\/yuzuk\/celeste\.jpg/
  );
  assert.match(prompt, /assets\.public\.blob\.vercel-storage\.com/);
  assert.match(prompt, /IDENTITY LOCK — NON-NEGOTIABLE/);
  assert.match(prompt, /AI STORYBOARD — 5 SHOTS/);
  assert.match(prompt, /9:16 vertical Story \/ Reels, 4:5 portrait feed/);
  assert.match(prompt, /Do not redesign/);
});
