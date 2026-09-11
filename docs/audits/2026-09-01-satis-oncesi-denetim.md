# Novella Jewell — Satış öncesi denetim

> Bu ilk denetimin ardından yapılan yerel düzeltmeler ve kalan kabul işleri [düzeltme raporunda](2026-09-01-duzeltmeler-ve-isletme-onayi.md) yer alıyor. Aşağıdaki bulgular ilk denetim anını anlatır.

**Tarih: 1 Eylül 2026. Sonuç: Temel sayfa ve SEO altyapısı büyük ölçüde kurulmuş; satış öncesinde giderilmesi gereken somut katalog, mobil ödeme ve içerik sorunları var.**

Bu çalışma bir denetimdir. Uygulama kodu, ürünler, stoklar, hesap ayarları ve canlı dağıtım değiştirilmedi. Gerçek sipariş/ödeme, iade veya mesaj gönderimi yapılmadı. Bulgu durumu “var”, “eksik”, “kısmen” ve “doğrulanamadı” olarak ayrıldı; bir entegrasyonun kodda bulunması, üretimde uçtan uca çalıştığı anlamına gelmez.

**Kapsam ve kanıt**

- Canlı sitemap ve sayfalardaki HTML bağlantıları takip edilerek 140 farklı adres tarandı. 139 adres HTTP 200, deneme amaçlı geçersiz adres HTTP 404 döndürdü. Ancak 200 dönen adreslerin 12'si ürün yerine `not-found` içeriği taşıyor: HTTP durumuna bakarak başarılı kabul edilmediler.
- 94 ürün adresi Product/Offer verisi döndürüyor. Canlı sitemap 79 adres ve yalnızca 59 ürün içeriyor; bulunan 35 ürün sitemap dışında.
- 94 ürünün ana görseli ve 2 sosyal paylaşım görseli olmak üzere 96 görsel adresi HTTP 200 döndürdü. Bu kontrol tüm galeri fotoğraflarının gerçek ürünle eşleştiğini kanıtlamaz.
- Tarayıcıda ana sayfa, ürün, Stockholm koleksiyonu, eski ürünün 404 sonucu, arama, sepet ve ödeme incelendi. Mobil ölçümler 390×844 ve ödeme için ayrıca 320×740; masaüstü ödeme kontrolü 1440×900 boyutunda yapıldı. Gerçek iOS/Android cihaz testi yapılmadı.
- `npm run lint` ve `npm run type-check` başarılı. Yeni bir production build çalıştırılmadı. Vercel proje çıktısı son production dağıtımını `READY` gösteriyor.
- Google PageSpeed API mobil ölçüm isteği HTTP 429 kota hatası verdi. Lighthouse/Core Web Vitals puanı elde edilmedi.
- Ham kanıtlar: [HTTP/SEO taraması](2026-09-01-http.json), [görsel erişimi](2026-09-01-assets.json), [12 ürünün not-found çıktısı](2026-09-01-soft404.json), [PageSpeed hata yanıtı](2026-09-01-pagespeed.json). Tekrarlanabilir temel tarama: [denetim betiği](check-2026-09-01.mjs).

**Satıştan önce çözülmesi gerekenler**

