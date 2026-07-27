'use client';

import { trackFirstPartyEvent } from '@/lib/analytics';
import {
  COOKIE_CONSENT_EVENT,
  getConsent,
  type ConsentValue,
} from '@/lib/cookies';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FirstPartyAnalytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentValue>(null);

  useEffect(() => {
    setConsent(getConsent());
    const onChange = (event: Event) =>
      setConsent((event as CustomEvent<ConsentValue>).detail);
    window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (consent !== 'accepted') return;
    trackFirstPartyEvent('page_view');
  }, [consent, pathname]);

  return null;
}
