// Static `process.env.X` accesses: the Studio bundler inlines those at build time,
// a dynamic `process.env[name]` stays undefined in the browser.
const projectIdValue = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectIdValue) throw new Error('Studio: missing SANITY_STUDIO_PROJECT_ID (copy studio/.env.example to studio/.env)');

export const projectId: string = projectIdValue;
export const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
export const apiVersion = '2026-09-01';
