import { SITE } from '@/lib/config';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'NovellaJewell — Özgün 316L Çelik Takılar';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const logoData = await readFile(join(process.cwd(), 'public/brand/novellajewell-logo-black-2048.png'), 'base64');
const logoSrc = `data:image/png;base64,${logoData}`;

export default async function Image() {
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
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders embedded data URLs with img. */}
        <img src={logoSrc} width={650} height={161} alt={SITE.name} />
        <div
          style={{
            fontSize: 24,
            color: '#9E8E63',
            marginTop: 36,
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
