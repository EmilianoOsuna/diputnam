// Mobile audit for every published route (both locales) at a phone viewport. Collects every failure
// instead of stopping at the first one so a run shows the full picture.
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium, webkit } from 'playwright';
import { projectPairs, routes as siteRoutes } from './routes.mjs';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
// `PLAYWRIGHT_BROWSER=webkit` runs the same audit on WebKit (`npm run test:mobile:webkit`,
// after `npx playwright install webkit`). It does not emulate Safari's toolbar or Apple
// Color Emoji, so it complements — never replaces — a real-device pass.
const browserName = process.env.PLAYWRIGHT_BROWSER === 'webkit' ? 'webkit' : 'chromium';
const shots = 'tests/.artifacts/mobile';
const BROWN = 'rgb(89, 64, 55)';
const URL_BAR_DELTA = 90; // px hidden/revealed by a phone's address bar

// Static routes and project pages, plus the first note linked from each news index (content-dependent).
const routes = [...siteRoutes];
const project = Object.values(projectPairs)[0]?.es;
const failures = [];
const check = async (label, fn) => {
  try { await fn(); console.log(`  ok   ${label}`); }
  catch (error) { failures.push(`${label}: ${error.message.split('\n')[0]}`); console.log(`  FAIL ${label}`); }
};

await mkdir(shots, { recursive: true });
let browser;
try {
  browser = browserName === 'webkit' ? await webkit.launch() : await chromium.launch(executablePath ? { executablePath, args: ['--no-sandbox', '--disable-gpu'] } : {});
} catch (error) {
  console.error(`mobile-audit: cannot launch ${browserName} — ${error.message.split('\n')[0]}`);
  if (browserName === 'webkit') console.error('  install it with: npx playwright install webkit (add --with-deps if system libraries are missing)');
  process.exit(1);
}
console.log(`mobile-audit on ${browserName}`);
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

// Sections reveal on scroll; bring the target into view and let the reveal settle.
const settleInView = async (selector) => {
  await page.evaluate((sel) => document.querySelector(sel)?.scrollIntoView({ block: 'start' }), selector);
  await page.waitForTimeout(1200);
};
// Ereditá hero: the mark is the project's logo, never over the hero copy.
const heroMarkClear = async (route) => {
  await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  return page.evaluate(() => {
    const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const mark = document.querySelector('.ed-hero-mark').getBoundingClientRect();
    const hits = [...document.querySelectorAll('.ed-hero-content > *')].filter((el) => overlaps(mark, el.getBoundingClientRect())).map((el) => el.className || el.tagName);
    return { hits, mark: { left: mark.left, right: mark.right, width: mark.width }, vw: document.documentElement.clientWidth };
  });
};
// CTA watermark on phones: in flow, below the last action link, never on the copy.
const ctaMarkBelowLinks = async (route, section) => {
  await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
  await settleInView(section);
  return page.evaluate((section) => {
    const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const s = document.querySelector(section);
    const mark = s.querySelector('.cta-mark').getBoundingClientRect();
    const links = [...s.querySelectorAll('.cta-actions a')].map((a) => a.getBoundingClientRect());
    const texts = [...s.querySelectorAll('h2, p, a')].map((el) => el.getBoundingClientRect());
    return { mark: { top: mark.top, bottom: mark.bottom }, lastLinkBottom: Math.max(...links.map((r) => r.bottom)), sectionBottom: s.getBoundingClientRect().bottom, overlapsText: texts.some((t) => overlaps(t, mark)) };
  }, section);
};
const ctaSections = { '/putnam/': '.institutional-cta', '/unete/': '.un-cta', '/contacto/': '.ct-cta', '/noticias/': '.nw-cta' };

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

