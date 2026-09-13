// One-off, reproducible seed: loads the Spanish content from ../../src/data, the English
// drafts from ./seed.en.ts and the mock images (uploaded as assets) into the dataset
// with deterministic ids, so a build against a fresh dataset renders the same site.
//
//   npm run seed            (from studio/: `sanity exec scripts/seed.ts --with-user-token`)
//
// Re-running replaces every seeded document (createOrReplace); documents created later
// in the Studio are left alone.
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getCliClient } from 'sanity/cli';
import { contact, homePanels } from '../../src/data/home';
import { erediteGallery, erediteHero, erediteIntro, erediteLegalDocs, erediteSections, erediteTypologies } from '../../src/data/eredita';
import { putnamDifferences, putnamEditorialImage, putnamHero, putnamIntro, putnamPrinciples, putnamProcess, putnamSections } from '../../src/data/putnam';
import * as un from '../../src/data/unete';
import * as ct from '../../src/data/contacto';
import { notas, noticiasPage } from '../../src/data/noticias';
import * as en from './seed.en';

const client = getCliClient({ apiVersion: '2026-09-01' });
const root = resolve(process.cwd(), '..');

const loc = (es: string, en?: string | null) => ({ es, ...(en ? { en } : {}) });
const key = (index: number) => `k${index}`;

// Assets: remote mocks are fetched, local ones read from src/assets. Cached per source so
// a URL reused across pages uploads once (Sanity also dedupes by content hash).
const uploaded = new Map<string, string>();
const uploadImage = async (source: string) => {
  if (uploaded.has(source)) return uploaded.get(source)!;
  const remote = source.startsWith('http');
  const bytes = remote ? Buffer.from(await (await fetch(source)).arrayBuffer()) : await readFile(resolve(root, 'src/assets', source));
  const filename = remote ? `${new URL(source).pathname.split('/').pop()}.jpg` : source;
  const asset = await client.assets.upload('image', bytes, { filename, source: { name: 'seed', id: source } });
  console.log(`  asset ${asset._id} ← ${source}`);
  uploaded.set(source, asset._id);
  return asset._id;
};
const image = async (source: string, altEs: string, altEn?: string) => ({
  _type: 'localeImage',
  asset: { _type: 'reference', _ref: await uploadImage(source) },
  alt: loc(altEs, altEn),
  decorative: false,
});

const monthIndex: Record<string, string> = { Ene: '01', Feb: '02', Mar: '03', Abr: '04', May: '05', Jun: '06', Jul: '07', Ago: '08', Sep: '09', Oct: '10', Nov: '11', Dic: '12' };
const isoDate = (date: string) => { const [d, m, y] = date.split(' '); return `${y}-${monthIndex[m]}-${d}`; };

