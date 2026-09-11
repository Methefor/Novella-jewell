import React from 'react';
import { Img, staticFile } from 'remotion';

type BrandLogoProps = {
  tone?: 'black' | 'white' | 'gold';
  width: number;
  style?: React.CSSProperties;
};

const files = {
  black: 'brand/novellajewell-logo-black-2048.png',
  white: 'brand/novellajewell-logo-white-2048.png',
  gold: 'brand/novellajewell-logo-gold-2048.png',
} as const;

export const BrandLogo: React.FC<BrandLogoProps> = ({ tone = 'black', width, style }) => (
  <Img
    src={staticFile(files[tone])}
    style={{
      width,
      height: width * (506 / 2048),
      objectFit: 'contain',
      ...style,
    }}
  />
);
