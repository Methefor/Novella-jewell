# Mimari Genel Görünüm

Bu belge, Novella Jewell e-ticaret uygulamasının yüksek düzeyli yapısını, teknoloji yığınını ve veri erişim kurallarını özetler.

## Teknoloji Yığını

| Katman         | Seçim                                                                                | Notlar                                                                                          |
| -------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Framework      | Next.js 16 (App Router)                                                              | Varsayılan olarak Sunucu Bileşenleri; `"use client"` yalnızca etkileşim/hook zorunlu olduğunda. |
| Dil            | TypeScript 5                                                                         | `tsconfig.json` içinde `strict: true`. `any` kullanımı yasaktır.                                |
| Stil           | Tailwind CSS v3                                                                      | `tailwind.config.ts` içinde marka renkleri, yazı tipleri ve gölgeler tanımlı.                   |
| Animasyon      | Framer Motion 11                                                                     | Sayfa geçişleri ve mikro etkileşimlerde.                                                        |
| Durum yönetimi | Zustand                                                                              | Sepet, favoriler, filtreler ve son bakılanlar gibi istemci durumları için.                      |
| İkonlar        | Lucide React                                                                         | —                                                                                               |
| Yazı tipleri   | Cormorant Garamond (başlık) + Inter (gövde)                                          | `next/font/google` ile optimize edilmiş.                                                        |
| Ödeme          | PayTR iFrame API (Shopier, 2026-07 itibarıyla kendi sitede satış desteğini kaldırdı) | `src/lib/checkout/paytr.ts`; `CheckoutProvider` arayüzü sayesinde sağlayıcı değiştirilebilir.   |
| Veritabanı     | Neon Postgres + Drizzle ORM                                                          | `src/db/index.ts` neon-http driver; `src/db/schema.ts` tek tablo: `orders`.                     |
| E-posta        | Resend                                                                               | `src/lib/email.ts`, `RESEND_API_KEY` opsiyonel.                                                 |
| Analitik       | Google Analytics 4                                                                   | `src/lib/analytics.ts`, çerez onayına bağlı.                                                    |
| Dağıtım        | Vercel                                                                               | `vercel.json` ve `next.config.ts` içinde yönlendirmeler tanımlı.                                |

## Klasör Yapısı

```
c:\Projects\Novella-Jewell
├── .docs/                    # Proje bilgi tabanı (bu klasör)
├── drizzle/                  # Drizzle migration dosyaları (.sql + meta/)
├── public/
│   └── media/                # Ürün ve site görselleri (kategori alt klasörleri)
├── src/
│   ├── app/                  # Next.js App Router rotaları ve layout
│   │   ├── api/              # Route handlers
│   │   │   ├── checkout/     # Ödeme başlatma
│   │   │   └── odeme/callback/  # Shopier ödeme geri dönüşü
│   │   ├── (sayfalar)/       # Hikaye, koleksiyon, ürün, sepet, ödeme vb.
│   │   ├── layout.tsx        # Kök layout: fontlar, SEO, JSON-LD, GA, çerez banner
│   │   ├── page.tsx          # Anasayfa
│   │   ├── sitemap.ts        # Dinamik sitemap
│   │   └── robots.ts         # robots.txt
│   ├── components/
│   │   ├── analytics/        # GoogleAnalytics
│   │   ├── cart/             # Sepet çekmecesi ve öğeleri
│   │   ├── common/           # Button, ErrorBoundary, StoreHydration, Toast
│   │   ├── filters/          # Ürün filtreleme arayüzü
│   │   ├── layout/           # Header, Footer, AnnouncementBar, PageTransition
│   │   ├── legal/            # CookieBanner ve yasal bileşenler
│   │   ├── product/          # Kart, galeri, varyasyon, detay bileşenleri
│   │   └── search/           # Arama bileşeni
│   ├── data/
│   │   ├── collections.ts    # 4 şehir koleksiyonu ve hikayeleri
│   │   ├── products.ts       # ~80 ürün, tek ürün kataloğu kaynağı
│   │   └── sss.ts            # Sık sorulan sorular
│   ├── db/
│   │   ├── index.ts          # Neon/Drizzle bağlantısı (DATABASE_URL)
│   │   └── schema.ts         # `orders` tablosu ve türleri
│   ├── hooks/                # useProductFilters, useProductSearch, useToast vb.
│   ├── lib/                  # İş mantığı ve yardımcılar
│   │   ├── analytics.ts      # GA4 e-ticaret olayları
│   │   ├── checkout/         # Sağlayıcı arayüzü, buildOrder, PayTR (eski Shopier)
│   │   ├── config.ts         # SITE, SHIPPING, LOW_STOCK_THRESHOLD, EMAIL
│   │   ├── cookies.ts        # Çerez onay yönetimi
│   │   ├── email.ts          # Resend sipariş onay e-postası
│   │   ├── legal.ts          # Şirket bilgileri (satış öncesi doldurulacak)
│   │   ├── orders.ts         # Sipariş DB işlemleri (create, paid, failed)
│   │   ├── products.ts       # Ürün erişim fonksiyonları (tek veri erişim noktası)
│   │   ├── turkiye.ts        # Türkiye iller listesi
│   │   └── utils.ts          # `cn` yardımcısı (clsx + tailwind-merge)
│   ├── sections/
│   │   └── Hero.tsx          # Anasayfa hero bölümü
│   ├── store/                # Zustand store'ları
│   │   ├── cartStore.ts
│   │   ├── filterStore.ts
│   │   ├── recentStore.ts
│   │   └── wishlistStore.ts
│   ├── styles/
│   │   └── globals.css       # Tasarım tokenları ve marka yardımcı sınıfları
│   └── types/
│       ├── product.ts        # Product, ProductVariant, FilterState türleri
│       └── review.ts         # Yorum türleri (şu an kullanımda değil)
├── studio/                   # Remotion video stüdyosu (tsconfig dışında)
├── next.config.ts            # Next.js yapılandırması ve yönlendirmeler
├── tailwind.config.ts        # Tailwind teması
├── tsconfig.json             # TypeScript yapılandırması (strict)
├── drizzle.config.ts         # Drizzle Kit yapılandırması
└── package.json              # Proje script'leri ve bağımlılıklar
```

