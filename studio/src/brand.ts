/**
 * NOVELLA marka değerleri — mağazayla AYNI kaynaktan.
 *
 * Bu değerler src/app/globals.css ve tailwind.config.ts ile birebir eşleşir.
 * Reklam videosunun rengi siteyle tutmazsa marka dağılır; bu yüzden burada
 * tahmin yok, hepsi mağazadan kopyalandı.
 *
 * ⚠️ Sitedeki altını değiştirirsen burayı da güncelle. Üç yer var:
 *    globals.css (--color-gold), site.webmanifest (theme_color), bu dosya.
 */

export const RENK = {
  krem: '#FAF8F5',
  kremKoyu: '#F2EDE4',
  sampanya: '#EAE1D1',
  altin: '#B8A574',
  altinAcik: '#C9BC96',
  altinKoyu: '#9E8E63',
  siyah: '#0A0A0A',
  kenar: '#E8E0D2',
} as const;

/** Sitedeki hero gradyanının aynısı. */
export const GRADYAN_SAMPANYA = `linear-gradient(160deg, ${RENK.krem} 0%, ${RENK.kremKoyu} 42%, #E3D5B8 100%)`;

/**
 * Fontlar BURADA yüklenir.
 *
 * Remotion'da font adını CSS'e yazmak yetmez — tarayıcıda olmadığı için
 * sessizce Times'a düşer ve marka tipografisi kaybolur. loadFont() fontu
 * gerçekten indirir ve render'ın onu beklemesini sağlar.
 */
import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

/**
 * ⚠️ HER İKİ SUBSET DE ŞART: 'latin' + 'latin-ext'.
 *
 * 'latin-ext' YALNIZCA genişletilmiş aralığı taşır (ı, ş, ğ, ü, ç).
 * Temel harfler (A–Z, a–z) 'latin' alt kümesindedir. Sadece latin-ext
 * yüklenirse Türkçe karakterler doğru fontla, geri kalan HER harf
 * Times'a düşerek çizilir — tipografi sessizce bozulur ve fark etmesi zordur.
 */
const { fontFamily: cormorantFamily } = loadCormorant('normal', {
  weights: ['300', '400'],
  subsets: ['latin', 'latin-ext'],
});

const { fontFamily: interFamily } = loadInter('normal', {
  weights: ['300', '400', '500', '600'],
  subsets: ['latin', 'latin-ext'],
});

export const YAZI = {
  baslik: cormorantFamily,
  govde: interFamily,
} as const;

/** Sitedeki --ease-spring ile aynı eğri. Hareketin karakteri buradan gelir. */
export const EASE_SPRING = [0.16, 1, 0.3, 1] as const;

export const MARKA = {
  ad: 'NOVELLA',
  slogan: 'Kararmayan Çelik, Eskimeyen Zarafet',
  site: 'novella-jewell.vercel.app',
  instagram: '@jewelry.novella',
} as const;

/** Instagram/TikTok dikey, Reels ve Story için. */
export const FORMAT_DIKEY = { width: 1080, height: 1920, fps: 30 } as const;
/** Feed gönderisi. */
export const FORMAT_KARE = { width: 1080, height: 1080, fps: 30 } as const;
/** YouTube / web banner. */
export const FORMAT_YATAY = { width: 1920, height: 1080, fps: 30 } as const;
