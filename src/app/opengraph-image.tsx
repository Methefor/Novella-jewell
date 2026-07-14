import { SITE } from '@/lib/config';
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F6F4EE',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 300,
            color: '#1A1A1A',
            letterSpacing: '-3px',
            lineHeight: 1,
          }}
        >
          {SITE.name}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#B8A574',
            marginTop: 24,
            letterSpacing: '1px',
          }}
        >
          {SITE.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
