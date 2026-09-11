import { getCatalogProducts } from '@/lib/catalog';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getCatalogProducts(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Ürünler şu anda yüklenemiyor.' }, { status: 503 });
  }
}
