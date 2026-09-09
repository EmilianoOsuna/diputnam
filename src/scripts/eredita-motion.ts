import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-eredita]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (root && !reducedMotion) {
  document.body.classList.add('is-motion-ready');
  const lenis = new Lenis({ anchors: true, autoRaf: false, lerp: 0.09 });
  const tick = (time: number) => lenis.raf(time * 1000);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const context = gsap.context(() => {
    gsap.from('.ed-hero-content > *', {
      autoAlpha: 0,
      y: 34,
      duration: 1.15,
      stagger: 0.09,
      ease: 'power3.out',
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      if (group.closest('.ed-hero')) return;
      gsap.from(Array.from(group.children), {
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
    context.revert();
    lenis.destroy();
    gsap.ticker.remove(tick);
  }, { once: true });
}
