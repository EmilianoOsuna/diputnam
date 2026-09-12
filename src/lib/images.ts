// Remote image variants (Unsplash + Contentful Images API): width/quality per breakpoint, modern format.
export const remoteImage = (src: string, width: number, quality: number) => {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality));
  if (url.hostname === 'images.ctfassets.net') {
    url.searchParams.set('fm', 'webp');
    url.searchParams.delete('fl');
  }
  return url.toString();
};

export const remoteSrcset = (src: string, widths: readonly number[], quality: number) =>
  widths.map((width) => `${remoteImage(src, width, quality)} ${width}w`).join(', ');

export const HERO_WIDTHS = [640, 960, 1280, 1600, 2000] as const;
export const CARD_WIDTHS = [480, 720, 960, 1200] as const;
