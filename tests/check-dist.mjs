// Post-build guard: the static build must never ship HTML that depends on Astro's
// on-demand `/_image` endpoint (there is no worker to serve it on Cloudflare), and
// every local optimized image it references must exist in dist/.
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

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = relative(dist, file);

  const endpointHits = html.match(/\/_image\?[^"'\s)]*/g) ?? [];
  for (const hit of endpointHits) failures.push(`${name}: references on-demand image endpoint ${hit}`);

  const assetRefs = new Set(html.match(/\/_astro\/[\w.-]+\.(?:webp|avif|png|jpe?g|svg)/g) ?? []);
  for (const ref of assetRefs) {
    if (!(await exists(join(dist, ref)))) failures.push(`${name}: missing asset ${ref}`);
  }
}

if (failures.length) {
  console.error(`check-dist: ${failures.length} problem(s) in ${dist}/`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`check-dist: ${htmlFiles.length} HTML file(s) OK, no /_image references, all /_astro images present.`);
