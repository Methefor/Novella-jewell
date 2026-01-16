# 🚀 NOVELLA - Kurulum Talimatları

## ⚡ HIZLI BAŞLANGIÇ

### 1️⃣ Projeyi Bilgisayarına İndir

Bu klasörün içeriğini şuraya kopyala:
```
C:\Users\methe\novella-jewelry\
```

### 2️⃣ Terminal Aç

Windows PowerShell veya Command Prompt:
```bash
cd C:\Users\methe\novella-jewelry
```

### 3️⃣ Paketleri Yükle

```bash
npm install
```

⏱️ Bu işlem 2-3 dakika sürebilir.

### 4️⃣ Development Server Başlat

```bash
npm run dev
```

### 5️⃣ Tarayıcıda Aç

http://localhost:3000

---

## 📁 KLASÖR YAPISI

Projen şöyle görünmeli:

```
novella-jewelry/
├── src/
│   ├── app/
│   │   ├── layout.tsx       ✅ Root layout
│   │   ├── page.tsx         ✅ Ana sayfa
│   │   └── globals.css      ✅ Global styles
│   ├── components/
│   │   ├── Hero.tsx         ✅ 3D Hero section
│   │   ├── Header.tsx       ✅ Navigation
│   │   ├── SteelCollection.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── About.tsx
│   │   ├── Newsletter.tsx
│   │   ├── CartSidebar.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── cart.ts          ✅ Zustand store
│       └── utils.ts         ✅ Helpers
├── public/                  📁 Ürün fotoğrafları buraya
├── package.json            ✅
├── tsconfig.json           ✅
├── tailwind.config.ts      ✅
├── next.config.js          ✅
└── README.md               ✅
```

---

## 🎨 ÜRÜN FOTOĞRAFLARI EKLEME

### Adım 1: public/products Klasörü Oluştur

```bash
mkdir public\products
```

### Adım 2: Fotoğrafları Kopyala

Fotoğraflarını şuraya kopyala:
```
public/products/steel-necklace-1.jpg
public/products/steel-bracelet-1.jpg
public/products/steel-earring-1.jpg
...
```

### Adım 3: Component'lerde Kullan

Fotoğraflar otomatik olarak yüklenecek!

---

## 🐛 SORUN GİDERME

### Hata: "Module not found"

```bash
# Temiz kurulum
rm -rf node_modules package-lock.json
npm install
```

### Hata: "Port 3000 is already in use"

```bash
# Farklı port kullan
npm run dev -- -p 3001
```

### Hata: TypeScript hatası

```bash
# TypeScript cache temizle
rm -rf .next
npm run dev
```

---

## 🚀 PRODUCTION BUILD

Canlıya almadan önce test et:

```bash
npm run build
npm run start
```

---

## 📦 DEPLOY (VERCEL)

### 1. GitHub'a Yükle

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/novella-jewelry.git
git push -u origin main
```

### 2. Vercel'e Deploy

https://vercel.com adresine git:
1. "New Project" tıkla
2. GitHub repo'yu seç
3. Deploy!

---

## 💳 İYZİCO ENTEGRASYONU

### Environment Variables

`.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_IYZICO_API_KEY=your_sandbox_key
IYZICO_SECRET_KEY=your_sandbox_secret

# Production'da:
NEXT_PUBLIC_IYZICO_API_KEY=your_production_key
IYZICO_SECRET_KEY=your_production_secret
```

### Test Kartları

Sandbox'ta test için:
- **Başarılı:** 5890040000000016
- **Başarısız:** 5526080000000006

---

## 📞 YARDIM

Sorun mu var? 

1. README.md'yi oku
2. Terminal'deki hata mesajını kopyala
3. Bana yaz!

---

**NOVELLA** - Her Parça Bir Hikaye ✨
