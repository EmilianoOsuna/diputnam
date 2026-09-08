import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const browser = await chromium.launch(executablePath ? { executablePath, args: ['--no-sandbox', '--disable-gpu'] } : {});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

try {
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  await page.setViewportSize({ width: 390, height: 844 });
  const menuToggle = page.locator('[data-menu-toggle]');
  assert.equal(await menuToggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.locator('.site-nav > a').count(), 3);
  await menuToggle.click();
  assert.equal(await menuToggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('.site-nav.is-open').count(), 1);
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  assert.equal(await page.locator('.mobile-menu-contact a').count(), 3);
  await page.keyboard.press('Escape');
  assert.equal(await menuToggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');
  assert.equal(await menuToggle.evaluate((element) => document.activeElement === element), true);
  await page.setViewportSize({ width: 1440, height: 900 });

  assert.deepEqual(await page.locator('[data-panel] h1 a, [data-panel] h2 a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))), [
    '#inicio', '#eredita', '#putnam', '#contacto',
  ]);
  assert.equal(await page.locator('.panel-eyebrow, .panel-description, .panel-link, .panel-index').count(), 0);
  assert.equal(await page.locator('[data-scroll-cue]').count(), 1);
  assert.equal(await page.locator('[data-scroll-cue]').getAttribute('aria-label'), 'Desplazarse a la siguiente sección');

  for (const progress of [0.25, 0.5, 0.75]) {
    await page.evaluate((y) => scrollTo(0, y), 900 * progress);
    await page.waitForTimeout(150);

    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      panels: [...document.querySelectorAll('[data-panel]')].map((panel, index) => ({
        index,
        visible: getComputedStyle(panel).visibility === 'visible',
        panelY: new DOMMatrix(getComputedStyle(panel).transform).m42,
        active: panel.classList.contains('is-active'),
        mediaY: getComputedStyle(panel.querySelector('.panel-media')).transform,
        contentY: new DOMMatrix(getComputedStyle(panel.querySelector('.panel-content')).transform).m42,
      })),
    }));
    const visible = state.panels.filter((panel) => panel.visible);

    assert.deepEqual(visible.map((panel) => panel.index), [0, 1]);
    assert.equal(visible.filter((panel) => panel.active).length, 1);
    assert.equal(state.overflow, 0);
    assert.equal(Math.abs(visible[0].panelY + 900 - visible[1].panelY) < 1, true);
    assert.notEqual(visible[0].mediaY, 'none');
    assert.equal(visible[0].panelY < 0, true);
    assert.equal(visible[1].panelY > 0, true);
    assert.equal(visible[0].contentY > 0, true);
    assert.equal(visible[1].contentY < 0, true);
    assert.equal(Math.abs((visible[1].panelY + visible[1].contentY) - (visible[0].panelY + visible[0].contentY) - 60) < 1, true);
  }

  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(150);
  const visibleAtTop = await page.locator('[data-panel]').evaluateAll((panels) =>
    panels.flatMap((panel, index) => getComputedStyle(panel).visibility === 'visible' ? [index] : []),
  );
  assert.deepEqual(visibleAtTop, [0]);

  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(200);
  assert.equal(await page.locator('[data-scroll-cue]').getAttribute('aria-label'), 'Volver al inicio');

  await page.locator('[data-scroll-cue]').click();
  await page.waitForTimeout(1400);
  assert.equal(await page.evaluate(() => window.scrollY < 5), true);
} finally {
  await browser.close();
}

console.log('Home sweep check passed');
