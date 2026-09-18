// Desktop behaviour of the typology media gallery on the first Ereditá project page:
// the pinned stage plays only the active panel's video, the strip is keyboard-operable
// (arrows move focus, Enter selects) and reduced motion swaps autoplay for a play button.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { projectPairs } from './routes.mjs';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const route = Object.values(projectPairs)[0]?.es;
if (!route) { console.error('eredita-gallery: no project page in dist/'); process.exit(1); }

const failures = [];
const check = async (label, fn) => {
  try { await fn(); console.log(`  ok   ${label}`); }
  catch (error) { failures.push(`${label}: ${error.message.split('\n')[0]}`); console.log(`  FAIL ${label}`); }
};

const browser = await chromium.launch(executablePath ? { executablePath, args: ['--no-sandbox', '--disable-gpu'] } : {});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const mp4 = [];
  page.on('request', (request) => { if (/\.mp4(\?|$)/.test(request.url())) mp4.push(request.url()); });
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const video = page.locator('.ed-h-media video[data-video]').first();
  const panels = await page.locator('.ed-h-panel').count();
  // Media blocks keep panel order once the desktop engine moves them into the pinned slot.
  const videoIndex = await page.locator('.ed-h-media').evaluateAll((els) => els.findIndex((el) => el.querySelector('video[data-video]')));
  console.log(`${route} at 1440px (${panels} panels, video in panel ${videoIndex})`);

  // The stage (media) stays pinned from the section top while the typology panels scroll
  // past; a panel becomes active once it crosses the middle of the viewport (start 'top 55%').
  const goTo = async (index) => {
    await page.evaluate((i) => {
      const panel = document.querySelectorAll('.ed-h-panel')[i];
      const top = (el) => scrollY + el.getBoundingClientRect().top;
      scrollTo(0, Math.max(top(document.querySelector('[data-typologies]')), top(panel) - innerHeight * 0.4));
    }, index);
    await page.waitForTimeout(1200);
  };
  const active = () => page.evaluate(() => Number(document.querySelector('[data-pin-current]').textContent) - 1);
  await check('no mp4 requested before the video panel is active', async () => {
    if (videoIndex > 0) await goTo(videoIndex - 1);
    assert.equal(mp4.length, 0, `${mp4.length} requests`);
  });
  await goTo(videoIndex);
  await check('scrolling to the video panel makes it the active one and plays the video', async () => {
    assert.equal(await active(), videoIndex, 'counter');
    assert.equal(await video.evaluate((el) => el.closest('.ed-h-media').classList.contains('is-active')), true, 'media is-active');
    assert.equal(await video.evaluate((el) => !el.paused), true, 'playing');
    assert.equal(new Set(mp4).size, 1, `${new Set(mp4).size} files requested`);
  });
  await check('stepping back pauses the video', async () => {
    await goTo(Math.max(0, videoIndex - 1));
    if (videoIndex === 0) await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(600);
    assert.equal(await video.evaluate((el) => el.paused), true);
  });
  await goTo(videoIndex);
  await check('arrow keys move the focus along the strip and Enter selects (focus stays)', async () => {
    const tabs = page.locator('.ed-h-media', { has: page.locator('video[data-video]') }).first().locator('[role="tab"]');
    const last = (await tabs.count()) - 1;
    assert.ok(last >= 1, 'video typology has several media');
    await tabs.first().focus();
    for (let i = 0; i < last; i++) await page.keyboard.press('ArrowRight');
    assert.equal(await tabs.nth(last).evaluate((el) => el === document.activeElement), true, 'last tab focused');
    assert.equal(await tabs.first().getAttribute('aria-selected'), 'true', 'not selected yet');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    assert.equal(await tabs.nth(last).getAttribute('aria-selected'), 'true', 'last selected');
    assert.equal(await tabs.nth(last).evaluate((el) => el === document.activeElement), true, 'focus kept');
    assert.equal(await video.evaluate((el) => el.paused), true, 'video paused while another medium is shown');
    assert.equal(await active(), videoIndex, 'stage did not move');
  });
  await page.close();

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await reduced.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  const rVideo = reduced.locator('.ed-h-media video[data-video]').first();
  await rVideo.scrollIntoViewIfNeeded();
  await reduced.waitForTimeout(600);
  await check('reduced motion: no autoplay, a play button starts the video', async () => {
    assert.equal(await rVideo.evaluate((el) => el.paused), true, 'paused by default');
    const play = reduced.locator('[data-play]').first();
    assert.equal(await play.isVisible(), true, 'play button visible');
    await play.click();
    await reduced.waitForTimeout(300);
    assert.equal(await rVideo.evaluate((el) => el.paused), false, 'plays after the click');
    assert.equal(await play.isHidden(), true, 'button hidden');
  });

  // The hero mark is the project's logo, never over the hero copy: checked at the two
  // common 14" laptop viewports on the line page and the project page.
  for (const viewport of [{ width: 1366, height: 768 }, { width: 1512, height: 982 }]) {
    const laptop = await browser.newPage({ viewport });
    for (const heroRoute of ['/eredita/', route]) {
      await laptop.goto(`${baseUrl}${heroRoute}`, { waitUntil: 'networkidle' });
      await laptop.waitForTimeout(1600);
      const hits = await laptop.evaluate(() => {
        const mark = document.querySelector('.ed-hero-mark').getBoundingClientRect();
        return [...document.querySelectorAll('.ed-hero-content > *')]
          .filter((el) => { const r = el.getBoundingClientRect(); return r.left < mark.right && r.right > mark.left && r.top < mark.bottom && r.bottom > mark.top; })
          .map((el) => el.className || el.tagName);
      });
      await check(`${heroRoute} hero mark never over the copy at ${viewport.width}×${viewport.height}`, () => assert.deepEqual(hits, []));
    }
    await laptop.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\neredita-gallery: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('\neredita-gallery: all checks passed');
