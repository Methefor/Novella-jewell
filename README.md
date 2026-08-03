# Novella Jewell

Modern, güvenilir ve ulaşılabilir premium takı deneyimi için geliştirilen Novella Jewell e-ticaret platformu.

[![Canlı Site](https://img.shields.io/badge/canlı-novellajewell.com-9b6b53?style=flat-square)](https://novellajewell.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/deploy-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

> 316L paslanmaz çelik, suya dayanıklı ve kararmaya karşı dirençli takılar.

## Proje hakkında

Bu depo yalnızca bir mağaza arayüzünü değil; katalog yönetimi, güvenli ödeme, sipariş operasyonu, analitik ve sosyal medya kampanya hazırlığını aynı sistemde birleştiren ticari uygulamayı içerir.

- Mobil öncelikli ürün kataloğu ve gelişmiş filtreleme
- Ürün detayları, sepet ve PayTR ödeme akışı
- Neon Postgres üzerinde katalog, stok, sipariş ve kampanya verileri
- Clerk tabanlı yönetici erişimi
- Ürün oluşturma, düzenleme, yayından kaldırma ve görsel yönetimi
- Reklama hazırlık puanı ve eksik içerik kontrolü
- Instagram ve Threads kampanya panosu
- Google Analytics ve Meta Pixel uyumlu dönüşüm olayları
- Resend ile işlem e-postaları
- Vercel üzerinde üretim dağıtımı

## Teknoloji

| Alan | Teknoloji |
| --- | --- |
| Uygulama | Next.js 16, React 19, TypeScript |
| Arayüz | Tailwind CSS, Framer Motion, Lucide |
| Veri | Neon Postgres, Drizzle ORM |
| Kimlik | Clerk |
| Dosya | Vercel Blob |
| Ödeme | PayTR iFrame API |
| E-posta | Resend |
| Dağıtım | Vercel |
| Video üretimi | Remotion Studio |

## Yerel kurulum

Gereksinimler: Node.js 20+ ve npm.

```bash
git clone https://github.com/Methefor/Novella-jewell.git
cd Novella-jewell
npm install
copy .env.example .env.local
npm run dev
```

Uygulama varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde açılır.

## Ortam değişkenleri

Gerçek anahtarlar depoya eklenmez. Gerekli değişkenlerin açıklamalı listesi [`.env.example`](.env.example) dosyasındadır.

Başlıca entegrasyonlar:

- `DATABASE_URL`
- `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`
- Clerk ve Vercel Blob tarafından sağlanan kimlik bilgileri

## Komutlar

```bash
npm run dev          # Geliştirme sunucusu
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript kontrolü
npm run build        # Üretim derlemesi
npm run db:generate  # Drizzle migration üretimi
npm run db:migrate   # Migration uygulama
npm run studio       # Remotion içerik stüdyosu
```

Her değişiklik için asgari kalite kapısı:

```bash
npm run lint
npm run type-check
npm run build
```

## Proje yapısı

```text
src/app/          Next.js sayfaları, API rotaları ve yönetim alanı
src/components/   Paylaşılan arayüz bileşenleri
src/db/           Drizzle şeması ve veri erişimi
src/lib/          Katalog, ödeme, e-posta ve iş kuralları
drizzle/          Sürümlenmiş veritabanı migration'ları
studio/           Sosyal medya video üretim alanı
docs/             Mimari ve operasyon belgeleri
```

Teknik ayrıntılar için [mimari belgelerine](docs/ARCHITECTURE.md), katkı süreci için [CONTRIBUTING.md](CONTRIBUTING.md) dosyasına bakın.

## Dağıtım

Üretim ortamı Vercel üzerinden yönetilir. `main` dalındaki doğrulanmış sürümler üretime alınır; veritabanı migration'ları uygulama dağıtımından ayrı ve kontrollü biçimde çalıştırılır.

- Web: [novellajewell.com](https://novellajewell.com)
- Instagram: [@novellajewellofficial](https://www.instagram.com/novellajewellofficial/)
- Threads: [@novellajewellofficial](https://www.threads.com/@novellajewellofficial)

## Katkıda bulunanlar

Proje bakım sorumlusu: [@Methefor](https://github.com/Methefor)

Commit geçmişine katkıda bulunanların güncel listesi GitHub tarafından [Contributors](https://github.com/Methefor/Novella-jewell/graphs/contributors) sayfasında tutulur.

## Güvenlik ve lisans

Bir güvenlik açığını herkese açık issue olarak paylaşmayın; [SECURITY.md](SECURITY.md) içindeki özel bildirim sürecini kullanın.

Bu depo ticari ve özel mülkiyet niteliğindedir. Açık kaynak lisansı verilmemiştir; tüm hakları saklıdır.
