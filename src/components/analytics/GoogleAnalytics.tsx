'use client';

import {
  COOKIE_CONSENT_EVENT,
  getConsent,
  type ConsentValue,
} from '@/lib/cookies';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

function RouteChangeTracker() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    // İlk sayfa görüntülemesini gtag('config') gönderir. Burada yalnızca
    // Next.js istemci yönlendirmelerini izleyerek çift sayımı önlüyoruz.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const w = window as typeof window & {
      gtag?: (
        command: string,
        eventName: string,
        params?: Record<string, unknown>
      ) => void;
    };
    w.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${pathname}${window.location.search}`,
    });
  }, [pathname]);

  return null;
}

/**
 * Google Analytics — YALNIZCA çerez onayı verildiyse yüklenir.
 *
 * KVKK: analitik çerezler açık rıza olmadan çalıştırılamaz. Bu yüzden onay
 * yoksa <Script> hiç render edilmez — script sayfaya eklenmez, pasif de kalmaz.
 *
 * Kurulum: .env.local (ve Vercel) içine NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX yaz.
 * ID yoksa bileşen sessizce hiçbir şey yapmaz.
 */
export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const [consent, setConsentState] = useState<ConsentValue>(null);

  useEffect(() => {
    setConsentState(getConsent());

    const onChange = (e: Event) => {
      setConsentState((e as CustomEvent<ConsentValue>).detail);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  if (!GA_ID || !/^G-[A-Z0-9]+$/i.test(GA_ID)) return null;
  if (consent !== 'accepted') return null;

  return (
    <>
      <RouteChangeTracker />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
