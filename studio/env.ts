const read = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Studio: missing ${name} (copy studio/.env.example to studio/.env)`);
  return value;
};

export const projectId = read('SANITY_STUDIO_PROJECT_ID');
export const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';
export const apiVersion = '2026-09-01';
