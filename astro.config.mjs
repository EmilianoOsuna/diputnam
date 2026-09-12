import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'http://localhost:4321',
  build: { inlineStylesheets: 'always' },
});
