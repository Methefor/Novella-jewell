import { getCheckoutProvider } from '@/lib/checkout';
import { saveOrder } from '@/lib/orders';
import { NextRequest, NextResponse } from 'next/server';

// Shopier callback: GET veya POST olarak gelebilir
export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  const siteUrl = (await import('@/lib/config')).SITE.url;

  // Parametre toplama (query string + form body)
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  try {
    const contentType = req.headers.get('content-type') ?? '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      new URLSearchParams(text).forEach((v, k) => { params[k] = v; });
    }
  } catch {
    // body okuma opsiyonel
  }

  const { platform_order_id } = params;

  // İmza doğrulama — başarısız → hata sayfası
  const provider = getCheckoutProvider();
  if (!provider.verifyCallback(params)) {
    console.error('[callback] İmza doğrulama başarısız', { platform_order_id });
    return NextResponse.redirect(
      `${siteUrl}/odeme/sonuc?status=error&reason=signature`
    );
  }

  // Ödeme durumu. Shopier güncel akış 'status=success' gönderiyor; eski
  // modüllerde 'payment_status=1' geliyordu — ikisini de kabul et.
  const isPaid =
    params.status === 'success' || params.payment_status === '1';

  // Geçici sipariş logu — Supabase fazında DB kaydına dönüşecek
  if (isPaid && platform_order_id) {
    await saveOrder(
      {
        id: platform_order_id,
        items: [],
        customer: { name: '', surname: '', email: '', phone: '', address: '', city: '', district: '' },
        subtotal: 0,
        shippingCost: 0,
        total: 0,
        currency: 'TRY',
        createdAt: new Date().toISOString(),
      },
      'paid'
    );
  }

  const status = isPaid ? 'success' : 'error';
  // GA4 purchase için toplam tutar. Shopier geri gönderirse (total_order_value)
  // kullanılır; sipariş kalıcı kaydı (Supabase) gelince asıl kaynak orası olmalı.
  const total = params.total_order_value ?? '';
  return NextResponse.redirect(
    `${siteUrl}/odeme/sonuc?status=${status}&orderId=${platform_order_id ?? ''}${
      total ? `&total=${encodeURIComponent(total)}` : ''
    }`
  );
}
