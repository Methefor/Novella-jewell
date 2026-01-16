# NOVELLA - Premium Jewelry E-Commerce

> **"Her Parça Bir Hikaye"** - Premium kalitede çelik takılar

## 🎯 Proje Özeti

NOVELLA, Tekirdağ merkezli premium çelik takı e-ticaret platformudur. Modern tasarım, 3D animasyonlar ve seamless alışveriş deneyimi sunar.

## ✨ Özellikler

### 🎨 Tasarım
- **Dark Premium Theme** - Reverie Jewelry benzeri lüks görünüm
- **3D Animasyonlar** - Three.js ile floating el ve ürün showcase
- **Glassmorphism** - Modern cam efekti kartlar
- **Smooth Animations** - Framer Motion ile akıcı geçişler
- **Responsive** - Tüm cihazlarda mükemmel görünüm

### 🛒 E-Ticaret
- **Sepet Sistemi** - Zustand ile hızlı state management
- **Multi-Checkout** - İyzico, Shopier, WhatsApp seçenekleri
- **Ürün Filtreleme** - Kategori, fiyat, yeni/çok satan
- **Favoriler** - Kullanıcı wishlisti
- **Arama** - Gelişmiş ürün arama

### 🚀 Performans
- **Next.js 15** - Server Components, ISR
- **Image Optimization** - Next/Image ile otomatik
- **SEO Optimized** - Meta tags, structured data
- **Lighthouse Score** - 90+ tüm metriklerde

## 📦 Tech Stack

```
Framework:     Next.js 15.1 (App Router)
Language:      TypeScript 5.7
Styling:       Tailwind CSS v4
Animations:    Framer Motion 11 + GSAP 3.12
3D:            Three.js + React Three Fiber
State:         Zustand 4.5
Forms:         React Hook Form + Zod
Icons:         Lucide React
Fonts:         Cormorant Garamond + Inter
```

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn

### Adımlar

1. **Projeyi klonla**
```bash
git clone <repo-url>
cd novella-jewelry
```

2. **Dependencies yükle**
```bash
npm install
# veya
yarn install
```

3. **Environment variables**
```bash
cp .env.example .env.local
```

`.env.local` dosyasına ekle:
```env
# İyzico (Production)
NEXT_PUBLIC_IYZICO_API_KEY=your_api_key
IYZICO_SECRET_KEY=your_secret_key

# Shopier
NEXT_PUBLIC_SHOPIER_STORE_ID=your_store_id

# Email (Newsletter)
EMAIL_SERVER=your_email_server
EMAIL_FROM=noreply@novella.com.tr
```

4. **Development server başlat**
```bash
npm run dev
# veya
yarn dev
```

http://localhost:3000 adresini tarayıcıda aç

5. **Production build**
```bash
npm run build
npm run start
```

## 📁 Proje Yapısı

```
novella-jewelry/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx             # Ana sayfa
│   │   ├── products/
│   │   │   └── page.tsx         # Ürünler sayfası
│   │   └── globals.css
│   ├── components/
│   │   ├── Hero.tsx             # 3D Hero section
│   │   ├── SteelCollection.tsx  # Çelik koleksiyon
│   │   ├── FeaturedProducts.tsx # Öne çıkan ürünler
│   │   ├── About.tsx            # Hakkımızda
│   │   ├── Newsletter.tsx       # Email toplama
│   │   ├── Header.tsx           # Navigation
│   │   ├── CartSidebar.tsx      # Sepet paneli
│   │   └── Footer.tsx
│   └── lib/
│       ├── cart.ts              # Zustand store
│       └── utils.ts             # Helper functions
├── public/
│   └── products/                # Ürün görselleri
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 🎨 Renk Paleti

```css
/* NOVELLA Colors */
--gold:       #D4AF37  /* Ana vurgu */
--gold-light: #E5C158  /* Açık altın */
--rose-gold:  #B76E79  /* İkincil vurgu */
--cream:      #FDFBF7  /* Yumuşak arka plan */
--dark-bg:    #0F0F0F  /* Ana arka plan */
```

## 📱 Sosyal Medya

- Instagram: [@jewelry.novella](https://instagram.com/jewelry.novella)
- TikTok: [@novella.tr](https://tiktok.com/@novella.tr)
- WhatsApp: +90 545 112 50 59

## 🚀 Deployment

### Vercel (Önerilen)

1. GitHub'a push
2. Vercel'e import et
3. Environment variables ekle
4. Deploy!

```bash
vercel --prod
```

### Diğer Platformlar
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 📝 Yapılacaklar

- [ ] İyzico payment entegrasyonu
- [ ] Shopier API bağlantısı
- [ ] Ürün yönetim paneli
- [ ] Admin dashboard
- [ ] Email automation (Welcome, Order confirmation)
- [ ] Google Analytics
- [ ] Instagram feed integration
- [ ] Blog sistemi
- [ ] Çoklu dil desteği (EN)

## 🐛 Bilinen Sorunlar

Şu anda bilinen kritik sorun yok.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje NOVELLA tarafından geliştirilmiştir. Tüm hakları saklıdır.

## 📧 İletişim

- Website: [novella-tek.vercel.app](https://novella-tek.vercel.app)
- Email: info@novella.com.tr
- Instagram: [@jewelry.novella](https://instagram.com/jewelry.novella)

---

**NOVELLA** - *Her Parça Bir Hikaye* ✨
