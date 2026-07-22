---
name: testing-novella
description: How to run and E2E-test the Novella Jewell Next.js storefront locally (cart, checkout, favorites), including known pitfalls.
---

# Testing Novella Jewell locally

- Start with `npm run dev` (localhost:3000). No login required.
- Without `PAYTR_*` env keys and `DATABASE_URL`, `POST /api/checkout` returns 503 with "Sipariş sistemi şu anda hazır değil" — this is expected in dev, not a failure. Full PayTR flow (merchant_oid etc.) needs those secrets.
- Free shipping logic lives in `src/lib/config.ts` (`SHIPPING.freeThreshold = 500`, `fee = 49.90`). Use a 499₺ product (e.g. `/urun/barcelona-sun-halka-bileklik`) to see the "1 ₺ kaldı" nudge; qty 2 flips to "Kargo bedava!".
- Cart/favorites use zustand persist with `skipHydration: true` (`src/store/cartStore.ts`). Pitfalls that may appear as bugs during testing:
  - `/sepet` and `/favoriler` can render a blank `<main>` after client-side navigation; a hard refresh (F5) shows the content.
  - Direct load/refresh of `/odeme` redirects to `/sepet` (`OdemeClient.tsx` redirects when `items.length === 0` before rehydration). Reach `/odeme` by clicking "Ödemeye Geç" from `/sepet`.
- Turkish characters (ı, ş, İ) cannot be typed via xdotool; use ASCII search queries (e.g. "nova") and pick the İl from the native `<select>` dropdown by clicking.
- Reset state between runs with `localStorage.clear()` (cart, favorites, cookie consent are all in localStorage).

## Devin Secrets Needed
- `PAYTR_MERCHANT_ID` / `PAYTR_MERCHANT_KEY` / `PAYTR_MERCHANT_SALT` and `DATABASE_URL` — only if the real PayTR checkout flow must be tested.
