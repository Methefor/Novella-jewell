import { getCheckoutProvider } from '@/lib/checkout';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { markOrderFailed, markOrderPaid } from '@/lib/orders';
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
  url.searchParams.forEach((v, k) => {
    params[k] = v;
  });

  try {
    const contentType = req.headers.get('content-type') ?? '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      new URLSearchParams(text).forEach((v, k) => {
        params[k] = v;
      });
    }
  } catch {
    // body okuma opsiyonel
  }

  const orderNo = params.platform_order_id ?? '';

  // İmza doğrulama — başarısız → hata sayfası (kayda dokunma)
  const provider = getCheckoutProvider();
  if (!provider.verifyCallback(params)) {
    console.error('[callback] İmza doğrulama başarısız', { orderNo });
    return NextResponse.redirect(
      `${siteUrl}/odeme/sonuc?status=error&reason=signature`
    );
  }

  // Ödeme durumu. Güncel Shopier akışı 'status=success'; eski modüllerde
  // 'payment_status=1' geliyordu — ikisini de kabul et.
  const isPaid =
    params.status === 'success' || params.payment_status === '1';

  let total = '';

  if (isPaid) {
    // IDEMPOTENT: aynı callback iki kez gelirse ikinci sefer no-op olur.
    const sonuc = await markOrderPaid(orderNo, params.payment_id);

    // E-posta YALNIZCA ilk paid geçişinde ve kayıt varsa gönderilir.
    // Gönderim başarısız olsa bile sipariş akışı KIRILMAZ (try/catch içinde).
    if (sonuc.ok && !sonuc.zatenPaid && sonuc.order) {
      total = sonuc.order.total;
      try {
        await sendOrderConfirmationEmail(sonuc.order);
      } catch (e) {
        console.error('[callback] Onay e-postası gönderilemedi', {
          orderNo,
          err: e,
        });
      }
    } else if (sonuc.ok && sonuc.zatenPaid) {
      console.warn('[callback] Tekrar gelen paid callback (idempotent no-op)', {
        orderNo,
      });
    }
  } else {
    await markOrderFailed(orderNo);
  }

  const status = isPaid ? 'success' : 'error';
  return NextResponse.redirect(
    `${siteUrl}/odeme/sonuc?status=${status}&orderNo=${encodeURIComponent(
      orderNo
    )}${total ? `&total=${encodeURIComponent(total)}` : ''}`
  );
}
