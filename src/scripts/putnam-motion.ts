import { mountAnchors, mountReveals, releaseTitles, settleLines, splitTitles } from './mobile-motion';

const root = document.querySelector<HTMLElement>('[data-putnam]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones get the CSS/IntersectionObserver runtime; the Lenis/GSAP engine is desktop-only
// and loaded on demand. Crossing the breakpoint after load needs a reload.
const desktop = window.matchMedia('(min-width: 768px)').matches;

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
