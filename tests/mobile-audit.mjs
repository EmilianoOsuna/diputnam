// Mobile audit for the six routes at a phone viewport. Collects every failure
// instead of stopping at the first one so a run shows the full picture.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const shots = 'tests/.artifacts/mobile';
const BROWN = 'rgb(89, 64, 55)';
const URL_BAR_DELTA = 90; // px hidden/revealed by a phone's address bar

const routes = ['/', '/putnam/', '/eredita/', '/unete/', '/contacto/', '/noticias/'];
const failures = [];
const check = async (label, fn) => {
  try { await fn(); console.log(`  ok   ${label}`); }
  catch (error) { failures.push(`${label}: ${error.message.split('\n')[0]}`); console.log(`  FAIL ${label}`); }
};

await mkdir(shots, { recursive: true });
const browser = await chromium.launch(executablePath ? { executablePath, args: ['--no-sandbox', '--disable-gpu'] } : {});
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();

const brownShare = async () => {
  const buffer = await page.screenshot();
  const { data, width, height } = await page.evaluate(async (bytes) => {
    const blob = new Blob([new Uint8Array(bytes)], { type: 'image/png' });
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    const image = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    return { data: Array.from(image.data), width: bitmap.width, height: bitmap.height };
  }, Array.from(buffer));
  let hits = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (Math.abs(data[i] - 89) < 8 && Math.abs(data[i + 1] - 64) < 8 && Math.abs(data[i + 2] - 55) < 8) hits++;
  }
  return (hits / (width * height)) * 100;
};

