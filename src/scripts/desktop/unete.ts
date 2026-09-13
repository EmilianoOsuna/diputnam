// Desktop motion for Únete (≥ 768px, no reduced motion): Lenis smooth scroll, GSAP
// entrances/reveals, parallax and the pinned stage. Loaded with import() so phones never
// download it.
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
    revealHeroLines(gsap, root.querySelector('.un-hero h1'));
    gsap.from('.un-hero .fade-up', { autoAlpha: 0, y: 24, duration: 0.8, delay: 0.4, stagger: 0.08, ease: 'power3.out' });

    revealTitles(gsap, root, '.un-hero');

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
      gsap.fromTo('.hero-frame img', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.un-hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
      gsap.fromTo('.cta-mark', { y: -40 }, { y: 40, ease: 'none', scrollTrigger: { trigger: '.un-cta', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 } });
      return () => gsap.set('.hero-frame img, .cta-mark', { clearProps: 'transform' });
    });

    media.add('(min-width: 900px)', () => {
      const traits = gsap.utils.toArray<HTMLElement>('[data-trait]');
      const current = root.querySelector<HTMLElement>('[data-pin-current]');
      const rail = root.querySelector<HTMLElement>('[data-pin-rail]');
      const setTrait = (activeIndex: number) => {
        if (current) current.textContent = String(activeIndex + 1).padStart(2, '0');
        traits.forEach((trait, index) => trait.classList.toggle('is-active', index === activeIndex));
        gsap.to(traits.map((trait) => trait.querySelector('h3')), { opacity: (index) => index === activeIndex ? 1 : 0.42, duration: 0.25, overwrite: 'auto' });
        if (rail) rail.style.setProperty('--progress', String((activeIndex + 1) / traits.length));
      };

      setTrait(0);
      ScrollTrigger.create({ trigger: '.un-culture', start: 'top top', end: 'bottom bottom', pin: '.pin-stage', pinSpacing: false, invalidateOnRefresh: true });
      traits.forEach((trait, index) => ScrollTrigger.create({ trigger: trait, start: 'top 55%', end: 'bottom 45%', onEnter: () => setTrait(index), onEnterBack: () => setTrait(index) }));
      gsap.fromTo('[data-pin-rail]', { '--progress': 1 / traits.length }, { '--progress': 1, ease: 'none', scrollTrigger: { trigger: '.un-culture', start: 'top top', end: 'bottom bottom', scrub: 0.45 } });

      return () => {
        traits.forEach((trait, index) => trait.classList.toggle('is-active', index === 0));
        if (current) current.textContent = '01';
        gsap.set(traits.map((trait) => trait.querySelector('h3')), { clearProps: 'opacity' });
        gsap.set('[data-pin-stage], [data-pin-rail]', { clearProps: 'transform,width,--progress' });
      };
    });
  }, root);

  window.addEventListener('pagehide', () => {
    context.revert();
    lenis.destroy();
    gsap.ticker.remove(tick);
  }, { once: true });

  return { refresh: () => ScrollTrigger.refresh() };
};
