import React from 'react';
import { Composition } from 'remotion';
import { FORMAT_DIKEY, FORMAT_KARE } from './brand';
import { HeroDongu, type HeroDonguProps } from './HeroDongu';
import { UrunReklami, type UrunReklamiProps } from './UrunReklami';

/**
 * Kompozisyon listesi.
 *
 * Yeni bir ürün reklamı için: aşağıya bir <Composition/> daha ekle, defaultProps
 * içine ürünün gerçek bilgilerini yaz. Görsel yolu mağazanın public klasöründen
 * okunur (remotion.config.ts → setPublicDir('../public')), yani kopyalamaya
 * gerek yok.
 *
 * ⚠️ Buradaki ürün bilgileri src/data/products.ts ile aynı olmalı. Videoda
 * farklı fiyat/ad göstermek yanıltıcı tanıtım olur.
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ────────────────────────────────────────────────────────────
          SİTE HERO DÖNGÜSÜ — yazısız, sessiz, sonsuz döner.
          Reklamlardan ayrı: sitede metni sayfanın kendisi söylüyor,
          videonun içine gömmek gereksiz tekrar olur.
          Çıktı: ../public/media/video/hero-loop.mp4
          ──────────────────────────────────────────────────────────── */}
      <Composition
        id="Site-HeroDongu"
        component={HeroDongu}
        durationInFrames={180} // 6 sn @30fps
        fps={30}
        width={900}
        height={1200} // 3:4 — hero yuvasının oranı
        defaultProps={
          {
            gorsel: 'media/yuzuk/yuzuk-16c.jpg',
            gorselIkinci: 'media/yuzuk/yuzuk-17c.jpg',
          } satisfies HeroDonguProps
        }
      />

      {/* ────────────────────────────────────────────────────────────
          SİTE HERO DÖNGÜSÜ (GENİŞ) — masaüstü için 16:9.
          Dikey sürüm mobilde kalır; masaüstünde bu geniş sürüm
          tam genişlikte oynar.
          Çıktı: ../public/media/video/hero-loop-wide.mp4
          ──────────────────────────────────────────────────────────── */}
      <Composition
        id="Site-HeroDonguWide"
        component={HeroDongu}
        durationInFrames={180} // 6 sn @30fps
        fps={30}
        width={1600}
        height={900}
        defaultProps={
          {
            gorsel: 'media/yuzuk/yuzuk-16c.jpg',
            gorselIkinci: 'media/yuzuk/yuzuk-17c.jpg',
          } satisfies HeroDonguProps
        }
      />

      {/* ── Stockholm Nova Yıldız Yüzük — Reels/Story ── */}
      <Composition
        id="Reels-StockholmNova"
        component={UrunReklami}
        durationInFrames={240}
        fps={FORMAT_DIKEY.fps}
        width={FORMAT_DIKEY.width}
        height={FORMAT_DIKEY.height}
        defaultProps={
          {
            gorsel: 'media/yuzuk/yuzuk-17.jpg',
            gorselModel: 'media/yuzuk/yuzuk-17c.jpg',
            urunAdi: 'Stockholm Nova Yıldız Yüzük',
            fiyat: 649,
            hikaye: 'İki yıldız, hiç değmeden yan yana.',
            koleksiyon: 'Stockholm',
          } satisfies UrunReklamiProps
        }
      />

      {/* ── Barcelona Ritm Altın Yüzük — Reels/Story ── */}
      <Composition
        id="Reels-BarcelonaRitm"
        component={UrunReklami}
        durationInFrames={240}
        fps={FORMAT_DIKEY.fps}
        width={FORMAT_DIKEY.width}
        height={FORMAT_DIKEY.height}
        defaultProps={
          {
            gorsel: 'media/yuzuk/yuzuk-16.jpg',
            gorselModel: 'media/yuzuk/yuzuk-16c.jpg',
            urunAdi: 'Barcelona Ritm Altın Yüzük',
            fiyat: 799,
            hikaye: 'Ritim tekrar eder, zarafet kalır.',
            koleksiyon: 'Barcelona',
          } satisfies UrunReklamiProps
        }
      />

      {/* ── Feed gönderisi (kare) ── */}
      <Composition
        id="Feed-StockholmNova"
        component={UrunReklami}
        durationInFrames={240}
        fps={FORMAT_KARE.fps}
        width={FORMAT_KARE.width}
        height={FORMAT_KARE.height}
        defaultProps={
          {
            gorsel: 'media/yuzuk/yuzuk-17.jpg',
            gorselModel: 'media/yuzuk/yuzuk-17c.jpg',
            urunAdi: 'Stockholm Nova',
            fiyat: 649,
            hikaye: 'İki yıldız, hiç değmeden yan yana.',
            koleksiyon: 'Stockholm',
          } satisfies UrunReklamiProps
        }
      />
    </>
  );
};
