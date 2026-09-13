// Every query the site runs, one function per page. Localized fields are resolved in
// GROQ (`coalesce(field[$lang], field.es)`) so views receive plain, already-localized
// values and never branch on language.
import { sanityFetch } from './sanity.ts';
import type { Lang } from '../i18n/routes.ts';

export interface CmsImage { url: string; width: number; height: number; alt: string; decorative: boolean; crop?: { top: number; bottom: number; left: number; right: number }; hotspot?: { x: number; y: number; width: number; height: number } }
export interface Pair { label: string; value: string }
export interface Titled { title: string; text: string }
export interface Heading { kicker: string; title: string; text?: string }

// `lang` is one of the two route-table locales, so it is interpolated as a literal:
// `coalesce(field.en, field.es)` for English, `field.es` for Spanish.
const projections = (lang: Lang) => {
  const loc = (path: string) => (lang === 'es' ? `${path}.es` : `coalesce(${path}.en, ${path}.es)`);
  const l = (field: string) => `"${field}": ${loc(field)}`;
  const img = (field: string) => `"${field}": ${field}{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, crop, hotspot, ${l('alt')}, decorative }`;
  const heading = (extra = '') => `${l('kicker')}, ${l('title')}, ${l('text')}${extra ? `, ${extra}` : ''}`;
  const pairs = (field: string) => `"${field}": ${field}[]{ ${l('label')}, ${l('value')} }`;
  const titled = (field: string) => `"${field}": ${field}[]{ ${l('title')}, ${l('text')} }`;
  const strings = (field: string) => `"${field}": ${field}[]{ "v": ${loc('@')} }.v`;
  return { l, img, heading, pairs, titled, strings };
};

