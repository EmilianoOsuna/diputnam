// Targeted content refresh on top of the seed: swaps the placeholder photos that read
// off-brand (a bed for "Diseñamos espacios", a skyscraper for Ereditá…) for allusive
// ones, fills the process steps and notes that had no image, and attaches the sample
// legal PDFs from seed-data/docs (rendered by scripts/mock-docs.mjs at the repo root).
// Only the listed fields are patched, so everything else edited in the Studio stays.
//
//   npx sanity exec scripts/patch-mocks.ts --with-user-token   (from studio/)
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2026-09-01' });
const seedData = resolve(dirname(fileURLToPath(import.meta.url)), 'seed-data');
const unsplash = (id: string, w = 2200) => `https://images.unsplash.com/photo-${id}?q=85&w=${w}&auto=format&fit=crop`;

const uploaded = new Map<string, string>();
const upload = async (kind: 'image' | 'file', source: string) => {
  if (uploaded.has(source)) return uploaded.get(source)!;
  const remote = source.startsWith('http');
  const bytes = remote ? Buffer.from(await (await fetch(source)).arrayBuffer()) : await readFile(resolve(seedData, source));
  const filename = remote ? `${new URL(source).pathname.split('/').pop()}.jpg` : source.split('/').pop()!;
  const asset = await client.assets.upload(kind, bytes, { filename, ...(kind === 'file' ? { contentType: 'application/pdf' } : {}), source: { name: 'seed', id: source } });
  console.log(`  ${kind} ${asset._id} ← ${source}`);
  uploaded.set(source, asset._id);
  return asset._id;
};
const localeImage = async (id: string, es: string, en: string) => ({ _type: 'localeImage', asset: { _type: 'reference', _ref: await upload('image', unsplash(id)) }, alt: { es, en }, decorative: false });

const run = async () => {
  const tx = client.transaction();

  // Home scenes: contemporary residential architecture, the project's facade, a meeting.
  const home = {
    inicio: await localeImage('1515263487990-61b07816b324', 'Fachada de un edificio residencial contemporáneo', 'Facade of a contemporary residential building'),
    eredita: await localeImage('1448630360428-65456885c650', 'Esquina de un edificio de departamentos moderno', 'Corner of a modern apartment building'),
    contacto: await localeImage('1431540015161-0bf868a2d407', 'Sala de reuniones con vista a la ciudad', 'Meeting room overlooking the city'),
  };
  tx.patch('home', (p) => p.set(Object.fromEntries(Object.entries(home).map(([id, image]) => [`scenes[id=="${id}"].image`, image]))));

  // Putnam process: the three steps that shipped without an image.
  const steps = {
    '02': await localeImage('1600880292203-757bb62b4baf', 'Equipo revisando la factibilidad de un proyecto sobre planos', "Team reviewing a project's feasibility over drawings"),
    '04': await localeImage('1497215728101-856f4ea42174', 'Estación de trabajo de diseño con vista a la ciudad', 'Design workstation overlooking the city'),
    '06': await localeImage('1560518883-ce09059eeffa', 'Llaves y maqueta de una vivienda sobre una mesa', 'House keys and a model home on a table'),
  };
  tx.patch('putnam', (p) => p.set(Object.fromEntries(Object.entries(steps).map(([n, image]) => [`process.steps[number=="${n}"].image`, image]))));

  // Ereditá Art gallery: the bedroom photo becomes a contemporary living room.
  const gallery = await client.fetch<{ _key: string; file: string }[]>(`*[_id == "proyecto-eredita-art"][0].gallery.items[]{ _key, "file": image.asset->originalFilename }`);
  const bed = gallery?.find((item) => item.file?.startsWith('photo-1505693416388'));
  if (bed) {
    const living = await localeImage('1600607687939-ce8a6c25118c', 'Sala de estar contemporánea con madera y luz natural', 'Contemporary living room with wood and natural light');
    tx.patch('proyecto-eredita-art', (p) => p.set({ [`gallery.items[_key=="${bed._key}"].image`]: living }));
  }

  // Notes: one featured image per note (both languages share it).
  const notes: Record<string, [string, string, string]> = {
    'comunicar-avances-constructivos': ['1541888946425-d81bb19240f5', 'Obra vista desde arriba con el equipo en el terreno', 'Construction site seen from above with the team on the ground'],
    'marca-premium-transparente': ['1541976590-713941681591', 'Fachada de un edificio moderno vista desde abajo', 'Facade of a modern building seen from below'],
    'nueva-etapa-comunicacion': ['1556761175-5973dc0f32e7', 'Equipo de trabajo en una presentación', 'Team during a presentation'],
  };
  for (const [slug, [id, es, en]] of Object.entries(notes)) {
    const ref = await upload('image', unsplash(id, 1600));
    tx.patch(`nota-${slug}`, (p) => p.set({ image: { _type: 'image', asset: { _type: 'reference', _ref: ref }, alt: es } }));
    tx.patch(`nota-${slug}-en`, (p) => p.set({ image: { _type: 'image', asset: { _type: 'reference', _ref: ref }, alt: en } }));
  }

  // Legal documents: sample PDFs, versioned and dated so the cards stop reading "Próximamente".
  const pdfs = ['reglamento-copropiedad.pdf', 'minuta-compraventa.pdf', 'planos-aprobaciones.pdf', 'fichas-politicas.pdf'];
  for (const [i, file] of pdfs.entries()) {
    const ref = await upload('file', `docs/${file}`);
    tx.patch(`documentoLegal-${i + 1}`, (p) => p.set({ file: { _type: 'file', asset: { _type: 'reference', _ref: ref } }, version: 'v0.1', validFrom: '2026-09-01' }));
  }

  console.log('\nCommitting patches…');
  await tx.commit();
  console.log('Done.');
};

run().catch((error) => { console.error(error); process.exit(1); });
