# Geliştirme, Dağıtım ve Veritabanı Çalışma Kitaplığı

Bu belge, Novella Jewell projesinde günlük geliştirme, CI/CD, dağıtım ve veritabanı göçü işlemlerinin nasıl yapılacağını özetler.

## Yerel Geliştirme Ortamı

### Kurulum

```powershell
npm install
```

### Geliştirme sunucusu

```powershell
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

### Kalite kontroller

Commit önerisi öncesi mutlaka çalıştır:

```powershell
npm run lint
npm run type-check
```

> **Not:** `package.json` içinde script adı `type-check` (tireli) olarak tanımlıdır. Eşdeğeri `npx tsc --noEmit`'dir.

### Çevre değişkenleri

Geliştirme için `.env.example` dosyasını kopyala:

```powershell
cp .env.example .env.local
```

Ardından `.env.local` içinde gerekli değerleri doldur. Gerçek anahtarlar Vercel > Settings > Environment Variables içinde de girilmelidir. `.env.local` git'e girmez.

## Veritabanı Göçleri (Drizzle)

### Şema değişikliği sonrası migration üretme

```powershell
npm run db:generate
```

Bu komut `drizzle/` klasörüne yeni `.sql` dosyası ve `meta/` anlık görüntüsü ekler. Üretilen `.sql` dosyaları depoya işlenir.

### Göçleri üretim ortamında çalıştırma

```powershell
npm run db:migrate
```

`DATABASE_URL` tanımlı olmalıdır. Production'da şema doğrudan değiştirilmez; mutlaka migration dosyası ile ilerlenir.

### Geliştirme ortamında hızlı şema itme

```powershell
npm run db:push
```

`db:push` sadeca geliştirme/test ortamında kullanılır; üretimde `db:migrate` kullanılır.

## Dağıtım (Vercel)

1. Vercel proje ayarlarında `Build Command` olarak `npm run build` kullanılır.
2. Ortam değişkenleri Vercel Dashboard > Settings > Environment Variables içinde girilir.
3. Her push, Vercel'de otomatik önizleme (Preview Deployment) oluşturur.
4. Ana dala (`main` veya `master`) push'u üretim dağıtımı tetikler.

## Commit ve PR Akışı

1. Conventional Commits formatı kullan:
   - `feat:` yeni özellik
   - `fix:` hata düzeltmesi
   - `docs:` dokümantasyon
   - `style:` stil değişikliği
   - `refactor:` refactor
   - `test:` test
   - `chore:` altyapı işleri
2. Her commit tek bir mantıksal değişiklik içersin.
3. Commit öncesi `npm run lint` ve `npm run type-check` başarılı olsun.
4. Pull request'ler küçük ve incelenebilir tutulur; uzun ömürlü branch yerine özellik bayrağı kullanımı tercih edilir.

## Stüdyo (Remotion) Videoları

`studio/` klasörü ayrı bir Remotion projesidir. Video üretimi için:

```powershell
npm run studio
```

`tsconfig.json` içinde `studio/` dışlanmıştır; ana proje build'ine karışmaz.
Render işlemleri kökten `npm run studio:render -- ...` ve
`npm run studio:still -- ...` komutlarıyla da çalıştırılabilir.

## Kontrol Listesi (Yayına Alma Öncesi)

- [x] `src/lib/legal.ts` şirket bilgileri doldurulmuş.
- [x] PayTR canlı mod ortam değişkenleri Vercel'e girilmiş.
- [x] `DATABASE_URL` tanımlı ve sipariş kayıt altyapısı hazır.
- [x] `NEXT_PUBLIC_SITE_URL` `https://novellajewell.com` olarak ayarlanmış.
- [x] Resend API anahtarı ve gönderici domain doğrulaması tamamlanmış.
- [x] Gerçek kartla PayTR ödeme, callback ve müşteri e-postası doğrulanmış.
- [ ] Başarılı ödeme sonrasında atomik stok düşümü uygulanmış ve doğrulanmış.
- [ ] Mobil ödeme ve sipariş takip akışı son kez test edilmiş.
- [ ] `NEXT_PUBLIC_GA_ID` opsiyonel; girildiyse çerez onayı akışı test edilmiş.
- [ ] `npm run lint` ve `npm run type-check` başarılı.
