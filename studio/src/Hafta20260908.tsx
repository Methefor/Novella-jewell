import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { GRADYAN_SAMPANYA, MARKA, RENK, YAZI } from './brand';
import { BrandLogo } from './BrandLogo';

export type HaftaKaruselProps = {
  seri: 'ig001' | 'ig003';
  slide: number;
};

// Gerçek ürün fotoğrafları — production kataloğu (Vercel Blob).
// Yerel public/media/* dosyaları silindi; bu görseller doğrudan URL'den yüklenir.
// Hafta 1: yalnızca doğrulanmış küpe + bilezik çekimleri. Yüzük görselleri karantinada.
const BLOB = 'https://uzxch7c5mh5aeema.public.blob.vercel-storage.com/products';

const IG001_URUNLER: Record<number, string> = {
  1: `${BLOB}/paris-laurel-yaprak-zincir-altin-bileklik/paris-laurel-yaprak-zincir-altin-bileklik-03-H3QKtiR001hFIZN6OVwD5nwBzZBgG2.jpg`,
  2: `${BLOB}/barcelona-goutte-tas-cizgili-altin-kupe/barcelona-goutte-tas-cizgili-altin-kupe-02-model-closeup-XhDNU1oRYxbMliRO0EJ0MYyBWbd2Zr.png`,
  3: `${BLOB}/barcelona-tempo-saat-kordonu-altin-bileklik/barcelona-tempo-saat-kordonu-altin-bileklik-03-aEeMaXu0ndv5eRtRgYLIWc1X7bkgWL.jpg`,
};

const IG003_METINLER: Record<number, string> = {
  2: "316L, düşük karbonlu bir paslanmaz çelik sınıfıdır. Krom, nikel ve molibden içerir. 'L' düşük karbon demektir — 'nikelsiz' demek değildir.",
  3: 'Suya dayanıklı ve kararmaya karşı dirençli. Yine de duş, deniz, havuz ve spor öncesi çıkarmak yüzeyi korur.',
  4: 'Çelik taban ile kaplamayı ayrı düşünün. Taban çelik olsa bile kaplama zamanla aşınabilir.',
  5: "'Cerrahi çelik' ya da '316L' ifadesi; ürünün steril, implant için uygun ya da her cilde uygun olduğu anlamına gelmez.",
  6: 'Metal hassasiyetiniz varsa ürün bilgilerini kontrol edin, gerekirse siparişten önce bize yazın.',
  7: 'Ürün bazında malzeme, kaplama, ölçü ve bakım bilgisi → ürün sayfası.',
};

const KremZemin: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      background: RENK.krem,
      color: RENK.siyah,
      overflow: 'hidden',
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage:
          'radial-gradient(circle at 88% 8%, rgba(184,165,116,0.11), transparent 32%), radial-gradient(circle at 8% 92%, rgba(234,225,209,0.55), transparent 36%)',
      }}
    />
    {children}
  </AbsoluteFill>
);

const Imza: React.FC<{ ortali?: boolean }> = ({ ortali = false }) => (
  <div
    style={{
      fontFamily: YAZI.baslik,
      fontSize: 30,
      fontWeight: 300,
      letterSpacing: 9,
      color: RENK.siyah,
      textAlign: ortali ? 'center' : 'left',
    }}
  >
    {MARKA.ad}
  </div>
);

const AltinCizgi: React.FC<{ width?: number }> = ({ width = 116 }) => (
  <div
    style={{
      width,
      height: 2,
      background: RENK.altin,
    }}
  />
);

