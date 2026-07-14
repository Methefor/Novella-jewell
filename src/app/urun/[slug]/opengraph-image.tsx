import { getProductBySlug, getAllProducts } from '@/lib/products';
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  const name = product?.name ?? 'NOVELLA';
  const price = product ? `${product.price.toLocaleString('tr-TR')} ₺` : '';
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
            fontSize: 20,
            fontWeight: 300,
            color: '#1A1A1A',
            letterSpacing: '-1px',
          }}
        >
          NOVELLA
        </div>
      </div>
    ),
    { ...size }
  );
}
