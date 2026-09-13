// Content images come from the Sanity image CDN: width/quality per breakpoint, automatic
// modern format, and the tonal treatment (desaturation) baked into the URL so no
// full-screen CSS `filter` is needed at render time. `rect` (editor crop) survives.
import type { CmsImage } from './content';

export const remoteImage = (src: string, width: number, quality: number, sat = 0) => {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality));
  url.searchParams.set('auto', 'format');
  if (sat) url.searchParams.set('sat', String(sat));
  return url.toString().replaceAll('%2C', ',');
};

export const remoteSrcset = (src: string, widths: readonly number[], quality: number, sat = 0) =>
  widths.map((width) => `${remoteImage(src, width, quality, sat)} ${width}w`).join(', ');

// Base URL of a CMS image with the editor's crop applied; width/quality are added per variant.
export const imageSrc = (image: Pick<CmsImage, 'url' | 'width' | 'height' | 'crop'>) => {
  if (!image.crop) return image.url;
  const { left, top, right, bottom } = image.crop;
  const x = Math.round(left * image.width), y = Math.round(top * image.height);
  const w = Math.round((1 - left - right) * image.width), h = Math.round((1 - top - bottom) * image.height);
  return `${image.url}?rect=${x},${y},${w},${h}`;
};

// The hotspot becomes `object-position` on an `object-fit: cover` image, so the
// aspect-ratio crop stays in CSS and srcset candidates keep varying by width only.
export const objectPosition = (image: Pick<CmsImage, 'crop' | 'hotspot'>) => {
  if (!image.hotspot) return undefined;
  const crop = image.crop ?? { left: 0, top: 0, right: 0, bottom: 0 };
  const x = (image.hotspot.x - crop.left) / (1 - crop.left - crop.right);
  const y = (image.hotspot.y - crop.top) / (1 - crop.top - crop.bottom);
  return `object-position: ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%`;
};

export const altOf = (image: Pick<CmsImage, 'alt' | 'decorative'>) => (image.decorative ? '' : image.alt);

export const HERO_WIDTHS = [640, 960, 1280, 1600, 2000] as const;
export const CARD_WIDTHS = [480, 720, 960, 1200] as const;

// `sat` equivalents of the former CSS filters: saturate(0.78) → -22, saturate(0.65) → -35,
// saturate(0.62) → -38, saturate(0.85) → -15, saturate(0.92) → -8.
export const SAT = { panel: -22, hero: -35, process: -38, card: -15, gallery: -8 } as const;
