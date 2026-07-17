import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { EASE_SPRING, GRADYAN_SAMPANYA, MARKA, RENK, YAZI } from './brand';

/**
 * NOT: `interface` değil `type` — Remotion, Composition props'unun
 * Record<string, unknown> ile uyumlu olmasını ister. TypeScript'te interface'ler
 * örtük index signature taşımaz, type alias'lar taşır. interface kullanırsan
 * "not assignable to LooseComponentType" hatası alırsın.
 */
export type UrunReklamiProps = {
  /** Mağazadaki gerçek yol — public/ sonrası. Örn: media/yuzuk/yuzuk-17.jpg */
  gorsel: string;
  /** İkinci görsel (model çekimi). Boşsa tek görselle kalır. */
  gorselModel?: string;
  urunAdi: string;
  fiyat: number;
  /** Ürünün mikro hikayesi — products.ts'teki `story` alanı. */
  hikaye: string;
  koleksiyon: string;
};

/**
 * Ürün reklamı — dikey (Reels/Story).
 *
 * Hareket dili sitedeki hero ile aynı: görsel aşağıdan yükselir, kenarları
 * zemine erir, üzerinden bir kez altın ışık geçer. Amaç videonun siteye
 * yabancı durmaması — aynı marka, aynı nefes.
 *
 * Sahne akışı (30fps, 8 sn = 240 kare):
 *   0–30    zemin + marka belirir
 *   20–70   görsel yükselir
 *   60–80   altın ışık geçer
 *   75–110  ürün adı + hikaye
 *   110–140 fiyat
 *   150–180 model çekimine geçiş (varsa)
 *   200–240 kapanış / CTA
 */
