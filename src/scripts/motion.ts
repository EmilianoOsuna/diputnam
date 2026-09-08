import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const panels = gsap.utils.toArray<HTMLElement>('[data-panel]');

if (!reducedMotion) {
  const lenis = new Lenis({ anchors: true, autoRaf: false });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  gsap.from('[data-site-header], .site-footer', { autoAlpha: 0, y: 12, duration: 1, ease: 'power2.out' });
  gsap.from('.panel--intro .panel-content > *', { autoAlpha: 0, y: 32, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.15 });

  panels.forEach((panel) => {
    const image = panel.querySelector<HTMLElement>('.panel-media');
    const content = panel.querySelectorAll<HTMLElement>('.panel-content > *');

    gsap.fromTo(image, { scale: 1.12 }, {
      scale: 1.04,
      ease: 'none',
      scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from(content, {
      autoAlpha: 0,
      y: 24,
      stagger: 0.06,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: panel, start: 'top 68%', once: true },
    });
  });
} else {
  document.documentElement.classList.add('reduced-motion');
}

const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Abrir menú' : 'Cerrar menú');
  menuToggle.querySelector('span')!.textContent = expanded ? 'menu' : 'cerrar';
  document.querySelector('.site-nav')?.classList.toggle('is-open', !expanded);
});
