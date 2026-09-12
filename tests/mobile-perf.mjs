// Mobile frame-budget check for the six routes at a phone viewport with the CPU
// throttled ×4. Drags the page with synthetic touch events (CDP) and measures what
// the site does during the gesture and its fling:
// rAF/scroll callbacks it registered, frame pacing, long tasks and forced layouts.
// Thresholds follow openspec/specs/mobile-rendering-performance. Collects every
// failure instead of stopping at the first one.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const artifacts = 'tests/.artifacts';
const CPU_RATE = 4;
const DRAG = { distance: 900, duration: 700 }; // px of finger travel, ms
const MOTION_LIBS = /gsap|ScrollTrigger|lenis/i;
const JS_BUDGET = 10 * 1024; // gzip bytes of first-party scripts on a mobile load

const routes = ['/', '/putnam/', '/eredita/', '/unete/', '/contacto/', '/noticias/'];
const tracks = { '/eredita/': '.ed-h-track', '/unete/': '.traits', '/contacto/': '.reasons' };
const failures = [];
const report = {};
const check = (label, fn) => {
  try { fn(); console.log(`  ok   ${label}`); }
  catch (error) { failures.push(`${label}: ${error.message.split('\n')[0]}`); console.log(`  FAIL ${label}`); }
};
const percentile = (values, p) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
};

await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch(executablePath ? { executablePath, args: ['--no-sandbox'] } : {});
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_RATE });
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A finger drag at ~60 Hz followed by the browser's own fling; resolves once the
// scroll position has settled. Input.synthesizeScrollGesture(touch) does not scroll in headless.
const touchDrag = async ({ x, y, dx = 0, dy = 0, duration = DRAG.duration }) => {
  const steps = Math.round(duration / 16);
  const pending = [cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })];
  for (let i = 1; i <= steps; i++) {
    pending.push(cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + (dx * i) / steps, y: y + (dy * i) / steps }] }));
    await sleep(16);
  }
  pending.push(cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }));
  await Promise.all(pending);
  let last = -1;
  for (let i = 0; i < 40; i++) {
    await sleep(50);
    const now = await page.evaluate(() => scrollY + [...document.querySelectorAll('[data-track]')].reduce((sum, track) => sum + track.scrollLeft, 0));
    if (now === last) break;
    last = now;
  }
};

// Probes run before any site script. They keep the native rAF/addEventListener for
// their own use, so only callbacks registered by the site are counted.
await page.addInitScript(() => {
  const perf = { counting: false, raf: 0, scroll: 0, frames: [], longTasks: [] };
  window.__perf = perf;
  const nativeRaf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (callback) => nativeRaf((time) => { if (perf.counting) perf.raf += 1; return callback(time); });
  const nativeAdd = EventTarget.prototype.addEventListener;
  const nativeRemove = EventTarget.prototype.removeEventListener;
  const wrapped = new WeakMap();
  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === 'scroll' && (this === window || this === document) && typeof listener === 'function') {
      let proxy = wrapped.get(listener);
      if (!proxy) { proxy = function (event) { if (perf.counting) perf.scroll += 1; return listener.call(this, event); }; wrapped.set(listener, proxy); }
      return nativeAdd.call(this, type, proxy, options);
    }
    return nativeAdd.call(this, type, listener, options);
  };
  EventTarget.prototype.removeEventListener = function (type, listener, options) {
    return nativeRemove.call(this, type, wrapped.get(listener) ?? listener, options);
  };
  let last = 0;
  const sample = (time) => {
    if (perf.counting) { if (last) perf.frames.push(time - last); last = time; } else last = 0;
    nativeRaf(sample);
  };
  nativeRaf(sample);
  if ('PerformanceObserver' in window) {
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (perf.counting) perf.longTasks.push(entry.duration); }).observe({ type: 'longtask' });
  }
  perf.reset = () => { perf.raf = 0; perf.scroll = 0; perf.frames.length = 0; perf.longTasks.length = 0; last = 0; };
});

// Scripts the page requested (revalidated 304s included); sizes are fetched once per
// path since a 304 carries no body.
const scripts = new Set();
const sizes = new Map();
page.on('response', (response) => {
  const url = new URL(response.url());
  if (url.origin === new URL(baseUrl).origin && /\.m?js$/.test(url.pathname)) scripts.add(url.pathname);
});
const gzipSize = async (path) => {
  if (!sizes.has(path)) sizes.set(path, gzipSync(await (await context.request.get(baseUrl + path)).body()).length);
  return sizes.get(path);
};

const forcedLayouts = (trace) => trace.traceEvents.filter((event) => event.name === 'Layout' && event.args?.beginData?.stackTrace?.length).length;

