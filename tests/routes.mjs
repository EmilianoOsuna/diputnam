// Every route the suites visit: the static route table plus the Ereditá project pages,
// discovered from dist/ (the same source the sitemap is checked against) because their
// slugs come from the CMS, not from code.
import { readdir } from 'node:fs/promises';
import { pages, projectPath, routes as siteRoutes } from '../src/i18n/routes.ts';

const dist = process.env.DIST_DIR ?? 'dist';
const slugsIn = async (dir) => (await readdir(dir, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const [es, en] = await Promise.all([slugsIn(`${dist}${pages.eredita.es}`), slugsIn(`${dist}${pages.eredita.en}`)]);

export const projectSlugs = es.filter((slug) => en.includes(slug)).sort();
// `{ es, en }` pairs, same shape as the entries of `pages`.
export const projectPairs = Object.fromEntries(projectSlugs.map((slug) => [`eredita/${slug}`, { es: projectPath('es', slug), en: projectPath('en', slug) }]));
export const projectRoutes = Object.values(projectPairs).flatMap((pair) => [pair.es, pair.en]);
export const routes = [...siteRoutes, ...projectRoutes];
