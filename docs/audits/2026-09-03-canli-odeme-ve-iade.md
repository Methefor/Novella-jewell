# Kontrollü canlı ödeme ve tam iade — 3 Eylül 2026

## Sonuç

**NJ-2026-0009 / 99,90 TL** için başarılı ödeme, siteye ulaşan bildirim, tek stok düşümü, sipariş e-postası ve belge eki doğrulandı. Önceden onaylanan **99,90 TL tam iade** yönetici panelinden bir kez başlatıldı; PayTR iadeyi banka POS sistemine iletti. Kullanıcı 3 Eylül'deki takip mesajında **“kontrol edildi iade gerçekleşti”** diyerek karta/hesaba yansımayı da doğruladı. Kontrollü tahsilat ve parasal iade testi tamamlandı. Bu kayıt tüm satış öncesi açık işlerin tamamlandığı anlamına gelmez.

## Ödeme

- Kullanıcı telefonundan denedi ve “Siparişiniz alındı” sonucunu bildirdi. Bu telefonun tarayıcı/işletim sistemi modeli kaydedilmedi; hem iOS hem Android test edilmiş sayılmaz.
- Sipariş oluşumu: `2026-09-03T14:56:18.792Z`; ödeme ekranı hazır: `2026-09-03T14:56:20.649Z`.
- PayTR merchant_oid: **NJ20260009**; işlem ID: **1320594956**. Panel işlem zamanı **17:57:04**, ödeme onayı **17:58:09 Türkiye saati**. Ödeme **Başarılı**, bildirim **Tamamlandı**, İş Bankası/tek çekim, toplam **99,90 TL**.
- DB: `status=paid`, `paid_at=2026-09-03T14:58:11.263Z`, sözleşme kaydı mevcut. Yönetici sipariş listesinde doğru sipariş ve tutar görüldü.
- Test ürünü stok hareketleri: ilk hazırlık `0→1`, yalnızca **bir** `sale` hareketi `1→0`, referans **NJ-2026-0009**. İkinci satış/stok düşümü yok. İmzalı callback tekrar gönderimi bu denemede ayrıca yapılmadı.

## E-postalar

- Gönderen: **NOVELLA <siparis@novellajewell.com>**. Kullanıcının telefon formunda girdiği alıcı adresine gönderildi; önceki test formundaki adrese bağlı kalınmadı.
- Sipariş e-postası Resend ID **01a067c7-05b4-7363-8ea1-29b9a86116e6**: **Delivered**, 17:58. Başlık **Siparişiniz alındı — NJ-2026-0009**. Ürün 50 TL, kargo 49,90 TL, toplam 99,90 TL; **NJ-2026-0009-belgeler.txt** eki mevcut. Ek dosyanın her satırı bu canlı kontrolde yeniden karşılaştırılmadı.
- İade e-postası Resend ID **01a067c9-f9f0-743f-bebe-b5729fff82bf**: **Delivered**, 18:01. Başlık **İade işleminiz kaydedildi — NJ-2026-0009**; içerik talebin işleme alındığını söylüyor.
- Delivered, alıcı sunucunun teslim kabulünü doğrular; mesajın kullanıcı tarafından okunması veya gelen kutusu/spam yerleşimi ayrıca kontrol edilmedi.

## İade

- Kullanıcının önceden verdiği 99,90 TL ödeme ve tam iade onayı kullanıldı. Yönetici ekranında yalnızca **NJ-2026-0009** seçildi; sipariş numarası yazılarak iade gönderildi. PayTR panelinden ikinci iade yapılmadı.
- Siparişe fiziksel gönderim yapılmayacağı operasyon notu eklendi. Fiziksel stok kontrolü kutusu işaretlenmedi; stok geri ekleme dalı bu gerçek iade testinde çalıştırılmadı.
- API başvurusu: **03.09.2026 18:01:24**, **99,90 TL**, kaynak **İade API**. DB `refund_status=success`, `refund_amount=99.90`, `refund_reference=NJREF20260009`, `fulfillment_status=returned`; kayıt zamanı `2026-09-03T15:01:24.675Z`.
- İlk PayTR kontrolünde iade **Beklemede**, kalan tutar **0 TL** idi. Sonraki kontrolde **“99.9 TL iade banka POS sistemine girildi”**, **18:02:17** görüldü. İade onay kodu **241323**, banka referansı **624608050962**. Kullanıcı sonraki mesajında iadenin gerçekleştiğini doğruladı; tam banka yansıma saati ayrıca alınmadı.
- Uygulamadaki `refund_status=success`, mevcut kodda PayTR iade API kabulünü ifade ediyor; bankadaki nihai yansımayı ayrıca sorgulamıyor. İade e-postasının vaat ettiği sonraki tamamlanma bildirimini üreten otomatik uzlaştırma/bildirim akışı henüz doğrulanmış değil; satış öncesi açık iş.

## Temizlik ve sınırlar

- `--cleanup` ile gizli test ürünü **18:02:55 Türkiye saati** satışa kapatıldı: `published=false`, `hidden=true`, `deletedAt` dolu, stok 0. Sipariş, iade ve stok hareketi kayıtları korundu.
- Bilgisayar sepetindeki eski test ürünü temizlendi; test öncesindeki **Stockholm Arc Oval Taşlı Altın Yüzük, 1 adet / 640 TL** geri eklendi. Bu ürün için ödeme başlatılmadı.
- Önceki NJ-2026-0007/0008 İş Bankası 3D denemeleri başarısız kapanmış ve bildirimleri işlenmişti. Telefon denemesinin başarılı olması banka genelinde kalıcı kesinti varsayımını desteklemiyor; tarayıcı/ağ/zaman etkileri ayrı ayrı kontrol edilmediğinden kesin kök neden söylenemez.
- Bu turda uygulama kodu değiştirilmedi veya dağıtılmadı. Canlı gözlemler ve salt okunur DB sorguları kullanıldı. Vercel log aracı HTTP 404 araç/taşıma hatası verdi; bu aralıktaki loglar “hatasız” diye onaylanmadı.
