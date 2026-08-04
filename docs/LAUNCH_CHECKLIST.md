# Novella Jewell — Lansman Kontrol Listesi

Son kontrol: 4 Ağustos 2026.
`[x]` yalnızca kaynak kodu, Git/Vercel çıktısı veya çalıştırılmış kontrolle doğrulanan maddeleri gösterir. Production ayarı ya da gerçek işlem gerektiren ve doğrulanmayan maddeler `[ ]` bırakılmıştır.

## Kod ve dağıtım

- [x] Git deposu `main` branch'inde ve `origin/main` ile aynı commit'te.
- [x] Vercel projesi `novella-jewell` production deployment'ı `Ready`.
- [x] `novellajewell.com` HTTP 200 döndürüyor.
- [x] `www.novellajewell.com` kök domaine HTTP 308 ile yönleniyor.
- [x] `npm run build` başarıyla tamamlanıyor.
- [x] `npm run type-check` başarıyla tamamlanıyor.
- [x] `npm run lint` hatasız tamamlanıyor.
- [ ] Otomatik birim/entegrasyon/uçtan uca test paketi mevcut ve geçiyor.
- [x] `.env.example` kullanılan bütün zorunlu production değişkenlerini listeliyor.

## Katalog ve mağaza

- [x] Dinamik katalog ve yayın durumu desteği mevcut.
- [x] Ürün oluşturma ve düzenleme ekranları mevcut.
- [x] Toplu ürün ekleme ve toplu yayın durumu işlemleri mevcut.
- [x] Vercel Blob görsel yükleme rotası dosya türü, yol ve boyut doğruluyor.
- [x] Ürün arama/filtreleme ve kategori sayfaları mevcut.
- [x] Mükerrer ürün adaylarını gösteren kontrol merkezi mevcut.
- [x] Reklam hazırlık puanı ve manuel onay alanları mevcut.
- [ ] Yayındaki bütün ürünlerin fiyatı ve gerçek stoku manuel olarak doğrulandı.
- [ ] Yayındaki bütün ürünlerin gerçek ürün/görsel eşleşmesi manuel olarak onaylandı.
- [ ] Yayındaki bütün ürün sayfaları gerçek mobil cihazlarda kontrol edildi.

## Ödeme, sipariş ve stok

- [x] Checkout fiyatı ve kargo sunucuda hesaplanıyor.
- [x] PayTR callback imzası doğrulanıyor; geçersiz imza canlı uç noktada HTTP 400 döndürüyor.
- [x] Ödeme başarısı veritabanındaki `paid` durumuna karşı doğrulanıyor.
- [x] Stok düşümü doğrulanmış ödeme ve yeterli stok koşuluyla yapılıyor.
- [x] Tekrarlanan başarılı callback için idempotent işlem uygulanmış.
- [x] Sipariş durum geçişleri kodda sınırlandırılmış.
- [x] Kargoya geçişte kargo firması ve takip numarası zorunlu.
- [x] PayTR tam iade kodu ve stok geri ekleme işlemi mevcut.
- [ ] Production `PAYTR_TEST_MODE=0` doğrulandı.
- [x] Production PayTR merchant bilgileri ve panel entegrasyon testi doğrulandı.
- [ ] Gerçek kartla başarılı ödeme testi tamamlandı.
- [ ] Gerçek başarısız/iptal ödeme testi tamamlandı.
- [ ] Gerçek ödemede stok düşümü ve sipariş kaydı birlikte doğrulandı.
- [ ] Gerçek ödenmiş siparişte tam iade testi tamamlandı.

## E-posta ve operasyon

- [x] Sipariş onay ve durum e-postası kodu mevcut.
- [x] Sipariş olay geçmişi ve admin audit log tabloları/işlemleri mevcut.
- [x] Müşteri sipariş takip rotası mevcut.
- [x] Resend gönderici domaini doğrulandı.
- [x] Production `RESEND_FROM_EMAIL` doğrulanmış marka adresini kullanıyor.
- [ ] Sipariş onay e-postası gerçek müşteri adresine ulaştı.
- [ ] Hazırlanıyor, kargoda, teslim ve iade e-postaları gerçek alıcıda doğrulandı.
- [ ] Gerçek kargo firması ve takip bağlantısı operasyon testi tamamlandı.

## Analitik ve arama görünürlüğü

- [x] Google Analytics bileşeni consent mode ile uygulanmış.
- [x] Meta Pixel çerez onayına bağlı uygulanmış.
- [x] Meta e-ticaret olayları kodda mevcut.
- [x] Birinci taraf analitik olay toplama rotası mevcut.
- [x] `robots.txt` canlıda HTTP 200.
- [x] Dinamik `sitemap.xml` canlıda HTTP 200.
- [x] Ürün ve organizasyon yapılandırılmış verileri uygulanmış.
- [ ] Production GA olaylarının gerçek zamanlı rapora ulaştığı bu denetimde doğrulandı.
- [ ] Production Meta Purchase olayının gerçek ödeme üzerinden ulaştığı doğrulandı.
- [ ] Search Console indeks kapsamı ve hata raporu bu denetimde doğrulandı.

## Güvenlik ve hukuk

- [x] Admin mutation ve admin API rotalarında doğrulanmış yönetici kontrolü uygulanmış.
- [x] Callback HMAC karşılaştırması sabit zamanlı yapılıyor.
- [x] Checkout müşteri verisi Zod şemasıyla doğrulanıyor.
- [x] KVKK ve mesafeli satış onayları checkout API'sinde zorunlu.
- [x] Gizlilik, KVKK, çerez, iade, ön bilgilendirme ve mesafeli satış sayfaları kodda mevcut.
- [ ] Hukuki metinlerin güncel işletme bilgileriyle uzman kontrolü tamamlandı.
- [ ] Production güvenlik başlıkları bağımsız taramayla doğrulandı.
- [ ] Bağımlılık güvenlik taraması tamamlandı ve açık bulgu yok.

## Sosyal medya ve içerik

- [x] Kampanya, ürün ve kanal bazlı içerik taslakları destekleniyor.
- [x] Medya inceleme/onay/red/yayına hazır durumları mevcut.
- [x] Instagram ve Threads için ayrı metin alanları mevcut.
- [x] İçerik tarih-saat ve kanal planı mevcut.
- [x] Remotion Story/Feed/Square kompozisyonları mevcut.
- [x] Sistem sosyal medyada otomatik paylaşım yapmıyor.
- [ ] Onaylı kampanya medya dosyaları admin medya kütüphanesine yüklendi.
- [ ] İlk 7 günlük içeriklerin tamamı görsel ve metin olarak son onay aldı.
- [ ] Instagram ve Threads ilk yayınları gerçekleştirildi.
