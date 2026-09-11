# Codex render görevi — Hafta 1 (8–14 Eylül 2026)

Amaç: 2 Instagram karusel (statik PNG) + 1 Instagram Reel (MP4) üret. Metinler **onaylı ve kilitli** — değiştirme. Threads gönderileri görselsiz, render yok.

Çıktı klasörü: `studio/out/hafta-2026-09-08/`

## Kurallar (brand-and-voice.md)
- Renk/font: `studio/src/brand.ts` (`RENK`, `YAZI`, `GRADYAN_SAMPANYA`). Zemin krem `#FAF8F5`. Başlık Cormorant, editorial Instrument Serif, gövde Instrument Sans.
- **`MARKA.slogan` ("Kararmayan Çelik...") KULLANMA** — brand-voice "asla kararmaz" iddiasını yasaklıyor. Gerekirse "kararmaya karşı dirençli".
- Yalnızca gerçek ürün fotoğrafları. Jeneratif AI görsel yok. Yasaklı: `public/media/pomelli_*`, `public/media/paketleme/*` (AI).
- Ürünün taşı/rengi/formu değiştirilmez; sadece kırpma, ölçek, krem zemine yerleştirme, hafif renk düzeltme serbest.
- Her karede logo basma; küçük "NOVELLA" imzası yalnızca bilgi/kapanış karelerinde.

---

## 1) IG-001 — "NOVELLA'ya hoş geldiniz" · 4:5 karusel · 6 PNG (1080×1350)

Dosya adları: `ig-001-01.png` … `ig-001-06.png`

| # | İçerik | Kaynak |
|---|---|---|
| 1 | Ürün makro, krem zemin. Üst: Cormorant 300 "NOVELLA" (harf aralığı geniş). Alt: Instrument Serif "kısa hikâye demek." | `media/video/hero-poster.jpg` |
| 2 | Bileklik, tam kare, yazısız, krem zemin | `media/bileklik/bileklik-1.jpg` |
| 3 | Küpe, tam kare, yazısız, krem zemin | `media/kupe/kupe-1.jpg` |
| 4 | Bilgi kartı (sadece yazı, krem zemin, altın ince çizgi): satır 1 "316L paslanmaz çelik" · satır 2 "Suya dayanıklı · kararmaya dirençli" · satır 3 "Hediye kutusunda" | — |
| 5 | Bilgi kartı: "Siparişten sonra 1–3 iş gününde kargo" / "14 gün içinde iade talebi" / küçük gri: "(yasal istisnalar saklıdır)" | — |
| 6 | Kapanış: krem zemin, ortada küçük "NOVELLA" imzası (Cormorant), altında altın renkte `novellajewell.com` | — |

Yöntem: `UrunReklami`/`YuzukLansmani` desenine benzer yeni bir statik kompozisyon (`Karusel-IG001-01` … `-06`) ya da tek parametrik `Karusel-Slide` + 6 defaultProps. `remotion still` ile PNG al.

---

## 2) IG-003 — "316L ne anlatır?" · 4:5 karusel · 7 PNG (1080×1350)

Dosya adları: `ig-003-01.png` … `ig-003-07.png`. Tümü bilgi kartı (krem zemin, Cormorant başlık ~64px, Instrument Sans gövde ~34px, sol hizalı, bol boşluk). 2. ve 7. karede istersen sağ altta küçük ürün fotoğrafı (`media/yuzuk/yuzuk-1.jpg`) — opsiyonel.

1. Başlık: **"316L ne anlatır, ne anlatmaz?"**
2. "316L, düşük karbonlu bir paslanmaz çelik sınıfıdır. Krom, nikel ve molibden içerir. 'L' düşük karbon demektir — 'nikelsiz' demek değildir."
3. "Suya dayanıklı ve kararmaya karşı dirençli. Yine de duş, deniz, havuz ve spor öncesi çıkarmak yüzeyi korur."
4. "Çelik taban ile kaplamayı ayrı düşünün. Taban çelik olsa bile kaplama zamanla aşınabilir."
5. "'Cerrahi çelik' ya da '316L' ifadesi; ürünün steril, implant için uygun ya da her cilde uygun olduğu anlamına gelmez."
6. "Metal hassasiyetiniz varsa ürün bilgilerini kontrol edin, gerekirse siparişten önce bize yazın."
7. Kapanış: "Ürün bazında malzeme, kaplama, ölçü ve bakım bilgisi → ürün sayfası." + küçük "NOVELLA" imzası

---

## 3) IG-002 — "Gerçek ürün yakın planı" · 9:16 Reel · MP4 (1080×1920, 30fps)

Dosya adı: `ig-002-detay-reel.mp4` · süre 10–14 sn (300–420 kare)

- Kaynak: aynı ürünün 3 açısı — `media/yuzuk/yuzuk-16.jpg`, `media/yuzuk/yuzuk-16b.jpg`, `media/yuzuk/yuzuk-16c.jpg`
- Akış: her görsel ~4 sn, aralarda 12 karelik cross-fade. Her görselde yavaş Ken Burns (zoom 1.12 → 1.0), krem zemin, `UrunReklami`'daki altın ışık geçişi bir kez.
- Yazı: 0–60 kare arası sol altta küçük "316L paslanmaz çelik" (Instrument Sans), sonra kaybolur. Ürün adı/fiyat YOK (metin ürün-agnostik).
- Kapanış (son ~40 kare): krem zemin + "NOVELLA" imzası + `novellajewell.com`
- Ses yok (sessiz).
- Yeni kompozisyon: `Reels-DetayYakinPlan` — `UrunReklami`'yı sadeleştirerek türet.

---

## Teslim
- `studio/out/hafta-2026-09-08/` içine tüm dosyalar
- Kısa `RENDER-NOTES.md`: hangi kompozisyon, hangi komut, üretilen dosya listesi
- Kod: yeni kompozisyonlar `studio/src/` içinde, `Root.tsx`'e eklenmiş; mağazayı (`src/`) etkilemez
- Site build'ini kırma: `studio/` bağımsız, `.vercelignore`'da

Onaylı caption metinleri: `social-media-hq/week-2026-09-08-preview.md`
