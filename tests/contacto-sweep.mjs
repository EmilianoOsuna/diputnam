import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4334';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const browser = await chromium.launch(executablePath ? { executablePath, args: ['--no-sandbox', '--disable-gpu'] } : {});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/contacto/`, { waitUntil: 'networkidle' });

  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('main > section').count(), 6);
  assert.deepEqual(await page.locator('.site-nav > a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), ['/eredita/', '/putnam/', '/contacto/']);
  assert.equal(await page.locator('.brand').getAttribute('href'), '/');
  assert.equal(await page.locator('label[for]').count(), 6);
  assert.equal(await page.locator('#ct-motivo option').count(), 6);
  assert.equal(await page.locator('.ct-map iframe[loading="lazy"]').count(), 1);
  assert.equal(await page.locator('.ct-location .cta-actions a').getAttribute('href'), 'https://maps.app.goo.gl/uLKQ1rPhj3DSpW1U8');
  assert.equal(await page.locator('a[href^="mailto:"]').count() > 0, true);
  assert.equal(await page.locator('a[href^="tel:"]').count() > 0, true);
  assert.equal(await page.locator('a[href^="https://wa.me/"]').count() > 0, true);
  assert.equal(await page.locator('form button[type="button"]').count(), 1);
  assert.equal(await page.locator('form button[type="submit"]').count(), 0);
  await page.locator('.custom-select__trigger').click();
  assert.equal(await page.locator('.custom-select[data-open] .custom-select__option').count(), 6);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.custom-select[data-open]').count(), 0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
  assert.equal(await page.locator('.ct-hero').evaluate((element) => getComputedStyle(element).height), '1100px');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate((element) => document.activeElement === element), true);
  await page.screenshot({ path: '/tmp/contacto-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);
  assert.equal(await page.locator('.pin-spacer').count(), 0);
  assert.deepEqual(await page.locator('[data-menu-toggle]').evaluate((element) => { const rect = element.getBoundingClientRect(); return [rect.width >= 44, rect.height >= 44]; }), [true, true]);
  await page.locator('[data-menu-toggle]').click();
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded'), 'false');
  await page.waitForTimeout(250);
  await page.screenshot({ path: '/tmp/contacto-mobile.png', fullPage: true });

  await page.setViewportSize({ width: 320, height: 700 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), 0);

  for (const route of ['/', '/eredita/', '/putnam/', '/contacto/']) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    assert.deepEqual(await page.locator('.site-nav > a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), ['/eredita/', '/putnam/', '/contacto/']);
    assert.equal(await page.locator('.brand').getAttribute('href'), '/');
  }

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJsPage = await noJs.newPage();
  await noJsPage.goto(`${baseUrl}/contacto/`, { waitUntil: 'networkidle' });
  assert.equal(await noJsPage.locator('main').evaluate((element) => getComputedStyle(element).visibility), 'visible');
  assert.equal(await noJsPage.locator('.reason').count(), 3);
  await noJsPage.screenshot({ path: '/tmp/contacto-mobile-nojs.png', fullPage: true });
  await noJsPage.setViewportSize({ width: 1440, height: 900 });
  await noJsPage.screenshot({ path: '/tmp/contacto-desktop-nojs.png', fullPage: true });
  await noJs.close();

  const mockup = (await readFile('openspec/changes/design-contacto-page/mockup/Main.dc.html', 'utf8'))
    .replace('<script src="./support.js"></script>', '')
    .replaceAll('src="contacto-hero.jpg"', `src="${baseUrl}/assets/contacto-hero.jpg"`)
    .replaceAll('src="putnam-light.png"', `src="${baseUrl}/assets/putnam-light.png"`);
  const reference = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await reference.setContent(mockup, { waitUntil: 'networkidle' });
  await reference.waitForTimeout(1200);
  await reference.screenshot({ path: '/tmp/contacto-reference-desktop.png', fullPage: true });
  await reference.setViewportSize({ width: 390, height: 844 });
  await reference.screenshot({ path: '/tmp/contacto-reference-mobile.png', fullPage: true });
  await reference.close();

  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(`${baseUrl}/contacto/`, { waitUntil: 'networkidle' });
  assert.equal(await reducedPage.locator('body.is-motion-ready').count(), 0);
  assert.equal(await reducedPage.locator('.pin-stage').evaluate((element) => getComputedStyle(element).position), 'static');
  await reduced.close();

  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}

console.log('Contacto sweep check passed');
