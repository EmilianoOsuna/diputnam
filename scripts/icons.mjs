// Site icons and web manifest from the vector mark (public/favicon.svg, see
// trace-mark.mjs). Run after the mark or the palette changes:
//
//   node scripts/icons.mjs
import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const MARK = 'public/favicon.svg';
const CREAM = '#f4eedf';
const cream = { r: 0xf4, g: 0xee, b: 0xdf, alpha: 1 };

// The mark rendered inside a square canvas; `inset` is the fraction of padding per side.
const render = async (size, { inset, background }) => {
  const markSize = Math.round(size * (1 - inset * 2));
  const mark = await sharp(await readFile(MARK), { density: 72 * (size / 800) * 4 }).resize(markSize, markSize).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: mark, gravity: 'centre' }]).png({ compressionLevel: 9 }).toBuffer();
};

// An .ico may embed a PNG directly (Vista+); one 32 px entry is all browsers ask for.
const ico = (png, size) => {
  const header = Buffer.alloc(6 + 16);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header.writeUInt8(size === 256 ? 0 : size, 6); header.writeUInt8(size === 256 ? 0 : size, 7);
  header.writeUInt8(0, 8); header.writeUInt8(0, 9); header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
};

await mkdir('public/icons', { recursive: true });
await writeFile('public/favicon.ico', ico(await render(32, { inset: 0.02 }), 32));
// iOS squares the corners itself; opaque background so the mark never sits on black.
await writeFile('public/apple-touch-icon.png', await render(180, { inset: 0.12, background: cream }));
// Android/PWA icons: safe zone for maskable rendering is the inner 80 %.
await writeFile('public/icons/icon-192.png', await render(192, { inset: 0.15, background: cream }));
await writeFile('public/icons/icon-512.png', await render(512, { inset: 0.15, background: cream }));

const manifest = {
  name: 'Putnam', short_name: 'Putnam', lang: 'es', start_url: '/', display: 'browser',
  background_color: CREAM, theme_color: CREAM,
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
};
await writeFile('public/site.webmanifest', `${JSON.stringify(manifest, null, 2)}\n`);
console.log('icons: favicon.ico, apple-touch-icon.png, icons/icon-192.png, icons/icon-512.png, site.webmanifest');