## Veri Erişim Kuralları

- **Öncelik sunucu tarafındadır.**
  - Ürün listesi, ürün detayı, koleksiyonlar ve SEO meta verileri Sunucu Bileşenlerinde (`src/app/**/page.tsx`) getirilir.
  - Veritabanı erişimi yalnızca Route Handler'lar (`src/app/api/**`) ve `src/lib/orders.ts` gibi sunucu tarafı modüllerinde olur.
- **İstemci bileşenleri** mümkün olduğunca küçük tutulur ve prop ile beslenir.
  - Zustand yalnızca kullanıcı arayüzü durumu (sepet, favori, filtre) için kullanılır; veritabanı istemcisine doğrudan erişemez.
- **Tek veri kaynağı:**
  - Ürün kataloğu: `src/data/products.ts`.
  - Koleksiyonlar: `src/data/collections.ts`.
  - Siparişler: Neon Postgres `orders` tablosu.
  - Şirket bilgileri: `src/lib/legal.ts`.

## Veritabanı Şeması

`src/db/schema.ts` içindeki `orders` tablosu:

| Sütun                | Tür                        | Açıklama                                                                          |
| -------------------- | -------------------------- | --------------------------------------------------------------------------------- |
| `id`                 | `uuid`                     | Birincil anahtar, `gen_random_uuid()` ile otomatik.                               |
| `order_no`           | `text`                     | İnsan-okur sipariş no (`NJ-2026-0001` gibi); DB sequence ile üretilir, benzersiz. |
| `status`             | `text`                     | `pending` \| `paid` \| `failed`.                                                  |
| `items`              | `jsonb`                    | `OrderItemRow[]`: slug, ad, adet, birimFiyat.                                     |
| `total`              | `numeric(10,2)`            | Sipariş toplamı.                                                                  |
| `customer`           | `jsonb`                    | `OrderCustomerRow`: adSoyad, email, telefon, adres, il, ilce, not.                |
| `shopier_payment_id` | `text`                     | Ödeme sağlayıcı tarafından dönen ödeme ID'si.                                     |
| `random_nr`          | `text`                     | Shopier imzasında kullanılan rastgele sayı.                                       |
| `created_at`         | `timestamp with time zone` | Sipariş oluşturulma zamanı.                                                       |
| `paid_at`            | `timestamp with time zone` | Ödeme onaylanma zamanı (nullable).                                                |

İlk migration: `drizzle/0000_past_harry_osborn.sql`.

## Ortam Değişkenleri (Adları)

Açıklamalar ve değer örnekleri için `.env.example` dosyasına bak. Gerçek değerler yalnızca Vercel ve `.env.local` içinde tutulur, `.docs/` içine yazılmaz.

- `NEXT_PUBLIC_SITE_URL`
- `PAYTR_MERCHANT_ID`
- `PAYTR_MERCHANT_KEY`
- `PAYTR_MERCHANT_SALT`
- `PAYTR_TEST_MODE`
- `CHECKOUT_PROVIDER` (varsayılan: `paytr`)
- `DATABASE_URL`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_GA_ID`

## Güvenlik ve İş Akışı Notları

- **Fiyat asla client'tan alınmaz.** `/api/checkout` yalnızca `productId`, `variantId` ve `quantity` kabul eder; fiyat/kargo/total `src/lib/checkout/buildOrder.ts` içinde sunucuda `PRODUCTS`'tan yeniden hesaplanır.
- **Mesafeli Sözleşmeler Yönetmeliği m.6:** `consent.sozlesme` ve `consent.kvkk` onayları `/api/checkout` gövdesinde `z.literal(true)` ile şart koşulur.
- **Çerez onayı:** Google Analytics yalnızca `src/lib/cookies.ts` üzerinden `accepted` onayı alınırsa yüklenir.
- **Sipariş onay e-postası:** `src/lib/email.ts` ile Resend üzerinden gönderilir; e-posta gönderilemese bile sipariş akışı kırılmaz.

## Bilinen Eksikler / Dikkat Edilecekler

- `src/lib/legal.ts` içindeki şirket bilgileri (`unvan`, `adres`, `vergiDairesi`, `vergiNo`, `email`, `telefon`) satış öncesi doldurulmalıdır; boş alanlar sitede `[DOLDURULACAK: ...]` olarak görünür.
- `public/media/kolye/` klasörü ve görselleri henüz mevcut değil; kolye ürünleri yer tutucu görsel gösteriyor.
- `src/types/product.ts` içinde `ProductCategory` türü `kolye` içermiyor; kolye envantere girdiğinde tipe ekleme yapılacak.
