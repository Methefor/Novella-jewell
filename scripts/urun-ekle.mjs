#!/usr/bin/env node
/**
 * Ürün ekleme aracı — fotoğrafları otomatik adlandırır, SEO dostu slug üretir
 * ve src/data/products.ts dosyasına kaydı ekler.
 *
 * Kullanım:
 *   1. Ürün fotoğraflarını `gelen-gorseller/` klasörüne at (sıra önemli:
 *      ilk dosya kapak görseli olur).
 *   2. `npm run urun:ekle` çalıştır ve soruları yanıtla.
 *
 * Araç ne yapar:
 *   • Kategorinin mevcut en yüksek numarasını bulur (örn. yuzuk-19) ve
 *     fotoğrafları yuzuk-20.jpg, yuzuk-20b.jpg ... olarak public/media/
 *     altına taşır — elle yeniden adlandırma gerekmez.
 *   • Üründen SEO dostu slug üretir (Türkçe karakterler dönüştürülür).
 *   • products.ts içine tip güvenli kaydı ekler.
 *
 * Bağımlılık yok — yalnızca Node yerleşik modülleri.
 */

import { createInterface } from 'node:readline/promises';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import process from 'node:process';

const KOK = new URL('..', import.meta.url).pathname;
const GELEN = join(KOK, 'gelen-gorseller');
const PRODUCTS_TS = join(KOK, 'src/data/products.ts');

const KATEGORILER = ['kolye', 'kupe', 'bilezik', 'yuzuk'];
/** Kategori → görsel klasör adı (bilezik görselleri "bileklik" klasöründe). */
const MEDYA_KLASORU = { kolye: 'kolye', kupe: 'kupe', bilezik: 'bileklik', yuzuk: 'yuzuk' };
const KOLEKSIYONLAR = ['barcelona', 'stockholm', 'paris', 'klasikler'];
const RENKLER = ['altin', 'gumus', 'rose-gold'];
const MATERYALLER = ['celik', 'altin-kaplama', 'rose-gold-kaplama'];

/** Türkçe karakterleri sadeleştirip SEO dostu slug üretir. */
function slugYap(metin) {
  const harita = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', Ç: 'c', Ğ: 'g', İ: 'i', I: 'i', Ö: 'o', Ş: 's', Ü: 'u' };
  return metin
    .split('')
    .map((h) => harita[h] ?? h)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** public/media/<klasor>/ içindeki en yüksek "<önek>-N" numarasını bulur. */
function sonNumara(klasor, onek) {
  const dizin = join(KOK, 'public/media', klasor);
  if (!existsSync(dizin)) return 0;
  let enBuyuk = 0;
  for (const dosya of readdirSync(dizin)) {
    const m = new RegExp(`^${onek}-(\\d+)`).exec(dosya);
    if (m) enBuyuk = Math.max(enBuyuk, Number(m[1]));
  }
  return enBuyuk;
}

async function sor(rl, soru, varsayilan) {
  const ek = varsayilan !== undefined ? ` [${varsayilan}]` : '';
  const cevap = (await rl.question(`${soru}${ek}: `)).trim();
  return cevap || varsayilan || '';
}

async function secim(rl, soru, secenekler, varsayilan) {
  console.log(`${soru}: ${secenekler.map((s, i) => `${i + 1}) ${s}`).join('  ')}`);
  const cevap = await sor(rl, 'Seçim (numara veya ad)', varsayilan);
  const num = Number(cevap);
  if (num >= 1 && num <= secenekler.length) return secenekler[num - 1];
  if (secenekler.includes(cevap)) return cevap;
  console.log(`  → tanınmadı, "${varsayilan}" kullanılıyor.`);
  return varsayilan;
}

