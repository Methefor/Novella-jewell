# Novella Jewell — Teknik ve Ticari Kararlar

Bu kayıt yalnızca mevcut kaynak kodunda veya Git geçmişinde uygulanmış olduğu doğrulanan kararları içerir.

## ADR-001 — Fiyat, kargo ve toplam sunucuda hesaplanır

- **Durum:** Kabul edildi
- **Kanıt:** `src/lib/checkout/buildOrder.ts`, `src/app/api/checkout/route.ts`
- **Karar:** Client yalnızca ürün, varyant ve adet gönderir. Ürün fiyatı, stok, kargo ve toplam sunucudaki katalogdan yeniden hesaplanır.
- **Sonuç:** Client tarafından fiyat değiştirilerek düşük tutarlı ödeme başlatılması engellenir.

## ADR-002 — Varsayılan ödeme sağlayıcısı PayTR iFrame API'dir

- **Durum:** Kabul edildi; aktif ve tek sağlayıcı PayTR'dir.
- **Kanıt:** `src/lib/checkout/index.ts`, `src/lib/checkout/paytr.ts`, `src/app/api/odeme/callback/route.ts`
- **Karar:** Checkout doğrudan `PayTRProvider` kullanır. Ödeme sonucu doğrulanmış PayTR callback'i ile işlenir; Shopier sağlayıcı yolu kaldırılmıştır.
- **Sonuç:** Ödeme ekranı site içinde açılır; canlı çalışma için production merchant ayarları zorunludur.

## ADR-003 — Kalıcı veri katmanı Neon Postgres ve Drizzle ORM'dir

- **Durum:** Kabul edildi
- **Kanıt:** `src/db/index.ts`, `src/db/schema.ts`, `drizzle/0000`–`0014`
- **Karar:** Sipariş, stok, dinamik katalog, kampanya, medya, analitik ve audit kayıtları Neon Postgres'te; şema Drizzle migration'larıyla tutulur.
- **Sonuç:** Production şema değişiklikleri migration ile sürümlenir.

## ADR-004 — Katalog dinamik veritabanı ve statik geri dönüşü birlikte kullanır

- **Durum:** Kabul edildi; eski “yalnızca statik katalog” kararı bununla değiştirilmiştir.
- **Kanıt:** `src/lib/catalog.ts`, `drizzle/0004_catalog_products.sql`
- **Karar:** Veritabanı varsa yayınlanmış dinamik ürünler kullanılır; veritabanı yoksa `src/data/products.ts` geri dönüş kaynağıdır. Dinamik taslak/yayından kaldırılmış kayıt, aynı kimlikli statik ürünü gizler.
- **Sonuç:** Admin paneli ürün yayınını yönetebilir; veritabanı erişilemezse statik katalog servis vermeyi sürdürebilir.

## ADR-005 — Satış sonrası stok yalnızca doğrulanmış ödeme ile düşer

- **Durum:** Kabul edildi
- **Kanıt:** `src/lib/orders.ts`, `src/app/api/odeme/callback/route.ts`
- **Karar:** Pending sipariş ödeme öncesi oluşturulur; `paid` geçişi ve stok düşümü aynı veritabanı işlemi içinde, yeterli stok koşuluyla yapılır. Tekrarlanan callback idempotent no-op olur.
- **Sonuç:** Başarısız ödeme stok azaltmaz; tekrar callback çift stok düşmez.

## ADR-006 — Sipariş operasyonu tek yönlü durum makinesiyle yönetilir

- **Durum:** Kabul edildi
- **Kanıt:** `src/lib/order-status.ts`, `src/app/admin/actions.ts`
- **Karar:** `new → preparing → shipped → delivered` ana akışıdır; yalnızca tanımlı iptal geçişleri mümkündür. `shipped` için kargo firması ve takip numarası gerekir.
- **Sonuç:** Yönetici geçmiş bir duruma keyfî dönüş yapamaz; değişiklikler order event ve admin audit kayıtlarına yazılır.

## ADR-007 — Yönetim erişimi tek ve doğrulanmış Clerk e-postasıyla sınırlandırılır

- **Durum:** Kabul edildi
- **Kanıt:** `src/lib/admin-auth.ts` ve admin/API rotalarındaki `getAdminAuth()` kontrolleri
- **Karar:** Ayrı rol tablosu yerine kodda belirlenmiş yönetici e-postası ve Clerk `verified` durumu kullanılır.
- **Sonuç:** Mevcut tek yönetici işletimi basittir; çok kullanıcılı rol yönetimi uygulanmış değildir.

## ADR-008 — Analitik ve reklam etiketleri açık çerez onayından sonra çalışır

- **Durum:** Kabul edildi
- **Kanıt:** `src/components/analytics/GoogleAnalytics.tsx`, `MetaPixel.tsx`, `FirstPartyAnalytics.tsx`, `src/components/legal/CookieBanner.tsx`
- **Karar:** Google Analytics, Meta Pixel ve birinci taraf analitik yalnızca `accepted` onayı sonrası ölçüm yapar. Google reklam depolaması kapalı tutulur.
- **Sonuç:** Onay verilmezse analitik olay gönderimi yapılmaz; ölçüm kapsamı onay veren ziyaretçilerle sınırlıdır.

## ADR-009 — Sosyal medya içerikleri taslak ve manuel onay akışında tutulur

- **Durum:** Kabul edildi
- **Kanıt:** `campaign_items`, `campaign_media_assets`, `/admin/kampanyalar`, `/admin/icerik-takvimi`
- **Karar:** Instagram ve Threads metinleri, medya durumları ve yayın tarihleri admin panelinde hazırlanır. Kod tabanında Instagram/Threads'e otomatik yayın yapan bir rota veya istemci bulunmaz.
- **Sonuç:** Takvimde “yayına hazır” olmak paylaşım yapıldığı anlamına gelmez; son yayın harici platformda manuel yapılır.

## ADR-010 — Video üretimi production sunucusunda değil yerel Remotion köprüsünde yapılır

- **Durum:** Kabul edildi
- **Kanıt:** `studio/`, `studio/scripts/render-bridge.mjs`, `src/app/admin/icerik-uret/ContentStudioClient.tsx`
- **Karar:** Render köprüsü yalnızca `127.0.0.1:4317` üzerinde çalışır. Admin paneli üç görsel ve metin paketini yerel köprüye gönderir; üretilen MP4 ayrıca kampanya kütüphanesine yüklenir.
- **Sonuç:** Vercel deployment'ı Remotion render yükünü taşımaz; video üretmek için yönetici bilgisayarında köprünün açık olması gerekir.

## ADR-011 — Reklama hazır durumu on maddelik ürün kontrolüyle belirlenir

- **Durum:** Kabul edildi
- **Kanıt:** `src/lib/product-readiness.ts`
- **Karar:** En az üç görsel, açıklama, hikâye, özellikler, fiyat, stok ve dört manuel reklam onayı tamamlanmadan ürün `ready` olmaz.
- **Sonuç:** Ürünün yayında olması, reklama hazır olduğu anlamına gelmez.
