# PayTR — Maxinet doğrulama ekranı bağlantı hatası

Durum: Kullanıcının açık onayıyla **03.09.2026 13:53:50 (Türkiye saati)** tarihinde gönderildi; kullanıcı PayTR yanıtını iletti (aşağıda). Gönderim anında panelde teslim doğrulaması, tarihli kayıt ve inceleme durumu görüldü. Ayrı destek talep numarası gösterilmiyor; tarih ve kategoriyle [PayTR destek panelinden](https://www.paytr.com/magaza/destek) takip edilebilir.

Kategori: POS / Banka Hataları → Ödeme

## Son durum — 3 Eylül 18:04 İstanbul

Kullanıcı telefonundan **NJ-2026-0009 / 99,90 TL** ödemesini başarıyla tamamladı; PayTR onayı, site bildirimi ve tek stok düşümü doğrulandı. Tam iade de banka POS sistemine iletildi. [Canlı test kaydı](2026-09-03-canli-odeme-ve-iade.md). Önceki hatanın kesin kök nedeni belirlenmedi; banka genelinde kesinti iddiası yapılmadı. Yeni destek mesajı gönderilmedi.

## Yanıt ve sonuç — 3 Eylül 17:10–17:12 İstanbul

- Kullanıcı PayTR yanıtını iletti: deneme 3D Secure aşamasını geçememiş; PayTR bu tür hataların banka/BKM veya kart kaynaklı olduğunu, işlemin tekrar denenebileceğini veya bankadan destek alınabileceğini belirtti. Yanıt belirli bir banka hata kodu içermiyor; hangi teknik bileşenin bağlantıyı kestiği ayrıntılı olarak açıklanmadı.
- PayTR işlem detayında **NJ20260007 / 1320402284** ödeme durumu artık “Müşteri ödeme yapmaktan vazgeçti ve ödeme sayfasından ayrıldı”, bildirim durumu **Tamamlandı**, onay tarihi boş. Bu sağlayıcı açıklaması kullanıcının bilerek vazgeçtiği anlamına gelmez; gözlenen olay 3D ekranındaki bağlantı hatasıydı.
- DB'de NJ-2026-0007 **failed**, paid_at null, stok **1**. Manuel durum değişikliği yapılmadı. Başarısız ödeme bildiriminin işlenmesi doğrulandı.
- Bu sonucun ardından mevcut onay kapsamında **NJ-2026-0008 / 99,90 TL** yeni oturum oluşturuldu. Kart ekranı 17:11:33 İstanbul'da açıldı; pending, rezervasyon/sözleşme kaydı mevcut, paid_at null. Kart ve banka doğrulaması için kullanıcıya bırakıldı. Başarılı tahsilat, e-posta ve tam iade henüz doğrulanmadı.

## Gönderilen metin

Merhaba,

728692 numaralı NOVELLA mağazamızda, alan adı güncellemesi sonrası PayTR iFrame V2 ile yapılan kontrollü ödeme denemesinde İş Bankası 3D Secure ekranı açılamıyor.

Site: https://novellajewell.com/
Ödeme sayfası: https://novellajewell.com/odeme
Bildirim URL: https://novellajewell.com/api/odeme/callback
Mağaza sipariş numarası (merchant_oid): NJ20260007
PayTR işlem ID: 1320402284
Paneldeki işlem tarihi: 03.09.2026 13:38:41 (Türkiye saati)
Tutar: 99,90 TL, tek çekim, İş Bankası

Kart bilgileri gönderildikten sonra, SMS doğrulama ekranına ulaşmadan "maxinet.isbank.com.tr bağlantıyı beklenmedik şekilde kapattı" hatası görüldü. Deneme Codex uygulama içi tarayıcısında yapıldı. Kullanıcı banka uygulamasında bekleyen veya tamamlanan 99,90 TL işlem görmediğini bildirdi.

Panelde işlem kaydı bulunuyor; ödeme durumu ve onay tarihi "-" görünüyor. Sitemizde sipariş pending, paid_at boş. Bugünün API Uyarıları listesinde kayıt yok. Alan adı ve Bildirim URL panelde yukarıdaki doğru adreslerle kayıtlı. Mevcut işlem kesinleşmeden yeni ödeme başlatmadık.

Bu işlemin banka/3D Secure hata veya dönüş kodunu ve kesin tahsilat durumunu kontrol eder misiniz? Bağlantı kesilmesinin nedeni ile uygulama içi tarayıcı/iFrame V2 kullanımında gereken bir düzenleme varsa paylaşmanızı rica ederiz. İşlem başarısızsa başarısızlık bildiriminin Bildirim URL'mize gönderildiğini de doğrular mısınız?

Teşekkürler.
