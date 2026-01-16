# Vercel Deployment Kılavuzu

## 🚀 Hızlı Deploy

### 1. GitHub Repo'yu Vercel'e Bağla

1. [Vercel Dashboard](https://vercel.com/dashboard) aç
2. "Add New Project" tıkla
3. GitHub repo'yu seç: `Methefor/Novella-bestsite`
4. "Import" tıkla

### 2. Build Ayarları

Vercel otomatik olarak Next.js projesini algılar. Ayarlar:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (root)
- **Build Command:** `npm run build` (otomatik)
- **Output Directory:** `.next` (otomatik)
- **Install Command:** `npm install` (otomatik)

### 3. Environment Variables

Vercel dashboard'da **Settings > Environment Variables** bölümüne git ve şunları ekle:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# NextAuth (Admin Panel)
NEXTAUTH_SECRET=your-random-secret-key-min-32-chars
NEXTAUTH_URL=https://your-domain.vercel.app
ADMIN_EMAIL=admin@novella.com.tr
ADMIN_PASSWORD=your-secure-password

# Shopier Payment
NEXT_PUBLIC_SHOPIER_STORE_ID=your_shopier_store_id

# İyzico (Opsiyonel)
NEXT_PUBLIC_IYZICO_API_KEY=your_iyzico_api_key
IYZICO_SECRET_KEY=your_iyzico_secret_key

# Site URL (SEO için)
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 4. Deploy

1. "Deploy" butonuna tıkla
2. Build tamamlanana kadar bekle (2-3 dakika)
3. Deploy başarılı olunca URL'yi al

### 5. Domain Ayarlama (Opsiyonel)

1. **Settings > Domains** bölümüne git
2. Custom domain ekle
3. DNS ayarlarını yap

## 📋 Pre-Deploy Checklist

- [ ] Environment variables eklendi
- [ ] Sanity CMS kuruldu ve ürünler eklendi
- [ ] `NEXTAUTH_SECRET` güçlü bir key (32+ karakter)
- [ ] `ADMIN_PASSWORD` güçlü bir şifre
- [ ] Test build yapıldı (`npm run build`)
- [ ] Linter hataları yok (`npm run lint`)

## 🔧 Build Sorunları

### Build Hatası Alırsanız

1. **TypeScript Errors:**
   ```bash
   npm run build
   ```
   Hataları düzelt

2. **Environment Variables Missing:**
   - Vercel dashboard'da kontrol et
   - Tüm gerekli değişkenler eklendi mi?

3. **Sanity Connection:**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` doğru mu?
   - Sanity projesi aktif mi?

## 🎯 Post-Deploy

### İlk Yapılacaklar

1. **Admin Panel Test:**
   - `/admin/login` sayfasına git
   - Giriş yap
   - Dashboard'u kontrol et

2. **Ürün Sayfaları:**
   - `/products` sayfasını kontrol et
   - Sanity'den ürünler geliyor mu?

3. **Checkout Test:**
   - Sepete ürün ekle
   - Checkout sayfasını test et

4. **SEO Kontrol:**
   - `https://your-domain.vercel.app/sitemap.xml`
   - `https://your-domain.vercel.app/robots.txt`

## 🔄 Continuous Deployment

Vercel otomatik olarak:
- Her `main` branch push'unda deploy yapar
- Preview deployment'lar oluşturur (PR'lar için)
- Build logları gösterir

## 📊 Monitoring

- **Analytics:** Vercel Analytics (ücretsiz)
- **Logs:** Vercel Dashboard > Deployments > Logs
- **Performance:** Vercel Speed Insights

## 🆘 Sorun Giderme

### Build Başarısız

1. Local'de test et: `npm run build`
2. Logları kontrol et: Vercel Dashboard > Deployments
3. Environment variables kontrol et

### Site Çalışmıyor

1. Environment variables eksik olabilir
2. Sanity connection hatası olabilir
3. NextAuth secret eksik olabilir

### Admin Panel Açılmıyor

1. `NEXTAUTH_SECRET` kontrol et
2. `NEXTAUTH_URL` doğru mu?
3. `ADMIN_EMAIL` ve `ADMIN_PASSWORD` doğru mu?

---

**Deploy URL:** https://your-project.vercel.app  
**Admin Panel:** https://your-project.vercel.app/admin/login
