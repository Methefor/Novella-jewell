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
 * Değer aktif katalogdan gelir; dinamik ürünlerde Neon DB stok kaynağıdır.
 */
export const LOW_STOCK_THRESHOLD = 8;

export const SITE = {
  // Domain alınınca SADECE bu satır değişir — canonical, OG, sitemap, JSON-LD hepsi buradan okur
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novellajewell.com',
  name: 'NOVELLA',
  tagline: 'Özgün Tasarımlar, Zamansız Işıltı',
  whatsapp: '905451125059',
  instagram: 'https://www.instagram.com/novellajewellofficial/',
  threads: 'https://www.threads.com/@novellajewellofficial',
} as const;

/**
 * E-posta gönderici adresi (Resend).
 *
 * novellajewell.com için Resend DKIM, SPF ve MX kayıtları yapılandırılmıştır.
 * Production ortamında değer Vercel üzerinden yönetilir; marka adresi güvenli
 * varsayılan olarak yalnızca yapılandırma eksikliğine karşı korunur.
 */
export const EMAIL = {
  from:
    process.env.RESEND_FROM_EMAIL ?? 'NOVELLA <siparis@novellajewell.com>',
  replyTo:
    process.env.RESEND_REPLY_TO ?? 'novella.jewellery.tr@gmail.com',
} as const;
