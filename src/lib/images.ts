// Content images come from the Sanity image CDN: width/quality per breakpoint, automatic
// modern format; `rect` (editor crop) survives. The tonal treatment is a CSS `filter` on
// the <img> (see `saturation`): Sanity's CDN only accepts `sat=-100`, never partial values.
import type { CmsImage } from './content';

// On Vercel the image CDN is proxied through the site's own origin (`/cdn/images/*` rewrite
// in vercel.json), so the hero image rides the connection already open for the HTML instead
// of paying DNS + TCP + TLS to cdn.sanity.io first — the difference between 99 and 100 in
// PageSpeed's mobile simulation, which ignores `preconnect`. Social previews (`ogUrl`) keep
// the absolute CDN URL: bots need an absolute address. Local builds hit the CDN directly.
const CDN_IMAGES = 'https://cdn.sanity.io/images/';
export const proxiedCdn = process.env.VERCEL === '1';
const viaProxy = (url: string) => (proxiedCdn && url.startsWith(CDN_IMAGES) ? `/cdn/images/${url.slice(CDN_IMAGES.length)}` : url);

export const remoteImage = (src: string, width: number, quality: number) => {
  const url = new URL(src);
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality));
  url.searchParams.set('auto', 'format');
  return viaProxy(url.toString().replaceAll('%2C', ','));
};

export const remoteSrcset = (src: string, widths: readonly number[], quality: number) =>
  widths.map((width) => `${remoteImage(src, width, quality)} ${width}w`).join(', ');

// ponytail: per-image CSS saturate; bake it into the assets at seed/upload time if test:perf flags it.
export const saturation = (sat: number) => (sat ? `filter: saturate(${(1 + sat / 100).toFixed(2)})` : '');

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

// Social preview (1200×630): the CDN crops around the hotspot; the editor crop is kept.
// Bots do not send `Accept: image/webp`, so `auto=format` delivers JPEG to them.
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
export const ogUrl = (image: Pick<CmsImage, 'url' | 'width' | 'height' | 'crop' | 'hotspot'>) => {
  const url = new URL(imageSrc(image));
  url.searchParams.set('w', String(OG_WIDTH));
  url.searchParams.set('h', String(OG_HEIGHT));
  url.searchParams.set('fit', 'crop');
  if (image.hotspot) {
    url.searchParams.set('crop', 'focalpoint');
    url.searchParams.set('fp-x', image.hotspot.x.toFixed(3));
    url.searchParams.set('fp-y', image.hotspot.y.toFixed(3));
  }
  url.searchParams.set('q', '80');
  url.searchParams.set('auto', 'format');
  return url.toString().replaceAll('%2C', ',');
};

export const altOf = (image: Pick<CmsImage, 'alt' | 'decorative'>) => (image.decorative ? '' : image.alt);

export const HERO_WIDTHS = [640, 960, 1280, 1600, 2000] as const;
export const CARD_WIDTHS = [480, 640, 800, 960, 1200] as const;

// `sat` in percent points, as the CSS filters were: saturate(0.78) → -22, saturate(0.65) → -35,
// saturate(0.62) → -38, saturate(0.85) → -15, saturate(0.92) → -8.
export const SAT = { panel: -22, hero: -35, process: -38, card: -15, gallery: -8 } as const;
