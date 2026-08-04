import { getCheckoutProvider } from '@/lib/checkout';
import { fromPayTROid } from '@/lib/checkout/paytr';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { markOrderFailed, markOrderPaid } from '@/lib/orders';
import { NextRequest, NextResponse } from 'next/server';

// PayTR callback'i production'da POST gelir. GET desteği güvenli tanılama ve
// geriye dönük callback testleri için aynı doğrulama yolunu kullanır.
export async function GET(req: NextRequest) {
  return handleCallback(req);
}

export async function POST(req: NextRequest) {
  return handleCallback(req);
}

async function handleCallback(req: NextRequest) {
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

  // PayTR merchant_oid (alfanumerik, NJ20260001) DB formatına geri çevrilir.
  const orderNo = params.merchant_oid ? fromPayTROid(params.merchant_oid) : '';

  // İmza doğrulama — başarısız → hata sayfası (kayda dokunma)
  const provider = getCheckoutProvider();
  if (!provider.verifyCallback(params)) {
    console.error('[callback] İmza doğrulama başarısız', { orderNo });
    return new NextResponse('PAYTR notification failed: bad hash', {
      status: 400,
    });
  }

  const isPaid = params.status === 'success';

  if (isPaid) {
    // IDEMPOTENT: aynı callback iki kez gelirse ikinci sefer no-op olur.
    const sonuc = await markOrderPaid(orderNo, params.payment_id);

    // E-posta YALNIZCA ilk paid geçişinde ve kayıt varsa gönderilir.
    // Gönderim başarısız olsa bile sipariş akışı KIRILMAZ (try/catch içinde).
    if (sonuc.ok && !sonuc.zatenPaid && sonuc.order) {
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
  return new NextResponse('OK');
}
