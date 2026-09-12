import { mountAnchors, mountReveals } from './mobile-motion';

const root = document.querySelector<HTMLElement>('[data-noticias]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones get the CSS/IntersectionObserver runtime; the Lenis/GSAP engine is desktop-only
// and loaded on demand. Crossing the breakpoint after load needs a reload.
const desktop = window.matchMedia('(min-width: 768px)').matches;

if (root && !reducedMotion) {
  if (desktop) {
    import('./desktop/noticias').then(({ mount }) => mount(root).refresh());
  } else {
    mountReveals(root, { hero: '.nw-hero' });
    mountAnchors(false);
  }
}
