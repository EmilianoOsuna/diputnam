// One-off, reproducible seed: uploads the mock images as assets and writes every
// document built by seed-docs.ts with deterministic ids, so a build against a fresh
// dataset renders the same site.
//
//   npm run seed            (from studio/: `sanity exec scripts/seed.ts --with-user-token`)
//
// Re-running replaces every seeded document (createOrReplace); documents created later
// in the Studio are left alone.
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCliClient } from 'sanity/cli';
import { buildDocs } from './seed-docs.ts';

const client = getCliClient({ apiVersion: '2026-09-01' });
const seedData = resolve(dirname(fileURLToPath(import.meta.url)), 'seed-data');

// Remote mocks are fetched, local ones read from seed-data/. Cached per source so a URL
// reused across pages uploads once (Sanity also dedupes by content hash).
const uploaded = new Map<string, string>();
const uploadImage = async (source: string) => {
  if (uploaded.has(source)) return uploaded.get(source)!;
  const remote = source.startsWith('http');
  const bytes = remote ? Buffer.from(await (await fetch(source)).arrayBuffer()) : await readFile(resolve(seedData, source));
  const filename = remote ? `${new URL(source).pathname.split('/').pop()}.jpg` : source;
  const asset = await client.assets.upload('image', bytes, { filename, source: { name: 'seed', id: source } });
  console.log(`  asset ${asset._id} ← ${source}`);
  uploaded.set(source, asset._id);
  return asset._id;
};

const run = async () => {
  const docs = await buildDocs(uploadImage);
  console.log(`\nWriting ${docs.length} documents…`);
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc as never), client.transaction());
  await tx.commit();
  console.log('Seed complete.');
};

run().catch((error) => { console.error(error); process.exit(1); });
