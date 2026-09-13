import { es, type Dictionary } from './es';
import { en } from './en';
import type { Lang } from './routes';

export type { Dictionary } from './es';
export * from './routes';

const dictionaries: Record<Lang, Dictionary> = { es, en };

// The type annotation on `en` catches a missing key in the editor and under `astro
// check`; `astro build` does not type-check, so the key sets are also compared here
// and a mismatch aborts the build with the offending path.
const keyPaths = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key))
    : [prefix];
const reference = new Set(keyPaths(es));
for (const lang of Object.keys(dictionaries) as Lang[]) {
  const paths = new Set(keyPaths(dictionaries[lang]));
  const missing = [...reference].filter((path) => !paths.has(path));
  const extra = [...paths].filter((path) => !reference.has(path));
  if (missing.length || extra.length) {
    throw new Error(`i18n: dictionary "${lang}" ${missing.length ? `is missing ${missing.join(', ')}` : ''}${missing.length && extra.length ? '; ' : ''}${extra.length ? `has unknown ${extra.join(', ')}` : ''}`);
  }
}

export const t = (lang: Lang): Dictionary => dictionaries[lang];

// "09 Mar 2026" in both locales (month abbreviation capitalized, no trailing period).
export const formatDate = (lang: Lang, iso: string) => {
  const date = new Date(`${iso}T00:00:00Z`);
  const parts = new Intl.DateTimeFormat(lang, { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  const month = get('month').replace('.', '');
  return `${get('day')} ${month.charAt(0).toUpperCase()}${month.slice(1)} ${get('year')}`;
};
