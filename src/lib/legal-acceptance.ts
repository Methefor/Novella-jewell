import type { Order } from '@/lib/checkout/types';

export interface LegalAcceptance {
  version: string;
  acceptedAt: string;
  contractAccepted: true;
  privacyNoticeRead: true;
  documents: { title: string; text: string }[];
  purchase: Pick<Order, 'customer' | 'items' | 'subtotal' | 'shippingCost' | 'total' | 'currency'>;
}

/** Uses the saved snapshot, never today's website copy. */
export function legalAcceptanceText(orderNo: string, acceptance: LegalAcceptance): string {
  const p = acceptance.purchase;
  return [
    `NOVELLA — Sipariş belgeleri (${orderNo})`,
    `Metin sürümü: ${acceptance.version}`,
    `Onay zamanı (UTC): ${acceptance.acceptedAt}`,
    'Ön bilgilendirme ve satış sözleşmesi onaylandı. KVKK aydınlatma metni okundu.',
    `Alıcı: ${p.customer.name} ${p.customer.surname}`,
    `E-posta: ${p.customer.email} | Telefon: ${p.customer.phone}`,
    `Teslimat: ${p.customer.address}, ${p.customer.district}/${p.customer.city}`,
    ...p.items.map((i) => `${i.name} | ${i.variantId} | ${i.quantity} adet × ${i.price.toFixed(2)} TRY${i.customization ? ' | Kişiselleştirme: ' + i.customization : ''}`),
    `Ürünler (KDV dâhil): ${p.subtotal.toFixed(2)} TRY`,
    `Kargo: ${p.shippingCost.toFixed(2)} TRY | Toplam: ${p.total.toFixed(2)} TRY`,
    ...acceptance.documents.map((d) => `\n${d.title}\n${d.text}`),
  ].join('\n');
}