const IG001: React.FC<{ slide: number }> = ({ slide }) => {
  const urun = IG001_URUNLER[slide];

  if (slide === 1 && urun) {
    return (
      <KremZemin>
        <Img
          src={urun}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'saturate(0.94) contrast(0.98) brightness(1.02)',
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(250,248,245,0.92) 0%, rgba(250,248,245,0) 28%, rgba(250,248,245,0) 67%, rgba(250,248,245,0.94) 100%)',
          }}
        />
        <BrandLogo
          width={430}
          style={{ position: 'absolute', top: 82, left: '50%', transform: 'translateX(-50%)' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 91,
            width: '100%',
            textAlign: 'center',
            fontFamily: YAZI.editorial,
            fontSize: 44,
            color: RENK.siyah,
          }}
        >
          kısa hikâye demek.
        </div>
      </KremZemin>
    );
  }

  if ((slide === 2 || slide === 3) && urun) {
    return (
      <KremZemin>
        <div
          style={{
            position: 'absolute',
            left: 70,
            top: 205,
            width: 940,
            height: 940,
            overflow: 'hidden',
            background: RENK.kremKoyu,
            boxShadow: '0 32px 80px rgba(88,69,30,0.09)',
          }}
        >
          <Img
            src={urun}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'saturate(0.94) contrast(0.98) brightness(1.015)',
            }}
          />
        </div>
      </KremZemin>
    );
  }

  if (slide === 4) {
    return (
      <BilgiKarti>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
          <div
            style={{
              fontFamily: YAZI.baslik,
              fontSize: 72,
              fontWeight: 300,
              lineHeight: 1.08,
            }}
          >
            316L paslanmaz çelik
          </div>
          <AltinCizgi width={148} />
          <div
            style={{
              fontFamily: YAZI.govde,
              fontSize: 36,
              lineHeight: 1.48,
              letterSpacing: -0.3,
            }}
          >
            Suya dayanıklı · kararmaya dirençli
          </div>
          <div
            style={{
              fontFamily: YAZI.govde,
              fontSize: 36,
              lineHeight: 1.48,
            }}
          >
            Hediye kutusunda
          </div>
        </div>
      </BilgiKarti>
    );
  }

  if (slide === 5) {
    return (
      <BilgiKarti>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div
            style={{
              fontFamily: YAZI.baslik,
              fontSize: 62,
              fontWeight: 300,
              lineHeight: 1.15,
            }}
          >
            Siparişten sonra 1–3 iş gününde kargo
          </div>
          <AltinCizgi width={148} />
          <div
            style={{
              fontFamily: YAZI.govde,
              fontSize: 38,
              lineHeight: 1.5,
            }}
          >
            14 gün içinde iade talebi
          </div>
          <div
            style={{
              fontFamily: YAZI.govde,
              fontSize: 25,
              lineHeight: 1.5,
              color: 'rgba(10,10,10,0.5)',
            }}
          >
            (yasal istisnalar saklıdır)
          </div>
        </div>
      </BilgiKarti>
    );
  }

  return (
    <KremZemin>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 34,
          transform: 'translateY(-18px)',
        }}
      >
        <BrandLogo width={500} />
        <AltinCizgi width={86} />
        <div
          style={{
            fontFamily: YAZI.govde,
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: 3.2,
            color: RENK.altinKoyu,
          }}
        >
          novellajewell.com
        </div>
      </div>
    </KremZemin>
  );
};

const BilgiKarti: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <KremZemin>
    <div style={{ position: 'absolute', top: 94, left: 92 }}>
      <Imza />
    </div>
    <div
      style={{
        position: 'absolute',
        left: 108,
        right: 108,
        top: 315,
        bottom: 235,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
    <div
      style={{
        position: 'absolute',
        left: 92,
        right: 92,
        bottom: 80,
        height: 1,
        background: RENK.kenar,
      }}
    />
  </KremZemin>
);

const IG003: React.FC<{ slide: number }> = ({ slide }) => {
  if (slide === 1) {
    return (
      <KremZemin>
        <div style={{ position: 'absolute', top: 94, left: 92 }}>
          <Imza />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 104,
            right: 104,
            top: 325,
            display: 'flex',
            flexDirection: 'column',
            gap: 52,
          }}
        >
          <AltinCizgi width={156} />
          <div
            style={{
              fontFamily: YAZI.baslik,
              fontSize: 88,
              fontWeight: 300,
              lineHeight: 1.03,
              letterSpacing: -1.8,
              maxWidth: 820,
            }}
          >
            316L ne anlatır, ne anlatmaz?
          </div>
        </div>
        <KartAltCizgi />
      </KremZemin>
    );
  }

  const fontSize = slide === 2 || slide === 5 ? 40 : slide === 7 ? 48 : 44;

  return (
    <KremZemin>
      <div style={{ position: 'absolute', top: 94, left: 92 }}>
        <Imza />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 106,
          right: 106,
          top: 265,
          bottom: 210,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 46,
        }}
      >
        <AltinCizgi width={136} />
        <div
          style={{
            fontFamily: YAZI.govde,
            fontSize,
            fontWeight: 400,
            lineHeight: 1.47,
            letterSpacing: -0.45,
            maxWidth: 850,
          }}
        >
          {IG003_METINLER[slide]}
        </div>
        {slide === 7 && (
          <div style={{ marginTop: 28 }}>
            <Imza />
          </div>
        )}
      </div>
      <KartAltCizgi />
    </KremZemin>
  );
};

