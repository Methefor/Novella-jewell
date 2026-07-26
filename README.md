# NOVELLA — Kararmayan Çelik, Eskimeyen Zarafet

316L cerrahi çelikten üretilen takılar satan Türkçe e-ticaret sitesi.
Next.js 16 (App Router), TypeScript, Tailwind CSS ve Framer Motion ile geliştirildi.

- **Canlı site:** https://novellajewell.com
- **Instagram:** [@jewelry.novella](https://www.instagram.com/jewelry.novella/)

---

## Hızlı Başlangıç

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # üretim derlemesi
npm run type-check   # TypeScript kontrolü
```

---

## Teknoloji

| Katman | Seçim |
|---|---|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Stil | Tailwind CSS v3 |
| Animasyon | Framer Motion 11 |
| Durum yönetimi | Zustand (sepet, favoriler) |
| İkonlar | Lucide React |
| Yazı tipleri | Cormorant Garamond (başlık) + Inter (metin) |
| Ödeme | PayTR iFrame API |
| Veritabanı | PostgreSQL + Drizzle ORM |
| E-posta | Resend |
| Deploy | Vercel |

---

## ⚠️ Görsel Eklerken Dikkat — En Önemli Kural

**Tüm görseller `public/media/` klasörüne konur. `public/products/` KULLANILMAZ.**

Sebebi: `next.config.ts` içinde eski SEO adreslerini yeni adreslere taşıyan
bir yönlendirme var:

```ts
{ source: '/products/:slug', destination: '/urun/:slug', permanent: true }
```

Next.js'te yönlendirmeler dosya sisteminden **önce** çalışır. Yani
`public/products/foto.jpg` koyarsan, tarayıcı `/products/foto.jpg` adresini
istediğinde Next.js onu `/urun/foto.jpg` adresine yönlendirir ve görsel
**404 olur**. Görsel bozulmaz — hiç yüklenmez.

Bu tuzak daha önce hero görselini ve arka plan desenini sessizce öldürmüştü.
Bu yüzden görsel klasörü `public/media/` olarak taşındı ve `/products/` artık
sadece bir yönlendirme adresi — orada dosya tutulmaz.

### Görsel ekleme adımları

```
public/media/
├── bileklik/     bileklik-1.jpg, bileklik-2.jpg …
├── kupe/         kupe-1.jpg …
├── yuzuk/        yuzuk-1.jpg …
└── kolye/        kolye-1.jpg …   ← şu an EKSİK, eklenmeli
```

1. Görseli ilgili klasöre koy (kare veya 4:5 dikey en iyi sonucu verir).
2. `src/data/products.ts` içinde ürünün `variants[].images` dizisine yolu yaz:
   ```ts
   images: ['/media/kolye/kolye-1.jpg', '/media/kolye/kolye-1b.jpg']
   ```
   İki görsel verirsen ikincisi kartta **hover'da** gösterilir.
3. Görsel gelene kadar kart `img-slot` sınıfıyla zarif altın dokulu bir yuva
   gösterir — boş/bozuk değil, kasıtlı görünür.

### Hero görseli — bilek fotoğrafı şartnamesi

Hero, görseli aşağıdan yukarı yükselten ve kenarlarını zemine eriten bir
kompozisyon kullanır. Hedeflenen tasarım: **naif bir kadın bileği, üzerinde
bizim bilekliğimiz.**

Fotoğraf çekilince `src/sections/Hero.tsx` içindeki **tek satır** değişir:

```ts
const HERO_WRIST: string | null = '/media/hero-wrist.jpg';
```

Şu an yerine gerçek bir ürün çekimi (`bileklik-5`, ipek üzerinde çapraz)
kullanılıyor — kenarları eridiği için hero olarak iyi duruyor.

**Fotoğraf şartnamesi** (buna uyarsa tasarım birebir oturur):

| Konu | Gereklilik |
|---|---|
| Oran | **Dikey** 3:4 veya 2:3 (örn. 1200×1600). Yatay çekme. |
| Kompozisyon | Kol aşağıdan yukarı, hafif çapraz. Bilek karenin **üst yarısında**; alt kısım boş kalsın, oraya ışık karışacak. |
| Arka plan | Sade ve **açık**: krem/bej duvar. Koyu veya kalabalık zemin tasarımı bozar. |
| Işık | Pencereden yumuşak yan ışık. **Flaş kullanma.** |
| Odak | Bileklik net, arka plan hafif bulanık. |
| Kadraj | El bileği + önkolun yarısı. Yüz girmesin. |
| Renk | Ten tonu doğal kalsın, aşırı filtre uygulama. |

> ⚠️ **Fotoğraftaki bileklik sattığın ürünün ta kendisi olmalı.** Yapay zekâyla
> üretilmiş veya başka bir bileklik göstermek yanıltıcı ticari uygulamadır —
> sitedeki diğer vaatleri bu yüzden temizledik, hero'da geri gelmemeli.

Telefon kamerası + pencere ışığı bu iş için yeterlidir; stüdyo gerekmez.

### Bilinen eksik

`kolye` kategorisindeki 4 ürünün görselleri yok (`public/media/kolye/` klasörü
henüz oluşturulmadı). Bu ürünler şu an altın dokulu yuva gösteriyor.

---

## Marka Kimliği ve Pomelli

Pomelli gibi siteyi tarayıp marka kimliği çıkaran araçlar baskın rengi
otomatik okur. Site tamamen beyaz olursa marka rengi "beyaz/gri" çıkar ve
üretilen içerik sönük olur. Bu yüzden palet **sıcak şampanya + altın** olarak
kuruldu ve renk sinyalleri üç yerde birbiriyle **tutarlı** tutuldu:

| Sinyal | Yer | Değer |
|---|---|---|
| `theme-color` meta | `src/app/layout.tsx` (`viewport`) | `#B8A574` |
| PWA manifest | `public/site.webmanifest` | `#B8A574` |
| CSS değişkeni | `src/app/globals.css` (`--color-gold`) | `#B8A574` |

> Not: `site.webmanifest` eskiden `#D4AF37` (farklı bir altın) kullanıyordu.
> Bu tutarsızlık, tarayan aracın marka rengini şaşırmasına yol açıyordu; düzeltildi.
> **Altın tonunu değiştirirsen üç yeri birden güncelle.**

### Palet

| Token | Hex | Kullanım |
|---|---|---|
| `--color-bg` / `bg-cream` | `#FAF8F5` | Sayfa zemini (sıcak krem) |
| `--color-surface` / `bg-cream-deep` | `#F2EDE4` | Bölüm zemini (şampanya) |
| `--color-surface-deep` | `#EAE1D1` | Derin şampanya |
| `--color-border` | `#E8E0D2` | Kenarlıklar |
| `--color-gold` | `#B8A574` | **Marka aksanı** |
| `--color-gold-dark` | `#9E8E63` | Altın metin (kontrast için) |
| `--color-text` | `#0A0A0A` | Metin |

### Hazır sınıflar (`globals.css`)

| Sınıf | İşi |
|---|---|
| `.bg-champagne` | Marka gradyanı (krem → altın) |
| `.texture-gold` | Yumuşak altın ışık dokusu (saf CSS) |
| `.texture-lines` | İnce altın çizgi dokusu |
| `.img-slot` | Görsel yuvası — foto yokken zarif durur |
| `.rule-gold` | Altın alt çizgi |

Bu dokuların hiçbiri görsel dosyasına bağlı değil, saf CSS. Bu yüzden bir asset
eksik olsa bile tasarım kırılmaz.

---

## URL Mimarisi

Site iki ayrı listeleme mantığı kullanır — karıştırma:

| Adres | Ne yapar | Dosya |
|---|---|---|
| `/koleksiyonlar` | Hikaye koleksiyonları dizini | `src/app/koleksiyonlar/page.tsx` |
| `/koleksiyonlar/[slug]` | Şehir koleksiyonu (barcelona, stockholm, paris, klasikler) | `src/app/koleksiyonlar/[slug]/` |
| `/collections/[category]` | Kategori/vitrin (yeni-gelenler, cok-satanlar, kolye, bilezik, kupe, yuzuk) | `src/app/collections/[category]/` |
| `/urun/[slug]` | Ürün detayı | `src/app/urun/[slug]/` |
| `/hikayemiz` | Marka hikayesi | `src/app/hikayemiz/` |
| `/sepet`, `/odeme`, `/favoriler` | Sepet, ödeme, favoriler | — |

### Yönlendirmeler (`next.config.ts`)

| Eski | Yeni |
|---|---|
| `/hakkimizda` | `/hikayemiz` |
| `/wishlist` | `/favoriler` |
| `/collections` | `/koleksiyonlar` |
| `/collections/(barcelona\|stockholm\|paris\|klasikler)` | `/koleksiyonlar/:slug` |
| `/products/:slug` | `/urun/:slug` |

> **Önemli:** `/collections/:slug` yönlendirmesi bilerek yalnızca 4 gerçek
> koleksiyon slug'ıyla eşleşir. Genel `:slug` yapılırsa `/collections/yeni-gelenler`
> gibi kategori sayfaları `/koleksiyonlar/yeni-gelenler`'e yönlenip **404 olur**.
> Yeni bir koleksiyon eklersen slug'ı bu listeye de ekle.

---

## Proje Yapısı

```
src/
├── app/
│   ├── layout.tsx              Kök layout, SEO metadata, theme-color, JSON-LD
│   ├── page.tsx                Anasayfa (hero + yeni gelenler + çok satanlar
│   │                           + hikaye bölümü + değer şeridi)
│   ├── globals.css             Tasarım token'ları + marka sınıfları
│   ├── hikayemiz/              Marka hikayesi sayfası
│   ├── koleksiyonlar/          Koleksiyon dizini + [slug]
│   ├── collections/[category]/ Kategori/vitrin sayfaları
│   ├── urun/[slug]/            Ürün detayı (+ dinamik OG görseli)
│   ├── sepet/ odeme/ favoriler/
│   ├── api/checkout/           PayTR ödeme başlatma
│   ├── api/odeme/callback/     PayTR bildirim/callback işleyicisi
│   ├── api/siparis-durum/      Sipariş takip sorgusu
│   ├── sitemap.ts robots.ts    SEO
│   └── error.tsx               Hata sınırı
├── sections/Hero.tsx           Hero (HERO_IMAGE anahtarı burada)
├── components/                 layout, product, cart, collections, filters, common
├── data/
│   ├── products.ts             Ürün kataloğu — tek kaynak
│   ├── collections.ts          4 koleksiyon + hikayeleri
│   └── reviews.ts
├── store/                      Zustand (sepet, favoriler)
├── lib/config.ts               SITE sabitleri (url, whatsapp, instagram)
└── types/product.ts            Tip tanımları
```

---

## Veri Modeli

`src/data/products.ts` ürün kataloğunun tek kaynağıdır.

```ts
{
  id: 'kolye-1',
  name: 'Paris Glow Altın Kolye',
  slug: 'paris-glow-altin-kolye',   // URL: /urun/paris-glow-altin-kolye
  category: 'kolye',                 // kolye | bilezik | kupe | yuzuk
  collection: 'paris',               // barcelona | stockholm | paris | klasikler
  story: 'Fransız zarafeti tek zincirde.',   // mikro hikaye
  price: 549,
  variants: [{ id: 'v1', color: 'altin', stock: 15, images: ['/media/…'] }],
  isNew: true, isBestSeller: true,   // vitrin sayfalarını besler
}
```

- `isNew: true` → `/collections/yeni-gelenler` sayfasında çıkar (şu an 43 ürün)
- `isBestSeller: true` → `/collections/cok-satanlar` sayfasında çıkar (43 ürün)
- `collection` → ilgili şehir koleksiyonunda çıkar

---

## SEO

- Sayfa bazlı `metadata` + canonical adresler (`src/lib/config.ts` → `SITE.url`)
- JSON-LD: `Organization` + `Brand` (kök), `AboutPage` (hikayemiz), koleksiyon breadcrumb
- Dinamik OG görselleri: `src/app/opengraph-image.tsx` ve `urun/[slug]/opengraph-image.tsx`
- `sitemap.ts` yalnızca **200 dönen** sayfaları listeler — yönlendirilen veya
  var olmayan adresler Search Console'da hata ürettiği için eklenmez.

Üretim domaini `novellajewell.com` olarak yapılandırılmıştır. Canonical, OG,
sitemap ve JSON-LD adresleri `SITE.url` üzerinden aynı kaynağı kullanır.

---

## Ortam Değişkenleri

```bash
NEXT_PUBLIC_SITE_URL=https://novellajewell.com
DATABASE_URL=…
CHECKOUT_PROVIDER=paytr
PAYTR_MERCHANT_ID=…
PAYTR_MERCHANT_KEY=…
PAYTR_MERCHANT_SALT=…
PAYTR_TEST_MODE=0
RESEND_API_KEY=…
RESEND_FROM_EMAIL="NOVELLA <siparis@novellajewell.com>"
RESEND_REPLY_TO=novella.jewellery.tr@gmail.com
```

Gerçek değerler yalnızca yerel `.env.local` ve Vercel ortam değişkenlerinde
tutulur; repoya anahtar veya bağlantı bilgisi eklenmez.

---

## Kargo Kuralları

`src/lib/config.ts` içinde: 500 ₺ üzeri kargo ücretsiz, altında 49,90 ₺.

---

## Yasal Sayfalar

Türkiye'de online satış için zorunlu 8 sayfa hazır:

| Sayfa | Adres |
|---|---|
| Mesafeli Satış Sözleşmesi | `/mesafeli-satis-sozlesmesi` (noindex) |
| Ön Bilgilendirme Formu | `/on-bilgilendirme` (noindex) |
| Gizlilik Politikası | `/gizlilik` |
| KVKK Aydınlatma Metni | `/kvkk` |
| Çerez Politikası | `/cerez-politikasi` |
| İade & Cayma Hakkı | `/iade` |
| Kargo & Teslimat | `/kargo` |
| İletişim + künye | `/iletisim` |

### Şirket bilgileri

Şirket bilgileri **tek yerden** okunur: [`src/lib/legal.ts`](src/lib/legal.ts).
Ticaret unvanı, adres, vergi dairesi/no ve iletişim bilgileri burada
doldurulmuştur. Değişiklik gerektiğinde bu tek kaynak güncellenir ve 8 yasal
sayfaya otomatik yansır.

### Sözleşme onayı

Ödeme sayfasında iki zorunlu checkbox var (Mesafeli Sözleşmeler Yönetmeliği
m.6). Onay **hem client hem sunucu** tarafında şart koşulur — `/api/checkout`
`consent.sozlesme` ve `consent.kvkk` olmadan 400 döner. Onay olmadan sözleşme
hukuken kurulmamış sayılır ve müşteri süresiz cayabilir.

### Çerez onayı

`CookieBanner` + `src/lib/cookies.ts`. Google Analytics **yalnızca** onay
verilirse yüklenir — script pasif kalmaz, sayfaya hiç eklenmez. Onaysız GA
çalıştırmak KVKK ihlalidir.

---

## Güvenlik Kuralları

### Fiyat asla client'tan alınmaz

`/api/checkout` client'tan **yalnızca** `productId + variantId + quantity`
kabul eder. Fiyat, kargo ve toplam [`src/lib/checkout/buildOrder.ts`](src/lib/checkout/buildOrder.ts)
içinde `PRODUCTS`'tan **sunucuda** yeniden hesaplanır.

> Eskiden client `total` gönderiyordu ve sunucu onu doğrudan imzalıyordu.
> Yani `{"total": 1}` POST eden biri 12.000 ₺'lik sepeti 1 ₺'ye alabiliyordu
> ve imza geçerli oluyordu. Bu API'ye fiyat alanı **geri eklenmemeli**.

### `NEXT_PUBLIC_` öneki ve secret

`NEXT_PUBLIC_` ile başlayan her değişken client bundle'ına gömülür ve
**herkese açık** olur. PayTR anahtarları bu yüzden öneksizdir
(`PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT`). Anahtarlara `NEXT_PUBLIC_`
ekleme.

`.env.local` git'te takip **edilmez**. Gerçek anahtarlar yalnızca
Vercel > Settings > Environment Variables içine girilir.

---

## Satışa Hazırlık Durumu

### Tamamlananlar

- [x] Şirket ve yasal sayfa bilgileri
- [x] `novellajewell.com` domaini, canonical/OG/sitemap yapılandırması
- [x] PayTR canlı mod ortam değişkenleri ve ödeme iframe akışı
- [x] Siparişin ödeme öncesi PostgreSQL veritabanına `pending` kaydedilmesi
- [x] PayTR callback imza doğrulaması ve siparişin `paid`/`failed` güncellenmesi
- [x] Resend API yapılandırması ve `novellajewell.com` gönderici domain doğrulaması
- [x] Mobil ve masaüstü checkout çift gönderim hatasının düzeltilmesi
- [x] PayTR test kartıyla uçtan uca entegrasyon testi (`NJ-2026-0001`, 98,90 TL)
- [x] Test işleminde `pending → paid` sipariş kaydı ve callback sonucunun doğrulanması
- [x] Test işleminde gerçek müşteri adresine sipariş onay e-postasının ulaştığının doğrulanması
- [x] PayTR Bildirim URL’sinin kalıcı domaine taşınması

### Satış açılmadan önce doğrulanacaklar

- [ ] PayTR mağazasının canlı moda alınması
- [ ] Gerçek kartla düşük tutarlı canlı ödeme ve iade testi
- [ ] Başarılı callback sonrasında sunucu tarafında atomik stok düşümü
- [ ] Mobil cihazlarda son ödeme ve sipariş takip testi
- [ ] Hazırlanıyor, kargoya verildi, teslim edildi, iptal ve iade durumlarını yöneten admin ekranı

### Ürün ve büyüme çalışmaları

- [ ] `public/media/kolye/` görsellerini ekle (4 ürün bekliyor)
- [ ] Ürün fotoğrafı, ad, fiyat ve açıklama girişini toplu iş akışına dönüştür
- [ ] Premium UI/motion tasarım geçişi
- [ ] Google Search Console doğrulaması ve ölçümleme ayarları
- [ ] Gerçek müşteri yorum sistemi
