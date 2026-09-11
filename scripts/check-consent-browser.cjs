// Isolated public-site browser: no user profile, credentials, checkout or fake purchase.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const report = { ga: [], meta: [], tagLoaded: false, failures: [], trackingRequests: [], diagnostics: [], beforeConsent: null, afterConsent: null };
  page.on('request', (req) => {
    const url = new URL(req.url());
    if (/facebook|google-analytics/.test(url.hostname)) report.trackingRequests.push({ host: url.hostname, path: url.pathname });
    if (url.hostname.endsWith('google-analytics.com') && url.pathname.includes('collect')) report.ga.push({ event: url.searchParams.get('en'), measurementId: url.searchParams.get('tid'), page: url.searchParams.get('dl') });
    if (url.hostname.endsWith('facebook.com') && url.pathname.startsWith('/tr')) report.meta.push({ event: url.searchParams.get('ev') });
  });
  page.on('response', (res) => { if (res.url().includes('googletagmanager.com/gtag/js')) report.tagLoaded = res.ok(); });
  page.on('requestfailed', (req) => { if (/google-analytics|googletagmanager|facebook/.test(req.url())) report.failures.push({ host: new URL(req.url()).hostname, reason: req.failure()?.errorText }); });
  page.on('console', (msg) => { if (/pixel|facebook|analytics/i.test(msg.text()) && ['error', 'warning'].includes(msg.type())) report.diagnostics.push(msg.text().slice(0,400)); });
  try {
    await page.goto(process.argv[2] || 'https://novellajewell.com/', { waitUntil: 'networkidle' });
    report.beforeConsent = { ga: report.ga.length, meta: report.meta.length };
    await page.getByRole('button', { name: 'Tümüne izin ver', exact: true }).click();
    await page.waitForTimeout(8000);
    report.afterConsent = { ga: report.ga.length, meta: report.meta.length };
    report.queue = await page.evaluate(() => (window.dataLayer || []).slice(0, 10).map((entry) => ({ type: Object.prototype.toString.call(entry), command: entry?.[0] ?? entry?.event })));
    report.pixel = await page.evaluate(() => ({ initialized: typeof window.fbq === 'function', engineReady: !!window.fbq?.callMethod, queue: window.fbq?.queue?.map((entry) => entry[0]) }));
    report.tags = await page.evaluate(() => Array.from(document.scripts).map((script) => script.src).filter((src) => /google|facebook/.test(src)).map((src) => { const u = new URL(src); return u.origin + u.pathname + (u.searchParams.has('id') ? '?id=' + u.searchParams.get('id') : ''); }));
    report.overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    console.log(JSON.stringify(report, null, 2));
    if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error.message); process.exitCode = 1; });
