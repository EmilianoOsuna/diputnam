// Social covers (1200×630) for the static pages, one per page and language, plus the
// default cover notes fall back to. Rendered from og-template.html with Playwright and
// committed to public/og/ (CI has no browsers). Run after copy or brand changes:
//
//   node scripts/og.mjs
import { chromium } from 'playwright';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { es } = await import('../src/i18n/es.ts');
const { en } = await import('../src/i18n/en.ts');
const dictionaries = { es, en };
const PAGES = ['home', 'eredita', 'putnam', 'noticias', 'unete', 'contacto'];
const OUT = 'public/og';

const template = await readFile('scripts/og-template.html', 'utf8');
// The traced mark, recolored cream for the green background.
const mark = (await readFile('public/favicon.svg', 'utf8')).replace('fill="#003a36"', 'fill="#f4eedf"').trim();
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

// "Ereditá · Departamentos en La Paz | Putnam" → ["Ereditá", "Departamentos en La Paz"];
// the home title starts with the brand, which the lockup already shows.
const lines = (title) => {
  const parts = title.replace(/\s*\|\s*Putnam$/, '').split(' · ');
  return parts[0] === 'Putnam' ? parts.slice(1) : parts;
};

const render = (lang, page) => {
  const ui = dictionaries[lang];
  const [line1, line2] = page ? lines(ui.meta[page].title) : [ui.meta.home.title.split(' · ').slice(1).join(' · ')];
  return template
    .replaceAll('{{lang}}', lang)
    .replaceAll('{{fonts}}', pathToFileURL(resolve('public/fonts')).href)
    .replaceAll('{{mark}}', mark)
    .replaceAll('{{tagline}}', escape(ui.brand.tagline))
    .replaceAll('{{kind}}', page ? 'page' : 'cover')
    .replaceAll('{{line1}}', escape(line1))
    .replaceAll('{{line2}}', line2 ? `<small>${escape(line2)}</small>` : '');
};

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const page = await context.newPage();
for (const lang of ['es', 'en']) {
  for (const key of [null, ...PAGES]) {
    // Served from a file so the file:// font URLs are same-origin (setContent is about:blank).
    const html = resolve(OUT, '.render.html');
    await writeFile(html, render(lang, key));
    await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const file = `${OUT}/${key ?? 'cover'}-${lang}.png`;
    await writeFile(file, await page.screenshot({ type: 'png', omitBackground: false }));
    console.log(`og: ${file}`);
  }
}
await browser.close();
await rm(resolve(OUT, '.render.html'));
