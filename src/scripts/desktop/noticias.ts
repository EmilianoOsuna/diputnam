// Desktop motion for Noticias (≥ 768px, no reduced motion): Lenis smooth scroll, GSAP
// entrances/reveals and parallax. Loaded with import() so phones never download it.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { groupTargets, revealHeroLines, revealTitles } from './lines';

gsap.registerPlugin(ScrollTrigger);

export const mount = (root: HTMLElement) => {
  document.body.classList.add('is-motion-ready');
  const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.09 });
  const tick = (time: number) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    revealHeroLines(gsap, root.querySelector('.nw-hero h1'));
    gsap.from('.nw-hero .fade-up', { autoAlpha: 0, y: 24, duration: 0.8, delay: 0.4, stagger: 0.08, ease: 'power3.out' });

    revealTitles(gsap, root, '.nw-hero');

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const targets = groupTargets(group);
      if (!targets.length) return;
      gsap.from(targets, {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    });

    const media = gsap.matchMedia();
    media.add('(min-width: 768px)', () => {
      gsap.fromTo('.cta-mark', { y: -40 }, { y: 40, ease: 'none', scrollTrigger: { trigger: '.nw-cta', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 } });
      return () => gsap.set('.cta-mark', { clearProps: 'transform' });
    });
  }, root);

  window.addEventListener('pagehide', () => {
    context.revert();
    lenis.destroy();
    gsap.ticker.remove(tick);
  }, { once: true });

  return { refresh: () => ScrollTrigger.refresh() };
};
