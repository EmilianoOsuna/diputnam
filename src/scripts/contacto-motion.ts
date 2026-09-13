import { mountHorizontalTrack } from './horizontal-track';
import { mountAnchors, mountReveals, releaseTitles, settleLines, splitTitles } from './mobile-motion';

const root = document.querySelector<HTMLElement>('[data-contacto]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones get the CSS/IntersectionObserver runtime; the Lenis/GSAP engine is desktop-only
// and loaded on demand. Crossing the breakpoint after load needs a reload.
const desktop = window.matchMedia('(min-width: 768px)').matches;
let motion: { refresh: () => void } | null = null;

// Mobile reasons: native swipe track. Independent of GSAP/reduced motion so the
// counter and rail keep working even when every animation is off.
if (root) {
  const track = root.querySelector<HTMLElement>('[data-reasons-track]');
  const mobile = window.matchMedia('(max-width: 899px)');
  let unmount: (() => void) | null = null;
  const sync = () => {
    if (mobile.matches && track && !unmount) {
      unmount = mountHorizontalTrack({
        track,
        cards: Array.from(track.querySelectorAll<HTMLElement>('[data-reason]')),
        current: root.querySelector<HTMLElement>('[data-track-current]'),
        rail: root.querySelector<HTMLElement>('[data-track-rail]'),
        label: 'Motivo',
        reducedMotion,
      });
    } else if (!mobile.matches && unmount) {
      unmount();
      unmount = null;
    }
    motion?.refresh();
  };
  sync();
  mobile.addEventListener('change', sync);
}

if (root && !reducedMotion) {
  // Titles are rebuilt as real lines first, so both engines animate the same lines.
  splitTitles(root, settleLines).then(() => {
    if (desktop) {
      import('./desktop/contacto').then(({ mount }) => { motion = mount(root); motion.refresh(); releaseTitles(); });
    } else {
      mountReveals(root, { hero: '.ct-hero' });
      releaseTitles();
      mountAnchors(false);
    }
  });
}
