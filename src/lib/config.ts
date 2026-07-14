export const SHIPPING = {
  freeThreshold: 500,
  fee: 49.90,
} as const;

export const SITE = {
  // Domain alınınca SADECE bu satır değişir — canonical, OG, sitemap, JSON-LD hepsi buradan okur
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novella-jewell.vercel.app',
  name: 'NOVELLA',
  tagline: 'Kararmayan Çelik, Eskimeyen Zarafet',
  whatsapp: '905451125059',
  instagram: 'https://www.instagram.com/jewelry.novella/',
} as const;
