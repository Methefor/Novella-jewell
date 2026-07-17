export const SHIPPING = {
  freeThreshold: 500,
  fee: 49.90,
} as const;

/**
 * "Son X adet kaldı" göstergesinin eşiği.
 *
 * Bu değerin ALTINDA veya EŞİT stokta gösterilir. Kıtlık sinyali ancak nadir
 * göründüğünde işe yarar; her üründe çıkarsa anlamını yitirir.
 *
 * ⚠️ Gösterilen sayı GERÇEK stok — uydurma sayaç değil. Stok verisi
 * src/data/products.ts'te sabit; Supabase'e geçince oradan okunmalı ve
 * satış sonrası düşmeli, yoksa "son 3 adet" yalan olur.
 */
export const LOW_STOCK_THRESHOLD = 8;

export const SITE = {
  // Domain alınınca SADECE bu satır değişir — canonical, OG, sitemap, JSON-LD hepsi buradan okur
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novella-jewell.vercel.app',
  name: 'NOVELLA',
  tagline: 'Kararmayan Çelik, Eskimeyen Zarafet',
  whatsapp: '905451125059',
  instagram: 'https://www.instagram.com/jewelry.novella/',
} as const;
