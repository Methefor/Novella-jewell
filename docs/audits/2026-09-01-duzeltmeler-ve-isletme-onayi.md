# Satış öncesi düzeltmeler ve işletme doğrulaması

**3 Eylül 18:09 İstanbul — Kullanıcı 99,90 TL iadenin gerçekleştiğini doğruladı; kontrollü tahsilat/iade testi tamamlandı. Canlı 94 ürün, 119 sitemap adresi ve 125 sayfa taramasında tanımlı kontrollerden hata çıkmadı. Gizli test ürünü kapalı. Yarım ödeme akışı, iade sonrası bildirim ve işletmenin fatura/kargo/ürün doğrulaması gibi açık işler sürüyor. Güncel karar ve öncelikler: [satışa hazırlık özeti](2026-09-03-satisa-hazirlik.md).**

## Son canlı durum

### 3 Eylül 18:09 İstanbul — İade teyidi ve son satışa hazırlık kontrolü

- Kullanıcı “kontrol edildi iade gerçekleşti” dedi; [tahsilat/iade testindeki](2026-09-03-canli-odeme-ve-iade.md) banka yansıması açık işi kapandı.
- Salt okunur canlı tarama: **94 katalog ürünü, 119 sitemap adresi, 125 sayfa**, `missingFromSitemap=[]`, `failures=[]`. Kapsam: sitemap kapsamı, sitemap sayfalarının 200/H1/noindex kontrolleri, eski katalog bağlantıları, ürün başlığında tek marka, ürün iade politikası yapılandırılmış verisi. [Ham rapor](2026-09-03-sale-readiness-http.json). Bu sonuç Google indekslenmesi, hız puanı veya tüm kullanıcı etkileşimlerinin testi değildir.
- Kaynakta yarım ödeme oturumu DB sonucu üzerinden bekliyor; PayTR durum sorgusuyla otomatik uzlaştırma yok. İade e-postası daha sonra tamamlanma bildirimi vaat ediyor, ancak böyle bir takip/bildirim işleyicisi bulunmadı. E-posta gönderim hataları loglanıyor; yeniden gönderim kuyruğu yok.
- Fatura kesme yöntemi ve anlaşmalı gönderim/iade süreci kullanıcıya soruldu. Henüz alınmamış işletme teyitleri yok sayılmadı; eksik kurulum oldukları da varsayılmadı.

### 3 Eylül 17:58–18:04 İstanbul — Başarılı ödeme ve tam iade gönderimi

- [Ayrıntılı canlı test kaydı](2026-09-03-canli-odeme-ve-iade.md): **NJ-2026-0009 / 99,90 TL**, PayTR **1320594956**, başarılı ödeme/bildirim; DB paid ve tek `sale` stok hareketi **1→0**. Kullanıcı telefonunda sipariş alındı ekranını gördü.
- Sipariş e-postası **Delivered**, doğru toplam ve **NJ-2026-0009-belgeler.txt** eki mevcut. İade e-postası da **Delivered**.
- Daha önce onaylanan tam iade yönetici panelinden bir kez yapıldı. DB iade kaydı success/99,90 TL, referans **NJREF20260009**. PayTR önce Beklemede, ardından **18:02:17'de banka POS sistemine girildi**; kalan tutar 0 TL. Kart hesabındaki yansıma henüz teyit edilmedi; uygulamanın success alanı API kabulünü ifade ediyor.
- Fiziksel stok geri giriş kutusu işaretlenmedi. Gizli test ürünü 18:02:55'te yayından kaldırıldı. Bilgisayar sepetindeki test öncesi yüzük tek adet geri eklendi; yeni ödeme açılmadı.
- Açık: yarım ödeme için otomatik sağlayıcı uzlaştırması; nihai iade durumunun siteye işlenmesi ve müşteriye vaat edilen tamamlanma bildirimi; fiziksel iade/kargo/fatura süreçleri; tekrarlanan callback ve iki mobil platformun ayrı kabulü. Canlı test bu kapsamların tamamlandığı anlamına gelmez.

### 3 Eylül 17:54 İstanbul — Önceki işlem kapandı, telefon denemesi serbest

- Salt okunur kontrol: **NJ-2026-0008 failed**, paid_at null, stok **1**. Mevcut test siparişlerinde pending kayıt kalmadı; bu ürünü tutan önceki rezervasyon sonlandı.
- PayTR **NJ20260008 / 1320572702** işlem detayında ödeme durumu “Müşteri ödeme yapmaktan vazgeçti ve ödeme sayfasından ayrıldı”, bildirim **Tamamlandı**, onay tarihi boş. Manuel sipariş/stok değişikliği yapılmadı.
- Telefonundaki mevcut formu yenilemeden “Siparişi Tamamla” ile yeni **99,90 TL** denemesine devam edebileceği kullanıcıya bildirildi. Bilgisayardan yeni sipariş açılmadı. Tam kapanış zamanı ölçülmedi; 17:42 kontrolünde pending, 17:54 kontrolünde failed görüldü.

### 3 Eylül 17:37 İstanbul — Telefondaki yeni deneme rezervasyona takıldı

