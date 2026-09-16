// Desktop behaviour of the typology media gallery on the first Ereditá project page:
// the pinned track plays only the visible panel's video, the strip is keyboard-operable
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
  const video = page.locator('.ed-h-panel video[data-video]').first();
  const panels = await page.locator('.ed-h-panel').count();
  const videoIndex = await page.locator('.ed-h-panel').evaluateAll((els) => els.findIndex((el) => el.querySelector('video[data-video]')));
  console.log(`${route} at 1440px (${panels} panels, video in panel ${videoIndex})`);

  // Reach the pinned typologies and step, one wheel gesture per panel (the first gesture is
  // swallowed by the settle lock on entry), until the video's panel is the one shown.
  const shown = () => page.evaluate(() => Math.round(-new DOMMatrix(getComputedStyle(document.querySelector('[data-h-track]')).transform).m41 / window.innerWidth));
  await page.evaluate(() => document.querySelector('[data-h-wrapper]').scrollIntoView({ block: 'start', behavior: 'auto' }));
  await page.waitForTimeout(1200);
  for (let i = 0; i < videoIndex + 3 && (await shown()) < videoIndex; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(1000); }
  await check('the pinned track reaches the video panel one gesture at a time', async () => assert.equal(await shown(), videoIndex));
  await check('no mp4 requested before its panel is visible', () => assert.equal(mp4.length, 1, `${mp4.length} requests`));
  await check('the video plays once its panel is the visible one', async () => {
    const playing = await video.evaluate((el) => !el.paused);
    assert.equal(playing, true);
  });
  await check('stepping back pauses the video', async () => {
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(1000);
    assert.equal(await video.evaluate((el) => el.paused), true);
  });
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(1000);
  await check('arrow keys move the focus along the strip and Enter selects (focus stays)', async () => {
    const tabs = page.locator('.ed-h-panel', { has: page.locator('video[data-video]') }).first().locator('[role="tab"]');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    assert.equal(await tabs.nth(2).evaluate((el) => el === document.activeElement), true, 'third tab focused');
    assert.equal(await tabs.first().getAttribute('aria-selected'), 'true', 'not selected yet');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    assert.equal(await tabs.nth(2).getAttribute('aria-selected'), 'true', 'third selected');
    assert.equal(await tabs.nth(2).evaluate((el) => el === document.activeElement), true, 'focus kept');
    assert.equal(await video.evaluate((el) => el.paused), true, 'video paused while another medium is shown');
    assert.equal(await page.locator('.ed-h-panel').evaluateAll((els) => els.findIndex((el) => el.querySelector('video[data-video]'))), videoIndex, 'track did not move');
  });
  await page.close();

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await reduced.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
  const rVideo = reduced.locator('.ed-h-panel video[data-video]').first();
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
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(`\neredita-gallery: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('\neredita-gallery: all checks passed');
