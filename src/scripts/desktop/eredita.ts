// Desktop motion for Ereditá (≥ 768px, no reduced motion): Lenis smooth scroll, GSAP
// entrances/reveals, parallax and the typologies sticky stage. Loaded with import() so
// phones never download it.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { groupTargets, revealHeroLines, revealTitles } from './lines';

gsap.registerPlugin(ScrollTrigger);

export const mount = (root: HTMLElement) => {
  document.body.classList.add('is-motion-ready');
  const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.09 });
  const tick = (time: number) => lenis.raf(time * 1000);
  let scrollFrame = 0;

  lenis.on('scroll', () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      ScrollTrigger.update();
    });
  });
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    gsap.from('.ed-hero-content > :not(h1)', {
      autoAlpha: 0,
      y: 34,
      duration: 1.15,
      stagger: 0.36,
      ease: 'power3.out',
    });
    revealHeroLines(gsap, root.querySelector('.ed-hero-content h1'), { delay: 0.1 });

    revealTitles(gsap, root, '.ed-hero', 'top 85%');
    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      if (group.closest('.ed-hero')) return;
      const targets = groupTargets(group);
      if (!targets.length) return;
      gsap.from(targets, {
        autoAlpha: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    });

    const media = gsap.matchMedia();
    media.add('(min-width: 768px)', () => {
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
        gsap.fromTo(element, { yPercent: -6 }, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
        });
      });
      return () => gsap.set('[data-parallax]', { clearProps: 'transform' });
    });

    media.add('(min-width: 900px)', () => {
      // Same principle as Únete's culture section: the stage (images/renders) stays pinned
      // while the typology data scrolls past — a plain ScrollTrigger pin driven by normal
      // scroll, not a wheel-captured/discrete step. Each panel's own `.ed-h-media` is moved
      // into the shared sticky slot once and crossfaded, so there is a single source of
      // media per typology (no duplicated markup) and mobile — which never reparents it —
      // keeps finding it inside its own panel.
      const wrapper = root.querySelector<HTMLElement>('[data-typologies]');
      const stage = root.querySelector<HTMLElement>('[data-pin-stage]');
      const slot = root.querySelector<HTMLElement>('[data-media-slot]');
      const panels = wrapper ? Array.from(wrapper.querySelectorAll<HTMLElement>('[data-h-panel]')) : [];
      if (!wrapper || !stage || !slot || !panels.length) return;

      const homes = panels.map((panel) => panel.querySelector<HTMLElement>(':scope > .ed-h-media'));
      homes.forEach((el) => { if (el) slot.appendChild(el); });

      const current = root.querySelector<HTMLElement>('[data-pin-current]');
      const setActive = (index: number) => {
        homes.forEach((el, i) => {
          const active = i === index;
          el?.classList.toggle('is-active', active);
          // All stacked media sit in the same viewport position once slotted, so
          // `typology-media.ts` only plays the `is-active` one; ask it to resync.
          el?.dispatchEvent(new Event('typology-sync'));
        });
        if (current) current.textContent = String(index + 1).padStart(2, '0');
      };
      setActive(0);

      const trigger = ScrollTrigger.create({ trigger: wrapper, start: 'top top', end: 'bottom bottom', pin: stage, pinSpacing: false, invalidateOnRefresh: true });
      const steps = panels.map((panel, index) => ScrollTrigger.create({ trigger: panel, start: 'top 55%', end: 'bottom 45%', onEnter: () => setActive(index), onEnterBack: () => setActive(index) }));
      const railTween = gsap.fromTo('[data-pin-rail]', { '--progress': 1 / panels.length }, { '--progress': 1, ease: 'none', scrollTrigger: { trigger: wrapper, start: 'top top', end: 'bottom bottom', scrub: 0.45 } });

      return () => {
        trigger.kill();
        steps.forEach((step) => step.kill());
        railTween.kill();
        homes.forEach((el, i) => { if (el) { panels[i].prepend(el); el.classList.remove('is-active'); } });
        if (current) current.textContent = '01';
        gsap.set('[data-pin-rail]', { clearProps: '--progress' });
      };
    });
  }, root);

  window.addEventListener('pagehide', () => {
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    context.revert();
    lenis.destroy();
    gsap.ticker.remove(tick);
  }, { once: true });

  return { refresh: () => ScrollTrigger.refresh() };
};