- Kullanıcı telefonda test ürününün başka bir ödeme için ayrılmış olabileceği uyarısını aldı. DB'de yeni sipariş oluşmamış; yalnızca NJ-2026-0008 pending, stok 1. PayTR detayında NJ20260008 için onay tarihi ve ödeme durumu hâlâ `-`.
- Kaynak kontrolünde bu 409 uyarısının mevcut pending siparişe ayrılan stoktan geldiği doğrulandı. Ödeme formu hata sonrası bilgileri koruyor; rezervasyon çözüldükten sonra aynı formdan tekrar gönderilebilir. Telefon oturumuna araç erişimi yok.
- Sağlayıcıya `timeout_limit=30` gönderilmiş. Oturum 17:11:33'te açılmış olsa da tek başına süre dolması kesin başarısızlık kanıtı sayılmadı; sağlayıcı bildirimi bekleniyor. Manuel stok artışı, rezervasyon silme veya yeni ödeme oturumu oluşturma yapılmadı.
- **17:42:32 İstanbul son kontrolü:** DB hâlâ NJ-2026-0008 pending, paid_at null, stok 1; yeni sipariş yok. 17:41 sonrasındaki PayTR detay yenilemesinde de ödeme/onay sonucu `-`. Tanımlı 30 dakikanın geçmesiyle hemen kapanış oluşmadığı görüldü; kapanış saati garanti edilmedi. Telefon formunu tekrar göndermeden önce sağlayıcı sonucunun kesinleşmesi gerekiyor. Bu kontrol rezervasyon engelini gidermedi; engel açık.

### 3 Eylül 17:22 İstanbul — Bankamatik kartı denemesi

- Kullanıcı önceki denemenin İş Bankası kredi kartıyla, son denemenin İş Bankası bankamatik kartıyla yapıldığını bildirdi. Ek soruya yanıtında bankamatik kartıyla da SMS ekranına ulaşmadan doğrudan aynı bağlantı hatasını aldığını ve banka uygulamasında işlem görünmediğini doğruladı. Her iki deneme aynı uygulama içi tarayıcıda yapıldığı için banka genelinde kesinti olduğu sonucuna varılmadı; tarayıcı/ağ etkisi henüz ayrıştırılmadı.
- PayTR'de **NJ20260008**, işlem ID **1320572702**, zaman **03.09.2026 17:21:01**, **99,90 TL**, İş Bankası/tek çekim kaydı mevcut. Ödeme durumu ve onay tarihi `-`.
- Salt okunur DB kontrolünde NJ-2026-0008 **pending**, paid_at null, rezervasyon mevcut, stok **1**, iade kaydı yok. Mevcut kart oturumu yeniden yüklenmedi; yeni ödeme veya iade açılmadı. Sonuç kesinleşmeden başka kartla yeni deneme başlatılmamalı.
- Sonuç kesin olarak başarısız kapandıktan sonra, aynı uygulama içi tarayıcıda tekrar etmek yerine kullanıcının telefonundaki standart Chrome/Safari tarayıcısında yeni oturumla kontrollü deneme yapılması öneriliyor. Eski iframe/token taşınmamalı. Bu henüz uygulanmış veya sorunu giderdiği doğrulanmış bir çözüm değildir.

### 3 Eylül 17:10–17:12 İstanbul — PayTR yanıtı ve yeni deneme

- [PayTR yanıtı ve önceki işlemin kesin sonucu](2026-09-03-paytr-maxinet-destek-talebi.md) kaydedildi. NJ20260007 panelde başarısız, bildirim **Tamamlandı**; NJ-2026-0007 DB'de **failed**, paid_at null. Manuel kapatma yapılmadı, stok 1. Başarısız bildirim akışı doğrulandı.
- Eski ödeme sayfası yenilendiğinde kapanmış oturum temizlenip sepete dönüldü. Gizli test ürünü tekrar tek adet eklendi ve normal site bağlantılarıyla ödeme formuna geçildi.
- Önceden onaylı 99,90 TL canlı ödeme/tam iade testi için **NJ-2026-0008** oluşturuldu: `2026-09-03T14:11:30.556Z`, payment_ready `2026-09-03T14:11:33.053Z`. Tek gizli ürün, pending, toplam 99,90 TL, rezervasyon ve sözleşme kaydı mevcut, paid_at null.
- Kullanıcının mevcut uygulama içi Ödeme sekmesinde boş PayTR kart formu ve 99,90 TL tutar doğrulandı. Kart/OTP araçlarla girilmedi; yeni iframe yeniden yüklenmedi. Kullanıcıya kart ve banka doğrulaması için açık bırakıldı. Yeni teknik neden varsayımıyla kod veya güvenlik ayarı değiştirilmedi.

### 3 Eylül 13:38–13:46 İstanbul — İş Bankası doğrulama ekranı bağlantı hatası

- Kullanıcı kart bilgilerini girdikten sonra `maxinet.isbank.com.tr bağlantıyı beklenmedik şekilde kapattı` hatası aldığını, SMS ekranına ulaşmadığını ve banka uygulamasında 99,90 TL işlem görünmediğini bildirdi. İlk mesajda alan adı `axinet.isbank.com.tr` olarak yazılmıştı; sonraki açıklamada `maxinet.isbank.com.tr` olarak düzeltildi. Codex uygulama içi tarayıcısındaki mevcut ödeme ekranında boş/hatalı iframe görüldü; ödeme sayfası yeniden yüklenmedi.
- PayTR panelinde merchant_oid **NJ20260007**, işlem ID **1320402284**, işlem zamanı **03.09.2026 13:38:41**, tutar **99,90 TL**, İş Bankası/tek çekim kaydı var. Ödeme durumu ve onay tarihi `-`; kesin başarılı/başarısız sonuç gösterilmiyor. Bu kayıt tahsilat kanıtı değildir.
- Son salt okunur DB kontrolü: **NJ-2026-0007 pending**, paid_at null, rezervasyon mevcut, stok **1**, iade kaydı yok. Yeni ödeme veya iade başlatılmadı; mevcut sipariş manuel başarısız yapılmadı.
- PayTR API Uyarıları sayfasının 03.09.2026 tarihli listesinde kayıt yok. Vercel'de ilgili üretim dağıtımı için 10:34 UTC sonrası error/warning taramasında ve 10:35 UTC sonrası callback yolu sorgusunda kayıt dönmedi; bu sınırlı sorgular uçtan uca başarı kanıtı değildir.
- Canlı `/odeme` HTTP 200. Kaynakta iframe sandbox yok, canlı yanıtta Content-Security-Policy yok. `X-Frame-Options: DENY` sitenin başka sayfaya gömülmesini sınırlar; bankanın kendi sayfasındaki bağlantı kesilmesinin nedeni olarak gösterilmedi. iFrame V2 token ve resizer ayarları mevcut. Kanıtlanmış bir site kodu hatası bulunmadığından spekülatif güvenlik ayarı değişikliği yapılmadı.
- Kesintinin banka, PayTR yönlendirmesi veya tarayıcı/ağ kaynaklı olduğu henüz ayrıştırılmadı. [Teknik destek talebi](2026-09-03-paytr-maxinet-destek-talebi.md), kullanıcının açık onayıyla **03.09.2026 13:53:50** tarihinde POS / Banka Hataları → Ödeme kategorisinde gönderildi. Panelde teslim doğrulaması, tarihli kayıt ve “Mesajınız incelenmektedir” durumu görüldü. Kesin sağlayıcı sonucu alınmadan yeni kart denemesi açılmamalı.