const measure = async (label, gesture) => {
  await page.evaluate(() => { window.__perf.reset(); window.__perf.counting = true; });
  await browser.startTracing(page, { categories: ['disabled-by-default-devtools.timeline'] });
  await touchDrag(gesture);
  const trace = JSON.parse((await browser.stopTracing()).toString());
  const perf = await page.evaluate(() => { window.__perf.counting = false; const { raf, scroll, frames, longTasks } = window.__perf; return { raf, scroll, frames: [...frames], longTasks: [...longTasks] }; });
  return {
    label,
    raf: perf.raf,
    scroll: perf.scroll,
    frames: perf.frames.length,
    p50: +percentile(perf.frames, 0.5).toFixed(1),
    p95: +percentile(perf.frames, 0.95).toFixed(1),
    slowFrames: perf.frames.filter((interval) => interval > 33.4).length,
    longTasks: perf.longTasks.filter((duration) => duration >= 50).length,
    forcedLayouts: forcedLayouts(trace),
  };
};

const restCallbacks = async (ms) => {
  await page.evaluate(() => { window.__perf.reset(); window.__perf.counting = true; });
  await page.waitForTimeout(ms);
  return page.evaluate(() => { window.__perf.counting = false; return window.__perf.raf + window.__perf.scroll; });
};

try {
  for (const route of routes) {
    console.log(`\n${route}`);
    scripts.clear();
    await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    const scrollTimeline = await page.evaluate(() => CSS.supports('animation-timeline: view()'));
    const libs = [...scripts].filter((path) => MOTION_LIBS.test(path));
    let jsGzip = 0;
    for (const path of scripts) if (!MOTION_LIBS.test(path)) jsGzip += await gzipSize(path);

    const down = await measure('down', { x: 195, y: 780, dy: -DRAG.distance });
    const up = await measure('up', { x: 195, y: 120, dy: DRAG.distance });
    const idle = await restCallbacks(500);
    const entry = { scrollTimeline, jsGzip, motionLibs: libs, idleCallbacks: idle, vertical: [down, up] };
    report[route] = entry;
    console.log(`  ${JSON.stringify({ scrollTimeline, jsGzip, libs, idle })}`);
    for (const pass of [down, up]) {
      console.log(`  ${pass.label}: ${JSON.stringify(pass)}`);
      check(`${route} ${pass.label}: no site rAF/scroll callbacks during the gesture`, () => {
        if (!scrollTimeline && route === '/putnam/') assert.ok(pass.raf <= pass.frames, `raf ${pass.raf} > frames ${pass.frames} (fallback)`);
        else assert.equal(pass.raf + pass.scroll, 0, `raf ${pass.raf}, scroll ${pass.scroll}`);
      });
      check(`${route} ${pass.label}: p95 frame interval ≤ 20ms`, () => { assert.ok(pass.frames > 20, `only ${pass.frames} frames sampled`); assert.ok(pass.p95 <= 20, `p95 ${pass.p95}ms`); });
      check(`${route} ${pass.label}: ≤ 1 long task ≥ 50ms`, () => assert.ok(pass.longTasks <= 1, `${pass.longTasks} long tasks`));
      check(`${route} ${pass.label}: no forced synchronous layout`, () => assert.equal(pass.forcedLayouts, 0, `${pass.forcedLayouts} forced layouts`));
    }
    check(`${route} idle: no site rAF/scroll callbacks at rest`, () => assert.equal(idle, 0, `${idle} callbacks in 500ms`));
    check(`${route} no smooth-scroll/ticker library requested`, () => assert.deepEqual(libs, []));
    check(`${route} first-party scripts ≤ ${JS_BUDGET / 1024} KB gzip`, () => assert.ok(jsGzip <= JS_BUDGET, `${jsGzip} bytes`));

    const trackSelector = tracks[route];
    if (trackSelector) {
      await page.evaluate((selector) => document.querySelector(selector).scrollIntoView({ block: 'center', behavior: 'auto' }), trackSelector);
      await page.waitForTimeout(400);
      const box = await page.locator(trackSelector).boundingBox();
      const swipe = await measure('swipe', { x: box.x + box.width - 20, y: box.y + box.height / 2, dx: -(box.width - 40), duration: 400 });
      await page.waitForTimeout(300);
      const settled = await restCallbacks(300);
      entry.track = { ...swipe, settledCallbacks: settled };
      console.log(`  track: ${JSON.stringify(entry.track)}`);
      check(`${route} track swipe: ≤ 1 callback per frame`, () => assert.ok(swipe.raf + swipe.scroll <= swipe.frames + 1, `${swipe.raf + swipe.scroll} callbacks over ${swipe.frames} frames`));
      check(`${route} track settled: no callbacks 300ms after the swipe`, () => assert.equal(settled, 0, `${settled} callbacks`));
    }
  }
} finally {
  await browser.close();
}

await writeFile(`${artifacts}/perf-last.json`, JSON.stringify(report, null, 2));
console.log(`\nreport: ${artifacts}/perf-last.json`);
if (failures.length) {
  console.error(`mobile-perf: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('mobile-perf: all checks passed');
