'use client';

import { resetConsent } from '@/lib/cookies';

/**
 * Çerez politikası sayfasındaki "tercihimi değiştir" butonu.
 * Tercihi sıfırlar → CookieBanner olayı yakalar ve yeniden açılır.
 */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        resetConsent();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-black text-white text-[13px] font-medium hover:bg-gold transition-colors not-prose"
    >
      Çerez tercihimi değiştir
    </button>
  );
}