export const UrunReklami: React.FC<UrunReklamiProps> = ({
  gorsel,
  gorselModel,
  urunAdi,
  fiyat,
  hikaye,
  koleksiyon,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Görselin yükselişi — hero'daki gibi yaylı, ani değil.
  const yukselis = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200, mass: 0.8 },
  });
  const gorselY = interpolate(yukselis, [0, 1], [180, 0]);
  const gorselOpacity = interpolate(frame, [20, 55], [0, 1], {
    extrapolateRight: 'clamp',
  });
  // Yavaş yakınlaşma — durağan fotoğrafa hayat verir (Ken Burns).
  const zoom = interpolate(frame, [20, durationInFrames], [1.12, 1]);

  // Altın ışık — metalin parladığı an.
  const isikX = interpolate(frame, [60, 85], [-120, 220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isikOpacity = interpolate(frame, [60, 68, 80, 86], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  /**
   * Model çekimine geçiş.
   *
   * Önemli: alttaki ürün görseli de SÖNMELİ. İlk versiyonda alttaki görsel
   * %100 opaklıkta kalıyor, model onun üstüne biniyordu — ikisi hayalet gibi
   * iç içe geçip yüzük kadının boğazında yüzüyormuş gibi görünüyordu.
   * Geçiş değil, hata gibi duruyordu.
   */
  const gecis = gorselModel
    ? interpolate(frame, [150, 180], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;
  const urunOpacity = 1 - gecis; // alttaki söner
  const modelOpacity = gecis; // üstteki belirir

  return (
    <AbsoluteFill style={{ background: GRADYAN_SAMPANYA }}>
      {/* Altın doku — sitedeki .texture-gold'un aynısı */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at 18% 22%, rgba(184,165,116,0.16) 0%, transparent 45%),
                            radial-gradient(circle at 82% 78%, rgba(184,165,116,0.13) 0%, transparent 48%)`,
        }}
      />

      {/* Üstten inen ışık huzmesi */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(255,252,244,0.9) 0%, transparent 70%)',
        }}
      />

      {/* ── Marka (üstte) ── */}
      <div
        style={{
          position: 'absolute',
          top: 110,
          width: '100%',
          textAlign: 'center',
          opacity: interpolate(frame, [0, 25], [0, 1], {
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            fontFamily: YAZI.baslik,
            fontSize: 52,
            fontWeight: 300,
            letterSpacing: 14,
            color: RENK.siyah,
          }}
        >
          {MARKA.ad}
        </div>
        <div
          style={{
            fontFamily: YAZI.govde,
            fontSize: 20,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: RENK.altinKoyu,
            marginTop: 14,
          }}
        >
          {koleksiyon} Koleksiyonu
        </div>
      </div>

      {/* ── Ürün görseli ── */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: '50%',
          transform: `translateX(-50%) translateY(${gorselY}px)`,
          width: 760,
          height: 760,
          opacity: gorselOpacity,
          borderRadius: 24,
          overflow: 'hidden',
          // Kenarların zemine erimesi — sert kesim marka dilini bozuyor
          maskImage:
            'radial-gradient(ellipse 74% 74% at 50% 50%, #000 55%, transparent 92%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 74% 74% at 50% 50%, #000 55%, transparent 92%)',
        }}
      >
        <Img
          src={staticFile(gorsel)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: urunOpacity,
            transform: `scale(${zoom})`,
          }}
        />

        {/* Model çekimi belirirken ürün çekimi söner — üst üste binmez */}
        {gorselModel && gecis > 0 && (
          <Img
            src={staticFile(gorselModel)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: modelOpacity,
              transform: `scale(${zoom})`,
            }}
          />
        )}

        {/* Altın ışık */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${isikX}%`,
            width: '45%',
            opacity: isikOpacity,
            background:
              'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.5) 45%, rgba(255,245,220,0.3) 60%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Ürün adı + hikaye ── */}
      <div
        style={{
          position: 'absolute',
          top: 1140,
          width: '100%',
          textAlign: 'center',
          padding: '0 90px',
        }}
      >
        <YukselenSatir gecikme={75} frame={frame}>
          <div
            style={{
              fontFamily: YAZI.baslik,
              fontSize: 76,
              fontWeight: 300,
              letterSpacing: -2,
              lineHeight: 1.1,
              color: RENK.siyah,
            }}
          >
            {urunAdi}
          </div>
        </YukselenSatir>

        <YukselenSatir gecikme={95} frame={frame}>
          <div
            style={{
              fontFamily: YAZI.baslik,
              fontSize: 36,
              fontStyle: 'italic',
              color: RENK.altinKoyu,
              marginTop: 24,
            }}
          >
            {hikaye}
          </div>
        </YukselenSatir>
      </div>

      {/* ── Fiyat ── */}
      <div
        style={{
          position: 'absolute',
          top: 1420,
          width: '100%',
          textAlign: 'center',
          opacity: interpolate(frame, [110, 140], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `scale(${interpolate(frame, [110, 140], [0.9, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })})`,
        }}
      >
        <span
          style={{
            fontFamily: YAZI.govde,
            fontSize: 60,
            fontWeight: 600,
            color: RENK.siyah,
          }}
        >
          {fiyat.toLocaleString('tr-TR')} ₺
        </span>
      </div>

      {/* ── Özellik rozetleri ── */}
      <div
        style={{
          position: 'absolute',
          top: 1540,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        {['Kararmaz', 'Suya Dayanıklı', 'Alerji Yapmaz'].map((etiket, i) => (
          <div
            key={etiket}
            style={{
              fontFamily: YAZI.govde,
              fontSize: 24,
              fontWeight: 300,
              color: 'rgba(10,10,10,0.62)',
              background: 'rgba(255,255,255,0.6)',
              border: `1px solid rgba(184,165,116,0.3)`,
              borderRadius: 999,
              padding: '14px 28px',
              opacity: interpolate(frame, [150 + i * 8, 175 + i * 8], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {etiket}
          </div>
        ))}
      </div>

      {/* ── Kapanış ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          width: '100%',
          textAlign: 'center',
          opacity: interpolate(frame, [200, 225], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            fontFamily: YAZI.govde,
            fontSize: 28,
            letterSpacing: 3,
            color: RENK.altinKoyu,
          }}
        >
          {MARKA.site}
        </div>
      </div>

      {/* Alt altın çizgi — sitedeki hero'nun imzası */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 4,
          background: RENK.altin,
          width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Maskeli kutudan yukarı yükselen satır — sitedeki H1 hareketinin aynısı. */
const YukselenSatir: React.FC<{
  children: React.ReactNode;
  gecikme: number;
  frame: number;
}> = ({ children, gecikme, frame }) => {
  const y = interpolate(frame, [gecikme, gecikme + 28], [110, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => bezier(t, EASE_SPRING),
  });

  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ transform: `translateY(${y}%)` }}>{children}</div>
    </div>
  );
};

/** Sitedeki cubic-bezier(0.16, 1, 0.3, 1) eğrisinin sayısal karşılığı. */
function bezier(t: number, [, , x2, y2]: readonly number[]): number {
  // Basit yaklaşım — tam bezier çözümü gerekmiyor, hareketin karakteri yeterli.
  return 1 - Math.pow(1 - t, 3) * (1 - y2) - Math.pow(1 - t, 2) * t * x2 * 0;
}
