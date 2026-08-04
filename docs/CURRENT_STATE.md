# Novella Jewell — Mevcut Durum

Son doğrulama: 4 Ağustos 2026
Kaynak: `main` branch'indeki `073e5f9ba59e72c2b249d55f1ca207639c6387cc` commit'i, mevcut çalışma ağacı, production build ve canlı HTTP kontrolleri.

## Tamamlananlar

- Next.js 16, React 19 ve TypeScript tabanlı mağaza uygulaması production build alıyor.
- Ürün kataloğu Neon Postgres `catalog_products` tablosunu kullanıyor; veritabanı yoksa `src/data/products.ts` statik kataloğuna geri dönüyor. Yayından kaldırılmış dinamik kayıtlar statik ürünü de bastırıyor (`src/lib/catalog.ts`).
- Ürün oluşturma, düzenleme, toplu ekleme, yayın durumu, geri alınabilir silme, görsel yükleme, görsel sıralama ve reklam hazırlık kontrolleri için admin ekranları mevcut.
- Ürün görselleri yetkili admin rotası üzerinden Vercel Blob'a JPEG, PNG veya WebP olarak yükleniyor; dosya başına sınır 4 MB (`src/app/api/admin/products/upload/route.ts`).
- Mükerrer ürün merkezi ad ve tarayıcı tarafı görsel benzerliğiyle olası eşleşmeleri listeliyor (`src/app/admin/mukerrer-urunler`).
- Sepet fiyatı, kargo ve toplam client verisine güvenilmeden sunucuda katalogdan hesaplanıyor (`src/lib/checkout/buildOrder.ts`).
- Aktif ve tek ödeme sağlayıcısı PayTR iFrame API. Callback imzası HMAC-SHA256 ve sabit zamanlı karşılaştırmayla doğrulanıyor (`src/lib/checkout/paytr.ts`).
- Başarılı ödeme yalnızca doğrulanmış callback sonrasında `paid` durumuna geçiriliyor; stok düşümü koşullu ve işlem içinde yapılıyor (`src/lib/orders.ts`).
- Sipariş operasyonunda yalnızca izin verilen durum geçişleri kullanılabiliyor. Kargoya geçişte taşıyıcı ve takip numarası zorunlu (`src/lib/order-status.ts`, `src/app/admin/actions.ts`).
- PayTR tam iade çağrısı, tekrar çalışmayı önleyen durum kilidi ve stok iadesi uygulanmış (`src/app/admin/actions.ts`).
- Admin erişimi Clerk oturumu ile, yalnızca kodda tanımlı ve doğrulanmış tek e-posta adresine veriliyor (`src/lib/admin-auth.ts`).
- Google Analytics, Meta Pixel ve birinci taraf analitik açık çerez onayından sonra çalışıyor. Meta `ViewContent`, `AddToCart`, `InitiateCheckout` ve doğrulanmış ödeme sonrası `Purchase` olayları kodda mevcut.
- `robots.txt`, dinamik `sitemap.xml`, sayfa metadata'ları, Organization/Product yapılandırılmış verileri ve dinamik ürün URL'leri uygulanmış.
- `www.novellajewell.com` 308 ile kök domaine yönlendiriliyor (`src/proxy.ts`).
- Kampanya panosu, medya inceleme/onay durumları, Instagram/Threads metinleri, tarih-saat ve içerik takvimi uygulanmış. Sistem sosyal ağlarda otomatik paylaşım yapmıyor; kayıtlar iç planlama ve taslak niteliğinde.
- Remotion tabanlı Story, Feed ve Square video kompozisyonları ile yalnızca `127.0.0.1:4317` üzerinde çalışan yerel render köprüsü mevcut. Oluşan MP4 dosyaları ayrıca admin üzerinden kampanya medya kütüphanesine yükleniyor.
- Pomelli admin rotası eski bağlantıları kırmamak için `/admin/icerik-uret` sayfasına yönlendiriliyor (`src/app/admin/pomelli/page.tsx`).
- Vercel production projesi `novella-jewell`; `novellajewell.com` doğrulama anında `Ready` durumundaki `dpl_G1atDX7FNeXs5SyF4cy4u4opW7uC` deployment'ına bağlıydı.
- Resend panelinde `novellajewell.com` domaini `verified`; gerçek gönderici `NOVELLA <siparis@novellajewell.com>` ile oluşturulan sipariş e-postası `delivered` durumunda doğrulandı.
- PayTR panelinde entegrasyon, test işlem, Bildirim URL ve güvenli kimlik doğrulama aşamaları tamamlandı. Canlı moda geçiş talebi PayTR teknik ekibine iletildi; mağaza inceleme tamamlanana kadar test modundadır.

## Açık sorunlar

1. Depoda otomatik birim, entegrasyon veya uçtan uca test dosyası bulunmuyor. `package.json` içinde test komutu yok.
2. Build dış Google Fonts erişimine bağımlı; ağ erişimi olmayan ilk denemede font indirme adımı başarısız olmuştu.
3. `caniuse-lite` verisi build sırasında eski veri uyarısı veriyor.

## Satış engelleri

Aşağıdakiler kod veya bu oturumdaki testlerle doğrulanamadığı için satış açılışı tamamlanmış kabul edilemez:

- PayTR merchant entegrasyonu paneldeki test işlem ve bildirim kontrollerini geçti; ancak mağaza canlı mod talebi hâlâ PayTR incelemesindedir ve production `PAYTR_TEST_MODE=0` değeri canlı onay sonrasında yeniden doğrulanmalıdır.
- Gerçek kartla baştan sona ödeme, PayTR callback, stok düşümü, sipariş onay e-postası ve yönetici sipariş ekranı testi yapılmadı.
- Kargoya verildi, teslim edildi, iptal ve iade e-postalarının gerçek alıcıya ulaştığı doğrulanmadı.
- PayTR tam iade akışı gerçek bir ödenmiş sipariş üzerinde test edilmedi.
- Yayındaki her ürün için fiyat, stok, görsel-gerçek ürün eşleşmesi ve mobil ürün sayfası manuel onayı doğrulanmadı. Kod bu kontrolleri destekliyor fakat tüm ürünlerin tamamlandığını kanıtlamıyor.
- Hukuki metin sayfaları kodda mevcut; güncel ticari bilgilerle hukuk uzmanı kontrolü doğrulanmadı.

## Bir sonraki adım

Öncelik sırası:

1. PayTR'ın canlı mod onayını beklemek; onay e-postası geldiğinde panel durumunu ve production `PAYTR_TEST_MODE=0` değerini yeniden doğrulamak.
2. Düşük tutarlı kontrollü bir gerçek siparişte ödeme → callback → stok → e-posta → kargo durumu → tam iade zincirini kayda alınmış biçimde test etmek.
3. Kritik iş kuralları için otomatik test altyapısı eklemek: fiyat manipülasyonu, stok yarışı, callback idempotency, sipariş durum geçişleri ve admin yetkisi.
