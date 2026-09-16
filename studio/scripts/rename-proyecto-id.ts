// One-off: Sanity hides documents whose _id contains a dot from public (unauthenticated)
// queries, so the site's build never saw `proyecto.eredita-art`. Copies it to
// `proyecto-eredita-art` and deletes the dotted one. Safe to re-run.
//   cd studio && npx sanity exec scripts/rename-proyecto-id.ts --with-user-token
import { getCliClient } from 'sanity/cli';
const c = getCliClient({ apiVersion: '2026-09-01' });
(async () => {
  const old = await c.fetch<Record<string, unknown> | null>(`*[_id=="proyecto.eredita-art"][0]`);
  if (!old) { console.log('Nothing to rename.'); return; }
  const { _id, _rev, _createdAt, _updatedAt, ...rest } = old;
  await c.transaction().createIfNotExists({ ...rest, _id: 'proyecto-eredita-art' } as never).delete('proyecto.eredita-art').commit();
  console.log('Renamed proyecto.eredita-art → proyecto-eredita-art');
})().catch((e) => { console.error(e); process.exit(1); });
