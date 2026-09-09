import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const browser = await chromium.launch(executablePath ? { executablePath, args: ['--no-sandbox'] } : {});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });

try {
  await page.addInitScript(() => {
    window.__putnamPerf = { frames: [], longTasks: [] };
    const start = performance.now();
    const sample = (time) => {
      window.__putnamPerf.frames.push(time - start);
      if (time - start < 2500) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) window.__putnamPerf.longTasks.push(entry.duration);
      });
      observer.observe({ type: 'longtask', buffered: true });
    }
  });

  await page.goto(`${baseUrl}/putnam/`, { waitUntil: 'networkidle' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo({ top: Math.min(500, document.body.scrollHeight), behavior: 'auto' }));
  await page.waitForTimeout(1800);

  const result = await page.evaluate(() => {
    const samples = window.__putnamPerf.frames;
    const intervals = samples.slice(1).map((time, index) => time - samples[index]);
    return {
      frameCount: samples.length,
      droppedFrames: intervals.filter((interval) => interval > 33.4).length,
      longTasks: window.__putnamPerf.longTasks,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroVisible: getComputedStyle(document.querySelector('.institutional-hero')).visibility !== 'hidden',
    };
  });

  assert.equal(result.heroVisible, true);
  assert.equal(result.overflow, 0);
  assert.equal(result.frameCount > 30, true);
  assert.equal(result.droppedFrames < Math.max(5, result.frameCount * 0.1), true);
  assert.equal(result.longTasks.filter((duration) => duration >= 50).length < 3, true);
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
}
