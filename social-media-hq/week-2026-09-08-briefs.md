# Hafta 1 — Tasarım brifleri (8–14 Eylül 2026)

Durum: **Metin onayı + görsel render + medya doğrulaması bekleniyor.** Bu dosya "GÖRSELLERİ ÜRET" çıktısıdır: her gönderi için kare planı, kaynak dosya ve Remotion/Codex yönergesi. Render işini `npm run studio` / `npm run studio:render` (Remotion) veya Codex yapar — Claude render etmez.

Marka görseli: krem zemin (`#FAF8F5`), doğal gölge, yakın ürün detayı, bol boşluk. Başlık: Cormorant Garamond. Vurgu: Instrument Serif. Gövde: Instrument Sans. Altın vurgu `#B8A574`. Her karede logo yok; küçük NOVELLA imzası yalnızca bilgi/kapanış karelerinde.

---

## 1) IG-001 — "NOVELLA'ya hoş geldiniz" · 4:5 karusel · 6 kare

| Kare | İçerik | Kaynak dosya |
|---|---|---|
| 1 | Tek yüzük, makro, krem zemin. Üstte ince Cormorant: "NOVELLA" · altında Instrument Serif: "kısa hikâye demek." | `public/media/video/hero-poster.jpg` (elde geometrik altın yüzük) VEYA `public/media/yuzuk/yuzuk-16.jpg` |
| 2 | Bileklik yakın plan, yazısız | `public/media/bileklik/bileklik-1.jpg` |
| 3 | Küpe yakın plan, yazısız | `public/media/kupe/kupe-1.jpg` (⚠️ gerçek ürün fotoğrafı olduğunu teyit et) |
| 4 | Bilgi kartı: krem zemin, 3 satır — "316L paslanmaz çelik" / "Suya dayanıklı · kararmaya dirençli" / "Hediye kutusunda" | Tasarım (ürün yok) |
| 5 | Bilgi kartı: "Siparişten sonra 1–3 iş gününde kargo" / "14 gün içinde iade talebi (yasal istisnalar saklıdır)" | Tasarım |
| 6 | Kapanış: krem zemin, ortada küçük NOVELLA imzası, altında `novellajewell.com` | Tasarım |

Render: statik PNG x6, 1080×1350. Yazı katmanları Pretext/HTML→PNG ya da Remotion still.

---

## 2) TH-001 — "Sade mi, katmanlı mı?" · Threads · sadece metin

Görsel yok. (İstersek tek sade kare: `public/media/yuzuk/yuzuk-3.jpg` — opsiyonel, tercihen görselsiz.)

---

## 3) IG-002 — "Gerçek ürün yakın planı" · 9:16 Reel · 10–14 sn

- **Kaynak:** `public/media/yuzuk/` — tek ürün, 2–3 farklı açı (ör. `yuzuk-16.jpg`, `yuzuk-16b.jpg`, `yuzuk-16c.jpg` aynı ürünün açıları).
- **Hareket:** yavaş yakınlaşma (Ken Burns) + hafif yatay kaydırma. Krem zemin sabit. Doğal gölge.
- **Yazı:** İlk 2 sn küçük alt yazı "316L paslanmaz çelik" → kaybolur. Sonu: `novellajewell.com`.
- **Ses:** sessiz veya çok sakin enstrümantal (telifsiz).
- **Kapak (thumbnail):** en net kare, sol altta küçük "316L ÇELİK".
- **Remotion:** `studio/src` içinde 1080×1920 kompozisyon; 3 görseli sırayla, her biri ~4 sn, cross-fade 0.4 sn.

---

## 4) TH-002 — "Takı seçerken ilk baktığın detay" · Threads · sadece metin

Görsel yok.

---

## 5) IG-003 — "316L ne anlatır?" · 4:5 karusel · 7 kare (bilgi kartı)

Tümü tasarım karesi (krem zemin, Cormorant başlık, Instrument Sans gövde). Kaynak metin: `src/data/rehber.ts` → `316l-celik-nedir`. 2. ve 7. karede destek ürün fotoğrafı opsiyonel (`public/media/yuzuk/yuzuk-1.jpg`).

1. "316L ne anlatır, ne anlatmaz?"
2. "316L, düşük karbonlu bir paslanmaz çelik sınıfıdır. Krom, nikel ve molibden içerir. 'L' düşük karbon demektir — 'nikelsiz' demek değildir."
3. "Suya dayanıklı ve kararmaya karşı dirençli. Yine de duş, deniz, havuz ve spor öncesi çıkarmak yüzeyi korur."
4. "Çelik taban ile kaplamayı ayrı düşünün. Taban çelik olsa bile kaplama zamanla aşınabilir."
5. "'Cerrahi çelik' ya da '316L' ifadesi; ürünün steril, implant için uygun ya da her cilde uygun olduğu anlamına gelmez."
6. "Metal hassasiyetiniz varsa ürün bilgilerini kontrol edin, gerekirse siparişten önce bize yazın."
7. Kapanış: "Ürün bazında malzeme, kaplama, ölçü ve bakım bilgisi → ürün sayfası. NOVELLA"

Render: PNG x7, 1080×1350.

---

## (Opsiyonel) IG-004 — "NOVELLA kutusu" · 9:16 Reel — SADECE GERÇEK ÇEKİMLE

- **Kullanılabilir gerçek medya:** `public/media/Novella kutu açılımı ön yüz.jpg`, `public/media/Novella kutu açılımı_.jpg` — gerçek ama sert ışık, dağınık arka plan (matbaa prova kağıdı görünüyor). Kırpma + renk düzeltme ile kurtarılabilir; jeneratif düzenleme yok.
- **4 kök .mp4** (`kutu açılış önizlemesi`, `kutu tanıtım videosu`, `kutu çanta içerisinde tanıtım`, `model kutu tanıtımı`): **gerçek çekim mi AI mi teyit gerekiyor** — teyit gelmeden kullanılmaz.
- Hafta 2'ye bırakıldı; gerçek malzeme netleşince brief yazılır.

---

## ⛔ Kullanılmayacak dosyalar (jeneratif AI — brand-and-voice.md ihlali)

- `public/media/pomelli_photoshoot_image_4k_0902.png` — AI; kartta bozuk metin ("Sıradaki hikâye stain."), "Mom" notu.
- `public/media/paketleme/novella-kutu-icerigi.webp` (+ eşi `.mp4`) — AI; kartta anlamsız metin ("Her telâ tât hüdya birtitih").
- `public/media/paketleme/novella-kutu.webp` (+ eşi `.mp4`) — aynı AI kaynağı; gerçek çekim olarak doğrulanana kadar kullanılmaz.
- Canva banner PNG'leri (`Beige and Brown...`, `White Simple Photocentric...`) — şablon; ürün görseli değil, yalnızca genel grafik olarak.
