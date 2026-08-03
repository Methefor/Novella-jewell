'use client';

import {
  COOKIE_CONSENT_EVENT,
  getConsent,
  type ConsentValue,
} from '@/lib/cookies';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type MetaPixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: MetaPixelFunction;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
  }
}

function installQueue(): MetaPixelFunction {
  if (window.fbq) return window.fbq;

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as MetaPixelFunction;

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  return fbq;
}

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentValue>(null);
  const initialized = useRef(false);
  const skipNextRoutePageView = useRef(true);
  const validId = Boolean(pixelId && /^\d{5,30}$/.test(pixelId));

  useEffect(() => {
    setConsent(getConsent());
    const onChange = (event: Event) =>
      setConsent((event as CustomEvent<ConsentValue>).detail);
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (!validId || !pixelId || consent !== 'accepted') return;
    const fbq = installQueue();
    if (!initialized.current) {
      initialized.current = true;
      fbq('init', pixelId);
      fbq('track', 'PageView');
    }
  }, [consent, pixelId, validId]);

  useEffect(() => {
    if (!validId || consent !== 'accepted' || !initialized.current) return;
    if (skipNextRoutePageView.current) {
      skipNextRoutePageView.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [consent, pathname, validId]);

  if (!validId || consent !== 'accepted') return null;

  return (
    <Script
      id="meta-pixel"
      src="https://connect.facebook.net/en_US/fbevents.js"
      strategy="afterInteractive"
    />
  );
}
