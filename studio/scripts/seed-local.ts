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

const docs = await buildDocs(uploadImage);
await mkdir(dirname(out), { recursive: true });
await writeFile(out, JSON.stringify([...docs, ...assets], null, 1));
console.log(`seed-local: ${docs.length} documents + ${assets.length} assets → ${out}`);
