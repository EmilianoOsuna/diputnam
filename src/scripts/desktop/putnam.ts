// Desktop motion for Putnam (≥ 768px, no reduced motion): Lenis smooth scroll, GSAP hero
// entrance, reveals, process steps/rail and parallax. Loaded with import() so phones
// never download it.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { groupTargets, revealHeroLines, revealTitles } from './lines';

gsap.registerPlugin(ScrollTrigger);

export const mount = (root: HTMLElement, setProcessStep: (index: number) => void, releaseHero: () => void) => {
  const processMarkers = Array.from(root.querySelectorAll<HTMLElement>('[data-process-marker]'));
  const processTrack = root.querySelector<HTMLElement>('[data-process-markers]');
  const lineProgress = root.querySelector<HTMLElement>('[data-line-progress]');

  document.body.classList.add('is-motion-ready');
  const lenis = new Lenis({ anchors: true, autoRaf: true, lerp: 0.09 });
  let scrollFrame = 0;
  let refreshFrame = 0;

  lenis.on('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      ScrollTrigger.update();
    });
  });
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    const heroTargets = '.institutional-hero .section-kicker, .institutional-hero .hero-lead';
    gsap.set(heroTargets, { autoAlpha: 0, y: 34, willChange: 'transform, opacity' });
    releaseHero();
    revealHeroLines(gsap, root.querySelector('.institutional-hero h1'), { delay: 0.1 });
    gsap.to(heroTargets, {
      autoAlpha: 1,
      y: 0,
      duration: 1.15,
      stagger: 0.36,
      ease: 'power3.out',
      onComplete: () => gsap.set(heroTargets, { clearProps: 'willChange' }),
    });
    revealTitles(gsap, root, '.institutional-hero', 'top 82%');
    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      if (group.closest('.institutional-hero')) return;
      const targets = groupTargets(group);
      if (!targets.length) return;
      gsap.from(targets, {
        autoAlpha: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'play none none reverse' },
      });
    });

    processMarkers.forEach((marker, index) => {
      ScrollTrigger.create({
        trigger: marker,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setProcessStep(index),
        onEnterBack: () => setProcessStep(index),
      });
    });

    const refreshLayout = () => {
      if (refreshFrame) return;
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = 0;
        ScrollTrigger.refresh();
      });
    };
    const heroImage = root.querySelector<HTMLImageElement>('.hero-frame img');
    if (heroImage) {
      if (heroImage.complete) refreshLayout();
      else heroImage.addEventListener('load', refreshLayout, { once: true });
    }
    window.addEventListener('resize', refreshLayout, { passive: true });

    gsap.to(lineProgress, {
      scaleX: 1,
      transformOrigin: 'left center',
      ease: 'none',
      scrollTrigger: { trigger: processTrack, start: 'top top', end: 'bottom bottom', scrub: 0.45 },
    });

    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
      gsap.fromTo(element, { yPercent: -4 }, {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
      });
    });
    gsap.to('.cta-mark', {
      yPercent: -9,
      ease: 'none',
      scrollTrigger: { trigger: '.institutional-cta', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
    });
  }, root);

  window.addEventListener('pagehide', () => {
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    context.revert();
    lenis.destroy();
  }, { once: true });

  return { refresh: () => ScrollTrigger.refresh() };
};
