# NOVELLA Social Media HQ

Bu klasör Instagram ve Threads içerik üretimi, onayı, yayını ve ölçümü için tek çalışma alanıdır. Claude bu klasörü proje bilgisi olarak okur; görsel ve videolar mağazanın gerçek `public/media` dosyalarından, ürün bilgileri ise canlı katalogdan alınır.

## Araç düzeni

- **Claude:** strateji, metin, içerik takvimi, gönderi puanlama ve Metricool MCP üzerinden planlama.
- **Metricool Free:** Instagram ve Threads bağlantısı, ayda 20 planlı içerik ve 30 günlük analitik.
- **Codex / Remotion:** ürün görseli düzenleme, Reels, Story ve paketleme videosu üretimi.
- **Canlı site:** ürün adı, fiyat, stok, teslimat ve iade bilgilerinde tek doğruluk kaynağı.

## Başlangıç kurulumu

1. Claude'da yalnızca NOVELLA sosyal medya yönetimi için yeni bir proje açın.
2. `CLAUDE_PROJECT_INSTRUCTIONS.md` dosyasını proje talimatı olarak ekleyin.
3. Bu klasörü ve `docs/NOVELLA-ON-LANSMAN-7-GUN.md` dosyasını proje bilgisine ekleyin.
4. Metricool Free hesabında tek marka olarak NOVELLA'yı oluşturun.
5. Instagram profesyonel hesabını ve Threads hesabını Metricool'a bağlayın.
6. Claude'a OAuth ile `https://ai.metricool.com/mcp` uzak MCP bağlantısını ekleyin.
7. İlk içerikleri `content-queue.csv` içinde hazırlayın. Metehan'ın açık onayı olmadan yayınlamayın.

## Klasör haritası

- `CLAUDE_PROJECT_INSTRUCTIONS.md`: Claude'un kalıcı çalışma kuralları.
- `brand-and-voice.md`: görsel kimlik, marka sesi ve iddia sınırları.
- `launch-plan.md`: güven odaklı ilk profil vitrini ve Story düzeni.
- `content-queue.csv`: üretim ve yayın kuyruğu.
- `response-library.md`: DM, yorum ve müşteri destek cevapları.

## Haftalık çalışma

Pazartesi günü bir haftalık içerik toplu hazırlanır. Görsel ve metin kontrolünden geçen içerikler kullanıcı onayına sunulur. Onaylananlar Metricool ile planlanır. Haftanın sonunda erişim, profil ziyareti, bağlantı tıklaması, kaydetme, paylaşım ve DM sayıları değerlendirilir; sonraki hafta yalnızca bu verilere göre ayarlanır.
