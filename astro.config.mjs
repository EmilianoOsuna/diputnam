import { defineConfig } from 'astro/config';

export default defineConfig({
  // Canonical origin. Fixed on purpose: a preview on workers.dev must canonicalize to
  // production, never to itself (see openspec seo-geo-foundation, D1).
  site: 'https://diputnam.com',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' },
  // Spanish keeps the unprefixed routes; English lives under /en/ with its own slugs
  // (see src/i18n/routes.ts). Page files are one-liners per locale over src/views/.
  i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: false } },
});
