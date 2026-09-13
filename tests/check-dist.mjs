// Post-build guard: the static build must never ship HTML that depends on Astro's
// on-demand `/_image` endpoint (there is no worker to serve it on Cloudflare), every
// local optimized image it references must exist in dist/, no content image may still
// point at the former mock hosts, and every page declares its locale with a reciprocal
// hreflang pair.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const dist = process.env.DIST_DIR ?? 'dist';
const failures = [];

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  }));
  return files.flat();
};

const exists = (path) => stat(path).then(() => true, () => false);

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const routeOf = (file) => '/' + relative(dist, file).replace(/index\.html$/, '');
const alternatesOf = (html) => Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map(([, lang, href]) => [lang, href]));
const pageAlternates = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = relative(dist, file);

  const endpointHits = html.match(/\/_image\?[^"'\s)]*/g) ?? [];
  for (const hit of endpointHits) failures.push(`${name}: references on-demand image endpoint ${hit}`);
  const mockHits = html.match(/https?:\/\/(?:images\.unsplash\.com|images\.ctfassets\.net)[^"'\s,)]*/g) ?? [];
  for (const hit of new Set(mockHits)) failures.push(`${name}: content image still on a mock host ${hit}`);

  const lang = html.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  const route = routeOf(file);
  const expectedLang = route.startsWith('/en/') ? 'en' : 'es';
  if (lang !== expectedLang) failures.push(`${name}: <html lang="${lang}"> (expected "${expectedLang}")`);
  const alternates = alternatesOf(html);
  if (alternates[expectedLang] !== route) failures.push(`${name}: self hreflang is ${alternates[expectedLang]}`);
  if (!alternates['x-default']) failures.push(`${name}: missing x-default hreflang`);
  pageAlternates.set(route, alternates);

  const assetRefs = new Set(html.match(/\/_astro\/[\w.-]+\.(?:webp|avif|png|jpe?g|svg)/g) ?? []);
  for (const ref of assetRefs) {
    if (!(await exists(join(dist, ref)))) failures.push(`${name}: missing asset ${ref}`);
  }
}

// Every declared pair must exist and point back.
for (const [route, alternates] of pageAlternates) {
  for (const [lang, target] of Object.entries(alternates)) {
    if (lang === 'x-default' || target === route) continue;
    const back = pageAlternates.get(target);
    if (!back) failures.push(`${route}: hreflang ${lang} points to missing page ${target}`);
    else if (back[lang === 'es' ? 'en' : 'es'] !== route) failures.push(`${route}: hreflang ${lang} -> ${target} is not reciprocal`);
  }
}

if (failures.length) {
  console.error(`check-dist: ${failures.length} problem(s) in ${dist}/`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`check-dist: ${htmlFiles.length} HTML file(s) OK, no /_image references, no mock image hosts, all /_astro images present, hreflang pairs reciprocal.`);
