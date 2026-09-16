// Plain-text guide for generative engines (llmstxt.org): who Putnam is, where each page
// lives in both languages and which notes exist. Same sources as the pages.
import type { APIRoute } from 'astro';
import { locales, notaPath, pages, projectPath, t, type PageKey } from '../i18n';
import { getNotas, getProyectos, getSettings } from '../lib/content';
import { absolute } from '../lib/seo';

export const GET: APIRoute = async () => {
  const settings = await getSettings('es');
  const sections = await Promise.all(locales.map(async (lang) => {
    const ui = t(lang);
    // Each Ereditá project is listed under the line's page.
    const projectLines = (await getProyectos(lang)).map((project) => `  - [${project.name}](${absolute(projectPath(lang, project.slug))}): ${project.card.text}`);
    const pageLines = (Object.keys(pages) as PageKey[]).flatMap((key) => [`- [${ui.meta[key].title}](${absolute(pages[key][lang])}): ${ui.meta[key].description}`, ...(key === 'eredita' ? projectLines : [])]);
    const notas = await getNotas(lang);
    const notaLines = notas.map((nota) => `- [${nota.title}](${absolute(notaPath(lang, nota.slug))}) — ${nota.date}: ${nota.excerpt}`);
    const heading = lang === 'es' ? 'Español' : 'English';
    const notesHeading = lang === 'es' ? 'Notas publicadas' : 'Published notes';
    return [`## ${heading}`, '', ...pageLines, '', `### ${notesHeading}`, '', ...(notaLines.length ? notaLines : [lang === 'es' ? '- (sin notas todavía)' : '- (no notes yet)'])].join('\n');
  }));
  const contact = [
    '## Contacto / Contact', '',
    `- Email: ${settings.email}`, `- Teléfono / Phone: ${settings.phone}`, `- ${settings.city} — ${settings.address}`, `- ${settings.hours}`,
    ...settings.organization.sameAs.map((url) => `- ${url}`),
  ].join('\n');
  const body = [`# Putnam`, '', `> ${settings.organization.description}`, '', `> ${(await getSettings('en')).organization.description}`, '', ...sections, '', contact, ''].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
