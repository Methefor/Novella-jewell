import { getCheckoutProvider } from '@/lib/checkout';
import { fromPayTROid } from '@/lib/checkout/paytr';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { markOrderFailed, markOrderPaid } from '@/lib/orders';
import { NextRequest, NextResponse } from 'next/server';

// PayTR/Shopier callback: GET veya POST olarak gelebilir.
export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
  const siteUrl = (await import('@/lib/config')).SITE.url;
  const providerName = process.env.CHECKOUT_PROVIDER ?? 'paytr';

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

  // PayTR: merchant_oid (alfanumerik, NJ20260001) → DB formatına geri çevrilir;
  // eski Shopier: platform_order_id (olduğu gibi).
  const orderNo =
    params.platform_order_id ??
    (params.merchant_oid ? fromPayTROid(params.merchant_oid) : '');

  // İmza doğrulama — başarısız → hata sayfası (kayda dokunma)
  const provider = getCheckoutProvider();
  if (!provider.verifyCallback(params)) {
    console.error('[callback] İmza doğrulama başarısız', { orderNo });
    return NextResponse.redirect(
      `${siteUrl}/odeme/sonuc?status=error&reason=signature`
    );
  }

  // PayTR status: success | failed; eski Shopier: status=success veya payment_status=1.
  const isPaid = params.status === 'success' || params.payment_status === '1';

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

  // PayTR Bildirim URL'sine (callback) dönülmesi gereken yanıt düz "OK" metnidir.
  // Müşterinin gördüğü başarı/hata sayfası merchant_ok_url / merchant_fail_url ile
  // ayrıca ayarlanır; o yüzden burada redirect dönmeyiz.
  if (providerName === 'paytr') {
    return new NextResponse('OK');
  }

  // Eski Shopier akışı: callback doğrudan müşteriyi sonuç sayfasına yönlendirir.
  const status = isPaid ? 'success' : 'error';
  return NextResponse.redirect(
    `${siteUrl}/odeme/sonuc?status=${status}&orderNo=${encodeURIComponent(
      orderNo
    )}${total ? `&total=${encodeURIComponent(total)}` : ''}`
  );
}
