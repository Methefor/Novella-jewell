# NOVELLA - Butik Taki E-Ticaret Sitesi

**"Her Parca Bir Hikaye"**

Modern, animasyonlu ve responsive e-ticaret websitesi.
Next.js 15, TypeScript, Tailwind CSS ve Framer Motion ile gelistirilmistir.

---

## Proje Ozeti

NOVELLA, Turkiye genelinde butik taki satisi yapan bir e-ticaret platformudur.
Kolye, bilezik, kupe ve yuzuk kategorilerinde kaliteli urunler sunulmaktadir.

Tasarim ilhami: [Velzck Shop](https://github.com/VelzckC0D3/Velzck_Shop)

---

## Teknoloji Stack

- **Framework:** Next.js 15 (App Router)
- **Dil:** TypeScript
- **Styling:** Tailwind CSS v3
- **Animasyon:** Framer Motion 11
- **State Management:** Zustand
- **Icons:** Lucide React
- **Fonts:** Cormorant Garamond + Inter
- **Deploy:** Vercel

---

## Ozellikler

- Dark hero section (Velzck-style parallax + scrolling text)
- Velzck-style urun kartlari (dark card, NOVELLA watermark, hover overlay, altin aksan)
- Aninda sepete ekle / favorilere ekle
- Indirim badge'leri (499 / 599)
- Collections sayfasi (filtreleme + siralama)
- Urun detay sayfasi (galeri, beden secimi, yorumlar)
- Sepet drawer (spring animasyon)
- Checkout (Shopier entegrasyonu)
- About Us bolumu (Velzck aboutUs yapisi)
- SSS + Footer (Velzck footer yapisi)
- Animasyon sistemi: stagger, parallax, spring, page transitions
- Tam responsive tasarim (mobil, tablet, desktop)

---

## Kurulum

```bash
# Bagimliliklari yukle
npm install

# Gelistirme sunucusunu baslat
npm run dev

# Production build
npm run build

# Lint
npm run lint
```

Tarayicida: http://localhost:3000

---

## Proje Yapisi

```
src/
  app/
    page.tsx                    # Ana sayfa (Velzck yapi)
    collections/                # Koleksiyonlar
    products/[slug]/            # Urun detay
    checkout/                   # Odeme
    favoriler/                  # Favoriler
    order-success/              # Siparis basarili
  components/
    product/
      ProductCard.tsx           # Velzck-style karti
      ProductDetailClient.tsx   # Urun detay
      ReviewCard/Form/List.tsx  # Yorumlar
    layout/
      Header.tsx                # Scroll-aware header
      Footer.tsx                # Dark Velzck-style footer
      AnnouncementBar.tsx       # Framer Motion marquee
      PageTransition.tsx        # Sayfa gecisi animasyonu
    sections/
      AboutUs.tsx               # Velzck aboutUs bolumu
      HeroSection.tsx           # Parallax hero
      FeaturedProducts.tsx      # One cikan urunler
    cart/
      CartDrawer.tsx            # Spring animasyonlu sepet
    search/
      SearchModal.tsx           # Arama modali
  data/
    products.ts                 # 15 urun (sabit veri)
    reviews.ts                  # Yorum verileri
  store/
    cartStore.ts                # Sepet state
    wishlistStore.ts            # Favori state
    filterStore.ts              # Filtre state
  hooks/
    useProductFilters.ts        # Filtreleme logic
    useProductSearch.ts         # Arama logic
    useToast.ts                 # Toast bildirimleri
    useScrollAnimation.ts       # Scroll trigger hook
```

---

## Tasarim Sistemi

| Renk        | Deger     | Kullanim                |
|-------------|-----------|-------------------------|
| Gold        | #C9A86A   | Ana marka, CTA, accent  |
| Dark Gold   | #D4B77F   | Hover, ikincil          |
| Cream       | #F8F6F3   | Sayfa arka plani        |
| Dark        | #1A1A1A   | Metin, karti arka plani |
| Hero Dark   | #0D0D0D   | Hero bolumu arkaplan    |

---

## Deployment (Vercel)

1. GitHub'a push et
2. Vercel'de repo'yu baglat
3. Otomatik deploy aktif

```bash
vercel --prod
```

---

**YAZAR:** Methefor
**DURUM:** Aktif Gelistirme
**LISANS:** MIT