| Öncelik | Bulgu | Müşteriye etkisi | Tamamlanma ölçütü |
|---|---|---|---|
| 1 | Arama, koleksiyonlar ve öneriler eski statik kataloğu kullanıyor. | Müşteri canlı ürünü bulamıyor; artık olmayan ürüne veya eski fiyat/stoğa yönlenebiliyor. | Tüm vitrinler aynı yayınlanmış katalogdan beslenmeli; Celeste aranabilmeli; önerilerdeki ürünlerin detayları açılmalı ve ödeme tarafından tanınmalı. |
| 1 | Mobil ödeme formu yatay taşıyor. | Alanların sağ tarafı kesiliyor, yatay kaydırma gerekiyor. | 320 ve 390 pikselde form, sipariş özeti ve butonlar ekran içine sığmalı. |
| 1 | İade kargo bedeli ve iade süreleri metinleri güncellenmeli. | Müşteriye güncel resmi açıklamadan farklı şartlar sunuluyor. | Ön bilgilendirme, iade, SSS ve sözleşmede tutarlı ve güncel süreç bulunmalı; belirlenen iade taşıyıcısı/süreci işletme tarafından doğrulanmalı. |
| 1 | “Nikel içermez / alerji yapmaz / renk solmaz” şeklinde kesin ürün vaatleri var. | Ürünün malzemesi ve kaplaması konusunda yanlış beklenti doğurabilir. | Tedarikçi belgeleriyle doğrulanabilen, kaplama ve kullanım koşullarını ayıran ortak metin kullanılmalı. |
| 1 | Ödeme ve siparişin gerçek işlemle kabul testi bu denetimde doğrulanamadı. | Canlı mod, stok, bildirim ve iade zinciri henüz bu raporla onaylanamaz. | Canlı PayTR modu; kontrollü ödeme, başarısız ödeme, stok düşümü, e-posta, kargo takibi ve tam iade birlikte kaydedilmeli. |
| 2 | Sözleşme onayının kalıcı kaydı kodda eksik. | Hangi metnin hangi siparişte onaylandığını sonradan gösterme kabiliyeti zayıf. | Siparişle ilişkili onay zamanı ve metin sürümü/içeriği saklanmalı; müşteriye kalıcı erişim/suret sağlanması doğrulanmalı. |

**1. Katalog ayrışması — canlıda yeniden üretildi**

