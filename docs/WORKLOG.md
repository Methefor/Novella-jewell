# Novella Jewell — Çalışma Günlüğü

Bu günlük Git geçmişi ve tarihli doğrulama kayıtlarını içerir. 3 Eylül ekleri mevcut çalışma ağacından üretime dağıtıldı; commit/push yapılmadı.

## 4 Eylül 2026 — açılış vitrini ve iletişim doğrulaması

- Novella kutusu ana sayfanın ilk bölümüne, yüzük seçkisi altına taşındı; kutu mesajı sayfanın tek H1 başlığı yapıldı.
- Instagram ve Threads profilleri `@novellajewellofficial`; PayTR yetkili e-postası, Resend production yanıt adresi ve sitedeki Gmail birbiriyle eşleşti.
- Production Resend göndericisi `NOVELLA <siparis@novellajewell.com>` olarak doğrulandı. Sipariş durum e-postalarına merkezi WhatsApp, Gmail ve Instagram bağlantıları eklendi; sitedeki sabit iletişim bağlantıları merkezi ayara bağlandı.
- TypeScript, ESLint, yerel ve Vercel üretim derlemesi geçti. Deployment `dpl_C4y6Zgks7RNAj8emXibfdnmFiZEY` Ready; `novellajewell.com` ve `www` alias'ları bağlı. Canlı DOM'da kutu → yüzük sırası ve tek H1 doğrulandı.
- Müşteriye gösterilen `0545 112 50 59` destek numarası ve Hürriyet Mahallesi merkez adresi kullanıcı tarafından doğrulandı. PayTR'daki farklı numaranın yetkilinin şahsi telefonu olduğu açıklandı.
- Merkez adresi, ev adresi mahremiyeti için global footer'dan kaldırıldı; Yönetmelik md. 5 gereği ana sayfadan doğrudan erişilen İletişim sayfasında ve zorunlu sözleşme/iade metinlerinde tutuldu.
- Yeni tespit: işletmenin tacir/esnaf statüsüne göre VKN veya MERSİS, KEP ve meslek odası bilgilerinin İletişim sayfasına eklenmesi gerekiyor.

## 3 Eylül 2026 — satış öncesi tamamlamalar

- Gerçek NJ-2026-0009 ödeme ve tam banka iadesi doğrulandı; eski siparişe yeni çekim/iade/e-posta oluşturulmadı.
- 0017 migration ile e-posta outbox ve PayTR durum takip alanları; kalıcı/tekil gönderim, ödeme ve banka iade tamamlanma uzlaştırması.
- /admin/takip, müşteri kargo/iade durumu, güvenli ödeme dönüş çerezi ve günlük cron. Üretim hedefi/alan adı otomatik ataması düzeltildi; cron GET 200 ile doğrulandı.
- GA4 komut kuyruğu düzeltildi; gerçek zamanlı hesapta ziyaret alındı. Search Console yanlış sitemap gönderimleri temizlendi; 119 adresli gerçek sitemap başarılı.
- Mobil okunabilirlik, breadcrumb, telefon/WhatsApp desteği, ilk HTML görünürlüğü ve görsel önceliği. Clerk arayüzü yalnızca admin bölümüne taşındı; sunucu yönetici yetkisi korunuyor.
- 30 test, lint, TypeScript, üretim derlemesi; 125 sayfalık tarama ve izole mobil tarayıcı kontrolleri. Hız ölçümleri ve sınırları ayrıntılı raporda.
- Açık: Pro ücret onayı / sık cron; fatura-kargo-fiziksel stok işletme teyidi; Meta hesabı ve gerçek Purchase kabulü.

Kanıt ve son dağıtım: [Satışa hazırlık](audits/2026-09-03-satisa-hazirlik.md).

## 3 Ağustos 2026

- `823dfbe`: Çerez onayına bağlı Meta Pixel bileşeni ve Meta e-ticaret olayları eklendi.
- `81fe12f`, `073e5f9`: Meta domain doğrulama metadata desteği eklendi ve doğrulama tokeni normalize edildi.
- `338cd8b`: Dinamik katalog ürünleri sitemap'e eklendi; robots ve metadata ayarları güncellendi.

## 2 Ağustos 2026

- `9706079`: Mükerrer ürün tespit merkezi eklendi.
- `09c04f2`: Pomelli admin iş akışı kullanımdan kaldırıldı; eski rota içerik üretim merkezine yönlendirildi.
- `d8cd732`: Ürün bilgisine dayalı Instagram/Threads taslakları ve içerik takvimi eklendi.
- `16f6ff4`: Kampanya medyası için inceleme, onay, red ve yayına hazır durumları eklendi.
- `7c18def`: Kampanya video medya kütüphanesi eklendi.

## 1 Ağustos 2026

- `a48113a`, `729c4c5`, `83dae9a`, `83eb743`: Remotion çoklu format yüzük lansman kompozisyonları, admin içerik üretim merkezi ve yerel render köprüsü eklendi; production origin'inden yerel köprü erişimi yapılandırıldı.
- `1be8709`: Editoryal hero ve kategori keşif menüsü eklendi.
- `57bc906`: Sipariş durum geçişleri kısıtlandı ve `www` → kök domain yönlendirmesi eklendi.

## 29 Temmuz 2026

