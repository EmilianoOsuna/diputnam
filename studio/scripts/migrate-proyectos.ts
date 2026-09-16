// One-off migration for the "Ereditá as a line" model: moves the commercial content of
// the published `eredita` singleton (gallery, typologies, legal heading; hero and intro
// are copied) into the project `proyecto.eredita-art`, turning each typology's single
// `image` into `images[0]`, and trims the singleton. Reads the published document, not
// the seed, so nothing the admin edited in the Studio is lost.
//
//   cd studio && npx sanity exec scripts/migrate-proyectos.ts --with-user-token [-- --dry-run]
//
// Idempotent: the project is created only when it does not exist yet (later edits to it
// are never overwritten), the singleton's moved sections are unset only while present,
// and `projects` is only set when missing.
import { getCliClient } from 'sanity/cli';

const PROJECT_ID = 'proyecto.eredita-art';

type Localized = { es: string; en?: string };
type Typology = Record<string, unknown> & { _key: string; image?: Record<string, unknown>; images?: unknown[] };
type Eredita = {
  _id: string;
  hero?: Record<string, unknown>;
  intro?: { lead?: Localized } & Record<string, unknown>;
  gallery?: Record<string, unknown>;
  typologies?: { items?: Typology[] } & Record<string, unknown>;
  legal?: Record<string, unknown>;
  cta?: Record<string, unknown>;
  projects?: Record<string, unknown>;
};

const toProjectTypology = ({ image, images, ...rest }: Typology): Typology => ({
  ...rest,
  images: images ?? (image ? [{ _key: 'k0', ...image, _type: 'captionedImage' }] : []),
});

// The plan is pure so it can be checked offline: `creates` and the patch operations
// that `run` turns into one transaction.
export interface Plan { creates: Record<string, unknown>[]; unset: string[]; setIfMissing: Record<string, unknown> | null; log: string[] }
export const plan = (eredita: Eredita, projectExists: boolean): Plan => {
  const result: Plan = { creates: [], unset: [], setIfMissing: null, log: [] };
  if (projectExists) {
    result.log.push(`${PROJECT_ID} already exists: left untouched`);
  } else {
    const poster = (eredita.hero as { poster?: Record<string, unknown> } | undefined)?.poster;
    if (!poster) throw new Error('`eredita.hero.poster` is missing; cannot build the project card.');
    result.creates.push({
      _id: PROJECT_ID, _type: 'proyecto',
      name: 'EREDITÁ Art', slug: { _type: 'slug', current: 'eredita-art' }, order: 1,
      status: { es: 'En preventa', en: 'Pre-sale' },
      card: { image: poster, text: eredita.intro?.lead ?? { es: 'EREDITÁ Art' } },
      hero: eredita.hero, intro: eredita.intro,
      gallery: eredita.gallery,
      typologies: eredita.typologies && { ...eredita.typologies, items: (eredita.typologies.items ?? []).map(toProjectTypology) },
      legal: eredita.legal, cta: eredita.cta,
    });
    result.log.push(`create ${PROJECT_ID} from the published singleton (${eredita.typologies?.items?.length ?? 0} typologies)`);
  }
  result.unset = (['gallery', 'typologies', 'legal'] as const).filter((field) => eredita[field] !== undefined);
  if (result.unset.length) result.log.push(`unset eredita.${result.unset.join(', eredita.')}`);
  if (!eredita.projects) {
    result.setIfMissing = { projects: {
      kicker: { es: 'Proyectos', en: 'Projects' },
      title: { es: 'Los edificios\nde la línea Ereditá.', en: 'The buildings\nof the Ereditá line.' },
      text: { es: 'Cada proyecto Ereditá comparte la misma idea de vivienda bien pensada, segura y durable, adaptada a su ubicación.', en: 'Every Ereditá project shares the same idea of thoughtful, safe and durable housing, adapted to its location.' },
    } };
    result.log.push('set eredita.projects (default copy, edit it in the Studio)');
  }
  return result;
};

const run = async () => {
  const dryRun = process.argv.includes('--dry-run');
  const client = getCliClient({ apiVersion: '2026-09-01' });
  const eredita = await client.fetch<Eredita | null>(`*[_id == "eredita"][0]`);
  if (!eredita) throw new Error('The published `eredita` document does not exist.');
  const existing = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]{ _id }`, { id: PROJECT_ID });
  const { creates, unset, setIfMissing, log } = plan(eredita, Boolean(existing));

  if (!creates.length && !unset.length && !setIfMissing) { console.log('Nothing to migrate.'); return; }
  const tx = client.transaction();
  creates.forEach((doc) => tx.create(doc as never));
  if (unset.length || setIfMissing) {
    const patch = client.patch('eredita');
    if (unset.length) patch.unset(unset);
    if (setIfMissing) patch.setIfMissing(setIfMissing);
    tx.patch(patch);
  }
  console.log(`${dryRun ? '[dry-run] would apply' : 'Applying'}:\n  - ${log.join('\n  - ')}`);
  if (dryRun) { console.log(JSON.stringify(tx.serialize(), null, 2)); return; }
  await tx.commit();
  console.log('Migration complete.');
};

if (!process.argv.includes('--no-run')) run().catch((error) => { console.error(error); process.exit(1); });
