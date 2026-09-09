import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-putnam]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (root && !reducedMotion) {
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
    gsap.from('.institutional-hero .section-kicker, .institutional-hero h1, .institutional-hero .hero-lead', {
      autoAlpha: 0,
      y: 34,
      duration: 1.15,
      stagger: 0.09,
      ease: 'power3.out',
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      if (group.closest('.institutional-hero')) return;
      gsap.from(Array.from(group.children), {
        autoAlpha: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 82%', toggleActions: 'play none none reverse' },
      });
    });

    const processSteps = gsap.utils.toArray<HTMLElement>('[data-process-step]');
    const processMedia = gsap.utils.toArray<HTMLElement>('[data-process-media]');
    const processMarkers = gsap.utils.toArray<HTMLElement>('[data-process-marker]');
    const currentStep = root.querySelector<HTMLElement>('[data-process-current]');
    const setProcessStep = (activeIndex: number) => {
      processSteps.forEach((step, index) => {
        const active = index === activeIndex;
        step.classList.toggle('is-active', active);
        step.setAttribute('aria-hidden', String(!active));
      });
      processMedia.forEach((media, index) => {
        const active = index === activeIndex;
        media.classList.toggle('is-active', active);
        media.setAttribute('aria-hidden', String(!active));
      });
      if (currentStep) currentStep.textContent = String(activeIndex + 1).padStart(2, '0');
    };

    setProcessStep(0);
    processMarkers.forEach((marker, index) => {
      ScrollTrigger.create({
        trigger: marker,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setProcessStep(index),
        onEnterBack: () => setProcessStep(index),
      });
    });

    gsap.to('[data-line-progress]', {
      width: '100%',
      ease: 'none',
      scrollTrigger: { trigger: '[data-process-markers]', start: 'top top', end: 'bottom bottom', scrub: 0.45 },
    });

    const media = gsap.matchMedia();
    media.add('(min-width: 768px)', () => {
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
      return () => gsap.set('[data-parallax], .cta-mark', { clearProps: 'transform' });
    });
  }, root);

  window.addEventListener('pagehide', () => {
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    context.revert();
    lenis.destroy();
    gsap.ticker.remove(tick);
  }, { once: true });
}