async function ana() {
  // Gelen görselleri topla
  if (!existsSync(GELEN)) mkdirSync(GELEN);
  const gorseller = readdirSync(GELEN)
    .filter((d) => /\.(jpe?g|png|webp)$/i.test(d))
    .sort();

  if (gorseller.length === 0) {
    console.error(`Önce ürün fotoğraflarını şu klasöre atın: ${GELEN}`);
    console.error('İlk dosya (alfabetik sırada) kapak görseli olur.');
    process.exit(1);
  }

  console.log(`\n${gorseller.length} görsel bulundu: ${gorseller.join(', ')}\n`);

  const rl = createInterface({ input: process.stdin, output: process.stdout });

  const ad = await sor(rl, 'Ürün adı (örn. Paris Lumière İnci Küpe)');
  if (!ad) {
    console.error('Ürün adı zorunlu.');
    process.exit(1);
  }
  const kategori = await secim(rl, 'Kategori', KATEGORILER, 'yuzuk');
  const fiyat = Number(await sor(rl, 'Fiyat (₺)', '499'));
  const aciklama = await sor(rl, 'Açıklama (SEO için 1-2 cümle)');
  const hikaye = await sor(rl, 'Mikro hikaye (kart üstünde görünen tek cümle)', '');
  const koleksiyon = await secim(rl, 'Koleksiyon', KOLEKSIYONLAR, 'klasikler');
  const renk = await secim(rl, 'Renk', RENKLER, 'altin');
  const materyal = await secim(rl, 'Materyal', MATERYALLER, 'celik');
  const stok = Number(await sor(rl, 'Stok adedi', '10'));
  const ozellikler = (await sor(rl, 'Özellikler (virgülle ayır)', '316L paslanmaz çelik, Suya dayanıklı'))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const yeniMi = (await sor(rl, 'Yeni ürün olarak işaretlensin mi? (e/h)', 'e')).toLowerCase().startsWith('e');
  rl.close();

  // Görselleri taşı ve yeniden adlandır
  const klasor = MEDYA_KLASORU[kategori];
  const onek = klasor;
  const numara = sonNumara(klasor, onek) + 1;
  const hedefDizin = join(KOK, 'public/media', klasor);
  if (!existsSync(hedefDizin)) mkdirSync(hedefDizin, { recursive: true });

  const harfler = ['', 'b', 'c', 'd', 'e', 'f'];
  const yollar = [];
  gorseller.slice(0, harfler.length).forEach((dosya, i) => {
    const uzanti = extname(dosya).toLowerCase().replace('jpeg', 'jpg');
    const yeniAd = `${onek}-${numara}${harfler[i]}${uzanti}`;
    const hedef = join(hedefDizin, yeniAd);
    if (existsSync(hedef)) {
      console.error(`Hedef zaten var, üzerine yazılmadı: ${hedef}`);
      process.exit(1);
    }
    copyFileSync(join(GELEN, dosya), hedef);
    renameSync(join(GELEN, dosya), join(GELEN, `.eklendi-${yeniAd}`));
    yollar.push(`/media/${klasor}/${yeniAd}`);
    console.log(`  ${dosya} → public/media/${klasor}/${yeniAd}`);
  });

  const slug = slugYap(ad);
  const id = `${onek}-${numara}`;
  const bugun = new Date().toISOString().slice(0, 10);

  const kayit = `  {
    id: '${id}',
    name: '${ad.replace(/'/g, "\\'")}',
    slug: '${slug}',
    description: '${aciklama.replace(/'/g, "\\'")}',
    collection: '${koleksiyon}',
    story: '${hikaye.replace(/'/g, "\\'")}',
    category: '${kategori}',
    price: ${fiyat},
    variants: [{ id: 'v1', color: '${renk}', material: '${materyal}', stock: ${stok}, images: [${yollar.map((y) => `'${y}'`).join(', ')}] }],
    defaultVariant: 'v1',
    features: [${ozellikler.map((o) => `'${o.replace(/'/g, "\\'")}'`).join(', ')}],
    material: '${materyal}',
    isNew: ${yeniMi}, isBestSeller: false, isCustomizable: false,
    createdAt: new Date('${bugun}'), updatedAt: new Date('${bugun}'),
  },
`;

  // products.ts dizisinin kapanışından hemen önce ekle
  const icerik = readFileSync(PRODUCTS_TS, 'utf8');
  const kapanis = icerik.lastIndexOf('];');
  if (kapanis === -1) {
    console.error('products.ts içinde dizi kapanışı bulunamadı.');
    process.exit(1);
  }
  writeFileSync(PRODUCTS_TS, icerik.slice(0, kapanis) + kayit + icerik.slice(kapanis));

  console.log(`\n✔ Ürün eklendi: ${ad}`);
  console.log(`  slug: /urun/${slug}`);
  console.log(`  Kontrol için: npm run typecheck && npm run dev`);
}

ana().catch((hata) => {
  console.error(hata);
  process.exit(1);
});