### 3 Eylül 13:35 İstanbul — Alan adı onayı sonrası yeni ödeme testi

- Kullanıcının ilettiği PayTR onayının ardından mağaza 728692 Ayarlar sayfasında site `https://novellajewell.com/`, Bildirim URL `https://novellajewell.com/api/odeme/callback` doğrulandı. Callback ayarı zaten doğru; panel ayarı değiştirilmedi. PayTR'nin [resmi bildirim akışı](https://dev.paytr.com/iframe-api/iframe-api-2-adim) uyarınca tam doğrulama gerçek işlem sonucu ve callback kaydıyla yapılmalı.
- NJ-2026-0006 DB'de `failed`, paid_at null; son güncelleme 2 Eylül 01:18:10 UTC. PayTR işlem numarası NJ20260006 ve test alıcısının e-postasıyla yapılan iki aramada işlem bulunamadı. Önceki test kaydına manuel müdahale edilmedi; yeni test öncesinde stok 1.
- Daha önce onaylanan 99,90 TL canlı ödeme/tam iade testi için **NJ-2026-0007** oluşturuldu. Oluşum `2026-09-03T10:35:34.741Z`, ödeme ekranı hazır `2026-09-03T10:35:36.706Z`. Tek gizli test ürünü, toplam 99,90 TL, pending, paid_at null, rezervasyon ve sözleşme kaydı mevcut.
- PayTR iframe'inde 99,90 TL tutar ve kart formu görüldü; alan adı hatası görünmedi. Kullanıcının mevcut Ödeme sekmesi açık bırakıldı; iframe yeniden yüklenmedi, kart/OTP girilmedi. Kart formunun açılması başarılı tahsilat kanıtı değildir.
- Gizli test ürününün sepetteyken tam sayfa yenilemede halka açık katalog uzlaştırması nedeniyle kaldırıldığı görüldü; normal site bağlantılarıyla ödeme formuna ilerlenince yeni test sorunsuz açıldı. Bu davranış gizli ürünün katalog dışında kalmasından kaynaklanıyor; halka açık ürünler için yapılan önceki yenileme kontrollerini etkilemiyor. Test sonrasında gizli ürün kapatılmalı.
- Kullanıcı kart/banka adımını tamamlayınca: sağlayıcı canlı işlem durumu, signed callback, paid kaydı, tek stok düşümü, Resend sipariş e-postası/TXT belge eki, ardından önceden onaylanan tam iade doğrulanacak.

### 3 Eylül — Vitrin, kutu videoları ve stok görünürlüğü yayında

- Güncel ürün görselleriyle kategori kartları, iki kutu videosu, ürün/kartvizit içeriği ve stokta olmayan ürünlerin görünür kalıp satın alınamaması yayınlandı. İşletmenin henüz sunmadığı hediye notu ve hediye tercihleri kaldırıldı. [Ayrıntılı değişiklik ve doğrulama kaydı](2026-09-03-vitrin-ve-paketleme.md).
- Güncel üretim sürümü `dpl_GDgcKQof3CAJjmHADwErQTv7tExW`, Ready; ana alan adı ve www bu sürüme bağlı. 23 test, lint, TypeScript, 241 sayfalık production build ve canlı mobil/masaüstü tarayıcı kontrolü başarılı. Üretim bağımlılıklarında 0 güvenlik bildirimi.
- Bu düzenlemeler ödeme/migration işlemi gerektirmedi. PayTR alan adı yanıtı ve gerçek ödeme/tam iade doğrulaması bekleniyor.

### 3 Eylül — PayTR alan adı güncelleme talebi gönderildi

