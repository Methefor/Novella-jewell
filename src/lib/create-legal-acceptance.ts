import 'server-only';
import { isValidElement, type ReactNode } from 'react';
import { OnBilgilendirmePage, MesafeliSatisPage, KvkkPage } from '@/components/legal/CheckoutDocuments';
import { LEGAL_VERSION, YASAL_GUNCELLEME } from '@/lib/legal';
import type { LegalAcceptance } from './legal-acceptance';
import type { Order } from './checkout/types';

// Document bodies contain only intrinsic elements/fragments. Fail closed if that
// changes: an omitted clause must never silently become an accepted snapshot.
function documentText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(documentText).join('');
  if (!isValidElement<{ children?: ReactNode; href?: string }>(node)) throw new Error('Unsupported legal content');
  if (typeof node.type !== 'string' && typeof node.type !== 'symbol') throw new Error('Legal content must be static');
  const content = documentText(node.props.children);
  const block = typeof node.type === 'string' && /^(p|h[1-6]|li|dt|dd|div|ul|ol|dl|br)$/.test(node.type);
  return content + (node.type === 'a' && node.props.href ? ` (${node.props.href})` : '') + (block ? '\n' : '');
}

export function createLegalAcceptance(order: Order): LegalAcceptance {
  const documents = [OnBilgilendirmePage(), MesafeliSatisPage(), KvkkPage()].map((element) => ({
    title: element.props.title as string,
    text: [element.props.intro, documentText(element.props.children), `Son güncelleme: ${YASAL_GUNCELLEME}`].join('\n'),
  }));
  const { customer, items, subtotal, shippingCost, total, currency } = order;
  return {
    version: LEGAL_VERSION, acceptedAt: new Date().toISOString(),
    contractAccepted: true, privacyNoticeRead: true, documents,
    purchase: structuredClone({ customer, items, subtotal, shippingCost, total, currency }),
  };
}
