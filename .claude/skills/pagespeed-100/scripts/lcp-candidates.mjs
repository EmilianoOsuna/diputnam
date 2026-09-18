// Lists what Chrome accepts as LCP candidates on a page (mobile and desktop emulation) via a
// buffered PerformanceObserver, with optional CSS injected before first paint to test a fix.
// Run from the repo root so `playwright` resolves:
//   node .claude/skills/pagespeed-100/scripts/lcp-candidates.mjs <url> ["css to inject"]
import { chromium } from 'playwright';

const [url = 'https://diputnam-ten.vercel.app/', css = ''] = process.argv.slice(2);
const browser = await chromium.launch();
for (const mobile of [true, false]) {
  const context = await browser.newContext(mobile
    ? { viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true }
    : { viewport: { width: 1350, height: 940 } });
  const page = await context.newPage();
  await page.addInitScript((css) => {
    window.__lcp = []; window.__fcp = null;
    new PerformanceObserver((list) => list.getEntries().forEach((e) => window.__lcp.push({
      t: Math.round(e.startTime), size: e.size,
      el: e.element ? `${e.element.tagName}${e.element.className ? '.' + String(e.element.className).split(' ')[0] : ''} "${(e.element.textContent || e.element.currentSrc || '').trim().slice(0, 40)}"` : null,
    }))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => list.getEntries().forEach((e) => { if (e.name === 'first-contentful-paint') window.__fcp = Math.round(e.startTime); })).observe({ type: 'paint', buffered: true });
    if (css) document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = css; document.head.append(s); }, { once: true });
  }, css);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const { fcp, lcp } = await page.evaluate(() => ({ fcp: window.__fcp, lcp: window.__lcp }));
  console.log(`${mobile ? 'mobile ' : 'desktop'}  FCP ${fcp}ms  candidates (last one is the LCP):`);
  if (!lcp.length) console.log('   NONE → PageSpeed will report NO_LCP');
  for (const c of lcp) console.log(`   ${c.t}ms  ${String(c.size).padStart(7)}px²  ${c.el}`);
  await context.close();
}
await browser.close();
