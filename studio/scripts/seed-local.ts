// Offline dataset for building the site without a Sanity project: the same documents as
// the real seed plus fabricated image assets, written as JSON that src/lib/sanity.ts
// evaluates with groq-js when SANITY_LOCAL_DATASET points at it.
//
//   node studio/scripts/seed-local.ts        → studio/.local/dataset.json
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocs, type SeedDoc } from './seed-docs.ts';

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../.local/dataset.json');
const assets: SeedDoc[] = [];
const uploadImage = async (source: string) => {
  const hash = createHash('sha1').update(source).digest('hex');
  const id = `image-${hash}-2200x1467-jpg`;
  if (!assets.some((asset) => asset._id === id)) {
    assets.push({
      _id: id, _type: 'sanity.imageAsset', extension: 'jpg', mimeType: 'image/jpeg',
      url: `https://cdn.sanity.io/images/local/production/${hash}-2200x1467.jpg`,
      metadata: { dimensions: { width: 2200, height: 1467, aspectRatio: 2200 / 1467 } },
      source: { name: 'seed', id: source },
    });
  }
  return id;
};

// The typology video of the seed is a fabricated mp4 asset: never fetched by the tests
// (the panel loads it only when visible and `preload="none"` defers even that).
const uploadFile = async (source: string) => {
  const hash = createHash('sha1').update(source).digest('hex');
  const id = `file-${hash}-mp4`;
  if (!assets.some((asset) => asset._id === id)) {
    assets.push({
      _id: id, _type: 'sanity.fileAsset', extension: 'mp4', mimeType: 'video/mp4', size: 4_000_000,
      url: `https://cdn.sanity.io/files/local/production/${hash}.mp4`,
      source: { name: 'seed', id: source },
    });
  }
  return id;
};

// Published documents carry _updatedAt in Sanity; the site uses it for sitemap lastmod
// and dateModified, so the offline dataset stamps the seed time.
const stamp = new Date().toISOString();
const docs = (await buildDocs(uploadImage, uploadFile)).map((doc) => ({ _updatedAt: stamp, ...doc }));
await mkdir(dirname(out), { recursive: true });
await writeFile(out, JSON.stringify([...docs, ...assets], null, 1));
console.log(`seed-local: ${docs.length} documents + ${assets.length} assets → ${out}`);