- Kullanıcının açık gönderim onayı ve PayTR oturumunu açması ardından [onaylı talep metni](2026-09-02-paytr-alan-adi-talebi.md), Mağaza Bilgi Güncelleme → Domain/URL Adresi Güncelleme kategorisinde gönderildi. `novellajewell.com` ve `www.novellajewell.com` için mağaza adresi/API yetkisi güncellemesi ve canlı kullanım kontrolü istendi.
- PayTR panelinde “Mesajınız destek ekibimize ulaştırılmıştır” doğrulaması ve destek listesinde **03.09.2026 01:03:24** tarihli kayıt görüldü. Durum: “Mesajınız incelenmektedir. En kısa sürede yanıtlanacaktır.” Ayrı talep numarası gösterilmiyor; [destek panelinde](https://www.paytr.com/magaza/destek) tarih/saat ve kategoriyle takip edilebilir.
- Alan adı yetkisinin güncellendiğine dair doğrulama henüz bulunmuyor. PayTR yanıtı ve NJ-2026-0006 sağlayıcı sonucu doğrulandıktan sonra kontrollü canlı ödeme/tam iade testine devam edilmeli.

### 2 Eylül 03:50 İstanbul — PayTR alan adı engeli

- Kullanıcının ekran görüntüsü: “Kullandığınız API bilgileri sadece https://novella-jewell.vercel.app/ için tanımlıdır. Farklı bir web sitesinde kullanım için bize ulaşın.” Bu, canlı satış için engeldir; kart formunun kısa süre görünmüş olması ödeme kabul testi sayılmaz.
- PayTR Ayarlar sayfasında SİTE ADRESİNİZ eski Vercel alan adı; callback doğru `https://novellajewell.com/api/odeme/callback`. Görünen değişiklik bağlantısı callback'e ait, site adresi için düzenleme alanı yok.
- Mağaza Bilgi Güncelleme → Domain/URL Adresi Güncelleme kategorisinde [destek talebi taslağı](2026-09-02-paytr-alan-adi-talebi.md) hazırlandı. `novellajewell.com` ve `www.novellajewell.com` için kayıt/yetki güncellemesi isteniyor. Bu kontrol sırasında gönderim onayı bekleniyordu; 3 Eylül tarihli güncel durum yukarıda.
- DB salt okunur kontrolünde NJ-2026-0006 pending, paid_at null, stok 1. Bu bulgu banka tahsilatının kesin kanıtı değildir; kullanıcı yeniden ödeme yapmaya yönlendirilmedi. PayTR alan adı onayı ve bu siparişin sağlayıcı sonucu doğrulanmadan yeni ödeme açılmamalı.
- Daha önce kayıtlı eski alan adı açık iş olarak yazılmıştı; ödeme öncesinde satış engeli olarak ele alınması gerekiyordu. “Kart ekranı hazır” kaydı alan adı yetkisini doğrulamıyordu.

### 2 Eylül — ödeme sayfasını yeniden açma düzeltmesi

- Son dağıtım `dpl_DNsVhP1P8oi1WqtUFwLAUG4cyRtt`, Ready; novellajewell.com ve www bu sürüme bağlı. Production build, 20 test, lint ve type-check başarılı; yeni dağıtım hata günlüğünde kontrol anında hata yok.
- Canlı yenilemede `NJ-2026-0005` için “Ödeme sonucu bekleniyor”, doğru toplam, durum kontrolü ve telefon/iletişim bağlantıları doğrulandı. Kart girilmeyen bu test, PayTR panelinde numara ve e-posta ile tahsilat olmadığı görüldükten sonra yalnızca tam sipariş/zaman/tutar/ürün eşleşmesiyle kapatıldı. Stok değişmedi. “Ödeme durumunu kontrol et” ardından kapanmış oturum temizlenip sepete dönüldüğü doğrulandı.
- Kullanıcıya bırakılan son ekran **NJ-2026-0006, 99,90 TL**, PayTR kart formu; açılış `2026-09-02T00:46:18.426Z` (03:46 İstanbul). Ekran tekrar yüklenmedi. DB'de yalnızca bu test pending, stock 1, sözleşme ve rezervasyon kayıtları var; paid_at yok. Kullanıcı kart ve banka doğrulamasını bu açık ekranda tamamlayacak. Önceki 0003/0004/0005 failed. Kart bilgileri araçlarla girilmedi/kaydedilmedi.
- İlk ödeme iframe'i yalnızca React belleğinde tutulduğu için sayfa yeniden açılınca kayboldu. `NJ-2026-0003` rezervasyonu korunurken ikinci checkout son stok uyarısıyla durdu.
- Ödeme oturumu artık imzalı, HttpOnly/Secure/SameSite çereziyle tanınıyor. Sunucu imzayı ve sipariş sahipliğini DB'den kontrol ediyor. GET `/api/checkout` ve mevcut oturumla tekrarlanan POST yalnızca mevcut durumu döndürüyor: paid sipariş sonuç sayfasına gider, failed oturum temizlenir, pending sipariş durum/destek ekranında kalır. Yanlış imza veya başka sipariş bilgisi ödeme erişimi sağlamıyor.
- Açık iframe geri yüklenmeden boş sepet yönlendirmesi yapılmıyor. Formdaki eşzamanlı çift gönderim de engellendi. Ödeme öncesinde yanıtın tamamen kaybolması ve çerezin hiç alınamaması ayrı bir kurtarma sınırıdır; otomatik yeni tahsilat başlatılmaz.
- 18 test, lint, type-check ve production build başarılı; production bağımlılık denetimi 0 bildirim. Canlı imzasız/sahte oturum GET'i yalnızca `type:none`, `Cache-Control: no-store, private` döndürüyor.
- İlk oturum düzeltmesi `dpl_GmJv2emJUXqzSah5UeWffhCkT241`, URL biçimi düzeltmesi `dpl_H1jin6sha9rrY7Q6HbATEM6cnKH1` ile yayınlandı. Son davranış aşağıdaki canlı bulguya göre güncellendi. Bu düzeltmeler ek migration gerektirmedi.
- 00:22 UTC'de PayTR panelinde hem `NJ20260003` hem alıcı e-postası aramasında işlem bulunamadı. 00:31 UTC'de süre dolduktan sonra iki arama tekrarlandı; yine işlem yok. Yalnızca bu test siparişi, 31 dakika / pending / ödenmemiş / 99,90 TL / tek test ürünü koşullarını denetleyen işlemle kapatıldı. `payment_expired` olayı kaydedildi; fiziksel stok değişmedi, rezervasyon kalktı.
- Sonraki `NJ-2026-0004` denemesinde Vercel hata kaydı, yeni oturum çerezinin PayTR URL doğrulamasında reddedildiğini gösterdi. Müşteriye iframe verilmeden sipariş otomatik `failed` oldu; tahsilat başlatılmadı. Sağlayıcının token'ını yalnızca harf/rakam varsayan kısıt kaldırıldı; HTTPS PayTR alan adı ve ödeme yolu kısıtı korundu. Token değişmeden imzalanıyor; farklı token biçimleri ve zararlı URL'ler test edildi. Güncel test sonucu 19/19 ve type-check başarılı.
- `NJ-2026-0005` için 99,90 TL PayTR kart formu açıldı. Token içinde `-` bulunduğu, gizli token değeri kaydedilmeden doğrulandı. Sayfa yenilenince aynı sipariş ve aynı iframe URL'si korundu; **PayTR kullanılmış token'ı reddederek “Bu ödeme sayfası artık geçersiz” gösterdi. Aynı iframe'i geri yükleme yaklaşımı bu nedenle kabul edilmedi.** Kart bilgisi girilmedi, DB'de sipariş pending kaldı.
- Son yaklaşım kullanılmış iframe'i GET/tekrar POST yanıtına koymuyor; güvenli durum ekranı ve telefon/iletişim bağlantıları gösteriyor. Otomatik yeni ödeme/rezervasyon yok. Bu yaklaşım mükerrer siparişi engeller; **yarım kalmış PayTR oturumunun otomatik uzlaştırılması ve yeniden ödeme açılması hâlâ satış öncesi açık iştir.** 004 durum-sorgu yanıtı tek başına kesin başarısızlık sayılmamalı. PayTR'nin [resmi WooCommerce modülü](https://wordpress.org/plugins/paytr-sanal-pos-woocommerce-iframe-api/) her denemede farklı sağlayıcı işlem numarası üretiyor; aynı token'ı tekrar kullanmıyor.
- PayTR V2 için iframeResizer adresi `?v2` ile düzeltildi ([resmi V2 dokümanı](https://dev.paytr.com/iframe-api/iframe-api-yeni-tasarim)). Son test paketi 20/20, lint ve type-check başarılı.
- Yönetici sipariş ekranı ve Resend e-posta listesi erişilebilir; gerçek tahsilat/iade henüz gerçekleşmedi.

- Üç yeni sipariş alanı ve pending stok indeksi üretimde uygulandı; mevcut siparişler değiştirilmedi.
- Vercel dağıtımı `dpl_4mto4SVWgVLgab7ZwmnLpXU1NmZm` Ready. `novellajewell.com` ve `www.novellajewell.com` yeni dağıtıma taşındı; önceki sabit alan adı eşlemeleri güncellendi.
- Ana sayfa, SSS, hukuki sayfalar ve katalog erişimi başarılı. Geçersiz callback imzası 400, geçersiz sipariş anahtarı 404, eksik checkout isteği 400 döndü.
- PayTR panelinde sözleşme ve Sanal POS komisyonu mevcut, `canli_mod` seçili, callback adresi `https://novellajewell.com/api/odeme/callback`. Panelde kayıtlı site adresi halen eski Vercel adresi; işletme/PayTR tarafından güncelliği doğrulanmalı. Production `PAYTR_TEST_MODE` değeri gizli olduğundan doğrudan okunmadı; canlı ödeme sonucu ile kesinleştirilecek.
- Kullanıcı 99,90 TL gerçek ödeme ve ardından tam iadeye onay verdi. `presales-live-payment-test-v1` gizli ürünü 50 TL ve 1 stokla oluşturuldu. Normal kargo bedeli 49,90 TL; ödeme ekranı 99,90 TL gösteriyor.
- İlk test siparişi `NJ-2026-0003` için 99,90 TL toplam, stok rezervasyonu, ödeme oturumu ve kalıcı sözleşme kaydı doğrulanmıştı; bu oturumun kapanışı yukarıda kaydedildi. Tahsilat henüz yok; yeni doğrulanmış ekranda kullanıcı kart ve banka doğrulama adımını tamamlayacak.
- Sonrasında signed callback, tek stok düşümü, sipariş e-postası ve TXT belge eki, yönetici görünümü ve tam iade doğrulanacak. Önceki mesajdaki PDF ifadesi doğru değildi; mevcut sözleşme sureti TXT ekidir.
- Test bitince `node scripts/manage-live-payment-test-product.mjs --cleanup` ile ürün yayından kaldırılacak. Bekleyen test siparişi varsa betik kapatmayı reddeder. Test öncesi sepette 1 adet Stockholm Arc Oval Taşlı Altın Yüzük (640 TL) vardı; test toplamını korumak için çıkarıldı, test sonunda kullanıcı sepetine geri eklenecek.

Belgenin aşağıdaki yerel kontrol sonuçları 1 Eylül çalışma anını kaydeder; migration ve dağıtım hakkındaki güncel durum bu bölümdeki gibidir.

İlk bulgular [satış öncesi denetimde](2026-09-01-satis-oncesi-denetim.md) korunuyor. Aşağıdaki sonuçlar `codex/satis-oncesi-duzeltmeler` dalındaki değişikliklere aittir.

## Tamamlanan düzeltmeler

| Sıra | Değişiklik | Sonuç |
|---|---|---|
| 1 | Katalog, koleksiyon, arama, ilgili ürünler, son görülenler ve sepet önerileri aynı yayınlanmış katalogdan besleniyor. | Eski katalogdaki ürünlere giden vitrin bağlantıları kaldırıldı. Celeste araması iki güncel ürün buluyor. Çok sonuçlu arama `/arama?q=…` sayfasını açıyor. |
| 2 | Persist edilen sepet güncel katalogla eşleştiriliyor. | Eski fiyat ve bağlantılar yenileniyor; yayından kaldırılan ürünler ve bulunmayan varyantlar çıkarılıyor. Stok/adet değişirse müşteriye bilgi veriliyor. |
| 3 | Mobil ödeme formunun kolon ve alan genişlikleri düzeltildi; etiketler alanlara bağlandı. | 320, 390 ve 1440 piksel kontrollerinde yatay taşma yok. Boş formda yedi alanın hatası erişilebilir biçimde gösteriliyor. |
| 4 | Fiyat ve stok doğrulaması güçlendirildi. | Aynı varyantın farklı kişiselleştirmelerle eklenen satırları toplam stok sınırını aşamıyor. Ödeme öncesi sunucu toplamı müşterinin gördüğü toplamdan farklıysa 409 ile durduruluyor. |
| 4a | Ödeme oturumları arasında stok rezervasyonu eklendi. | Stok kontrolü ve pending sipariş aynı kilitli işlemde oluşturuluyor. Devam eden ödemelere ayrılmış adetler ikinci müşteriye kullandırılmıyor. Başarısız ödeme rezervasyonu bırakıyor; geciken bildirim için stok korunuyor. |
| 5 | Neon bağlantısındaki işlem desteği düzeltildi. | Normal sorgular HTTP ile; sipariş, stok ve iade gibi birden çok sorguyu birlikte tamamlaması gereken işlemler WebSocket transaction ile çalışıyor. Bağlantı işlem sonunda kapanıyor. Node.js 22 veya üstü gerekiyor. |
| 6 | İade, kargo, SSS, ön bilgilendirme ve satış sözleşmesi tutarlı hale getirildi. | İade kargo bedeli, sürelerin başlangıcı, hijyen istisnası ve hasarlı teslimat koşulları ortak metinlerden geliyor. E-postadaki “30 iş günü” çelişkisi giderildi. |
| 7 | Sabit “nikel içermez / alerji yapmaz / renk solmaz” vaatleri kaldırıldı. | Ortak bakım ve malzeme açıklamaları kullanılıyor. Ürün açıklaması detay sayfasında görünür. Veritabanındaki her ürünün malzeme ve kaplama doğruluğu ayrıca işletme kontrolü bekliyor. |
| 8 | Siparişe bağlı kalıcı onay kaydı ve belge sureti eklendi. | Metin sürümü, sunucu onay zamanı, üç metnin tam içeriği, ürünler ve toplamlar siparişte saklanacak. Onay e-postası kaydedilmiş sureti TXT eki olarak gönderecek. Güncel sayfa değişse de eski suret değişmeyecek. |
| 9 | SEO başlıkları, koleksiyon H1'leri ve sitemap güncellendi. | Ürün başlıklarında marka bir kez yer alıyor. Koleksiyon H1'i sunucuda üretiliyor. Sitemap 94 ürünü ve rehberleri kapsıyor. Yayın/stok değişiklikleri ilgili sayfa önbelleklerini yeniliyor. |
| 10 | Ürün sosyal paylaşım metinleri ve yapılandırılmış veri düzeltildi. | Ürüne özel Twitter metni, iade politikası verisi eklendi; gerçekte belirlenmemiş bir fiyat bitiş tarihi üretilmiyor. |
| 11 | GA4/Meta satın alma olayları düzeltildi. | Doğrulanmış siparişten ürün, adet ve tutar gönderiliyor; kargo GA4 ürün değerinden ayrılıyor. Onay olmadan olay gönderilmiyor. Etiket geç hazır olduğunda tekrar deneniyor; aynı işlem tekrar sayılmıyor. GA4/birinci taraf sayfa alanlarına ödeme doğrulama parametresi eklenmiyor. |
| 12 | Üretim bağımlılıkları güncellendi. | Next.js 16.3.4; `npm audit --omit=dev` sonucu sıfır bilinen açık. |

İade metninin dayanağı [Ticaret Bakanlığının mesafeli sözleşme açıklaması](https://tuketici.ticaret.gov.tr/yayinlar/tuketici-bilgi-rehberi/mesafeli-sozlesmeler-hakkinda-bilgilendirme); 316L bileşimi için [üretici tablosu](https://www.outokumpu.com/en/products/product-ranges/supra) esas alındı. Bunlar işletmenin tedarikçi belgelerinin veya kendi süreçlerine ilişkin nihai hukuki kontrolünün yerine geçmez.

## Kontrol sonuçları

- `npm run build`: başarılı; 241 statik çıktı üretildi.
- `npm run lint` ve `npm run type-check`: başarılı.
- `npm test`: 15/15 başarılı. Fiyat/adet hesabı, birleşik varyant sınırı, sözleşme sureti, ödeme analitiği ve izin/tekrar davranışı, sepet yenileme, öneriler, Türkçe arama ve eklemeli migration kontrol edildi. Dört rezervasyon testi son birime rakip iki istek, başarısız işlem sonrası yeniden deneme, açılmamış oturumun zaman aşımı, geciken/eski ödeme ve ödenmiş stok senaryolarını kapsıyor. İade testleri yalnızca hedef siparişin kilitlendiğini, PayTR imzasını ve belirsiz yanıtta ikinci iadenin engellendiğini doğruluyor.
- Yeni migration boş bir yerel PostgreSQL uyumlu PGlite veritabanında sınandı: eski sipariş korunuyor, yeni JSONB sureti geri okunabiliyor, başarısız işlem geri alınıyor.
- Yapılandırılmış Neon bağlantısında iki sorgulu **salt okunur** transaction başarılı. Sipariş, stok veya müşteri verisi yazılmadı.
- Salt okunur yayın ön kontrolünde yeni üç kolon henüz yok, migration geçmişi var, **bekleyen sipariş sayısı 0**. Bu sayı bağlı ortamın kontrol anına aittir; yayın öncesi tekrar bakılmalı.
- Yerel HTTP kontrolü: **125 adres, 119 sitemap URL'si, 94 ürün, sitemap dışında kalan ürün yok, taranan vitrinlerde eski katalog bağlantısı yok.** İndekslenebilir sayfalar 200, tek H1 ve indekslemeye açık robot metası döndürüyor. [Makine tarafından okunabilir sonuç](2026-09-01-after-http.json).
- Tarayıcı: Celeste iki sonuç; Küpe aramasındaki “Tüm 45 sonucu gör” bağlantısı 45 ürünlü arama sayfasını açıyor. 320/390/1440 piksel ödeme formu kontrol edildi. [Düzeltilmiş mobil ödeme görüntüsü](2026-09-01-mobile-checkout-after.png).
- Genel bilinmeyen adres 404/noindex. Eski ürün adresi Next.js akışlı yanıtında hâlâ HTTP 200 + noindex/not-found içeriği dönebiliyor; bu adres artık katalog ve sitemap'ten bağlantı almıyor. Tüm ürün 404 durum kodlarının düzeldiği iddia edilmiyor.

HTTP ve tarayıcı kontrolleri `localhost:3000` geliştirme sunucusunda yapıldı. Derlenmiş üretim sunucusu yerelde Clerk publishable key eksikliğinden istek kabul edemedi; üretim çalışma zamanı kabul testi tamamlandı sayılmıyor. Canlıdaki Clerk hesabı veya anahtarları değiştirilmedi.

Tekrar kontrol için, yerel sunucu açıkken:

```powershell
npm test
npm run lint
npm run type-check
npm run build
npm audit --omit=dev
node scripts/check-presales-http.mjs http://localhost:3000
node --import tsx scripts/check-db-transaction.ts
node --import tsx scripts/check-presales-db.ts
```

Son iki komut ortamda tanımlı gerçek veritabanına salt okunur bağlanır. Test paketi ise gerçek DB ve e-posta anahtarlarını kullanmaz. Tam bağımlılık denetiminde Drizzle geliştirme araçlarının esbuild zincirinde dört orta seviye bildirim kaldı; kırıcı bir sürüm düşürme önerisi otomatik uygulanmadı.

## Yayına alma sırası

Bu bölüm 1 Eylül'deki ilk yayın planını korur. **Migration ve production dağıtımı daha sonra onayla tamamlandı; tekrar uygulanmaları gerekmiyor.** Sonraki günlük kayıtları ve güncel satışa hazırlık özetini esas alın.

1. İşletmenin aşağıdaki metin, ürün ve operasyon kontrollerini tamamlaması.
2. Üretim veritabanı migration geçmişi ve yedeği kontrol edilerek **`drizzle/0015_order_legal_acceptance.sql`** ve **`drizzle/0016_checkout_stock_reservation.sql`** değişikliklerinin uygulanması. `orders.legal_acceptance`, `checkout_reserved`, `payment_ready_at` alanları ve pending sipariş indeksi eklenir; eski kayıtlar silinmez. Bağlı veritabanında Drizzle geçmişi yalnızca iki migration kaydı içerirken şema daha ileri durumda; bu nedenle bu yayın için genel `npm run db:migrate` çalıştırılmamalı. İncelenmiş idempotent `scripts/apply-presales-migrations.ts --apply` betiği kullanılmalı ve ardından `check-presales-db.ts` ile doğrulanmalı. Bu oturumda çalıştırılmadı.
3. Migration'lardan sonra uygulamanın Node.js 22+ ortamına dağıtılması. Yeni sürüm kolonlar olmadan yayınlanırsa sipariş işlemleri hata verir. Migration'lar tek başına eski uygulamayla uyumludur; geri dönüşte kolonları silmek gerekmez. Yayın öncesinde eski pending sipariş varsa sağlayıcı sonucu ile uzlaştırılmalı; belirsiz bir ödeme yalnızca yaşına bakılarak iptal edilmemeli.
4. Üretim Clerk yapılandırmasıyla kamuya açık mağaza ve yönetici erişiminin kontrolü. Ödeme, e-posta ve son stok kabul senaryolarının aşağıdaki ölçütlerle tamamlanması.
5. Canlı sitemap/arama kontrolü, Search Console gönderimi ve ölçüm hesaplarında doğrulama.

## Satış açılışından önce işletmenin doğrulayacağı liste

Her satır için sonuç, tarih ve varsa sipariş/işlem numarası kaydedilmeli. Kart verisi, şifre veya API anahtarı bu belgeye yazılmamalı.

| Tamam | Kontrol | Kabul ölçütü |
|---|---|---|
| [ ] | Satıcı bilgileri | Unvan, adres, telefon, e-posta, vergi dairesi ve faturadaki bilgiler aynı ve güncel. |
| [ ] | Ürün bilgileri | Malzeme, kaplama, ölçü, gerçek fotoğraf, fiyat ve fiziksel stok 94 ürün için doğrulanmış. İndirim öncesi fiyatlar gerçek fiyat geçmişiyle destekleniyor. |
| [ ] | Kargo | Ücret/eşik, 1–3 iş günü hazırlık vaadi, gönderim bölgeleri ve anlaşmalı taşıyıcı işletmenin gerçek süreciyle uyumlu. |
| [ ] | İade | İade taşıyıcısı/kodu, ücretsiz gönderim, teslim alma ve geri ödeme sorumluları belirlenmiş. Ambalaj/hijyen uygulaması metindeki istisnayla uyumlu. |
| [ ] | KVKK ve kayıtlar | Hizmet sağlayıcılar, yurt dışı aktarım dayanakları, saklama süreleri, başvuru adresi ve işletmeye uygulanabilen ticari kayıtlar doğrulanmış. Metinler nihai olarak onaylanmış. |
| [x] | PayTR gerçek işlem ve bildirim | NJ-2026-0009 için gerçek tahsilat, doğru alan adı ve tamamlanan bildirim doğrulandı. Gizli ortam değişkeni dışarı aktarılmadı; canlı işleyiş gerçek işlemle doğrulandı. |
| Kısmi | Başarılı ödeme | NJ-2026-0009: tek tahsilat/paid, 99,90 TL, tek stok düşümü, yönetici görünümü ve kullanıcının gördüğü sonuç doğrulandı. Başarılı sonuç ekranını telefonda yenileme ayrıca sınanmadı. |
| Kısmi | Başarısız/yarım kalan ödeme | Başarısız bildirim rezervasyonu bırakıyor ve yeniden ödeme açılabiliyor; 0008→0009 ile doğrulandı. Uzun bekleme ve otomatik sağlayıcı uzlaştırması açık. |
| [ ] | Bildirim tekrarı | Aynı imzalı sağlayıcı bildirimi tekrarlandığında ikinci stok düşümü veya ikinci satış oluşmuyor. Test, sağlayıcının test ortamında/izinli işleminde yapılmalı. |
| [ ] | Son stok ve paralel ödeme | Son birim için yalnızca ilk müşteriye ödeme açılıyor; ikinci müşteri stok/rezervasyon uyarısı alıyor. İlk işlem başarısızsa yeniden denenebiliyor; başarılıysa stok bir kez düşüyor. Gecikmiş/tekrarlanan bildirimler sağlayıcı testinde doğrulanmış. |
| Kısmi | Sipariş e-postası | Gerçek sipariş e-postası Delivered; doğru sipariş/tutar ve TXT eki var. Ekin her satırının canlı kopyayla eşleştirilmesi ve teslim hatası/yeniden gönderim senaryosu ayrıca doğrulanmalı. |
| [ ] | Gönderim ve fatura | Fatura oluşturuluyor, kargo takip numarası çalışıyor ve bildirim alıcıya ulaşıyor. |
| [x] | Parasal tam iade | NJ-2026-0009 için 99,90 TL tam iade, sipariş kaydı, iade e-postası, banka POS kabulü ve kullanıcının banka yansıması teyidi tamamlandı. Fiziksel stok geri giriş dalı bu testte seçilmedi. |
| Kısmi | Gerçek cihaz | Kullanıcının telefonunda ürün → ödeme → sonuç başarılı. Cihaz/tarayıcı modeli kaydedilmedi; iPhone Safari ve Android Chrome ayrı ayrı kabul edilmiş sayılmaz. |

**Rezervasyonun işleyişi:** Ödeme başlatma kontrolü, pending/paid/failed geçişleri veritabanında ortak transaction kilidi kullanıyor. Fiziksel stoktan pending ödemelerdeki adetler çıkarılarak yeni ödeme izni veriliyor. Fiziksel stok başarılı bildirimde bir kez düşüyor; başarısız bildirim rezervasyonu bırakıyor. Müşteriye ödeme ekranı hiç verilmemiş yeni oturumlar 5 dakika sonra sonraki ödeme kontrolünde güvenle kapatılabiliyor. Müşteriye verilmiş iframe ve eski pending kayıtlar yalnızca doğrulanmış sağlayıcı sonucuyla çözülüyor; geç gelen başarılı ödeme için ayrılan stok süre doldu diye başkasına verilmiyor. Sağlayıcı sonucu kaydedilemezse callback artık `OK` yerine 503 vererek yeniden denemeye izin veriyor. [PayTR bildirim dokümanı](https://dev.paytr.com/iframe-api/iframe-api-2-adim) tekrar ve zaman aşımı senaryolarını açıklar.

Vitrin fiziksel stoğu gösterebilir; son ödeme kontrolünde başka bir oturuma ayrılmış ürün için açıklayıcı uyarı alınması beklenen davranıştır. Açık ödeme varken yöneticinin fiziksel stoğu azaltması ayrıca değerlendirilmelidir. Gerçek sağlayıcı kabul testi, yerel PostgreSQL testinden ayrı tutulur.

**E-posta teslimi:** Gönderim hatası artık görünür biçimde kaydediliyor; otomatik yeniden gönderim kuyruğu mevcut değil. Başarısız teslimlerin nasıl takip edilip yeniden gönderileceği işletme kabulüne dahil edilmeli. Sözleşme sureti DB'de korunur; birim test, gerçek e-posta tesliminin kanıtı değildir.

**İade güvenliği:** Müşteri talebi WhatsApp mesajı olarak gönderir; para iadesi yönetici sipariş ekranından ve sipariş numarası tekrar yazılarak başlatılır. İade edilen ürün yalnızca fiziksel olarak geri geldiği ve yeniden satılabilir olduğu ayrıca işaretlenirse stoğa eklenir. PayTR isteği açıkça reddederse yeniden deneme mümkündür; zaman aşımı, geçersiz yanıt veya sağlayıcı başarılı olduktan sonra oluşabilecek yerel hata `review` durumunda kilitlenir ve PayTR Durum Sorgu/panel sonucu uzlaştırılmadan ikinci iade yapılamaz.

## Hesap ve görünürlük kontrolleri

- [ ] GA4 Realtime/DebugView'da ürün, sepet, ödeme ve doğrulanmış purchase olayları; doğru ürün/adet ve tek transaction. Ret ve izin geri çekme senaryoları da kontrol edilmeli. Mevcut ürün fiyatları KDV dâhil: ayrı vergi/net gelir raporlaması için muhasebe oranları doğrulanmalı; bilinmeyen KDV oranı kodda uydurulmadı. [GA4 olay tanımı](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#purchase).
- [ ] Meta Events Manager'da izin sonrası tek Purchase ve doğru toplam.
- [ ] Search Console'da mülk erişimi, yeni sitemap gönderimi, yeni/eski ürün URL incelemeleri ve kapsam hataları.
- [ ] Google Rich Results Test'te ürün örneği. İade politikası ekli; kargo süre/ücret schema'sı için gerçek operasyon verisi bekleniyor. Merchant Center isteğe bağlı bir sonraki adım.
- [ ] Canlı mobil PageSpeed/Core Web Vitals. İlk denetim API kotasına takıldı; hız puanı ölçülmüş sayılmıyor.

Gerçek müşteri yorumları izinle toplanmalı. Gerçek mağaza/hizmet yoksa ek lokasyon/servis sayfası üretmek gerekmiyor. Sabit telefon CTA'sı, görünür breadcrumb ve müşteri stil örnekleri sonraki iyileştirmeler olabilir.