// Typology media gallery (typology-media-gallery) inside the mobile swipe track.
const galleryChecks = async (route) => {
  const requests = [];
  const onRequest = (request) => { if (/\.mp4(\?|$)/.test(request.url())) requests.push(request.url()); };
  page.on('request', onRequest);
  await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await check(`${route} gallery: no mp4 requested before reaching the typologies`, () => assert.deepEqual(requests, []));
  await check(`${route} gallery: thumbnails are ≤ 320px wide and only the selected medium is shown`, async () => {
    const state = await page.evaluate(() => {
      const widths = [...document.querySelectorAll('.ed-h-thumb img')].flatMap((img) => [img.currentSrc || img.src, ...img.srcset.split(',')].map((c) => Number(new URL(c.trim().split(' ')[0], location.href).searchParams.get('w'))));
      const panels = [...document.querySelectorAll('.ed-h-panel:not(.ed-h-panel--intro)')].map((panel) => ({
        media: panel.querySelectorAll('[role="tabpanel"]').length,
        shown: [...panel.querySelectorAll('[role="tabpanel"]')].filter((pane) => !pane.hidden).length,
        tabs: panel.querySelectorAll('[role="tab"]').length,
        selected: panel.querySelectorAll('[role="tab"][aria-selected="true"]').length,
      }));
      return { widths, panels };
    });
    assert.ok(state.widths.length > 0, 'no thumbnails');
    assert.ok(state.widths.every((w) => w > 0 && w <= 320), `thumb widths ${[...new Set(state.widths)].join(',')}`);
    for (const panel of state.panels) {
      assert.equal(panel.shown, 1, 'one visible medium');
      assert.equal(panel.tabs, panel.media > 1 ? panel.media : 0, 'strip only with several media');
      assert.equal(panel.selected, panel.media > 1 ? 1 : 0, 'one selected tab');
    }
    assert.ok(new Set(state.panels.map((p) => p.media)).size > 1, 'dataset should mix media counts');
  });
  await check(`${route} gallery: copy offset does not depend on the number of media`, async () => {
    const tops = await page.evaluate(() => [...document.querySelectorAll('.ed-h-panel')].map((panel) => Math.round(panel.querySelector('.ed-h-copy').getBoundingClientRect().top - panel.getBoundingClientRect().top)));
    assert.equal(new Set(tops).size, 1, `copy tops ${tops.join(',')}`);
  });
  await check(`${route} gallery: selecting another thumbnail swaps the visible medium and keeps focus`, async () => {
    const panel = page.locator('.ed-h-panel').filter({ has: page.locator('[role="tab"]:nth-child(2)') }).first();
    await panel.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(400);
    const tab = panel.locator('[role="tab"]').last();
    const before = await panel.locator('[role="tabpanel"]:not([hidden]) img, [role="tabpanel"]:not([hidden]) video').first().evaluate((el) => el.currentSrc || el.src || el.querySelector('source')?.src);
    await tab.click();
    await page.waitForTimeout(200);
    const after = await panel.locator('[role="tabpanel"]:not([hidden]) img, [role="tabpanel"]:not([hidden]) video').first().evaluate((el) => el.currentSrc || el.src || el.querySelector('source')?.src);
    assert.notEqual(after, before, 'medium changed');
    assert.equal(await tab.getAttribute('aria-selected'), 'true');
    assert.equal(await tab.evaluate((el) => el === document.activeElement), true, 'focus stays on the tab');
  });
  await check(`${route} gallery: the video plays only while its panel is the visible one`, async () => {
    const video = page.locator('.ed-h-panel video[data-video]').first();
    assert.equal(await video.count(), 1, 'dataset has one typology with video');
    const panel = page.locator('.ed-h-panel', { has: page.locator('video[data-video]') }).first();
    await panel.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(600);
    assert.equal(await panel.locator('[role="tab"]').first().evaluate((tab) => tab.classList.contains('is-video')), true, 'video is the first medium');
    await panel.locator('[role="tab"]').first().click();
    await page.waitForTimeout(300);
    assert.equal(await video.evaluate((el) => el.paused), false, 'plays when visible and selected');
    assert.ok(requests.some((url) => url.endsWith('.mp4')), 'mp4 requested once visible');
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(600);
    assert.equal(await video.evaluate((el) => el.paused), true, 'pauses when the panel leaves');
  });
  page.off('request', onRequest);
};

