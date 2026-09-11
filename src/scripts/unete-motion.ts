import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-unete]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (root && !reducedMotion) {
  document.body.classList.add('is-motion-ready');
  const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.09 });
  const tick = (time: number) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    gsap.from('.un-hero h1 .line > span', { yPercent: 110, duration: 0.9, stagger: 0.09, ease: 'expo.out' });
    gsap.from('.un-hero .fade-up', { autoAlpha: 0, y: 24, duration: 0.8, delay: 0.4, stagger: 0.08, ease: 'power3.out' });

    gsap.utils.toArray<HTMLElement>('.section-head h2, .un-cta h2').forEach((heading) => {
      gsap.from(heading.querySelectorAll('.line > span'), {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.09,
        ease: 'expo.out',
        scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const targets = group.children.length ? Array.from(group.children) : group;
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
        if (rail) gsap.set(rail, { width: `${((activeIndex + 1) / traits.length) * 100}%` });
      };

      setTrait(0);
      ScrollTrigger.create({ trigger: '.un-culture', start: 'top top', end: 'bottom bottom', pin: '.pin-stage', pinSpacing: false, invalidateOnRefresh: true });
      traits.forEach((trait, index) => ScrollTrigger.create({ trigger: trait, start: 'top 55%', end: 'bottom 45%', onEnter: () => setTrait(index), onEnterBack: () => setTrait(index) }));
      gsap.fromTo('[data-pin-rail]', { width: `${100 / traits.length}%` }, { width: '100%', ease: 'none', scrollTrigger: { trigger: '.un-culture', start: 'top top', end: 'bottom bottom', scrub: 0.45 } });

      return () => {
        traits.forEach((trait, index) => trait.classList.toggle('is-active', index === 0));
        if (current) current.textContent = '01';
        gsap.set(traits.map((trait) => trait.querySelector('h3')), { clearProps: 'opacity' });
        gsap.set('[data-pin-stage], [data-pin-rail]', { clearProps: 'transform,width' });
      };
    });
  }, root);

  window.addEventListener('pagehide', () => {
    context.revert();
    lenis.destroy();
    gsap.ticker.remove(tick);
  }, { once: true });
}
