import { getCheckoutProvider } from '@/lib/checkout';
import type { Order } from '@/lib/checkout/types';
import { saveOrder } from '@/lib/orders';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order: Order = body.order;

    if (!order?.id || !order?.customer || !order?.items?.length) {
      return NextResponse.json({ error: 'Geçersiz sipariş verisi.' }, { status: 400 });
    }

    await saveOrder(order, 'pending');

    const provider = getCheckoutProvider();
    const result = await provider.createPayment(order);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/checkout]', err);
    return NextResponse.json({ error: 'Ödeme başlatılamadı.' }, { status: 500 });
  }
}
