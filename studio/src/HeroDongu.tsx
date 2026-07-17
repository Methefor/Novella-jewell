import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * NOT: `interface` değil `type` — Remotion Record<string, unknown> uyumu ister.
 */
export type HeroDonguProps = {
  gorsel: string;
  gorselIkinci?: string;
};

/**
 * Site hero'su için sessiz, YAZISIZ, sonsuz dönen video.
 *
 * ── Neden reklamdan ayrı bir kompozisyon? ──
 * Reklam videosunda marka adı, ürün adı, fiyat ve rozetler piksele gömülü.
 * Onu siteye koymak, sayfada zaten HTML olarak yazan bilgiyi Google'ın
 * okuyamayacağı bir biçimde tekrarlamak olur. Site videosu sadece hareket
 * taşır; metni sayfanın kendisi söyler.
 *
 * ── Kusursuz döngü ──
 * İlk ve son kare BİREBİR aynı olmalı, yoksa her turda görünür bir sıçrama
 * olur. Bu yüzden zoom gidip geri dönüyor (1.06 → 1.00 → 1.06) ve ışığın
 * opaklığı hem başta hem sonda 0.
 */
export const HeroDongu: React.FC<HeroDonguProps> = ({
  gorsel,
  gorselIkinci,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const orta = durationInFrames / 2;

  // Ping-pong zoom — başa döndüğünde aynı değerde biter, sıçrama olmaz.
  const zoom = interpolate(frame, [0, orta, durationInFrames], [1.06, 1.0, 1.06]);

  // İkinci görsel varsa: ortada belirir, sonda tekrar kaybolur → döngü korunur.
  const ikinciOpacity = gorselIkinci
    ? interpolate(
        frame,
        [orta * 0.5, orta * 0.9, orta * 1.1, orta * 1.5],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      )
    : 0;

  // Altın ışık — turda bir kez geçer, başta ve sonda görünmez.
  const isikX = interpolate(frame, [orta * 1.5, durationInFrames * 0.95], [-120, 220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isikOpacity = interpolate(
    frame,
    [orta * 1.5, orta * 1.62, durationInFrames * 0.88, durationInFrames * 0.95],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAF8F5' }}>
      <Img
        src={staticFile(gorsel)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom})`,
        }}
      />

      {gorselIkinci && ikinciOpacity > 0 && (
        <Img
          src={staticFile(gorselIkinci)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: ikinciOpacity,
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
            'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.45) 45%, rgba(255,245,220,0.28) 60%, transparent 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
