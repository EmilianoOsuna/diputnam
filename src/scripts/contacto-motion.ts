import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mountHorizontalTrack } from './horizontal-track';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-contacto]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    if (!reducedMotion) ScrollTrigger.refresh();
  };
  sync();
  mobile.addEventListener('change', sync);
}

if (root && !reducedMotion) {
  document.body.classList.add('is-motion-ready');
  const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.09 });
  const tick = (time: number) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    gsap.from('.ct-hero h1 .line > span', { yPercent: 110, duration: 0.9, stagger: 0.09, ease: 'expo.out' });
    gsap.from('.ct-hero .fade-up', { autoAlpha: 0, y: 24, duration: 0.8, delay: 0.4, stagger: 0.08, ease: 'power3.out' });

    gsap.utils.toArray<HTMLElement>('.ct-channels h2, .ct-location h2, .ct-form h2, .ct-cta h2').forEach((heading) => {
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
      gsap.fromTo('.cta-mark', { y: -40 }, { y: 40, ease: 'none', scrollTrigger: { trigger: '.ct-cta', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 } });
      return () => gsap.set('.cta-mark', { clearProps: 'transform' });
    });

    media.add('(min-width: 900px)', () => {
      const reasons = gsap.utils.toArray<HTMLElement>('[data-reason]');
      const current = root.querySelector<HTMLElement>('[data-pin-current]');
      const rail = root.querySelector<HTMLElement>('[data-pin-rail]');
      const setReason = (activeIndex: number) => {
        if (current) current.textContent = String(activeIndex + 1).padStart(2, '0');
        reasons.forEach((reason, index) => reason.classList.toggle('is-active', index === activeIndex));
        gsap.to(reasons.map((reason) => reason.querySelector('h3')), { opacity: (index) => index === activeIndex ? 1 : 0.42, duration: 0.25, overwrite: 'auto' });
        if (rail) rail.style.setProperty('--progress', String((activeIndex + 1) / reasons.length));
      };

      setReason(0);
      ScrollTrigger.create({ trigger: '.ct-reasons', start: 'top top', end: 'bottom bottom', pin: '.pin-stage', pinSpacing: false, invalidateOnRefresh: true });
      reasons.forEach((reason, index) => ScrollTrigger.create({ trigger: reason, start: 'top 55%', end: 'bottom 45%', onEnter: () => setReason(index), onEnterBack: () => setReason(index) }));
      gsap.fromTo('[data-pin-rail]', { '--progress': 1 / reasons.length }, { '--progress': 1, ease: 'none', scrollTrigger: { trigger: '.ct-reasons', start: 'top top', end: 'bottom bottom', scrub: 0.45 } });

      return () => {
        reasons.forEach((reason, index) => reason.classList.toggle('is-active', index === 0));
        if (current) current.textContent = '01';
        gsap.set(reasons.map((reason) => reason.querySelector('h3')), { clearProps: 'opacity' });
        gsap.set('[data-pin-stage], [data-pin-rail]', { clearProps: 'transform,width,--progress' });
      };
    });
  }, root);

  window.addEventListener('pagehide', () => {
    context.revert();
    lenis.destroy();
    gsap.ticker.remove(tick);
  }, { once: true });
}