- `ce575da`, `a080ea6`: Ürün görsel yüklemeleri sunucu rotası ve public Vercel Blob üzerinden çalışacak şekilde düzenlendi.
- `f9bdcae`, `86775f4`, `158fa13`: Mükerrer yükleme önleme, geri alınabilir ürün silme ve async doğrulamada form verisini koruma geliştirildi.
- `4efd3de`, `2a4220c`: Toplu ürün görünürlüğü ve yayın durumu filtreleri eklendi.
- `f4a1fa2`, `26c5351`: Kategori slug eşleştirmesi ve ürün kartı satın alma aksiyonları düzeltildi.

## 28 Temmuz 2026

- `04a801f`: Ödeme başarı ekranı, siparişin veritabanında gerçekten `paid` olduğunu doğrulamadan başarı göstermeyecek şekilde düzeltildi.
- `fcca115`, `05b4c08`, `9f4a387`: Sepet, checkout ve mobil ürün sayfası dönüşüm akışları geliştirildi.
- `93d7ec6`, `a2dc274`, `50a36c8`, `e0a4d36`: Ana sayfa keşfi, yeni ürün vitrini, 316L güven/teslimat görselleri ve editoryal stil alanları eklendi.
- `0564401`, `b3da982`: Toplu ürün ekleme ve toplu onay iş akışları eklendi.
- `3b4d54c`, `3b29d7c`, `bb16589`: Birinci taraf analitik merkezi ve izin modlu Google Analytics entegrasyonu eklendi/düzeltildi.

## 27 Temmuz 2026

- `2833fda`: Stok işlemleri ve stok hareket geçmişi eklendi.
- `bcb26e3`: Sipariş operasyon merkezi ve kampanya taslakları eklendi.
- `6e9b460`: Tek yönetici güvenlik denetim merkezi eklendi.
- `1287a0c`, `50b1fba`, `87b2e1c`: Ürün medya sıralama, reklam hazırlık merkezi ve sosyal kampanya panosu eklendi.
- `02aa51c`, `c506786`, `385bc25`, `4cf2051`: Admin dashboard, ürün düzenleme, arama/filtre ve katalog filtreleri geliştirildi.

## 26 Temmuz 2026

- `e59d4a5`: Vercel Blob kullanan ürün yükleme admin ekranı eklendi.
- `a0361a4`: Sipariş durum e-postaları ve güvenli tam iade akışı eklendi.
- `4b06671`: Ayrı admin kayıt rotası eklendi.

## 4 Ağustos 2026 doğrulama sonuçları

- ESLint hatası ve iki uyarı temizlendi.
- Aktif ödeme yolu PayTR-only hale getirildi; eski sağlayıcı implementasyonu ve seçim değişkeni kaldırıldı.
- Aktif veritabanı mimarisi Neon Postgres olarak belgelerde netleştirildi; kullanılmayan Supabase tür belgesi kaldırıldı.
- `.env.example` PayTR, Neon, Resend, Clerk, Vercel Blob, GA, Meta ve doğrulama değişkenleriyle tamamlandı.
- Resend panelinde `novellajewell.com` domaini `verified`, gönderici `NOVELLA <siparis@novellajewell.com>` ve sipariş onay e-postası `delivered` olarak doğrulandı.
- Resend DKIM, SPF, MX ve DMARC kayıtları halka açık DNS üzerinden doğrulandı.
- Kullanımdan kaldırılan `CHECKOUT_PROVIDER` Vercel ortam değişkenlerinden kaldırıldı.
- PayTR Bildirim URL'sinin `https://novellajewell.com/api/odeme/callback` olduğu panelden doğrulandı.
- PayTR entegrasyon, test işlem, bildirim ve güvenli kimlik doğrulama aşamaları tamamlandı; canlı moda geçiş talebi başarıyla gönderildi ve PayTR teknik incelemesine alındı.

| Kontrol | Sonuç | Not |
| --- | --- | --- |
| `npm run build` | Geçti | Next.js 16.2.11; 211 statik sayfa üretim adımı tamamlandı. İlk sandbox denemesi Google Fonts ağına erişemedi, ağ izniyle tekrarlandı. |
| `npm run type-check` | Geçti | `tsc --noEmit`, çıkış kodu 0. |
| `npm run lint` | Geçti | ESLint çıkış kodu 0. |
| Otomatik test keşfi | Test yok | Test/spec dosyası ve test scripti bulunmadı. |
| Canlı ana sayfa | Geçti | `https://novellajewell.com` HTTP 200. |
| `www` yönlendirmesi | Geçti | HTTP 308 → `https://novellajewell.com/`. |
| `robots.txt` | Geçti | HTTP 200, `text/plain`. |
| `sitemap.xml` | Geçti | HTTP 200, `application/xml`. |
| Geçersiz ödeme doğrulama isteği | Geçti | `/api/odeme/dogrula` HTTP 400. |
| Geçersiz PayTR callback imzası | Geçti | HTTP 400, `PAYTR notification failed: bad hash`. |
| Vercel deployment | Geçti | `novella-jewell`, production, `Ready`, deployment `dpl_G1atDX7FNeXs5SyF4cy4u4opW7uC`. |
| Gerçek ödeme ve e-posta | Doğrulanmadı | Canlı kart/ödeme/e-posta testi yapılmadı. |