[Stockholm koleksiyonuna](https://novellajewell.com/koleksiyonlar/stockholm) girip “New York Edge Zincir Bileklik” seçildiğinde [ürün adresi](https://novellajewell.com/urun/new-york-edge-zincir-bileklik) “Bu sayfa kaybolmuş” ekranını açıyor. Aynı ürün, canlı Stockholm Arc yüzüğünün “Aynı hikayeden” önerilerinde de gösteriliyor.

Taramada 12 eski ürün adresinde HTTP 200 içinde `NEXT_HTTP_ERROR_FALLBACK;404`, `noindex` ve 404 ekran içeriği birlikte doğrulandı. Bu, HTTP seviyesinde 200 görünse bile müşterinin ürünü satın alabileceği bir sayfa olmadığı anlamına geliyor. Genel, bilinmeyen bir adreste markalı 404 düzgün çalışıyor.

Ana sayfada satılan [Barcelona Celeste küpe](https://novellajewell.com/urun/barcelona-celeste-yildizli-denizanasi-altin-kupe) için arama kutusuna “Celeste” yazıldığında “Sonuç bulunamadı” çıkıyor. [Arama kanıtı](2026-09-01-search-celeste.png).

Kaynak nedenler:

- `src/app/koleksiyonlar/[slug]/page.tsx:37` statik `getProductsByCollection` kullanıyor.
- `src/app/urun/[slug]/ProductPageClient.tsx:141` statik `getRelatedProducts` kullanıyor.
- `src/hooks/useProductSearch.ts:44` statik `getAllProducts` kullanıyor.
- `src/components/product/OneriSeridi.tsx` ve `src/lib/recommendations.ts` de aynı eski kaynağa bağlı.
- Ana sayfa, kategoriler ve checkout ise `src/lib/catalog.ts` üzerinden yayınlanmış veritabanı kataloğunu kullanıyor.

İç bağlantı eklemekten önce mevcut arama/öneri/koleksiyon yollarını aynı güncel veri kaynağına bağlamak gerekli. Sayfa önbellekleri de ürünün fiyatı, stoğu ve yayın durumu değiştiğinde birlikte yenilenmeli.

**2. Mobil ödeme — ölçülmüş taşma**

390 piksel genişlikte `/odeme` sayfa genişliği 417 piksel. Formun sağ kenarı x=416,58 konumunda. 320 pikselde de içerik 417 piksel kalıyor. 1440 piksel masaüstünde aynı yatay taşma gözlenmedi. Ana sayfa ve Stockholm koleksiyonu 390 pikselde yatay taşmadı.

[Mobil ödeme ekran görüntüsü](2026-09-01-mobile-checkout.png).

İncelenecek yer `src/app/odeme/OdemeClient.tsx:235`: grid ve iç elemanların minimum genişlik davranışı. Yalnızca sayfaya `overflow-x:hidden` eklemek alanların kesilmesini çözmez; kolon/form/özetin küçülebilmesi gerekir.

Ek erişilebilirlik notu: `Field` bileşeninin metin etiketleri inputlara `htmlFor/id` ile bağlanmıyor (`OdemeClient.tsx:549`). Tarayıcı erişilebilirlik ağacında bazı alanlar “Ad” yerine örnek placeholder ile tanınıyor.

**3. Hukuki sayfalar var; içerikleri tamamen hazır sayılmamalı**

Gizlilik, KVKK, çerez, ön bilgilendirme, mesafeli satış, iade, kargo ve iletişim sayfaları açılıyor. Unvan, adres, telefon ve e-posta doldurulmuş; taranan sayfalarda `[DOLDURULACAK]` bulunmadı. Checkout'ta sözleşme ve KVKK kutuları var, API de `true` değerlerini şart koşuyor.

Somut düzeltme gerektiren noktalar:

- `src/app/on-bilgilendirme/page.tsx:110` fikir değişikliğinde iade kargosunu alıcıya yüklüyor. Güncel [Ticaret Bakanlığı açıklamasına](https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/mesafeli-sozlesmeler-hakkinda-bilgilendirme) göre ön bilgilendirmede belirtilen taşıyıcıyla yapılan iadede veya taşıyıcı belirtilmemişse tüketici iade masraflarından sorumlu tutulamaz. Bu nedenle mevcut genel ifade düzeltilmeli.
- İade sayfası ve SSS bedel iadesini “iade onayından” başlatırken, sözleşme “cayma bildiriminden” başlatıyor. Bakanlığın güncel açıklamasında malın iade taşıyıcısına teslimi, farklı taşıyıcı kullanımı ve henüz teslim edilmemiş siparişler için ayrım var. Metinler güncel gerçek sürece göre birlikte ele alınmalı.
- E-posta şablonunda teslimat üst sınırı “30 iş günü”, sitedeki metinlerde “30 gün” olarak yazılmış. `src/lib/email.ts` içindeki bu çelişki giderilmeli.
- API onayı kontrol ettikten sonra sipariş oluşturma fonksiyonuna onay verisini geçirmiyor. `orders` şemasında onay/metin sürümü alanı yok; incelenen akışta onay kaydı yazılmıyor. Buna karşılık metinler onayın kayıt altına alındığını söylüyor. Teknik saklama ile gösterilen vaat eşleştirilmeli.
- İncelenen sipariş e-postası tam sözleşme/ön bilgilendirme sureti veya bunların sürümlü kopyasını içermiyor. Kalıcı bildirim ve belge saklama süreci tamamlanmalı; işletmeye özel nihai metin kontrolü ayrıca yapılmalı.

**4. Ürün vaatleri — belge ve tutarlılık gerekli**

Canlı ürün detayında “Nikel içermez, alerji yapmaz”, “Renk solmaz, kararma yaşanmaz” ifadeleri tüm ürünler için sabit içerik olarak basılıyor (`ProductPageClient.tsx:44–52,463`). SSS ise 316L'de düşük nikel salınımından ve bilinen metal alerjisinde dikkatten bahsediyor; kaplamalı modelleri deniz suyu ve sürtünmeden uzak tutmayı öneriyor.

316L'nin nikelsiz olduğu varsayımı doğru değil: üretici [Outokumpu'nun 316L/4404 bileşim tablosunda](https://www.outokumpu.com/en/products/product-ranges/supra) nikel bulunuyor. Bu kaynak Novella ürünlerinin birebir malzeme testini kanıtlamaz; mevcut genel “nikel içermez” iddiasının 316L adıyla doğrulanamayacağını gösterir. Kesin alerji ve ömür boyu renk garantileri yerine ürünün doğrulanmış malzemesi, kaplaması ve bakım koşulları yazılmalı.

**5. SEO ve ölçümde tamamlanacaklar**

- **Sitemap güncelliği:** 94 ürün içeriğinden 35'i sitemap dışında; ayrıca `/rehber` ve 4 rehber yazısı yok. Bu durum indekslenmediklerini kanıtlamaz, ancak keşif listesinin eksik olduğunu gösterir. Sitemap için yenilenme stratejisi yok; ürün yayın/değişiklik işlemlerinde sitemap invalidasyonu da bulunamadı. Canlı statik sitemap kayıtları 10 Ağustos tarihini taşıyor. Gerçek güncelleme tarihleri kullanılmalı; [Google `lastmod` açıklaması](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- **Başlık şablonu:** İncelenen 94 gerçek ürünün tamamında son ek `— NOVELLA | NOVELLA`. Ürün adı benzersiz olsa da marka iki kez ekleniyor. Aynı desen koleksiyon başlıklarında da var. `generateMetadata` ile layout'taki `%s | NOVELLA` tek marka ekleyecek şekilde düzenlenmeli.
- **H1:** Dört koleksiyonun ham HTML'inde H1 yok. Tarayıcıda Stockholm H1'i oluşuyor; dolayısıyla “H1 hiç yok” sonucu doğru değil. Ortak bileşen H1 içeriyor, fakat içerik JavaScript'e bağımlı. Başlığın ve temel koleksiyon içeriğinin sunucudan gelmesi geliştirilmeli. Ana sayfanın slogan H1'ine “316L çelik takı” bağlamı eklemek isteğe bağlı içerik iyileştirmesi.
- **GA4:** Canlıda `G-QJJ8TD7PHZ` etiketi var. Kodda görüntüleme, sepet ve ödeme olayları mevcut. `purchase` ise sadece sipariş numarası, para birimi ve toplam tutarı gönderiyor; `items` yok, kargo dahil toplam `value` olarak kullanılıyor. [GA4 purchase tanımı](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase) ürün listesini ister, kargo/verginin `value` dışında tutulmasını belirtir. Ürün bazlı satış ve gelir ölçümü tamamlanmalı. Sepet/checkout olaylarında gerçek adetler de korunmalı.
- **Çerez ölçüm doğrulaması:** Consent arayüzü ve consent mode var. GA olay yardımcı fonksiyonunda doğrudan izin kontrolü yok; reklam ve birinci taraf olaylarında var. İlk ziyaret, ret, kabul ve izin geri çekme senaryolarındaki gerçek ağ istekleri ayrı kabul testi gerektiriyor. Bu denetim hukuka uygun ölçüm yapıldığını onaylamaz.
- **Search Console:** Halka açık DNS'te `google-site-verification` TXT kaydı doğrulandı. HTML'de doğrulama etiketi olmaması eksik kurulum kanıtı değil; DNS yöntemi kullanılmış olabilir. Mülk erişimi, sitemap gönderimi, kapsam ve URL inceleme raporları hesap içinde doğrulanmadı.
- **Zengin sonuçlar:** 94 üründe Product/Offer; ürün ve koleksiyonlarda BreadcrumbList; genel Organization, SSS'de FAQPage ve rehberlerde Article var. Product/Offer içinde `shippingDetails` ve `hasMerchantReturnPolicy` yok. Bunlar [Google mağaza listelemeleri](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing) için geliştirme fırsatı; tüm mevcut Product verisinin geçersiz olduğu anlamına gelmez. Google Rich Results Test sonucu ve Merchant Center hesabı ayrıca doğrulanmalı.
- **Sosyal paylaşım:** Genel ve ürün OG görselleri açılıyor. Twitter başlık/açıklaması ürün sayfasında genel marka değerini miras alıyor; her ürün için ayrılaştırılabilir. Bu bir yayın engeli değil.

**Verdiğiniz listenin karşılığı**

Tekrarlanan lokasyon, CTA, SSS ve meta başlık maddeleri birleştirildi. “Meta başlık” HTML title olarak, meta açıklama da ayrıca değerlendirildi.

| Madde | Durum | Novella için sonuç |
|---|---|---|
| Anlamlı H1 | Kısmen | Ana sayfa, ürün ve kategori başlıkları var; koleksiyon başlığı JavaScript sonrası geliyor. |
| Güçlü CTA + üst kısma CTA | Var | Ana sayfada “Yüzükleri keşfet”, ürünlerde “Sepete Ekle”; mobil ilk ekranda ana CTA görünür. |
| SEO sayfa/meta başlıkları + benzersiz başlık | Kısmen | Gerçek ürünler benzersiz; 94 ürün başlığında marka iki kez yazılıyor. |
| Meta açıklamalar | Var | Taranan gerçek içerik sayfalarında mevcut; ürün açıklamaları farklı. Noindex işlem sayfalarının ortak açıklaması öncelikli SEO sorunu değil. |
| Servis sayfaları | İş modeline bağlı | Ürün/kategori sayfaları mevcut. Tamir, gravür vb. gerçek bir hizmet sunulmuyorsa ayrıca servis sayfası gerekmez. |
| Lokasyon sayfaları | İş modeline bağlı | İletişimde adres var. Müşteri kabul eden gerçek mağaza yoksa şehir şehir sayfa üretmek gerekli değil. Paris/Stockholm koleksiyon isimleri mağaza konumu değildir. |
| Hakkımızda / Hikayemiz | Var | `/hikayemiz` açılıyor; `/hakkimizda` kalıcı yönlendirme yapıyor. |
| Bize Ulaş / İletişim | Var | WhatsApp, telefon, e-posta, adres, satıcı bilgileri, çalışma saatleri var. |
| SSS sayfası + en az 5 soru | Var, içerik düzeltilecek | 14 soru, 4 grup var. Malzeme, iade ve takip cevapları tutarlı hale getirilmeli. |
| Müşteri yorumları | Eksik | Bileşen ve WhatsApp ile gönderim bağlantısı var, gerçek yorum dizisi boş. İlk gerçek müşterilerden izinli yorum toplanmalı; açılış için sahte yorum eklenmemeli. |
| Güven sinyalleri | Kısmen | HTTPS, işletme bilgileri, kargo/iade, hediye kutusu, takip ve ödeme akışı var; kesin malzeme vaatleri düzeltilmeli. |
| İç linkleme | Sorunlu | Menü/footer/rehber ilişkileri var; eski katalog nedeniyle en az 12 ürün linki 404 içeriğine gidiyor. |
| Görsel alt metni | Var | Taranan HTML img etiketlerinde alt niteliği eksik değil; dekoratiflerde boş alt uygun. Her görsele görünen altyazı yazmak zorunlu değil. |
| Gizlilik sayfası | Var | Gizlilik, KVKK ve çerez sayfaları açılıyor; onay/ölçüm davranışı için ayrı test gerekli. |
| Şartlar ve koşullar | Kısmen | Mesafeli satış ve ön bilgilendirme var; iade koşulları, kayıt ve kalıcı suret süreçleri tamamlanmalı. |
| Mobil uyumluluk | Sorunlu | Ana sayfa/ürün/koleksiyon düzenleri var; ödeme formu 320/390 pikselde taşıyor. |
| Görsel optimizasyonu | Var | Next Image, boyuta göre seçim, lazy loading ve AVIF/WebP yapılandırması var. Örnek 640px görsel AVIF ve 19.520 bayt olarak geldi. |
| Google Analytics | Kısmen | Canlı etiket kurulu; purchase ürün verisi eksik, DebugView/Realtime doğrulaması yapılmadı. |
| Search Console | Kurulum işareti var | DNS doğrulaması var; hesap, sitemap gönderimi ve indeks kapsamı doğrulanamadı. |
| XML sitemap | Eksik kapsam | Endpoint 200; 35 ürün, rehber ana sayfası ve 4 yazı eksik. |
| 404 sayfası | Var, durum kodu sorunu var | Genel yanlış adreste 404 doğru; 12 eski ürün adresi HTTP 200 içinde 404 içeriği gönderiyor. |
| Teşekkür sayfası | Var | `/odeme/sonuc`, noindex ve sunucu ödeme doğrulaması var. Başarılı gerçek ödeme görünümü bu denetimde çalıştırılmadı. |
| Sayfa işaret yolu / breadcrumb | Kısmen | Ürün/koleksiyon JSON-LD mevcut. Ürün ekranında tam, tıklanabilir “Ana Sayfa > … > Ürün” yolu yok; koleksiyon bağlantısı var. |
| Vaka çalışmaları | Öncelikli ihtiyaç değil | Takı mağazasında gerçek müşteri fotoğrafları, stil örnekleri, bakım ve malzeme rehberleri daha doğrudan faydalı. Rehber ve stil içeriği zaten var. |
| Site hızı | Doğrulanamadı | PageSpeed 429 verdi. `/urunler` sıkıştırma sonrası olmayan HTML ölçüsünde yaklaşık 1,13 MiB; yük miktarı incelenmeli, tek başına yavaşlık hükmü değil. |
| Sticky telefon CTA | Yok, zorunlu değil | Telefon/footer ve ürün WhatsApp bağlantısı var. Mobilde sabit sepete ekle/ödemeye geç CTA'sı mevcut. Telefon/WhatsApp sabit butonu, bunları örtmeyecekse isteğe bağlı. |
| robots.txt | Var | Canlı 200; sitemap adresi ve özel işlem alanlarına tarama kuralları var. |
| Sosyal medya paylaşım resimleri | Var | Genel ve ürün OG görseli erişilebilir; ürün bazlı Twitter metni geliştirilebilir. |
| Google zengin içerik | Kısmen | Temel Product/Offer, Organization, BreadcrumbList, FAQPage ve Article var; kargo/iade schema ve Google doğrulaması açık. |

SSS sayfası müşteri desteği için faydalı; sırf 5 soru eklemek Google'da açılır SSS sonucu garantilemez. Google bu görünümü ağırlıklı olarak yetkili sağlık ve kamu siteleriyle sınırlandırıyor: [resmi FAQ açıklaması](https://developers.google.com/search/blog/2023/08/howto-faq-changes).

**Hız ve görsellerin doğru yorumu**

96 görsel kontrolünde hata yok. 24 özgün görsel 1 MiB üzerinde; en büyüğü yaklaşık 1,80 MiB. Bunlar kaynak dosyalar; tarayıcıya her zaman bu büyüklükte gönderildikleri söylenemez. Örnek optimizer isteği 19,1 KiB AVIF döndürdü. Gerçek mobil LCP, INP ve CLS için PageSpeed/CrUX veya sahadan ölçüm gerekir. Bu denetimin hızlı HTTP yanıtları kullanıcı deneyimi puanı olarak kullanılmadı.

**Hesap veya işletme doğrulaması gerektiren açık işler**

| Kontrol | Bu denetimin sonucu |
|---|---|
| PayTR canlı mod ve `PAYTR_TEST_MODE=0` | Güncel üretim değeri/panel onayı okunmadı. 4 Ağustos tarihli eski belgede test modu açık kalmış; bu bugünkü durumun kanıtı değil. |
| Başarılı/başarısız gerçek ödeme ve tam iade | Gerçek işlem yapılmadı; tamamlanmış sayılmıyor. |
| Stok ve fiyat doğruluğu | Kod sunucuda yeniden hesaplıyor; tüm ürünlerin fiziksel stoğu ve son birimin eşzamanlı satışı doğrulanmadı. |
| Sipariş/kargo/iade e-postaları | Kod mevcut; güncel gerçek teslimat testi yapılmadı. |
| Faturalama, anlaşmalı taşıyıcı, iade kargo süreci | İşletmenin operasyonel doğrulaması gerekli; yeni bir yazılım otomatik olarak şart değil. |
| GA4/Meta veri kabulü | Script varlığı doğrulandı, hesap raporunda gerçek dönüşüm kabulü doğrulanmadı. |
| Search Console kapsamı | DNS kaydı var; indekslenmiş sayfa sayısı ve hatalar bilinmiyor. |
| Google Merchant Center | Kurulum/yayın durumu doğrulanmadı. Satış açılışı için mecburi değil; Google ürün görünürlüğü için değerlendirilebilir. [Google ürün verisi rehberi](https://developers.google.com/search/docs/appearance/structured-data/product). |
| Ticari kayıtlar ve işletmeye özgü yasal süreçler | Halka açık site kontrolü bunları tamamlanmış kabul ettirmez. ETBİS vb. hesap/kayıt durumuna ilişkin bu oturumda kanıt alınmadı. |

**Önerilen iş sırası:** Önce katalog/arama/öneriler ve mobil ödeme; ardından iade ve ürün vaatleri ile onay kayıtları; sonra sitemap/başlık/GA4 düzeltmeleri; bunlarla birlikte kontrollü gerçek sipariş kabul testi. Müşteri yorumu toplama, görünür breadcrumb, sosyal metinler ve Merchant Center sonraki iyileştirmeler olabilir.