export interface Settings { city: string; email: string; phone: string; whatsapp: string; whatsappNumber: string; address: string; hours: string; hoursShort: string; responseTime: string; mapsUrl: string; coordinates: { lat: number; lng: number } }
export const getSettings = async (lang: Lang): Promise<Settings> => {
  const { l } = projections(lang);
  const s = await sanityFetch<Omit<Settings, 'whatsapp' | 'whatsappNumber'> & { whatsappMessage: string }>(`*[_id == "siteSettings"][0]{ city, email, phone, ${l('whatsappMessage')}, address, ${l('hours')}, ${l('hoursShort')}, responseTime, mapsUrl, coordinates }`, { lang });
  if (!s) throw new Error('Sanity: siteSettings is missing (run the seed)');
  const whatsappNumber = s.phone.replace(/\D/g, '');
  return { ...s, whatsappNumber, whatsapp: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(s.whatsappMessage ?? '')}` };
};

export interface HomeScene { id: 'inicio' | 'eredita' | 'putnam' | 'contacto'; title: string; image: CmsImage }
export const getHome = (lang: Lang) => { const { l, img } = projections(lang); return sanityFetch<{ scenes: HomeScene[] }>(`*[_id == "home"][0]{ scenes[]{ id, ${l('title')}, ${img('image')} } }`, { lang }); };

export interface Eredita {
  hero: { kicker: string; title: string; sub: string; poster: CmsImage; video: string | null };
  intro: { kicker: string; title: string; lead: string; bullets: string[]; facts: Pair[] };
  gallery: Heading & { items: { image: CmsImage; tag: string }[] };
  typologies: Heading & { intro: string; items: { id: string; tag: string; tone: string; title: string; subtitle: string; image: CmsImage; description: string; specs: Pair[] }[] };
  legal: { kicker: string; title: string; lead: string };
  cta: Heading;
}
export const getEredita = (lang: Lang) => { const { l, img, heading, pairs, strings } = projections(lang); return sanityFetch<Eredita>(`*[_id == "eredita"][0]{
  hero{ ${l('kicker')}, ${l('title')}, ${l('sub')}, ${img('poster')}, "video": video.asset->url },
  intro{ ${l('kicker')}, ${l('title')}, ${l('lead')}, ${strings('bullets')}, ${pairs('facts')} },
  gallery{ ${heading()}, items[]{ ${img('image')}, ${l('tag')} } },
  typologies{ ${heading(l('intro'))}, items[]{ "id": id.current, ${l('tag')}, tone, ${l('title')}, ${l('subtitle')}, ${img('image')}, ${l('description')}, ${pairs('specs')} } },
  legal{ ${l('kicker')}, ${l('title')}, ${l('lead')} },
  cta{ ${heading()} }
}`, { lang }); };

export interface LegalDoc { title: string; description: string; file: { url: string; size: number } | null; version: string | null; validFrom: string | null }
export const getLegalDocs = (lang: Lang) => { const { l } = projections(lang); return sanityFetch<LegalDoc[]>(`*[_type == "documentoLegal"] | order(order asc){ ${l('title')}, ${l('description')}, "file": select(defined(file.asset) => { "url": file.asset->url, "size": file.asset->size }, null), version, validFrom }`, { lang }); };

export interface Putnam {
  hero: { kicker: string; title: string; lead: string; image: CmsImage };
  process: { kicker: string; steps: { number: string; title: string; text: string; image: CmsImage | null }[] };
  principles: Heading & { mission: Pair & { text: string; title: string }; vision: Pair & { text: string; title: string }; valuesLabel: string; valuesTitle: string; values: string[] };
  differences: Heading & { items: { number: string; title: string; text: string }[] };
  cta: Heading;
}
export const getPutnam = (lang: Lang) => { const { l, img, heading, strings } = projections(lang); return sanityFetch<Putnam>(`*[_id == "putnam"][0]{
  hero{ ${l('kicker')}, ${l('title')}, ${l('lead')}, ${img('image')} },
  process{ ${l('kicker')}, steps[]{ number, ${l('title')}, ${l('text')}, ${img('image')} } },
  principles{ ${heading()}, mission{ ${l('label')}, ${l('title')}, ${l('text')} }, vision{ ${l('label')}, ${l('title')}, ${l('text')} }, ${l('valuesLabel')}, ${l('valuesTitle')}, ${strings('values')} },
  differences{ ${heading()}, items[]{ number, ${l('title')}, ${l('text')} } },
  cta{ ${heading()} }
}`, { lang }); };

export interface Unete {
  hero: { kicker: string; title: string; lead: string; meta: string[]; image: CmsImage };
  culture: Heading & { traits: Titled[] };
  profile: Heading & { values: Titled[]; kpis: Pair[] };
  openings: Heading & { emptyKicker: string; emptyTitle: string; emptyText: string[]; cta: string };
  process: Heading & { steps: Titled[] };
  spontaneous: Heading & { fields: string[] };
  apply: Heading;
  mail: { body: string; whatsapp: string };
}
export const getUnete = (lang: Lang) => { const { l, img, heading, pairs, titled, strings } = projections(lang); return sanityFetch<Unete>(`*[_id == "unete"][0]{
  hero{ ${l('kicker')}, ${l('title')}, ${l('lead')}, ${strings('meta')}, ${img('image')} },
  culture{ ${heading()}, ${titled('traits')} },
  profile{ ${heading()}, ${titled('values')}, ${pairs('kpis')} },
  openings{ ${heading()}, ${l('emptyKicker')}, ${l('emptyTitle')}, ${strings('emptyText')}, ${l('cta')} },
  process{ ${heading()}, ${titled('steps')} },
  spontaneous{ ${heading()}, ${strings('fields')} },
  apply{ ${heading()} },
  mail{ ${l('body')}, ${l('whatsapp')} }
}`, { lang }); };

export interface Contacto {
  hero: { kicker: string; title: string; lead: string; image: CmsImage };
  channels: Heading & { kpis: { value: string | null; label: string }[] };
  reasons: Heading & { items: { tag: string; title: string; text: string; cta: string; target: 'whatsapp' | 'form' }[] };
  location: Heading;
  form: Heading;
  cta: Heading;
}
export const getContacto = (lang: Lang) => { const { l, img, heading } = projections(lang); return sanityFetch<Contacto>(`*[_id == "contacto"][0]{
  hero{ ${l('kicker')}, ${l('title')}, ${l('lead')}, ${img('image')} },
  channels{ ${heading()}, kpis[]{ value, ${l('label')} } },
  reasons{ ${heading()}, items[]{ ${l('tag')}, ${l('title')}, ${l('text')}, ${l('cta')}, target } },
  location{ ${heading()} }, form{ ${heading()} }, cta{ ${heading()} }
}`, { lang }); };

export interface NoticiasPage { hero: { kicker: string; title: string; lead: string; image: CmsImage }; index: Heading & { archive: string }; empty: { title: string; text: string }; cta: Heading }
export const getNoticiasPage = (lang: Lang) => { const { l, img, heading } = projections(lang); return sanityFetch<NoticiasPage>(`*[_id == "noticias"][0]{
  hero{ ${l('kicker')}, ${l('title')}, ${l('lead')}, ${img('image')} },
  index{ ${heading('archive')} }, empty{ ${l('title')}, ${l('text')} }, cta{ ${heading()} }
}`, { lang }); };

export interface NotaImage { url: string; width: number; height: number; alt: string | null; crop?: CmsImage['crop']; hotspot?: CmsImage['hotspot'] }
export interface Nota { title: string; slug: string; date: string; category: string; tags: string[]; excerpt: string; readTime: string | null; image: NotaImage | null; body: unknown[] | null; translation: { slug: string } | null }
const notaFields = `title, "slug": slug.current, date, category, "tags": coalesce(tags, []), excerpt, readTime,
  "image": image{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, crop, hotspot, alt },
  body[]{ ..., _type == "image" => { "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height } },
  "translation": *[_type == "translation.metadata" && references(^._id)][0].translations[language != $lang][0].value->{ "slug": slug.current }`;
export const getNotas = (lang: Lang) => sanityFetch<Nota[]>(`*[_type == "nota" && language == $lang && defined(slug.current)] | order(date desc){ ${notaFields} }`, { lang });
export const getNota = (lang: Lang, slug: string) => sanityFetch<Nota | null>(`*[_type == "nota" && language == $lang && slug.current == $slug][0]{ ${notaFields} }`, { lang, slug });
