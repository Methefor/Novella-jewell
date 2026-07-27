'use client';

import {
  COOKIE_CONSENT_EVENT,
  getConsent,
  type ConsentValue,
} from '@/lib/cookies';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type GtagWindow = typeof window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function RouteChangeTracker({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!enabled) return;

    const w = window as GtagWindow;
    w.gtag?.('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${pathname}${window.location.search}`,
    });
  }, [enabled, pathname]);

  return null;
}

/**
 * Google etiketi her zaman bulunabilir durumdadır; ölçüm ise yalnızca açık
 * çerez onayından sonra başlar. Böylece Google kurulum testi etiketi görebilir,
 * onay öncesinde analitik depolama ve sayfa görüntüleme çalışmaz.
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
    w.gtag =
      w.gtag ||
      function gtag(...args: unknown[]) {
        w.dataLayer?.push(args);
      };

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
        w.gtag?.('config', GA_ID, { anonymize_ip: true });
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
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
