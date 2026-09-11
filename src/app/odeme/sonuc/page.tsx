import type { Metadata } from 'next';
import { Suspense } from 'react';
import SonucClient from './SonucClient';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Sipariş Sonucu — NOVELLA',
  robots: { index: false },
};

export default async function SonucPage({ searchParams }: { searchParams: Promise<{ orderNo?: string; verify?: string; status?: string }> }) {
  const params = await searchParams;
  if (params.status === 'success' && params.orderNo && params.verify) {
    redirect(`/api/odeme/return?orderNo=${encodeURIComponent(params.orderNo)}&verify=${encodeURIComponent(params.verify)}`);
  }
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <SonucClient />
    </Suspense>
  );
}