try {
  for (const index of ['/noticias/', '/en/news/']) {
    await page.goto(baseUrl + index, { waitUntil: 'domcontentloaded' });
    const first = await page.locator('.index-row').first().getAttribute('href').catch(() => null);
    if (first) routes.push(first);
  }
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
    // CMS images: the editor's hotspot lands as object-position on an object-fit: cover image.
    const hotspots = await page.$$eval('img[style*="object-position"]', (imgs) => imgs.map((img) => {
      const css = getComputedStyle(img);
      const declared = img.style.objectPosition.replace(/\.0%/g, '%');
      return { declared, computed: css.objectPosition, fit: css.objectFit };
    }));
    await check(`${route} hotspot images keep object-position (${hotspots.length})`, async () => {
      for (const h of hotspots) { assert.equal(h.fit, 'cover'); assert.equal(h.computed, h.declared); }
    });
    await page.screenshot({ path: `${shots}${route.replace(/\//g, '_')}top.png` });
  }

  // Home: full-screen slider (no document scroll). Every scene must cover the viewport
  // exactly, with the address bar shown (svh) or retracted (taller viewport), and the
  // scroll cue must step one scene per press and land within Swiper's 500ms.
  for (const height of [844, 844 - URL_BAR_DELTA]) {
    console.log(`\n/ (home slider) at 390×${height}`);
    await page.setViewportSize({ width: 390, height });
    await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600); // intro title entrance
    const home = await page.evaluate(() => document.querySelector('[data-home]').className);
    await check(`home mode is slider (${height})`, () => assert.ok(home.includes('is-slider'), home));
    await check(`home document does not scroll (${height})`, async () => {
      const state = await page.evaluate(() => ({ overflow: getComputedStyle(document.body).overflow, extra: document.documentElement.scrollHeight - innerHeight }));
      assert.equal(state.overflow, 'hidden');
      assert.ok(state.extra <= 1, `scrollHeight exceeds viewport by ${state.extra}px`);
    });
    const total = await page.locator('[data-panel]').count();
    for (let i = 0; i < total; i++) {
      if (i > 0) { await page.click('[data-scroll-cue]'); await page.waitForTimeout(700); }
      await check(`home scene ${i + 1}/${total} covers the viewport (${height})`, async () => {
        const g = await page.evaluate(() => {
          const active = document.querySelector('[data-panel].is-active');
          const r = active.getBoundingClientRect();
          const title = active.querySelector('h1, h2').getBoundingClientRect();
          return { id: active.id, top: r.top, bottom: r.bottom, vh: innerHeight, titleIn: title.top >= 0 && title.bottom <= innerHeight, cue: document.querySelector('[data-scroll-cue]').dataset.direction };
        });
        assert.ok(Math.abs(g.top) < 0.5, `panel top ${g.top}`);
        assert.ok(Math.abs(g.bottom - g.vh) < 0.5, `panel bottom ${g.bottom} vs ${g.vh}`);
        assert.equal(g.titleIn, true, 'title inside the viewport');
        assert.equal(g.cue, i === total - 1 ? 'up' : 'down');
      });
    }
    await page.setViewportSize({ width: 390, height: 844 });
  }

  // Safari's toolbar collapses mid-run: the active scene must still cover the viewport after
  // a height change (the slider re-renders on `resize`/`visualViewport`). Positions stay in px
  // on purpose: switching a layer between px and % makes Safari rebuild it and flicker.
  console.log('\n/ (home slider) scene after viewport height change');
  await page.setViewportSize({ width: 390, height: 844 - URL_BAR_DELTA });
  await page.goto(baseUrl + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  await page.click('[data-scroll-cue]'); await page.waitForTimeout(700);
  await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(200);
  await check('home scene 2 covers the viewport after the address bar retracts', async () => {
    const g = await page.evaluate(() => {
      const active = document.querySelector('[data-panel].is-active'); const r = active.getBoundingClientRect();
      const stage = document.querySelector('[data-stage]');
      return { id: active.id, top: r.top, bottom: r.bottom, vh: innerHeight, translate: stage.style.translate, scrollY, touchAction: getComputedStyle(stage.parentElement).touchAction, overscroll: getComputedStyle(document.documentElement).overscrollBehaviorY };
    });
    assert.ok(Math.abs(g.top) < 1 && Math.abs(g.bottom - g.vh) < 1, `${g.id} ${g.top}…${g.bottom} vs ${g.vh}`);
    assert.match(g.translate, /px$/, `positions must stay in px (Safari flickers on unit changes), got "${g.translate}"`);
    assert.equal(g.scrollY, 0);
    assert.equal(g.touchAction, 'none', 'experience must own the touch gesture');
    assert.equal(g.overscroll, 'none', 'no rubber-band on html');
  });

  // Action arrows are inline SVG (`Arrow.astro`), never `→`/`↗` characters that iOS may
  // draw as emoji; links keep their accessible name without the arrow.
  console.log('\naction arrows');
  for (const route of ['/contacto/', '/unete/', '/en/news/']) {
    await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
    const arrows = await page.evaluate(() => {
      const chars = [...document.querySelectorAll('a, button')].filter((el) => /[→↗]/.test(el.textContent)).map((el) => el.textContent.trim().slice(0, 30));
      const icons = [...document.querySelectorAll('.arrow')];
      const bad = icons.filter((el) => !el.querySelector('svg') || getComputedStyle(el.querySelector('svg')).stroke !== getComputedStyle(el).color).length;
      const name = document.querySelector('.cta-actions a')?.textContent.trim();
      return { chars, icons: icons.length, bad, name };
    });
    await check(`${route} action links use vector arrows (${arrows.icons})`, () => {
      assert.deepEqual(arrows.chars, [], 'arrow characters left in links/buttons');
      assert.ok(arrows.icons > 0, 'no Arrow icons found');
      assert.equal(arrows.bad, 0, 'icon without svg or stroke ≠ text colour');
      assert.doesNotMatch(arrows.name ?? '', /[→↗]/, 'accessible name carries the arrow');
    });
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
      // A `[data-reveal-group]` with no element children reveals itself; it must end visible.
      if (width === 390) {
        const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal-group]')]
          .filter((el) => !el.children.length && el.getClientRects().length && getComputedStyle(el).opacity !== '1')
          .map((el) => el.textContent.trim().slice(0, 30)));
        await check(`${route} childless reveal groups end visible`, () => assert.deepEqual(hidden, []));
      }
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
  await page.evaluate(() => scrollTo(0, document.querySelector('.principles').offsetTop + 200));
  await page.waitForTimeout(400);
  const onPrinciples = await headerTheme();
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
  const backOnHero = await headerTheme();
  await check('putnam header switches light → dark → light across hero/principles', () => {
    assert.deepEqual(onHero, { light: true, logo: 'light' }, 'hero');
    assert.deepEqual(onPrinciples, { light: false, logo: 'dark' }, 'principles');
    assert.deepEqual(backOnHero, { light: true, logo: 'light' }, 'back on hero');
  });

  // Short phones (an iPhone with Safari's toolbar out, a small Android): the Ereditá hero
  // mark never sits on the hero copy, the CTA watermark stays below its links, and no
  // route overflows horizontally.
  const heroRoutes = ['/eredita/', project].filter(Boolean);
  for (const vp of [{ width: 390, height: 844 }, { width: 375, height: 635 }, { width: 360, height: 640 }]) {
    console.log(`\nshort viewport ${vp.width}×${vp.height}`);
    await page.setViewportSize(vp);
    for (const route of heroRoutes) {
      const hero = await heroMarkClear(route);
      await check(`${route} hero mark inside the viewport (≥16px) and clear of the copy at ${vp.width}×${vp.height}`, () => {
        assert.ok(hero.mark.width > 0, 'mark has no size');
        assert.ok(hero.mark.left >= 16, `left ${hero.mark.left}`);
        assert.ok(hero.mark.right <= hero.vw - 16, `right ${hero.mark.right} of ${hero.vw}`);
        assert.deepEqual(hero.hits, [], 'mark overlaps hero copy');
      });
    }
    for (const [route, section] of Object.entries(ctaSections)) {
      const cta = await ctaMarkBelowLinks(route, section);
      await check(`${route} CTA mark below the action links at ${vp.width}×${vp.height}`, () => {
        assert.ok(cta.mark.top >= cta.lastLinkBottom, `mark top ${cta.mark.top} above last link bottom ${cta.lastLinkBottom}`);
        assert.equal(cta.overlapsText, false, 'mark overlaps CTA text');
        assert.ok(cta.mark.bottom > cta.mark.top && cta.mark.top < cta.sectionBottom, 'mark not visible inside the section');
      });
    }
    if (vp.width !== 390) {
      for (const route of routes) {
        await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded' });
        const extra = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        await check(`${route} no horizontal overflow at ${vp.width}px`, () => assert.equal(extra, 0));
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });

  console.log('\nhorizontal tracks');
  if (project) {
    await page.goto(baseUrl + project, { waitUntil: 'domcontentloaded' });
    await galleryChecks(project);
    // Typologies: swipe track that fits one screen, the medium being the dominant element.
    const typologies = await page.locator('.ed-h-panel').count();
    await trackChecks(project, '.ed-h-track', typologies);
    await check(`${project} typologies: section fits 100dvh, medium over half the card, details closed`, async () => {
      const state = await page.evaluate(() => {
        const section = document.querySelector('[data-typologies]');
        section.scrollIntoView({ block: 'start' });
        const card = document.querySelector('.ed-h-panel');
        const media = card.querySelector('.ed-h-media');
        return {
          section: section.getBoundingClientRect().height, viewport: innerHeight,
          card: card.getBoundingClientRect().height, media: media.getBoundingClientRect().height,
          open: [...document.querySelectorAll('details.ed-h-more')].filter((d) => d.open).length,
          summaryVisible: getComputedStyle(document.querySelector('details.ed-h-more > summary')).display !== 'none',
        };
      });
      assert.ok(state.section <= state.viewport + 1, `section ${state.section} > viewport ${state.viewport}`);
      assert.ok(state.media > state.card / 2, `media ${state.media} vs card ${state.card}`);
      assert.equal(state.open, 0, 'details should be closed on mobile');
      assert.equal(state.summaryVisible, true, 'summary visible on mobile');
    });
  } else {
    failures.push('no Ereditá project page in dist/');
  }
  await trackChecks('/unete/', '.traits', 4);
  await trackChecks('/contacto/', '.reasons', 3);
  await trackChecks('/putnam/', '.process-track', 6);
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
