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
import { MARKA, RENK, YAZI } from './brand';

export type YuzukLansmaniProps = {
  gorseller: [string, string, string];
  baslik?: string;
  altBaslik?: string;
  cta?: string;
};

const source = (path: string) =>
  path.startsWith('http://') || path.startsWith('https://')
    ? path
    : staticFile(path);

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const YuzukLansmani: React.FC<YuzukLansmaniProps> = ({
  gorseller,
  baslik = 'Özgün parçalar.',
  altBaslik = 'Ulaşılabilir bir lüks.',
  cta = 'Yeni yüzükleri keşfet',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const vertical = height / width > 1.45;
  const scale = width / 1080;
  const reveal = spring({ frame: frame - 8, fps, config: { damping: 180, mass: 0.85 } });
  const outro = interpolate(frame, [durationInFrames - 42, durationInFrames - 12], [0, 1], clamp);
  const textOpacity = interpolate(frame, [18, 42, durationInFrames - 54, durationInFrames - 28], [0, 1, 1, 0], clamp);

  const cardLayout = vertical
    ? [
        { left: 70, top: 450, width: 570, height: 720, rotate: -4 },
        { left: 420, top: 330, width: 590, height: 790, rotate: 3 },
        { left: 560, top: 970, width: 410, height: 520, rotate: 5 },
      ]
    : [
        { left: 42, top: 255, width: 500, height: 630, rotate: -4 },
        { left: 360, top: 190, width: 530, height: 690, rotate: 3 },
        { left: 665, top: 610, width: 335, height: 425, rotate: 5 },
      ];

  return (
    <AbsoluteFill style={{ backgroundColor: RENK.krem, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 78% 18%, white 0%, transparent 34%), linear-gradient(145deg, ${RENK.krem} 0%, #F1ECE3 52%, #E8DDC9 100%)` }} />
      <AbsoluteFill style={{ opacity: 0.48, backgroundImage: `radial-gradient(circle at 18% 22%, rgba(184,165,116,.16), transparent 40%), radial-gradient(circle at 84% 76%, rgba(143,123,80,.13), transparent 42%)` }} />

      <div style={{ position: 'absolute', top: vertical ? 80 : 54, left: 62, right: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: textOpacity }}>
        <div style={{ fontFamily: YAZI.editorial, fontSize: 40 * scale, color: '#16130F', letterSpacing: 5 }}>NOVELLA</div>
        <div style={{ fontFamily: YAZI.govde, fontSize: 15 * scale, color: RENK.altinKoyu, letterSpacing: 4, textTransform: 'uppercase' }}>Selected rings · 316L</div>
      </div>

      {gorseller.map((gorsel, index) => {
        const item = cardLayout[index];
        const localReveal = spring({ frame: frame - (16 + index * 10), fps, config: { damping: 190, mass: 0.8 } });
        const float = Math.sin((frame + index * 23) / 24) * (5 + index * 2);
        const zoom = interpolate(frame, [0, durationInFrames], [1.07 + index * 0.01, 1.015], clamp);
        return (
          <div key={`${gorsel}-${index}`} style={{ position: 'absolute', left: item.left * scale, top: item.top * (vertical ? height / 1920 : height / 1350), width: item.width * scale, height: item.height * (vertical ? height / 1920 : height / 1350), overflow: 'hidden', background: '#E7DED0', boxShadow: '0 28px 80px rgba(65,46,24,.18)', opacity: localReveal * (1 - outro), transform: `translateY(${(1 - localReveal) * 90 + float}px) rotate(${item.rotate}deg) scale(${0.96 + localReveal * 0.04})` }}>
            <Img src={source(gorsel)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
            <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.48)' }} />
          </div>
        );
      })}

      <div style={{ position: 'absolute', left: 64, right: 64, top: vertical ? 185 : 130, opacity: textOpacity, transform: `translateY(${(1 - reveal) * 26}px)` }}>
        <div style={{ fontFamily: YAZI.editorial, fontSize: (vertical ? 94 : 78) * scale, lineHeight: 0.92, letterSpacing: -3, color: '#16130F' }}>{baslik}</div>
        <div style={{ marginTop: 8, fontFamily: YAZI.baslik, fontSize: (vertical ? 66 : 54) * scale, fontStyle: 'italic', color: RENK.altinKoyu }}>{altBaslik}</div>
      </div>

      <div style={{ position: 'absolute', left: 62, right: 62, bottom: vertical ? 92 : 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: interpolate(frame, [88, 116, durationInFrames - 24, durationInFrames], [0, 1, 1, 0], clamp) }}>
        <div style={{ padding: `${16 * scale}px ${28 * scale}px`, borderRadius: 999, background: '#16130F', color: 'white', fontFamily: YAZI.govde, fontSize: 21 * scale }}>{cta}</div>
        <div style={{ fontFamily: YAZI.govde, fontSize: 17 * scale, color: 'rgba(22,19,15,.54)' }}>{MARKA.site}</div>
      </div>

      <AbsoluteFill style={{ background: '#16130F', opacity: outro }}>
        <div style={{ margin: 'auto', textAlign: 'center', color: 'white' }}>
          <div style={{ fontFamily: YAZI.editorial, fontSize: 108 * scale, letterSpacing: 8 }}>NOVELLA</div>
          <div style={{ marginTop: 20, fontFamily: YAZI.govde, fontSize: 20 * scale, letterSpacing: 5, textTransform: 'uppercase', color: RENK.altinAcik }}>Özgün parçalar · ulaşılabilir lüks</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
