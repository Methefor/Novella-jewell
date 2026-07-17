# NOVELLA Studio — Motion Tasarım

Reklam videoları, ürün animasyonları ve sosyal medya içerikleri. Remotion ile
React kullanarak video üretir — After Effects gerekmez, her şey kod.

**Bu klasör mağazadan tamamen bağımsızdır.** Kendi `package.json`'ı vardır,
Vercel build'ine dahil edilmez (`.vercelignore`), mağazanın `tsconfig.json`'ı
onu taramaz. Buradaki hiçbir şey siteyi etkilemez.

---

## Kullanım

```bash
cd studio

npm run studio          # görsel editör açılır (tarayıcıda, canlı önizleme)
npm run render Reels-StockholmNova out/video.mp4
```

Videoyu `npm run studio` ile açıp zaman çizelgesinde oynatabilir, kodu
kaydettiğinde anında değişimi görürsün.

---

## Mevcut kompozisyonlar

| ID | Format | Süre | Kullanım |
|---|---|---|---|
| `Reels-StockholmNova` | 1080×1920 | 8 sn | Instagram Reels / Story |
| `Reels-BarcelonaRitm` | 1080×1920 | 8 sn | Instagram Reels / Story |
| `Feed-StockholmNova` | 1080×1080 | 8 sn | Instagram feed gönderisi |

```bash
npx remotion compositions src/index.ts   # tam listeyi görmek için
```

---

## Yeni ürün reklamı ekleme

`src/Root.tsx` içine bir `<Composition/>` daha ekle:

```tsx
<Composition
  id="Reels-YeniUrun"
  component={UrunReklami}
  durationInFrames={240}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{
    gorsel: 'media/yuzuk/yuzuk-18.jpg',
    gorselModel: 'media/yuzuk/yuzuk-18c.jpg',
    urunAdi: 'Ürün Adı',
    fiyat: 649,
    hikaye: 'Mikro hikaye.',
    koleksiyon: 'Stockholm',
  }}
/>
```

> ⚠️ Buradaki ad ve fiyat `src/data/products.ts` ile **aynı** olmalı.
> Videoda farklı fiyat göstermek yanıltıcı tanıtımdır.

---

## Görseller nereden geliyor?

`remotion.config.ts` içinde `Config.setPublicDir('../public')` var. Yani stüdyo
**mağazanın gerçek görsel klasörünü** okur:

```tsx
staticFile('media/yuzuk/yuzuk-17.jpg')   // → ../public/media/yuzuk/yuzuk-17.jpg
```

Görselleri kopyalamak gerekmez. Ürünü sitede güncellersen video da güncel kalır,
iki kopya birbirinden ayrışmaz.

---

## Marka değerleri

Renkler, fontlar ve hareket eğrisi `src/brand.ts` içinde — hepsi mağazanın
`globals.css` dosyasıyla birebir aynı. Video siteye yabancı durmasın diye.

**Altın tonunu değiştirirsen üç yeri birden güncelle:**
`globals.css` (`--color-gold`) · `site.webmanifest` (`theme_color`) · `studio/src/brand.ts`

---

## Tuzaklar (yaşandı, not düşüldü)

**Font subset'i.** `subsets: ['latin', 'latin-ext']` — **ikisi de şart.**
`latin-ext` yalnızca ı, ş, ğ, ü gibi genişletilmiş karakterleri taşır; temel
harfler (A–Z, a–z) `latin` alt kümesindedir. Sadece latin-ext yüklersen Türkçe
karakterler doğru fontla, **geri kalan her harf Times'a düşerek** çizilir.
Sessizce olur, fark etmesi zordur.

**TypeScript sürümü.** Stüdyo TypeScript **5.x** kullanır. TypeScript 7 (Go
tabanlı native port) farklı bir Node API'sine sahiptir; Remotion'ın bundler'ı
`typescript.readConfigFile` çağırıp `undefined` alır ve build çöker.
`npm i -D typescript@5` ile sabitlendi.

**Props tipi.** Composition props'u `interface` değil **`type`** olmalı.
TypeScript'te interface'ler örtük index signature taşımaz, Remotion ise
`Record<string, unknown>` uyumu bekler — interface kullanırsan
"not assignable to LooseComponentType" hatası alırsın.

**Çapraz geçiş.** İki görsel arasında geçiş yaparken alttakinin opaklığını da
düşür. Alttaki %100'de kalırsa ikisi hayalet gibi üst üste biner; geçiş değil,
hata gibi görünür.

---

## Lisans

Remotion bireyler ve **4 kişiden az** çalışanı olan şirketler için ücretsizdir.
Ekip büyürse şirket lisansı gerekir: https://remotion.dev/license

---

## Çıktılar

`out/` klasörüne yazılır ve git'e girmez (`.gitignore`). Videolar üretildikten
sonra doğrudan Instagram'a yüklenebilir.
