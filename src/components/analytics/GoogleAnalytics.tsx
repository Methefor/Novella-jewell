'use client';

import {
  COOKIE_CONSENT_EVENT,
  getConsent,
  type ConsentValue,
} from '@/lib/cookies';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createGtagQueue } from '@/lib/gtag-queue';

type GtagWindow = typeof window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function RouteChangeTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();


  useEffect(() => {
    if (!enabled) return;

    const w = window as GtagWindow;
    w.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: `${window.location.origin}${pathname}`,
      page_path: pathname,
    });
  }, [enabled, pathname]);

  return null;
}

/**
 * Google komut kuyruğu hazırdır; etiket ve ölçüm açık izinden sonra başlar.
 */
export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const [consent, setConsentState] = useState<ConsentValue>(null);
  const configured = useRef(false);
  const validId = Boolean(GA_ID && /^G-[A-Z0-9]+$/i.test(GA_ID));

  useEffect(() => {
    if (!validId) return;

    const w = window as GtagWindow;
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || createGtagQueue(w.dataLayer);

    w.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
    w.gtag('js', new Date());

    const applyConsent = (value: ConsentValue) => {
      const accepted = value === 'accepted';
      w.gtag?.('consent', 'update', {
        analytics_storage: accepted ? 'granted' : 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });

      if (accepted && !configured.current) {
        configured.current = true;
        w.gtag?.('config', GA_ID, { anonymize_ip: true, send_page_view: false, page_location: `${window.location.origin}${window.location.pathname}` });
        window.dispatchEvent(new Event('novella:analytics-ready'));
      }
    };

    const initialConsent = getConsent();
    setConsentState(initialConsent);
    applyConsent(initialConsent);

    const onChange = (event: Event) => {
      const value = (event as CustomEvent<ConsentValue>).detail;
      setConsentState(value);
      applyConsent(value);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, [GA_ID, validId]);

  if (!validId) return null;

  return (
    <>
      <RouteChangeTracker enabled={consent === 'accepted'} />
      {consent === 'accepted' && <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
        onReady={() => { window.dispatchEvent(new Event('novella:analytics-ready')); }}
      />}
    </>
  );
}
