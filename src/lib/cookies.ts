/**
 * Çerez onayı — tek kaynak.
 *
 * KVKK: zorunlu olmayan çerezler (analitik/pazarlama) açık rıza olmadan
 * ÇALIŞTIRILAMAZ. Bu yüzden Google Analytics yalnızca burada 'accepted'
 * dönerse yüklenir — pasif kalmaz, script hiç eklenmez.
 */

export const COOKIE_CONSENT_KEY = 'novella_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'novella:cookie-consent';

export type ConsentValue = 'accepted' | 'rejected' | null;

/** Kullanıcının analitik çerezlere izin verip vermediğini okur. */
export function getConsent(): ConsentValue {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return v === 'accepted' || v === 'rejected' ? v : null;
  } catch {
    // localStorage kapalıysa (gizli sekme/katı ayarlar) izin yok say.
    return null;
  }
}

/** Tercihi kaydeder ve dinleyen bileşenleri (GA, banner) haberdar eder. */
export function setConsent(value: Exclude<ConsentValue, null>): void {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // Yazamıyorsak sessizce geç — izin verilmemiş sayılır, güvenli taraf.
  }
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: value }));
}

/** Tercihi siler — banner yeniden görünür. */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch {
    /* yok say */
  }
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: null }));
}
