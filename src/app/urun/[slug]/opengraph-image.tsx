import { getCatalogProductBySlug, getCatalogProducts } from '@/lib/catalog';
export const revalidate = 60;
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
const logoData = await readFile(join(process.cwd(), 'public/brand/novellajewell-logo-black-2048.png'), 'base64');
const logoSrc = `data:image/png;base64,${logoData}`;

export async function generateStaticParams() {
  return (await getCatalogProducts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  const name = product?.name ?? 'NOVELLA';
  // "₺" yerine "TL": OG görseli satori ile üretiliyor ve ₺ karakteri için
  // dinamik font indirmesi 400 dönüyor (build log'unda "Failed to load dynamic
  // font for ₺"). Sembol boş kutu olarak çıkıyordu. "TL" varsayılan fontta var.
  const price = product ? `${product.price.toLocaleString('tr-TR')} TL` : '';
  const collection = product?.collection ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#F6F4EE',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {collection && (
            <div style={{ fontSize: 18, color: '#B8A574', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {collection}
            </div>
          )}
          <div style={{ fontSize: 52, fontWeight: 300, color: '#1A1A1A', letterSpacing: '-1px', lineHeight: 1.1 }}>
            {name}
          </div>
          {price && (
            <div style={{ fontSize: 28, color: '#555', marginTop: '8px' }}>
              {price}
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            top: '64px',
            right: '64px',
            display: 'flex',
            width: '250px',
            height: '62px',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders embedded data URLs with img. */}
          <img src={logoSrc} width={250} height={62} alt="NovellaJewell" />
        </div>
      </div>
    ),
    { ...size }
  );
}
