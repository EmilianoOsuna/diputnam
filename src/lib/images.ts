// Remote image variants (Unsplash + Contentful Images API): width/quality per breakpoint, modern format.
// Tonal treatment (desaturation) is baked into the URL where the CDN supports it so no
// full-screen CSS `filter` is needed at render time. Unsplash (imgix) takes `sat` in
// -100..100; Contentful has no equivalent and is served as is.
export const remoteImage = (src: string, width: number, quality: number, sat = 0) => {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality));
  if (url.hostname === 'images.ctfassets.net') {
    url.searchParams.set('fm', 'webp');
    url.searchParams.delete('fl');
  } else if (sat) {
    url.searchParams.set('sat', String(sat));
  }
  return url.toString();
};

export const remoteSrcset = (src: string, widths: readonly number[], quality: number, sat = 0) =>
  widths.map((width) => `${remoteImage(src, width, quality, sat)} ${width}w`).join(', ');

export const HERO_WIDTHS = [640, 960, 1280, 1600, 2000] as const;
export const CARD_WIDTHS = [480, 720, 960, 1200] as const;

// `sat` equivalents of the former CSS filters: saturate(0.78) → -22, saturate(0.65) → -35,
// saturate(0.62) → -38, saturate(0.85) → -15, saturate(0.92) → -8.
export const SAT = { panel: -22, hero: -35, process: -38, card: -15, gallery: -8 } as const;