const trackChecks = async (route, trackSelector, total) => {
  await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await check(`${route} track: markup present`, async () => {
    assert.equal(await page.locator(`${trackSelector}[data-track]`).count(), 1, 'track missing');
    assert.equal(await page.locator(`${trackSelector} [data-track-card]`).count(), total, 'card count');
  });
  await check(`${route} track: horizontal scroll-snap without document overflow`, async () => {
    const state = await page.evaluate((selector) => {
      const track = document.querySelector(selector);
      const style = getComputedStyle(track);
      return {
        snap: style.scrollSnapType, overflowX: style.overflowX,
        scrollable: track.scrollWidth > track.clientWidth + 10,
        docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, trackSelector);
    assert.match(state.snap, /x/, 'scroll-snap-type x');
    assert.equal(state.overflowX, 'auto');
    assert.equal(state.scrollable, true, 'track should scroll horizontally');
    assert.equal(state.docOverflow, 0, 'document overflow');
  });
  await check(`${route} track: counter and rail follow the active card`, async () => {
    const read = () => page.evaluate(() => ({
      current: document.querySelector('[data-track-current]')?.textContent.trim(),
      progress: parseFloat(getComputedStyle(document.querySelector('[data-track-rail]')).getPropertyValue('--progress')),
    }));
    await page.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center' }), trackSelector);
    await page.waitForTimeout(300);
    const start = await read();
    assert.equal(start.current, '01');
    assert.ok(Math.abs(start.progress - 1 / total) < 0.02, `initial progress ${start.progress}`);
    await page.evaluate((selector) => { const t = document.querySelector(selector); t.scrollTo({ left: t.scrollWidth, behavior: 'auto' }); }, trackSelector);
    await page.waitForTimeout(500);
    const end = await read();
    assert.equal(end.current, String(total).padStart(2, '0'));
    assert.ok(end.progress > 0.98, `final progress ${end.progress}`);
  });
  await page.screenshot({ path: `${shots}${route.replace(/\//g, '_')}track.png` });
};

try {
  for (const route of routes) {
    console.log(`\n${route}`);
    await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const shell = await page.evaluate(() => ({
      docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      htmlBg: getComputedStyle(document.documentElement).backgroundColor,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      themeColors: [...document.querySelectorAll('meta[name="theme-color"]')].map((m) => m.content),
      logo: (() => {
        const svg = document.querySelector('.brand--mark svg');
        const imgs = [...document.querySelectorAll('.brand--mark img')].filter((img) => img.getClientRects().length);
        const img = imgs[0];
        return { svg: !!svg, natural: img?.naturalWidth ?? 0, visible: imgs.length > 0 || !!svg };
      })(),
    }));
    await check(`${route} no horizontal document overflow`, () => assert.equal(shell.docOverflow, 0));
    await check(`${route} document background is not brown`, () => { assert.notEqual(shell.htmlBg, BROWN); assert.notEqual(shell.bodyBg, BROWN); });
    await check(`${route} theme-color declared (light + dark)`, () => assert.equal(shell.themeColors.length, 2, JSON.stringify(shell.themeColors)));
    await check(`${route} header mark is visible and sharp (svg or ≥300px)`, () => {
      assert.equal(shell.logo.visible, true, 'no visible mark');
      assert.ok(shell.logo.svg || shell.logo.natural >= 300, `naturalWidth ${shell.logo.natural}`);
    });
    await page.screenshot({ path: `${shots}${route.replace(/\//g, '_')}top.png` });
  }

  console.log('\n/ (home) stage gap with retracted URL bar');
  await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `
    .home.is-enhanced .home-stage, .home.is-enhanced .panel, .scene-marker { height: ${844 - URL_BAR_DELTA}px !important; min-height: 0 !important; }
    .home.is-enhanced .scene-markers { margin-top: -${844 - URL_BAR_DELTA}px !important; }` });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(400);
  for (const y of [500, 900, 1400]) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.waitForTimeout(350);
    await check(`home gap === 0 and no brown band at scrollY ${y}`, async () => {
      const gap = await page.evaluate(() => {
        const visible = [...document.querySelectorAll('[data-panel]')]
          .filter((p) => getComputedStyle(p).visibility === 'visible' && getComputedStyle(p).opacity !== '0')
          .map((p) => p.getBoundingClientRect()).sort((a, b) => a.top - b.top);
        return visible.length === 2 ? visible[1].top - visible[0].bottom : 0;
      });
      const brown = await brownShare();
      if (gap !== 0 || brown > 0.3) await page.screenshot({ path: `${shots}/home-gap-${y}.png` });
      assert.ok(Math.abs(gap) < 1, `gap ${gap}px`);
      assert.ok(brown < 0.3, `brown ${brown.toFixed(2)}%`);
    });
  }

  console.log('\n/putnam/ hero entrance animation');
  await page.goto(baseUrl + '/putnam/', { waitUntil: 'commit' });
  await page.waitForTimeout(80);
  const early = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.institutional-hero h1')).opacity));
  await page.waitForTimeout(1500);
  const settled = await page.evaluate(() => ({
    opacity: parseFloat(getComputedStyle(document.querySelector('.institutional-hero h1')).opacity),
    nativeMotion: document.body.classList.contains('is-native-motion'),
  }));
  await check('putnam hero animates in on mobile', () => {
    assert.equal(settled.nativeMotion, false, 'body has is-native-motion');
    assert.ok(early < 1, `h1 opacity at 80ms was ${early}`);
    assert.equal(settled.opacity, 1);
  });

  console.log('\n/eredita/ hero mark placement');
  await page.goto(baseUrl + '/eredita/', { waitUntil: 'networkidle' });
  await check('eredita hero mark fully inside viewport with ≥16px side margin', async () => {
    const box = await page.evaluate(() => {
      const el = document.querySelector('.ed-hero-mark');
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width, vw: document.documentElement.clientWidth };
    });
    assert.ok(box.width > 0, 'mark has no size');
    assert.ok(box.left >= 16, `left ${box.left}`);
    assert.ok(box.right <= box.vw - 16, `right ${box.right} of ${box.vw}`);
  });

  console.log('\nhorizontal tracks');
  await trackChecks('/eredita/', '.ed-h-track', 4);
  await trackChecks('/unete/', '.traits', 4);
} finally {
  await browser.close();
}

console.log('');
if (failures.length) {
  console.error(`mobile-audit: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('mobile-audit: all checks passed');
