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

- **Durum:** **DEĞİŞTİRİLDİ (SUPERSEDED)** — bkz. ADR-013. Aşağıdaki metin tarihçe olarak korunur ve artık geçerli değildir. (Önceki durum: Kabul edildi; eski “yalnızca statik katalog” kararı bununla değiştirilmişti.)
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

## ADR-012 — Kimlik, ürün verisi, yayın medyası ve arşiv ayrı sorumluluklardır

- **Durum:** Kabul edildi
- **Kanıt:** `src/lib/admin-auth.ts`, `src/db/schema.ts`, `src/app/api/admin/media-assets/upload/route.ts`, `/admin/icerik-uret`
- **Karar:** Clerk yalnızca admin kimlik doğrulamasını yapar. Ürün ve medya kayıtları Neon Postgres'te, sitede kullanılacak gerçek dosyalar Vercel Blob'da tutulur. Google Drive site çalışma zamanının parçası değildir; ham/orijinal çekimler için işletme arşivi olarak kullanılabilir.
- **Sonuç:** Drive veya Clerk ürün kataloğunun ikinci kopyası yapılmaz. İçerik Üret ekranı katalog ve AI medya kütüphanesindeki görselleri yeniden kullanır; AI çıktıları mağazada otomatik yayınlanmadan ürüne geri bağlanır.

## ADR-013 — Katalog tek gerçek kaynağı veritabanıdır

- **Durum:** Kabul edildi; ADR-004'ün “statik geri dönüş” kararını değiştirir. (Kod hazır; production'a henüz dağıtılmadı.)
- **Kanıt:** `src/lib/catalog.ts`, `src/lib/orders.ts`, `src/app/error.tsx`, `src/components/catalog/`, `tests/catalog-source-of-truth.test.ts`, `tests/catalog-orders.test.ts`
- **Karar:** Ürün kataloğunun tek kaynağı Neon Postgres `catalog_products` tablosudur. `src/data/products.ts` mağaza, sipariş, stok veya yönetim paneli için geri dönüş kaynağı DEĞİLDİR ve hiçbir kaydı veritabanına otomatik tohumlamaz (seed etmez). Üç durum birbirine karıştırılmaz:
  - **Veritabanı erişilemiyor** → `CatalogUnavailableError`. Sessiz statik geri dönüş yoktur; sayfa Novella hata durumunu gösterir. ISR yenilemesinde hata fırlatıldığı için son başarılı sayfa sunulmaya devam eder; ürün silinmiş gibi 404 verilmez. Checkout bu durumda 503 döner.
  - **Veritabanı erişilebilir, katalog boş** → normal boş liste (`[]`) ve “Şu anda vitrinde ürün bulunmuyor” durumu. Bu bir arıza sayılmaz.
  - **Veritabanı erişilebilir, istenen ürün yok** → `undefined` → gerçek 404.
- **Sipariş/stok:** Sipariş yalnızca veritabanı kataloğunda yayında olan ürün ve varyant için açılır; aksi halde `CatalogProductMissingError` ile fail closed olur (checkout 409). Ödeme alındıktan sonra (`markOrderPaid`) katalog aynası eksikse sipariş başarısız sayılmaz: stok defteri (`inventory`) atomik düşer, statik veriden katalog kaydı üretilmez. Fiyat, kargo ve toplam sunucuda, veritabanı kataloğundan hesaplanır (ADR-001 değişmedi).
- **Yönetim paneli:** Ürün listeleri, stok ve yayın işlemleri yalnızca `catalog_products`'ı kullanır; veritabanında olmayan ürün statik veriden oluşturulmaz.
- **Salt okunur legacy istisna:** `src/app/admin/analitik/page.tsx`, eski analitik olaylarındaki ürün kimliklerini okunabilir isme çevirmek için `src/data/products.ts`'i salt okunur kullanır. Bu bir kaynak-doğruluk istisnası değil, geçmiş olayları görüntüleme yardımcısıdır; vitrini, siparişi, stoğu veya fiyatı etkilemez ve hiçbir şey yazmaz. Dosyanın tamamen kaldırılması ayrı bir temizlik kararıdır.
- **Derleme:** Katalog sayfaları derleme sırasında veritabanına ihtiyaç duyar; veritabanı yoksa derleme başarısız olur ve önceki dağıtım yayında kalır (bilinçli fail-safe).
- **Sonuç:** Eski/stale ürün bilgisi, fiyatı veya stoğu müşteriye gösterilmez ve siparişe dönüşmez.
