import type { Metadata } from 'next';
import { Suspense } from 'react';
import OdemeClient from './OdemeClient';

export const metadata: Metadata = {
  title: 'Ödeme — NOVELLA',
  robots: { index: false },
};

export default function OdemePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <OdemeClient />
    </Suspense>
  );
}
