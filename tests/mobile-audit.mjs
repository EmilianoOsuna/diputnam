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

  // Home stage geometry with a phone address bar: "shown" (svh === innerHeight) and
  // "retracted" (innerHeight grows by URL_BAR_DELTA while svh-sized markers stay put).
  // Run for both mobile modes: the CSS scroll-driven sweep and the stacked fallback used
  // when `animation-timeline` is unsupported (forced here by stubbing CSS.supports).
  for (const mode of ['sweep', 'stacked']) {
    const stacked = await context.newPage();
    if (mode === 'stacked') await stacked.addInitScript(() => {
      const supports = CSS.supports.bind(CSS);
      CSS.supports = (...args) => (String(args[0]).includes('animation-timeline') ? false : supports(...args));
    });
    for (const bar of ['shown', 'retracted']) {
      console.log(`\n/ (home, ${mode}) stage coverage, address bar ${bar}`);
      await stacked.goto(baseUrl + '/', { waitUntil: 'networkidle' });
      const svh = 844 - URL_BAR_DELTA;
      const home = await stacked.evaluate(() => document.querySelector('[data-home]').className);
      await check(`home mode is ${mode}`, () => assert.ok(home.includes(mode === 'sweep' ? 'is-css-sweep' : 'is-stacked'), home));
      await stacked.addStyleTag({ content: bar === 'shown'
        ? `.home.is-enhanced .home-stage, .home.is-enhanced .panel, .home.is-stacked .panel, .scene-marker { height: ${svh}px !important; min-height: 0 !important; }
           .home.is-enhanced .scene-markers { margin-top: -${svh}px !important; }`
        : `.scene-marker { height: ${svh}px !important; } .home.is-stacked .panel { height: ${svh}px !important; min-height: 0 !important; }` });
      if (bar === 'shown') await stacked.setViewportSize({ width: 390, height: svh });
      await stacked.waitForTimeout(400);
      await stacked.evaluate(() => window.dispatchEvent(new Event('resize')));
      await stacked.waitForTimeout(400);
      const maxY = await stacked.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      for (const y of [0.15, 0.3, 0.5, 0.7, 0.9, 1].map((f) => Math.round(maxY * f))) {
        await stacked.evaluate((v) => scrollTo(0, v), y);
        await stacked.waitForTimeout(350);
        await check(`home ${mode} covers viewport, panels contiguous (bar ${bar}, scrollY ${y})`, async () => {
          const g = await stacked.evaluate(() => {
            const onScreen = [...document.querySelectorAll('[data-panel]')]
              .filter((p) => getComputedStyle(p).visibility === 'visible' && getComputedStyle(p).opacity !== '0')
              .map((p) => p.getBoundingClientRect()).filter((r) => r.bottom > 0 && r.top < innerHeight).sort((a, b) => a.top - b.top);
            const gaps = onScreen.slice(1).map((r, i) => r.top - onScreen[i].bottom);
            return { vh: innerHeight, count: onScreen.length, top: onScreen[0]?.top, bottom: onScreen.at(-1)?.bottom, maxGap: Math.max(0, ...gaps) };
          });
          assert.ok(g.count >= 1, 'no panel on screen');
          assert.ok(g.top <= 0.5, `first panel top ${g.top}`);
          assert.ok(g.bottom >= g.vh - 0.5, `last panel bottom ${g.bottom} vs viewport ${g.vh}`);
          assert.ok(g.maxGap < 1, `gap ${g.maxGap}px between panels`);
        });
      }
      await stacked.setViewportSize({ width: 390, height: 844 });
    }
    await stacked.close();
  }

  console.log('\n/putnam/ hero entrance animation');
  await page.goto(baseUrl + '/putnam/', { waitUntil: 'commit' });
  await page.waitForTimeout(120);
  const lineY = () => page.evaluate(() => [...document.querySelectorAll('.institutional-hero h1 .line > span')].map((span) => Math.round(new DOMMatrix(getComputedStyle(span).transform).m42)));
  const early = await lineY();
  await page.waitForTimeout(1500);
  const settled = await page.evaluate(() => ({
    lines: [...document.querySelectorAll('.institutional-hero h1 .line > span')].map((span) => Math.round(new DOMMatrix(getComputedStyle(span).transform).m42)),
    opacity: parseFloat(getComputedStyle(document.querySelector('.institutional-hero h1')).opacity),
    nativeMotion: document.body.classList.contains('is-native-motion'),
  }));
  await check('putnam hero title enters line by line on mobile', () => {
    assert.equal(settled.nativeMotion, false, 'body has is-native-motion');
    assert.ok(early.length >= 2, `only ${early.length} lines`);
    assert.ok(early.at(-1) > 0, `last line offset at 120ms was ${early.at(-1)}`);
    assert.deepEqual(settled.lines, settled.lines.map(() => 0), 'lines not landed');
    assert.equal(settled.opacity, 1);
  });

  // Titles: one real line per mask, nothing clipped once landed, no word wider than its box.
  for (const width of [320, 390]) {
    console.log(`\ntitles at ${width}px`);
    await page.setViewportSize({ width, height: 844 });
    for (const route of routes) {
      await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
      await page.evaluate(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y <= h; y += 300) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } });
      await page.waitForTimeout(2000);
      const rows = await page.evaluate(() => {
        const out = [];
        for (const h of document.querySelectorAll('h1, h2')) {
          if (h.classList.contains('visually-hidden') || !h.getClientRects().length || h.closest('[data-track]')) continue;
          const lines = [...h.querySelectorAll('.line')];
          const issues = [];
          for (const line of lines) {
            const span = line.firstElementChild;
            const range = document.createRange(); range.selectNodeContents(span);
            const rects = [...range.getClientRects()].filter((r) => r.width > 0);
            if (new Set(rects.map((r) => Math.round(r.top / 4))).size > 1) issues.push(`mask holds 2+ lines: ${span.textContent.slice(0, 24)}`);
            if (Math.abs(new DOMMatrix(getComputedStyle(span).transform).m42) > 0.5) { issues.push(`not landed: ${span.textContent.slice(0, 24)}`); continue; }
            if (getComputedStyle(line).clipPath !== 'none') {
              const lr = line.getBoundingClientRect();
              const top = Math.min(...rects.map((r) => r.top)), bottom = Math.max(...rects.map((r) => r.bottom));
              if (lr.top - top > 0.5 || bottom - lr.bottom > 0.5) issues.push(`clipped: ${span.textContent.slice(0, 24)}`);
            }
          }
          const words = (lines.length ? lines.map((l) => l.textContent).join(' ') : h.textContent).trim().split(/\s+/);
          const probe = document.createElement('span'); probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;';
          h.append(probe);
          let widest = 0, widestWord = '';
          for (const w of words) { probe.textContent = w; const ww = probe.getBoundingClientRect().width; if (ww > widest) { widest = ww; widestWord = w; } }
          probe.remove();
          const box = h.getBoundingClientRect();
          if (widest > box.width + 0.5) issues.push(`word "${widestWord}" wider than title box`);
          if (h.scrollWidth > h.clientWidth + 1) issues.push('title overflows its box');
          if (box.right > document.documentElement.clientWidth + 0.5) issues.push('title past the viewport');
          out.push({ id: h.id || h.textContent.trim().slice(0, 18), issues });
        }
        return out;
      });
      await check(`${route} titles at ${width}px: real lines, no clipping, no overflow`, () => {
        const bad = rows.filter((r) => r.issues.length).map((r) => `${r.id}: ${r.issues.join(' | ')}`);
        assert.deepEqual(bad, []);
      });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });

  console.log('\n/putnam/ header theme follows the section behind it');
  await page.goto(baseUrl + '/putnam/', { waitUntil: 'networkidle' });
  const headerTheme = () => page.evaluate(() => ({
    light: document.querySelector('[data-site-header]').classList.contains('site-header--light'),
    logo: [...document.querySelectorAll('[data-logo]')].find((el) => !el.hidden)?.dataset.logo,
  }));
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(300);
  const onHero = await headerTheme();
  await page.evaluate(() => scrollTo(0, document.querySelector('.process').offsetTop + 200));
  await page.waitForTimeout(400);
  const onProcess = await headerTheme();
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
  const backOnHero = await headerTheme();
  await check('putnam header switches light → dark → light across hero/process', () => {
    assert.deepEqual(onHero, { light: true, logo: 'light' }, 'hero');
    assert.deepEqual(onProcess, { light: false, logo: 'dark' }, 'process');
    assert.deepEqual(backOnHero, { light: true, logo: 'light' }, 'back on hero');
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
  await trackChecks('/contacto/', '.reasons', 3);
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
