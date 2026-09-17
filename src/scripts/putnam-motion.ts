import { mountHorizontalTrack } from './horizontal-track';
import { mountAnchors, mountReveals, releaseTitles, settleLines, splitTitles } from './mobile-motion';

const root = document.querySelector<HTMLElement>('[data-putnam]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones get the CSS/IntersectionObserver runtime; the Lenis/GSAP engine is desktop-only
// and loaded on demand. Crossing the breakpoint after load needs a reload.
const desktop = window.matchMedia('(min-width: 768px)').matches;

// Mobile process steps: native swipe track with the counter/rail, independent of GSAP and of
// reduced motion. The desktop engine drives the same [data-pin-*] nodes, but only at ≥768px.
if (root) {
  const track = root.querySelector<HTMLElement>('[data-h-track]');
  const mobile = window.matchMedia('(max-width: 767px)');
  let unmount: (() => void) | null = null;
  const sync = () => {
    if (mobile.matches && track && !unmount) {
      unmount = mountHorizontalTrack({
        track,
        cards: Array.from(track.querySelectorAll<HTMLElement>('[data-h-panel]')),
        current: root.querySelector<HTMLElement>('[data-pin-current]'),
        rail: root.querySelector<HTMLElement>('[data-pin-rail]'),
        label: 'Etapa',
        reducedMotion,
      });
    } else if (!mobile.matches && unmount) {
      unmount();
      unmount = null;
    }
  };
  sync();
  mobile.addEventListener('change', sync);
}

if (root) {
  if (desktop && !reducedMotion) {
    // The hero copy is pre-hidden by `.motion-pending` (inline script in putnam.astro).
    // Whatever happens to the motion bundle, never leave it hidden.
    const releaseHero = () => document.documentElement.classList.remove('motion-pending');
    const heroFailsafe = window.setTimeout(releaseHero, 3000);
    Promise.all([splitTitles(root, settleLines), import('./desktop/putnam')])
      .then(([, { mount }]) => { window.clearTimeout(heroFailsafe); mount(root, releaseHero); releaseTitles(); })
      .catch((error) => { window.clearTimeout(heroFailsafe); releaseHero(); throw error; });
  } else if (!reducedMotion) {
    splitTitles(root, settleLines).then(() => { mountReveals(root, { hero: '.institutional-hero' }); releaseTitles(); });
    mountAnchors(false);
  }
}
