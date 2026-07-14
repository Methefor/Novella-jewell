import type { Metadata } from 'next';
import { Suspense } from 'react';
import SonucClient from './SonucClient';

export const metadata: Metadata = {
  title: 'Sipariş Sonucu — NOVELLA',
  robots: { index: false },
};

export default function SonucPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SonucClient />
    </Suspense>
  );
}
