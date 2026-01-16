# NOVELLA - Kurulum ve Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### 1. Environment Variables

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# NextAuth (Admin Panel)
NEXTAUTH_SECRET=your-random-secret-key-here
ADMIN_EMAIL=admin@novella.com.tr
ADMIN_PASSWORD=your-secure-password

# Shopier Payment
NEXT_PUBLIC_SHOPIER_STORE_ID=your_shopier_store_id

# İyzico (Opsiyonel)
NEXT_PUBLIC_IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key
```

### 2. Sanity CMS Kurulumu

```bash
# Sanity CLI kurulumu
npm install -g @sanity/cli

# Sanity projesi oluştur
npx sanity init

# Proje ID ve Dataset'i .env.local'e ekleyin
```

**Schema Oluşturma:**
- `sanity-schema.md` dosyasındaki schema tanımlarını Sanity Studio'ya ekleyin
- Product ve Category schema'larını oluşturun
- Test ürünleri ekleyin

### 3. Projeyi Çalıştırma

```bash
# Dependencies yükle
npm install

# Development server
npm run dev

# Production build
npm run build
npm run start
```

## 📋 Tamamlanan Özellikler

### ✅ Frontend
- [x] Ana sayfa (Hero, Koleksiyonlar, Öne Çıkanlar)
- [x] Ürün listeleme sayfası (`/products`)
- [x] Ürün detay sayfası (`/products/[slug]`)
- [x] Sepet sistemi (Zustand)
- [x] Checkout sayfası (`/checkout`)
- [x] Responsive tasarım
- [x] SEO optimizasyonu

### ✅ Ödeme Sistemleri
- [x] Shopier entegrasyonu (hazır, API key gerekli)
- [x] WhatsApp sipariş sistemi (0545 112 50 59)
- [x] İyzico entegrasyonu (placeholder, API key gerekli)

### ✅ İletişim
- [x] WhatsApp Business butonu (sağ alt köşe)
- [x] Instagram DM butonu (sağ alt köşe)
- [x] Telefon: 0545 112 50 59

### ✅ Admin Panel
- [x] NextAuth.js authentication
- [x] Admin login sayfası (`/admin/login`)
- [x] Dashboard (`/admin`)
- [x] Ürün yönetimi (`/admin/products`)
- [x] Sipariş yönetimi (`/admin/orders`)
- [x] Sidebar navigation

## 🔐 Admin Panel Kullanımı

### Giriş Bilgileri
- **URL:** `/admin/login`
- **Email:** `.env.local` dosyasındaki `ADMIN_EMAIL`
- **Şifre:** `.env.local` dosyasındaki `ADMIN_PASSWORD`

### Özellikler
- Dashboard istatistikleri
- Ürün ekleme/düzenleme/silme
- Sipariş görüntüleme
- Sanity Studio entegrasyonu

## 💳 Ödeme Entegrasyonları

### Shopier
1. Shopier hesabı oluşturun
2. Store ID'yi alın
3. `.env.local` dosyasına `NEXT_PUBLIC_SHOPIER_STORE_ID` ekleyin
4. Production'da hash generation implementasyonu gerekli

### WhatsApp Sipariş
- Otomatik çalışıyor
- Sipariş bilgileri WhatsApp mesajı olarak gönderilir
- Telefon: 0545 112 50 59

## 📱 İletişim Butonları

### WhatsApp
- Sağ alt köşede sabit buton
- Tıklanınca direkt WhatsApp'a yönlendirir
- Mesaj formatı: Sipariş bilgileri otomatik doldurulur

### Instagram
- Sağ alt köşede sabit buton
- Instagram profil sayfasına yönlendirir
- Kullanıcı adı: `@jewelry.novella`

## 🛠️ Geliştirme Notları

### Sanity CMS
- Ürünler Sanity'den çekiliyor
- Görseller Sanity asset management kullanıyor
- Schema tanımları `sanity-schema.md` dosyasında

### Cart Store
- Tek bir store: `src/lib/cart.ts`
- LocalStorage'da persist ediliyor
- Type-safe (TypeScript)

### Admin Panel
- NextAuth.js ile korumalı
- Server-side authentication
- JWT session management

## 🚨 Önemli Notlar

1. **Production'da:**
   - `NEXTAUTH_SECRET` güçlü bir key olmalı
   - `ADMIN_PASSWORD` güçlü bir şifre olmalı
   - HTTPS kullanılmalı
   - Environment variables güvenli tutulmalı

2. **Shopier Hash:**
   - Production'da Shopier hash generation implementasyonu gerekli
   - Şu anda placeholder URL döndürüyor

3. **Sanity CMS:**
   - Ürün eklemek için Sanity Studio kullanılmalı
   - Admin panel'den sadece görüntüleme yapılıyor

4. **Sipariş Yönetimi:**
   - Şu anda database yok
   - Siparişler kaydedilmiyor (TODO)
   - WhatsApp siparişleri manuel takip edilmeli

## 📝 Yapılacaklar (Gelecek Geliştirmeler)

- [ ] Database entegrasyonu (Prisma + PostgreSQL veya Sanity)
- [ ] Sipariş kayıt sistemi
- [ ] Email bildirimleri (sipariş onayı, kargo bilgisi)
- [ ] Shopier hash generation (production)
- [ ] İyzico tam entegrasyonu
- [ ] Admin panel'den ürün ekleme (Sanity API)
- [ ] Stok takibi
- [ ] Kargo entegrasyonu
- [ ] Analytics (Google Analytics)

## 🆘 Sorun Giderme

### Sanity'den veri gelmiyor
- `.env.local` dosyasında `NEXT_PUBLIC_SANITY_PROJECT_ID` kontrol edin
- Sanity Studio'da ürünlerin ekli olduğundan emin olun
- Network tab'ında API isteklerini kontrol edin

### Admin panel'e giriş yapamıyorum
- `.env.local` dosyasında `ADMIN_EMAIL` ve `ADMIN_PASSWORD` kontrol edin
- `NEXTAUTH_SECRET` tanımlı olmalı
- Browser console'da hata mesajlarını kontrol edin

### Ödeme butonları çalışmıyor
- Shopier için `NEXT_PUBLIC_SHOPIER_STORE_ID` kontrol edin
- WhatsApp numarası doğru mu kontrol edin (0545 112 50 59)
- Browser console'da JavaScript hatalarını kontrol edin

## 📞 Destek

- **WhatsApp:** 0545 112 50 59
- **Instagram:** @jewelry.novella
- **Email:** info@novella.com.tr

---

**Son Güncelleme:** 2025-01-27