const run = async () => {
  const docs: Record<string, unknown>[] = [];

  // Site settings (contact data used by header, footer and every CTA).
  docs.push({
    _id: 'siteSettings', _type: 'siteSettings',
    city: contact.city, email: contact.email, phone: contact.phone,
    whatsappMessage: loc(decodeURIComponent(new URL(contact.whatsapp).searchParams.get('text') ?? ''), en.settings.whatsappMessage),
    address: contact.address, hours: loc(contact.hours, en.settings.hours), hoursShort: loc(contact.hoursShort, en.settings.hoursShort),
    responseTime: contact.responseTime, mapsUrl: contact.mapsUrl,
    coordinates: { _type: 'geopoint', lat: contact.coordinates.latitude, lng: contact.coordinates.longitude },
  });

  // Home scenes.
  docs.push({
    _id: 'home', _type: 'home',
    scenes: await Promise.all(homePanels.map(async (panel, i) => ({
      _key: key(i), id: panel.id, title: loc(panel.title, en.home.scenes[panel.id]),
      image: await image(panel.image, panel.alt, en.home.alts[panel.id]),
    }))),
  });

  // Ereditá.
  docs.push({
    _id: 'eredita', _type: 'eredita',
    hero: { kicker: loc(erediteHero.kicker, en.eredita.hero.kicker), title: loc(erediteHero.title, en.eredita.hero.title), sub: loc(erediteHero.sub, en.eredita.hero.sub), poster: await image(erediteHero.poster, erediteHero.alt, en.eredita.hero.alt) },
    intro: {
      kicker: loc(erediteIntro.eyebrow, en.eredita.intro.eyebrow), title: loc(erediteIntro.title, en.eredita.intro.title), lead: loc(erediteIntro.lead, en.eredita.intro.lead),
      bullets: erediteIntro.bullets.map((b, i) => ({ _key: key(i), _type: 'localeString', ...loc(b, en.eredita.intro.bullets[i]) })),
      facts: erediteIntro.facts.map((f, i) => ({ _key: key(i), _type: 'labelValue', label: loc(f.label, en.eredita.intro.facts[i][0]), value: loc(f.value, en.eredita.intro.facts[i][1]) })),
    },
    gallery: {
      kicker: loc(erediteSections.gallery.kicker, en.eredita.gallery.kicker), title: loc(erediteSections.gallery.title, en.eredita.gallery.title),
      items: await Promise.all(erediteGallery.map(async (item, i) => ({ _key: key(i), image: await image(item.src, item.alt, en.eredita.gallery.alts[i]), tag: loc(item.tag, en.eredita.gallery.tags[item.tag]) }))),
    },
    typologies: {
      kicker: loc(erediteSections.typologies.kicker, en.eredita.typologies.kicker), title: loc(erediteSections.typologies.title, en.eredita.typologies.title), intro: loc(erediteSections.typologies.intro, en.eredita.typologies.intro),
      items: await Promise.all(erediteTypologies.map(async (item, i) => {
        const t = en.eredita.typologies.items[item.id];
        return {
          _key: key(i), id: { _type: 'slug', current: item.id }, tag: loc(item.tag, en.eredita.typologies.tags[item.tag]), tone: item.tone,
          title: loc(item.title, t.title), subtitle: loc(item.subtitle, t.subtitle), image: await image(item.image, item.alt, t.alt), description: loc(item.description, t.description),
          specs: item.specs.map((s, j) => ({ _key: key(j), _type: 'labelValue', label: loc(s.key, t.specs[j][0]), value: loc(s.val, t.specs[j][1]) })),
        };
      })),
    },
    legal: { kicker: loc(erediteLegalDocs.eyebrow, en.eredita.legal.eyebrow), title: loc(erediteLegalDocs.title, en.eredita.legal.title), lead: loc(erediteLegalDocs.lead, en.eredita.legal.lead) },
    cta: { kicker: loc(erediteSections.cta.kicker, en.eredita.cta.kicker), title: loc(erediteSections.cta.title, en.eredita.cta.title) },
  });

  // Legal documents: four placeholders without a file (cards read "Próximamente").
  erediteLegalDocs.docs.forEach((doc, i) => docs.push({
    _id: `documentoLegal.${i + 1}`, _type: 'documentoLegal', order: i + 1,
    title: loc(doc.title, en.eredita.legal.docs[i][0]), description: loc(doc.text, en.eredita.legal.docs[i][1]),
  }));

  // Putnam.
  docs.push({
    _id: 'putnam', _type: 'putnam',
    hero: { kicker: loc(putnamIntro.eyebrow, en.putnam.hero.kicker), title: loc(putnamHero.title, en.putnam.hero.title), lead: loc(putnamHero.lead, en.putnam.hero.lead), image: await image(putnamEditorialImage.src, putnamEditorialImage.alt, en.putnam.hero.alt) },
    process: {
      kicker: loc(putnamSections.process.kicker, en.putnam.process.kicker),
      steps: await Promise.all(putnamProcess.map(async (step, i) => {
        const [title, text, alt] = en.putnam.process.steps[step.number];
        return { _key: key(i), number: step.number, title: loc(step.title, title), text: loc(step.text, text), ...(step.image ? { image: await image(step.image, step.alt, alt) } : {}) };
      })),
    },
    principles: {
      kicker: loc(putnamSections.principles.kicker, en.putnam.principles.kicker), title: loc(putnamSections.principles.title, en.putnam.principles.title),
      mission: { label: loc(putnamPrinciples.mission.label, en.putnam.principles.mission[0]), title: loc(putnamPrinciples.mission.title, en.putnam.principles.mission[1]), text: loc(putnamPrinciples.mission.text, en.putnam.principles.mission[2]) },
      vision: { label: loc(putnamPrinciples.vision.label, en.putnam.principles.vision[0]), title: loc(putnamPrinciples.vision.title, en.putnam.principles.vision[1]), text: loc(putnamPrinciples.vision.text, en.putnam.principles.vision[2]) },
      valuesLabel: loc(putnamSections.principles.valuesLabel, en.putnam.principles.valuesLabel), valuesTitle: loc(putnamSections.principles.valuesTitle, en.putnam.principles.valuesTitle),
      values: putnamPrinciples.values.map((v, i) => ({ _key: key(i), _type: 'localeString', ...loc(v, en.putnam.principles.values[i]) })),
    },
    differences: {
      kicker: loc(putnamSections.differences.kicker, en.putnam.differences.kicker), title: loc(putnamSections.differences.title, en.putnam.differences.title),
      items: putnamDifferences.map((item, i) => ({ _key: key(i), number: item.number, title: loc(item.title, en.putnam.differences.items[item.number][0]), text: loc(item.text, en.putnam.differences.items[item.number][1]) })),
    },
    cta: { kicker: loc(putnamSections.cta.kicker, en.putnam.cta.kicker), title: loc(putnamSections.cta.title, en.putnam.cta.title) },
  });

  // Únete.
  const pairs = (items: readonly { title: string; text: string }[], enItems: [string, string][]) => items.map((item, i) => ({ _key: key(i), _type: 'titledItem', title: loc(item.title, enItems[i][0]), text: loc(item.text, enItems[i][1]) }));
  docs.push({
    _id: 'unete', _type: 'unete',
    hero: { kicker: loc(un.hero.kicker, en.unete.hero.kicker), title: loc(un.hero.title, en.unete.hero.title), lead: loc(un.hero.lead, en.unete.hero.lead), meta: un.hero.meta.map((m, i) => ({ _key: key(i), _type: 'localeString', ...loc(m, en.unete.hero.meta[i]) })), image: await image('unete-hero.jpg', 'Equipo de obra sobre la losa de un proyecto en construcción', en.unete.hero.alt) },
    culture: { kicker: loc(un.culture.kicker, en.unete.culture.kicker), title: loc(un.culture.title, en.unete.culture.title), text: loc(un.culture.text, en.unete.culture.text), traits: pairs(un.culture.traits, en.unete.culture.traits) },
    profile: { kicker: loc(un.profile.kicker, en.unete.profile.kicker), title: loc(un.profile.title, en.unete.profile.title), text: loc(un.profile.text, en.unete.profile.text), values: pairs(un.profile.values, en.unete.profile.values), kpis: un.profile.kpis.map((k, i) => ({ _key: key(i), _type: 'labelValue', label: loc(k.label, en.unete.profile.kpis[i][1]), value: loc(k.value, en.unete.profile.kpis[i][0]) })) },
    openings: { kicker: loc(un.openings.kicker, en.unete.openings.kicker), title: loc(un.openings.title, en.unete.openings.title), text: loc(un.openings.text, en.unete.openings.text), emptyKicker: loc(un.openings.emptyKicker, en.unete.openings.emptyKicker), emptyTitle: loc(un.openings.emptyTitle, en.unete.openings.emptyTitle), emptyText: un.openings.emptyText.map((p, i) => ({ _key: key(i), _type: 'localeText', ...loc(p, en.unete.openings.emptyText[i]) })), cta: loc(un.openings.cta, en.unete.openings.cta) },
    process: { kicker: loc(un.process.kicker, en.unete.process.kicker), title: loc(un.process.title, en.unete.process.title), text: loc(un.process.text, en.unete.process.text), steps: pairs(un.process.steps, en.unete.process.steps) },
    spontaneous: { kicker: loc(un.spontaneous.kicker, en.unete.spontaneous.kicker), title: loc(un.spontaneous.title, en.unete.spontaneous.title), text: loc(un.spontaneous.text, en.unete.spontaneous.text), fields: un.spontaneous.fields.map((f, i) => ({ _key: key(i), _type: 'localeString', ...loc(f, en.unete.spontaneous.fields[f]) })) },
    apply: { kicker: loc(un.apply.kicker, en.unete.apply.kicker), title: loc(un.apply.title, en.unete.apply.title), text: loc(un.apply.text, en.unete.apply.text) },
    mail: { body: loc(decodeURIComponent(new URL(un.profileMailto('x')).searchParams.get('body') ?? ''), en.unete.mail.body), whatsapp: loc(decodeURIComponent(new URL(un.profileWhatsapp).searchParams.get('text') ?? ''), en.unete.mail.whatsapp) },
  });

  // Contacto.
  docs.push({
    _id: 'contacto', _type: 'contacto',
    hero: { kicker: loc(ct.contactoHero.kicker, en.contacto.hero.kicker), title: loc(ct.contactoHero.title, en.contacto.hero.title), lead: loc(ct.contactoHero.lead, en.contacto.hero.lead), image: await image('contacto-hero.jpg', 'Interior residencial de un proyecto Putnam', en.contacto.hero.alt) },
    channels: { kicker: loc(ct.contactoChannels.kicker, en.contacto.channels.kicker), title: loc(ct.contactoChannels.title, en.contacto.channels.title), text: loc(ct.contactoChannels.text, en.contacto.channels.text), kpis: ct.contactoChannels.kpis.map((k, i) => ({ _key: key(i), ...(k.value ? { value: k.value } : {}), label: loc(k.label, en.contacto.channels.kpis[i]) })) },
    reasons: { kicker: loc(ct.contactoReasons.kicker, en.contacto.reasons.kicker), title: loc(ct.contactoReasons.title, en.contacto.reasons.title), items: ct.contactoReasons.items.map((r, i) => ({ _key: key(i), tag: loc(r.tag, en.contacto.reasons.items[i][0]), title: loc(r.title, en.contacto.reasons.items[i][1]), text: loc(r.text, en.contacto.reasons.items[i][2]), cta: loc(r.cta, en.contacto.reasons.items[i][3]), target: r.href === 'whatsapp' ? 'whatsapp' : 'form' })) },
    location: { kicker: loc(ct.contactoLocation.kicker, en.contacto.location.kicker), title: loc(ct.contactoLocation.title, en.contacto.location.title), text: loc(ct.contactoLocation.text, en.contacto.location.text) },
    form: { kicker: loc(ct.contactoForm.kicker, en.contacto.form.kicker), title: loc(ct.contactoForm.title, en.contacto.form.title), text: loc(ct.contactoForm.text('{responseTime}'), en.contacto.form.text) },
    cta: { kicker: loc(ct.contactoCta.kicker, en.contacto.cta.kicker), title: loc(ct.contactoCta.title, en.contacto.cta.title), text: loc(ct.contactoCta.text, en.contacto.cta.text) },
  });

  // Noticias: index page copy + one document per note and language, linked by metadata.
  docs.push({
    _id: 'noticias', _type: 'noticias',
    hero: { kicker: loc(noticiasPage.hero.kicker, en.noticias.hero.kicker), title: loc(noticiasPage.hero.title, en.noticias.hero.title), lead: loc(noticiasPage.hero.lead, en.noticias.hero.lead), image: await image('contacto-hero.jpg', 'Interior residencial de un proyecto Putnam', en.noticias.hero.alt) },
    index: { kicker: loc(noticiasPage.index.kicker, en.noticias.index.kicker), title: loc(noticiasPage.index.title, en.noticias.index.title), archive: noticiasPage.index.archive },
    empty: { title: loc('Aún no hay notas publicadas.', en.noticias.empty.title), text: loc('Estamos preparando las primeras notas. Vuelve pronto.', en.noticias.empty.text) },
    cta: { kicker: loc(noticiasPage.cta.kicker, en.noticias.cta.kicker), title: loc(noticiasPage.cta.title, en.noticias.cta.title), text: loc(noticiasPage.cta.text, en.noticias.cta.text) },
  });
  for (const nota of notas) {
    const es = { _id: `nota.${nota.slug}`, _type: 'nota', language: 'es', title: nota.title, slug: { _type: 'slug', current: nota.slug }, date: isoDate(nota.date), category: nota.category, tags: nota.tags, excerpt: nota.excerpt, readTime: nota.readTime };
    const tr = en.noticias.notas[nota.slug];
    const enDoc = { _id: `nota.${nota.slug}.en`, _type: 'nota', language: 'en', title: tr.title, slug: { _type: 'slug', current: tr.slug }, date: isoDate(nota.date), category: tr.category, tags: tr.tags, excerpt: tr.excerpt, readTime: tr.readTime };
    docs.push(es, enDoc, {
      _id: `translation.${nota.slug}`, _type: 'translation.metadata', schemaTypes: ['nota'],
      translations: [es, enDoc].map((doc) => ({ _key: doc.language, _type: 'internationalizedArrayReferenceValue', language: doc.language, value: { _type: 'reference', _ref: doc._id } })),
    });
  }

  console.log(`\nWriting ${docs.length} documents…`);
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc as never), client.transaction());
  await tx.commit();
  console.log('Seed complete.');
};

run().catch((error) => { console.error(error); process.exit(1); });
