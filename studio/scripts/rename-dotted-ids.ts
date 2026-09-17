// One-off, same fix as rename-proyecto-id.ts for the rest of the seed: Sanity hides
// documents whose _id contains a dot from public (unauthenticated) queries, so the site's
// build never saw the legal documents, the notes or their translation metadata. Copies
// each `a.b` document to `a-b`, repoints the translation references and deletes the
// dotted originals in one transaction. Safe to re-run.
//   cd studio && npx sanity exec scripts/rename-dotted-ids.ts --with-user-token
import { getCliClient } from 'sanity/cli';

const c = getCliClient({ apiVersion: '2026-09-01' });
type Doc = Record<string, unknown> & { _id: string; _type: string };
const dashed = (id: string) => id.replaceAll('.', '-');

(async () => {
  const docs = await c.fetch<Doc[]>(`*[_type in ["documentoLegal", "nota", "translation.metadata"] && !(_id in path("drafts.**"))]`);
  const dotted = docs.filter((doc) => doc._id.includes('.'));
  if (!dotted.length) { console.log('Nothing to rename.'); return; }
  const tx = c.transaction();
  for (const doc of dotted) {
    const { _id, _rev, _createdAt, _updatedAt, ...rest } = doc;
    const copy: Doc = { ...rest, _id: dashed(_id), _type: doc._type };
    if (doc._type === 'translation.metadata') {
      copy.translations = (doc.translations as { value?: { _ref: string } }[]).map((entry) => ({ ...entry, value: entry.value ? { ...entry.value, _ref: dashed(entry.value._ref) } : entry.value }));
    }
    tx.createIfNotExists(copy as never).delete(_id);
    console.log(`  ${_id} → ${copy._id}`);
  }
  await tx.commit();
  console.log('Renamed.');
})().catch((e) => { console.error(e); process.exit(1); });
