// Read-only public browser verification. No user profile, payment or analytics consent.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
(async () => {
  const base = process.argv[2] || 'https://novellajewell.com';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = { checkedAt: new Date().toISOString(), base, pages: [] };
  try {
    for (const javaScriptEnabled of [false, true]) {
      const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      const errors = [];
      const authRequests = [];
      page.on('request', (request) => {
        if (new URL(request.url()).hostname === 'clerk.novellajewell.com') authRequests.push(new URL(request.url()).pathname);
      });
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(base, { waitUntil: 'networkidle' });
      console.log(JSON.stringify({ javaScriptEnabled, url: page.url(), status: response.status(), title: await page.title(), h1Count: await page.locator('h1').count() }));
      await page.screenshot({ path: `tmp/order-followup/mobile-js-${javaScriptEnabled}.png` });
      const heading = page.locator('h1');
      const visibility = await heading.evaluate((el) => {
        let node = el;
        while (node) {
          const style = getComputedStyle(node);
          if (Number(style.opacity) === 0 || style.visibility === 'hidden' || style.display === 'none') return false;
          node = node.parentElement;
        }
        return true;
      });
      const item = { javaScriptEnabled, h1: await heading.innerText(), visibleBeforeHydration: visibility,
        ctaVisible: await page.getByRole('link', { name: 'Yüzükleri keşfet', exact: true }).isVisible(),
        overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        highPriorityImages: await page.locator('img[fetchpriority="high"]').count(), authRequests, errors };
      report.pages.push(item);
      console.log(JSON.stringify(item));
      if (!visibility || !item.ctaVisible || item.overflow || errors.length || authRequests.length) throw new Error('Storefront verification failed');
      if (javaScriptEnabled) await page.screenshot({ path: 'docs/audits/2026-09-03-mobile-final.png', fullPage: false });
      await context.close();
    }
    const anonymous = await browser.newContext();
    const admin = await anonymous.request.get(base + '/admin/takip', { maxRedirects: 0 });
    const adminBody = await admin.text();
    report.anonymousAdmin = { status: admin.status(), location: new URL(admin.headers().location || '/', base).pathname,
      showsSignIn: /admin\/giris|Sign in|Oturum aç|Giriş/.test(adminBody), exposesTrackingPanel: adminBody.includes('Sonuç bekleyen siparişler') };
    console.log(JSON.stringify({ anonymousAdmin: report.anonymousAdmin }));
    const redirectedToSignIn = [307, 308].includes(admin.status()) && report.anonymousAdmin.location.startsWith('/admin/giris');
    if (!(redirectedToSignIn || report.anonymousAdmin.showsSignIn) || report.anonymousAdmin.exposesTrackingPanel) throw new Error('Anonymous admin access was not protected');
    await anonymous.close();
    fs.writeFileSync('docs/audits/2026-09-03-storefront-browser.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
