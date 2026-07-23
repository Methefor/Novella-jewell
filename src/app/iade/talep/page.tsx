import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import IadeTalepClient from './IadeTalepClient';

export const metadata: Metadata = {
  title: 'İade Talebi',
  description:
    'NOVELLA iade talebi formu. Sipariş numaranızla 14 gün içinde kolayca iade talebi oluşturun.',
  alternates: { canonical: `${SITE.url}/iade/talep` },
};

export default function IadeTalepPage() {
  return <IadeTalepClient />;
}
