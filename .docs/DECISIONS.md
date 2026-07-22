# Mimari Karar Kayıtları (ADR)

Bu dosya, projedeki önemli teknik kararları nedenleri ve sonuçlarıyla birlikte kaydeder. Yeni bir önemli mimari seçim yapıldığında buraya ekleme yapılır.

## ADR Şablonu

```markdown
### ADR-XXX: [Kısa başlık]

- **Tarih:** YYYY-AA-GG
- **Durum:** taslak / önerildi / kabul edildi / reddedildi / kullanımdan kaldırıldı
- **Bağlam:** [Kararın alındığı ortam ve problem]
- **Karar:** [Seçilen çözüm]
- **Sonuçlar:** [Olumlu/olumsuz etkiler, kabul edilen riskler]
- **Alternatifler:** [Düşünülen ve reddedilen seçenekler]
```

---

## ADR-001: Fiyat ve stok hesaplaması sunucuda yapılır

- **Tarih:** 2026-07-22
- **Durum:** kabul edildi
- **Bağlam:** Ödeme akışında client'tan gelen `total` alanı doğrudan imzalanıyordu. Bu, `{ "total": 1 }` gönderilerek yüksek tutarlı bir sepetin düşük fiyata satın alınmasına olanak tanıyordu.
- **Karar:** `/api/checkout` yalnızca `productId`, `variantId` ve `quantity` kabul eder. Fiyat, stok ve toplam `src/lib/checkout/buildOrder.ts` içinde sunucudaki `PRODUCTS` verisinden yeniden hesaplanır. Client'tan gelen hiçbir fiyat alanına güvenilmez.
- **Sonuçlar:**
  - Güvenlik açısından kritik bir hata kapatıldı.
  - Sipariş akışı tek kaynak (sunucu) üzerinden yönetilir.
  - Ürün verisi değiştiğinde client tarafında ekstra senkronizasyon gerekmez.
- **Alternatifler:**
  - Client'tan gelen fiyatın sunucuda doğrulanması: daha fazla karmaşıklık getirir ve hâlâ manipülasyona açıktır.
  - Ürün başına hash/imza: ek yük getirir ve gerekli değildir.

---

## ADR-002: Ödeme sağlayıcısı olarak Shopier kullanılır ve soyutlanır

- **Tarih:** 2026-07-22
- **Durum:** kullanımdan kaldırıldı
- **Bağlam:** Projenin ilk fazında Türkiye'de yaygın ve hızlı entegre edilebilir bir ödeme çözümüne ihtiyaç vardı. İleride iyzico veya PayTR'ye geçiş ihtimali de göz önünde bulunduruldu.
- **Karar:** `CheckoutProvider` arayüzü (`src/lib/checkout/types.ts`) tanımlandı. `getCheckoutProvider()` (`src/lib/checkout/index.ts`) `CHECKOUT_PROVIDER` ortam değişkenine göre sağlayıcı döner. İlk uygulama `ShopierProvider` (`src/lib/checkout/shopier.ts`)'dır.
- **Sonuçlar:**
  - Sağlayıcı değişikliği rota ve iş mantığı kodlarını değiştirmeden yapılabilir.
  - İmza doğrulama ve form/redirect üretme her sağlayıcının kendi sorumluluğundadır.
- **Değişiklik (2026-07-22):** Shopier, kendi web sitesinde satış desteğini kaldırdı. Bkz. ADR-005.
- **Alternatifler:**
  - Doğrudan Shopier kodunun route handler'a gömülmesi: ileride geçişte yüksek refactor maliyeti doğurur.

---

## ADR-003: Ürün kataloğu statik dosyada tutulur ve tek erişim noktası sağlanır

- **Tarih:** 2026-07-22
- **Durum:** kabul edildi
- **Bağlam:** Site açılışında envanter küçüktü ve sık değişmiyordu; Supabase/Product CMS geçişi ileriye bırakıldı.
- **Karar:** Ürün verisi `src/data/products.ts` içinde tek kaynak olarak tutulur. Dışa aktarım `src/lib/products.ts` üzerinden yapılır; böylece Supabase/CMS geçişinde yalnızca bu dosya değişir.
- **Sonuçlar:**
  - Sayfalar ve API'ler ürün verisinin nereden geldiğini bilmez.
  - Stok değişiklikleri ve fiyat güncellemeleri tek yerden yapılır.
  - CMS/Supabase'e geçişte `src/data/products.ts` yerine yeni veri erişim katmanı yazmak yeterlidir.
- **Alternatifler:**
  - Her sayfada doğrudan `PRODUCTS` içe aktarımı: geçişte çok sayıda dosya değişir.

---

## ADR-004: Neon Postgres + Drizzle ORM kullanılır

- **Tarih:** 2026-07-22
- **Durum:** kabul edildi
- **Bağlam:** Sipariş kayıtları kalıcı tutulmalıydı; Vercel Storage/Neon kolay entegrasyon sundu. Supabase ile ilişkisel veritabanı ihtiyacı aynı anda değerlendirildi.
- **Karar:** `DATABASE_URL` ile Neon Postgres bağlantısı kurulur; ORM olarak Drizzle kullanılır. Göçler `drizzle-kit` ile `drizzle/` klasörüne yazılır ve depoya dahil edilir.
- **Sonuçlar:**
  - `neon-http` driver'ı her sorguyu tek HTTP isteğiyle çalıştırır; Vercel serverless ortamında kalıcı bağlantı havuzu gerekmez.
  - Drizzle tip güvenliği `src/db/schema.ts` üzerinden sağlar.
  - Üretimde şema migration dışında değiştirilmez.
- **Alternatifler:**
  - Supabase PostgREST: istemci tarafı erişim riski taşır; server-side kullanım gerekir.
  - Prisma: daha büyük paket ve ek çalışma zamanı gereksinimi.

---

## ADR-005: Shopier desteği kalkınca PayTR iFrame API'ye geçilir

- **Tarih:** 2026-07-22
- **Durum:** kabul edildi
- **Bağlam:** Shopier, "ürün listelemeden kendi internet sitenizde satış" desteğini kaldırdığını bildirdi. Kendi sitesinde mağaza açma veya listeleme dışında bir entegrasyon yolu sunmuyor.
- **Karar:** Mevcut `CheckoutProvider` soyutlaması korunarak yeni sağlayıcı `PayTRProvider` (`src/lib/checkout/paytr.ts`) yazıldı. Varsayılan sağlayıcı `paytr` olarak değiştirildi. `/api/checkout` PayTR'den `iframe_token` alıp `/odeme` sayfasında iframe açar; `/api/odeme/callback` PayTR Bildirim URL'sinden gelen POST'u doğrulayıp siparişi `paid`/`failed` yapar ve `OK` yanıtı döner.
- **Sonuçlar:**
  - Kredi kartı / havale ödemeleri Türkiye içinde yasal altyapıda kabul edilir.
  - iFrame akışı müşteriyi siteden çıkarmadan ödeme yapmasını sağlar.
  - PayTR komisyon oranları ve onay süreci mağaza bazında değişebilir.
- **Alternatifler:**
  - iyzico: Daha kapsamlı ama entegrasyonu daha karmaşık; daha sonra gerekirse yine `CheckoutProvider` arayüzüne eklenebilir.
  - Stripe: Türkiye'de yerel merchant hesabı desteği yoktur.
  - Shopier mağazasına yönlendirme: Marka deneyimi ve site kontrolünü kaybetme riski taşır.
