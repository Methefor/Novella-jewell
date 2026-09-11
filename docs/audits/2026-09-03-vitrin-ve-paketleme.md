# Ana sayfa, paketleme ve stok görünürlüğü

## Uygulanan düzenlemeler

- Kategori kartları güncel, yayınlanmış katalogdaki ürün görsellerini kullanır. Yüzük: Barcelona Ritm; küpe: Stockholm Soleil; bileklik: Stockholm Rivet. Seçili ürün kaldırılırsa aynı kategorinin güncel ürünü kullanılır. Gizli test ürünleri gösterilmez.
- Ana sayfaya `#novella-kutusu` bölümü, ürün sayfalarına bu bölüme bağlantı eklendi. Kutu içeriği işletmenin bildirdiği **ürün + Novella kartviziti** olarak yazıldı.
- Paylaşılan dört video incelendi. `(2).mp4` kapalı kutu ve `(3).mp4` kutu içeriği seçildi. İçerik videosundaki yazılı zarf kadraj dışında bırakıldı. Videolar 720×900, 8 saniye, sessiz H.264/faststart olarak hazırlandı. Toplam 1.382.273 bayt; iki WebP kapak toplam 64.638 bayt.
- Videolar kullanıcı oynat düğmesine basana kadar indirilmez. İkisi aynı anda oynatılmaz. Mobilde satır içi oynatma ve yerel video kontrolleri kullanılır.
- “Bu bir hediye” alanı, el yazısı notu ve fiyat gizleme tercihleri geçici olarak kaldırıldı. Normal sipariş notu korunur. SSS, kargo ve hikâyemiz sayfalarındaki kutu/kese/not ifadeleri gerçek içeriğe uyarlandı.
- Stoku biten yayınlanmış ürünler listelerde ve kendi sayfalarında kalır. “Stokta yok · Yakında gelecek” gösterilir; kart, ürün detayı ve mobil sabit sepete ekleme düğmeleri devre dışıdır. Varsayılan varyant tükenmiş ama başka varyantta stok varsa stoklu varyant seçilir.
- Kontrol anında herkese açık katalogdaki 94 ürünün tamamında stok vardı. Yeni görünümü göstermek için üretim stokları değiştirilmedi; stok sıfırlanması test verisiyle doğrulandı. Taslak, silinmiş ve gizli ürünler yayına açılmadı.

## Doğrulama

- 23 otomatik test başarılı; stok dışı ürünün detay bağlantısı, kapalı satın alma düğmesi, yeniden stok girişi ve katalog görsellerinin güncellenmesi dahil.
- TypeScript ve lint başarılı.
- Kategori başlıklarının fotoğraf üzerindeki kontrastı düzeltildi. Hero bölümünde azaltılmış hareket tercihinin ilk yüklemede oluşturduğu React hydration uyarısı giderildi.
- `npm audit --omit=dev`: üretim bağımlılıklarında 0 güvenlik bildirimi.
- Yerel tarayıcıda 1440×1000 ve 390×844 boyutlarında üç kategori görseli doğrulandı. İki video oynadı; kullanıcı etkileşiminden önce video isteği yok; aynı anda tek video var; yatay taşma ve JavaScript hatası yok.
- Her iki boyutta ödeme formunda hediye alanlarının bulunmadığı, normal sipariş notunun bulunduğu doğrulandı. Test sırasında ödeme isteği gönderilmedi.

## Yayın

- Nihai üretim sürümü: `dpl_GDgcKQof3CAJjmHADwErQTv7tExW`, Ready; 3 Eylül 2026 02:10 İstanbul tarihli dağıtım.
- Dağıtım adresi: https://novella-jewell-r40du1rgo-methefor-8960s-projects.vercel.app
- `novellajewell.com` ve `www.novellajewell.com` bu sürüme bağlandı. Ana alan adı `vercel inspect` ile doğrulandı.
- Vercel production build: 241/241 sayfa başarılı.
- Canlı `https://novellajewell.com` üzerinde 1440×1000 ve 390×844 tarayıcı kontrolleri de başarılı: güncel kategori görselleri, her iki videoda oynatma, etkileşim öncesi sıfır video isteği, aynı anda tek video, hediye alanları kaldırılmış ödeme formu, korunmuş normal sipariş notu. Yatay taşma, JavaScript istisnası veya konsol hatası yok. Ödeme başlatılmadı.
- Önceki canlı sürüm: `dpl_DNsVhP1P8oi1WqtUFwLAUG4cyRtt`. Ara dağıtım `dpl_DsYjiasVEJr2RkD9NbuuW88oRWKZ` son kontrast/hydration düzeltmeleriyle yukarıdaki nihai sürüme güncellendi.

PayTR alan adı talebinin sonucu ve gerçek ödeme/tam iade testi bu düzenlemelerden bağımsız açık işlerdir.
