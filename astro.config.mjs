import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'http://localhost:4321',
  build: { inlineStylesheets: 'always' },
  // Spanish keeps the unprefixed routes; English lives under /en/ with its own slugs
  // (see src/i18n/routes.ts). Page files are one-liners per locale over src/views/.
  i18n: { defaultLocale: 'es', locales: ['es', 'en'], routing: { prefixDefaultLocale: false } },
});
