// Route map per locale. Spanish is unprefixed; English slugs are translated where the
// slug is a word. Header links, hreflang pairs, the language switch and the Playwright
// route lists all derive from this table so a new page is added in exactly one place.
export const locales = ['es', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'es';

export const pages = {
  home: { es: '/', en: '/en/' },
  eredita: { es: '/eredita/', en: '/en/eredita/' },
  putnam: { es: '/putnam/', en: '/en/putnam/' },
  noticias: { es: '/noticias/', en: '/en/news/' },
  unete: { es: '/unete/', en: '/en/join/' },
  contacto: { es: '/contacto/', en: '/en/contact/' },
} as const;
export type PageKey = keyof typeof pages;

export const notaPath = (lang: Lang, slug: string) => `${pages.noticias[lang]}${slug}/`;
// Ereditá projects share their slug across languages, so the pair is always derivable.
export const projectPath = (lang: Lang, slug: string) => `${pages.eredita[lang]}${slug}/`;

export const otherLang = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');

// Every static route the site publishes, in audit order (Spanish first, then English).
export const routes: string[] = locales.flatMap((lang) => (Object.keys(pages) as PageKey[]).map((key) => pages[key][lang]));
