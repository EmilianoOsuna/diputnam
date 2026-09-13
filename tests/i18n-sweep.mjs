// Locale sweep over every published route: <html lang>, reciprocal hreflang pairs,
// the language switch landing on the page's pair, and per-locale navigation targets.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { locales, otherLang, pages } from '../src/i18n/routes.ts';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const browser = await chromium.launch(executablePath ? { executablePath, args: ['--no-sandbox', '--disable-gpu'] } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const navKeys = ['eredita', 'putnam', 'noticias', 'unete', 'contacto'];
const failures = [];

try {
  for (const lang of locales) {
    const other = otherLang(lang);
    for (const [key, route] of Object.entries(pages)) {
      const path = route[lang];
      const label = `${lang} ${path}`;
      try {
        await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
        assert.equal(await page.evaluate(() => document.documentElement.lang), lang, 'html lang');
        const alternates = await page.locator('link[rel="alternate"]').evaluateAll((links) => Object.fromEntries(links.map((link) => [link.hreflang, new URL(link.href).pathname])));
        assert.equal(alternates[lang], path, 'self hreflang');
        assert.equal(alternates[other], route[other], 'pair hreflang');
        assert.equal(alternates['x-default'], route.es, 'x-default');
        assert.deepEqual(await page.locator('.site-nav > a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), navKeys.map((k) => pages[k][lang]), 'nav targets');
        assert.equal(await page.locator('.brand').getAttribute('href'), pages.home[lang], 'brand target');
        const current = await page.locator('.lang-switch [aria-current]').textContent();
        assert.equal(current.trim(), lang.toUpperCase(), 'current locale marker');
        await page.locator('.lang-switch a').focus();
        await Promise.all([page.waitForURL((url) => url.pathname !== path, { waitUntil: 'domcontentloaded' }), page.keyboard.press('Enter')]);
        assert.equal(new URL(page.url()).pathname, route[other], 'switch lands on pair');
        console.log(`  ok   ${label} (${key})`);
      } catch (error) {
        failures.push(`${label}: ${error.message.split('\n')[0]}`);
        console.log(`  FAIL ${label}`);
      }
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\ni18n-sweep: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('\ni18n-sweep: all routes OK');
