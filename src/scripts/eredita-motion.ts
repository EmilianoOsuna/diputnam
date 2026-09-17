import { mountHorizontalTrack } from './horizontal-track';
import { mountTypologyMedia } from './typology-media';
import { mountAnchors, mountReveals, releaseTitles, settleLines, splitTitles } from './mobile-motion';

const root = document.querySelector<HTMLElement>('[data-eredita]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones get the CSS/IntersectionObserver runtime; the Lenis/GSAP engine is desktop-only
// and loaded on demand. Crossing the breakpoint after load needs a reload.
const desktop = window.matchMedia('(min-width: 768px)').matches;
let motion: { refresh: () => void } | null = null;

// Typology media (video + renders) within each panel: independent of GSAP/reduced motion,
// so it keeps working even when every animation is off. The sticky media stage/pin is
// desktop-only motion (see desktop/eredita.ts); mobile keeps each typology's media in place.
if (root) mountTypologyMedia(root);

// Mobile typologies: native swipe track with the shared counter/rail. The description and
// specs <details> ship open (desktop shows everything) and are closed here so the medium
// stays the dominant element; they reopen if the viewport crosses back to desktop.
if (root) {
  const track = root.querySelector<HTMLElement>('[data-h-track]');
  const details = Array.from(root.querySelectorAll<HTMLDetailsElement>('details.ed-h-more'));
  const mobile = window.matchMedia('(max-width: 899px)');
  let unmount: (() => void) | null = null;
  const sync = () => {
    if (mobile.matches && track && !unmount) {
      details.forEach((item) => { item.open = false; });
      unmount = mountHorizontalTrack({
        track,
        cards: Array.from(track.querySelectorAll<HTMLElement>('[data-h-panel]')),
        current: root.querySelector<HTMLElement>('[data-pin-current]'),
        rail: root.querySelector<HTMLElement>('[data-pin-rail]'),
        label: 'Tipología',
        reducedMotion,
      });
    } else if (!mobile.matches && unmount) {
      unmount();
      unmount = null;
      details.forEach((item) => { item.open = true; });
    }
    motion?.refresh();
  };
  sync();
  mobile.addEventListener('change', sync);
}

// Gallery lightbox: click a photo to view it full-screen; close via the × button, the
// backdrop or Escape.
const gallery = root?.querySelector<HTMLElement>('.ed-masonry');
if (gallery) {
  const overlay = document.createElement('div');
  overlay.className = 'ed-lightbox';
  overlay.innerHTML = '<button class="ed-lightbox-close" type="button" aria-label="Cerrar">✕</button><img alt="" />';
  root!.appendChild(overlay);
  const img = overlay.querySelector('img') as HTMLImageElement;
  const close = () => overlay.classList.remove('is-open');
  overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
  overlay.querySelector('.ed-lightbox-close')?.addEventListener('click', close);
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  gallery.addEventListener('click', (event) => {
    const clicked = (event.target as HTMLElement).closest<HTMLImageElement>('.ed-masonry-item img');
    if (!clicked) return;
    img.src = clicked.currentSrc || clicked.src;
    overlay.classList.add('is-open');
  });
}

if (root && !reducedMotion) {
  // Titles are rebuilt as real lines first, so both engines animate the same lines.
  splitTitles(root, settleLines).then(() => {
    if (desktop) {
      import('./desktop/eredita').then(({ mount }) => { motion = mount(root); motion.refresh(); releaseTitles(); });
    } else {
      mountReveals(root, { hero: '.ed-hero' });
      releaseTitles();
      mountAnchors(false);
    }
  });
}