const KartAltCizgi: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 92,
      right: 92,
      bottom: 80,
      height: 1,
      background: RENK.altin,
      opacity: 0.55,
    }}
  />
);

export const HaftaKarusel: React.FC<HaftaKaruselProps> = ({ seri, slide }) => {
  return seri === 'ig001' ? <IG001 slide={slide} /> : <IG003 slide={slide} />;
};

// IG-002 "Gerçek ürün yakın planı" — 3 doğrulanmış model yakın-plan çekimi (küpe).
const REEL_GORSELLER = [
  `${BLOB}/barcelona-amour-pembe-mine-kalp-altin-kupe/barcelona-amour-pembe-mine-kalp-altin-kupe-02-model-closeup-wZL4Ka69muODq3mHXKfD7Qeq9WDZl4.png`,
  `${BLOB}/barcelona-goutte-tas-cizgili-altin-kupe/barcelona-goutte-tas-cizgili-altin-kupe-02-model-closeup-XhDNU1oRYxbMliRO0EJ0MYyBWbd2Zr.png`,
  `${BLOB}/paris-halo-pave-daire-gumus-kupe/paris-halo-pave-daire-gumus-kupe-02-model-closeup-ViFOaVWOYBBQwTmLBFKVcag5DmsOhB.png`,
] as const;

const REEL_BASLANGICLAR = [0, 104, 208] as const;

const gorselOpacity = (frame: number, index: number): number => {
  const baslangic = REEL_BASLANGICLAR[index];
  const bitis = index === 0 ? 116 : index === 1 ? 220 : 332;
  const giris = index === 0
    ? 1
    : interpolate(frame, [baslangic, baslangic + 12], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
  const cikis = interpolate(frame, [bitis - 12, bitis], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return Math.min(giris, cikis);
};

export const DetayYakinPlanReel: React.FC = () => {
  const frame = useCurrentFrame();
  const kapanisOpacity = interpolate(frame, [320, 332], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const altyaziOpacity = interpolate(frame, [0, 10, 48, 60], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isikX = interpolate(frame, [134, 164], [-1250, 1150], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isikOpacity = interpolate(frame, [134, 142, 156, 164], [0, 0.72, 0.72, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: GRADYAN_SAMPANYA, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 14%, rgba(255,255,255,0.82), transparent 34%), radial-gradient(circle at 82% 82%, rgba(184,165,116,0.14), transparent 38%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 360,
          width: 960,
          height: 1120,
          overflow: 'hidden',
          borderRadius: 28,
          background: RENK.kremKoyu,
          boxShadow: '0 38px 110px rgba(74,56,19,0.15)',
        }}
      >
        {REEL_GORSELLER.map((gorsel, index) => {
          const baslangic = REEL_BASLANGICLAR[index];
          const bitis = index === 2 ? 332 : REEL_BASLANGICLAR[index + 1] + 12;
          const zoom = interpolate(frame, [baslangic, bitis], [1.12, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <Img
              key={gorsel}
              src={gorsel}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: index === 1 ? '50% 48%' : '50% 50%',
                opacity: gorselOpacity(frame, index),
                transform: `scale(${zoom})`,
                filter: 'saturate(0.94) contrast(0.98) brightness(1.015)',
              }}
            />
          );
        })}

        <div
          style={{
            position: 'absolute',
            top: -100,
            bottom: -100,
            left: 0,
            width: 430,
            opacity: isikOpacity,
            transform: `translateX(${isikX}px) rotate(11deg)`,
            background:
              'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.08) 16%, rgba(255,250,229,0.62) 48%, rgba(255,255,255,0.08) 80%, transparent 100%)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 82,
          bottom: 205,
          opacity: altyaziOpacity,
          fontFamily: YAZI.govde,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: 1.1,
          color: RENK.siyah,
        }}
      >
        316L paslanmaz çelik
      </div>

      <AbsoluteFill
        style={{
          background: RENK.krem,
          opacity: kapanisOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 42,
        }}
      >
        <BrandLogo width={520} />
        <AltinCizgi width={96} />
        <div
          style={{
            fontFamily: YAZI.govde,
            fontSize: 30,
            fontWeight: 500,
            letterSpacing: 3.2,
            color: RENK.altinKoyu,
          }}
        >
          novellajewell.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
