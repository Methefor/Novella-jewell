# Design System — Novella Jewell

## Product Context

- **What this is:** Premium görünümlü, ulaşılabilir fiyatlı 316L çelik takı markası ve e-ticaret deneyimi.
- **Who it's for:** Türkiye'de özgün takı ve modern stille ilgilenen, ağırlıklı kadın müşteriler.
- **Project type:** Editoryal marka sitesi, e-ticaret mağazası ve yönetim paneli.
- **Memorable idea:** “Lüks görünüyor ama ulaşılabilir; ürünleri özgün ve etkileyici.”

## Aesthetic Direction

- **Direction:** Sessiz ihtişam ve editoryal mücevher vitrini.
- **Decoration:** Az ama bilinçli; ürün fotoğrafı, tipografi, ışık ve boşluk önceliklidir.
- **Mood:** Sıcak, güvenilir ve özgün. Novella başka bir markayı taklit etmez; kendi yayın ve ürün dünyasını kurar.
- **Avoid:** Yapay altın efektleri, her yerde yuvarlak kartlar, ağır gölgeler, jenerik stok fotoğrafı ve satış baskısı.

## Typography

- **Editorial display:** Instrument Serif — hero, kampanya ve marka cümleleri.
- **Product/editorial heading:** Cormorant Garamond — ürün isimleri ve koleksiyon başlıkları.
- **Body/UI:** Instrument Sans — açıklamalar, fiyatlar, menüler, formlar ve butonlar.
- **Scale:** 12, 14, 16, 20, 28, 40, 64 ve akışkan 96–122px hero başlıkları.

## Color

- **Background:** `#FAF8F5`
- **Warm surface:** `#F1ECE3`
- **Deep surface:** `#E8DDC9`
- **Ink:** `#16130F`
- **Novella gold:** `#B8A574`
- **Deep gold:** `#8F7B50`
- **Approach:** Altın nadir ve anlamlı bir vurgu; siyah ve krem ana taşıyıcılardır.

## Spacing and Layout

- **Base unit:** 4px.
- **Density:** Pazarlama alanlarında ferah, alışveriş ve admin alanlarında rahat/işlevsel.
- **Layout:** Satış alanlarında disiplinli grid; hero, menü ve kampanya alanlarında yaratıcı editoryal kompozisyon.
- **Max width:** 1440px.
- **Radius:** Görsel çerçevelerde köşesiz veya çok düşük; işlem kontrollerinde 8–16px; yalnızca küçük kontroller ve CTA'larda tam pill.

## Motion

- **Approach:** Kontrollü ve sinematik.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Duration:** Mikro 150–220ms, panel 500–650ms, hero girişleri 700–1150ms.
- **Rules:** Ürün biçimi ve rengi asla değiştirilmez. Hareket; kadraj, ölçek, ışık ve katman derinliğiyle sınırlıdır. `prefers-reduced-motion` daima desteklenir.

## Brand Rules

1. Ürün her zaman ana kahramandır.
2. Ulaşılabilirlik fiyat, açıklık ve kullanım kolaylığıyla anlatılır; görsel dil ucuzlaştırılmaz.
3. Bir ekranda tek baskın CTA kullanılır.
4. Instagram ve Threads içerikleri aynı dünyaya ait görünür, fakat metinleri platforma göre özgün yazılır.
5. Yeni yüzük görselleri hero, reklam ve sosyal şablonları otomatik besleyebilmelidir.

## Decisions Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-08-01 | Sessiz ihtişam + editoryal vitrin | Novella'yı ulaşılabilir fakat kendine ait bir premium marka olarak konumlandırmak |
| 2026-08-01 | Tam ekran menü yerine yan keşif paneli | Navigasyonu yormadan kategori ve marka dünyasını görselleştirmek |
| 2026-08-01 | Katalogdan beslenen katmanlı hero | Yeni yüklenen gerçek yüzükleri hızla vitrine ve kampanyalara taşımak |
