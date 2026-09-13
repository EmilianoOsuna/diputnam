// Desktop motion for Ereditá (≥ 768px, no reduced motion): Lenis smooth scroll, GSAP
// entrances/reveals, parallax and the pinned typologies track. Loaded with import()
// so phones never download it.
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
      const wrapper = root.querySelector<HTMLElement>('[data-h-wrapper]');
      const track = wrapper?.querySelector<HTMLElement>('[data-h-track]');
      if (!wrapper || !track) return;

      const panels = Array.from(track.querySelectorAll<HTMLElement>('[data-h-panel]'));
      const last = panels.length - 1;
      let index = 0;
      let locked = false;
      let unlockTimer = 0;

      const settle = () => {
        // ignore any trailing wheel input from the very gesture that just carried the
        // user into (or back into) this section, so they always get a clean look at the
        // panel they landed on before a scroll can advance further.
        locked = true;
        window.clearTimeout(unlockTimer);
        unlockTimer = window.setTimeout(() => { locked = false; }, 850);
      };

      const setIndexInstant = (next: number) => {
        index = Math.max(0, Math.min(last, next));
        gsap.set(track, { x: -index * window.innerWidth });
      };

      const goTo = (next: number) => {
        index = Math.max(0, Math.min(last, next));
        gsap.to(track, { x: () => -index * window.innerWidth, duration: 0.7, ease: 'power3.inOut' });
        settle();
      };

      // Lenis owns wheel/touch scrolling and animates it regardless of preventDefault()
      // on our own listener, so the only reliable way to hard-lock the page here is to
      // stop Lenis itself while stepping through panels, and hand control back at the edges.
      const trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: '+=300',
        pin: true,
        onEnter: () => { setIndexInstant(0); lenis.stop(); settle(); },
        onEnterBack: () => { setIndexInstant(last); lenis.stop(); settle(); },
        onLeave: () => lenis.start(),
        onLeaveBack: () => lenis.start(),
      });
      if (trigger.isActive) { setIndexInstant(0); lenis.stop(); settle(); }

      // Discrete, one-gesture-per-panel navigation: a small wheel notch or trackpad
      // swipe advances exactly one typology, like pressing a button — not a scrubbed drag.
      const onWheel = (event: WheelEvent) => {
        if (!trigger.isActive || Math.abs(event.deltaY) < 2) return;
        const goingForward = event.deltaY > 0;
        if (goingForward && index < last) {
          event.preventDefault();
          if (!locked) goTo(index + 1);
        } else if (!goingForward && index > 0) {
          event.preventDefault();
          if (!locked) goTo(index - 1);
        } else if (!locked) {
          // settled on the first/last panel long enough to actually see it — only now
          // release, so the native scroll can continue into the previous/next section.
          lenis.start();
        } else {
          event.preventDefault();
        }
      };

      window.addEventListener('wheel', onWheel, { passive: false });

      return () => {
        window.removeEventListener('wheel', onWheel);
        window.clearTimeout(unlockTimer);
        trigger.kill();
        lenis.start();
        gsap.set(track, { clearProps: 'transform' });
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
