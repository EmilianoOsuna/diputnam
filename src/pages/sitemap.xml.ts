// Every indexable URL of the site with its language alternates, generated from the
// route table and the CMS on each build. lastmod is the last publish time of the
// document behind each page (never the build date).
import type { APIRoute } from 'astro';
import { locales, notaPath, pages, type Lang, type PageKey } from '../i18n';
import { getNotas, getUpdatedAt } from '../lib/content';
import { absolute } from '../lib/seo';

interface Entry { loc: string; lastmod: string | null; alternates: Partial<Record<Lang, string>> }

// Singleton behind each static page; the home also depends on the site settings.
const documentOf: Record<PageKey, string> = { home: 'home', eredita: 'eredita', putnam: 'putnam', noticias: 'noticias', unete: 'unete', contacto: 'contacto' };

export const GET: APIRoute = async () => {
  const entries: Entry[] = [];
  for (const key of Object.keys(pages) as PageKey[]) {
    const lastmod = await getUpdatedAt(documentOf[key]);
    for (const lang of locales) entries.push({ loc: absolute(pages[key][lang]), lastmod, alternates: { es: absolute(pages[key].es), en: absolute(pages[key].en) } });
  }
  for (const lang of locales) {
    for (const nota of await getNotas(lang)) {
      const other: Lang = lang === 'es' ? 'en' : 'es';
      const alternates: Partial<Record<Lang, string>> = { [lang]: absolute(notaPath(lang, nota.slug)) };
      if (nota.translation) alternates[other] = absolute(notaPath(other, nota.translation.slug));
      entries.push({ loc: alternates[lang]!, lastmod: nota.updatedAt ?? nota.date, alternates });
    }
  }

  const link = (hreflang: string, href: string) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;
  const url = ({ loc, lastmod, alternates }: Entry) => [
    '<url>', `<loc>${loc}</loc>`, lastmod && `<lastmod>${lastmod}</lastmod>`,
    ...locales.map((lang) => alternates[lang] && link(lang, alternates[lang]!)),
    link('x-default', alternates.es ?? loc),
    '</url>',
  ].filter(Boolean).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.map(url).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
