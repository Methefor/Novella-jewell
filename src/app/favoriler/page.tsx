import { SITE } from '@/lib/config';
import type { Metadata } from 'next';
import FavorilerClient from './FavorilerClient';

export const metadata: Metadata = {
  title: 'Favorilerim',
  description: 'Beğendiğiniz NOVELLA takıları.',
  alternates: { canonical: `${SITE.url}/favoriler` },
  robots: { index: false, follow: true },
};

export default function FavorilerPage() {
  return <FavorilerClient />;
}
