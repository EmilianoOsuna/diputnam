import { mountAnchors, mountReveals, supportsScrollTimeline } from './mobile-motion';

const root = document.querySelector<HTMLElement>('[data-putnam]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones get the CSS/IntersectionObserver runtime (hero entrance and reveals are CSS,
// the process rail is a scroll-driven animation); the Lenis/GSAP engine is desktop-only
// and loaded on demand. Crossing the breakpoint after load needs a reload.
const desktop = window.matchMedia('(min-width: 768px)').matches;

if (root) {
  const processSteps = Array.from(root.querySelectorAll<HTMLElement>('[data-process-step]'));
  const processMedia = Array.from(root.querySelectorAll<HTMLElement>('[data-process-media]'));
  const processMarkers = Array.from(root.querySelectorAll<HTMLElement>('[data-process-marker]'));
  const processTrack = root.querySelector<HTMLElement>('[data-process-markers]');
  const lineProgress = root.querySelector<HTMLElement>('[data-line-progress]');
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

  if (desktop && !reducedMotion) {
    // The hero copy is pre-hidden by `.motion-pending` (inline script in putnam.astro).
    // Whatever happens to the motion bundle, never leave it hidden.
    const releaseHero = () => document.documentElement.classList.remove('motion-pending');
    const heroFailsafe = window.setTimeout(releaseHero, 3000);
    import('./desktop/putnam')
      .then(({ mount }) => { window.clearTimeout(heroFailsafe); mount(root, setProcessStep, releaseHero); })
      .catch((error) => { window.clearTimeout(heroFailsafe); releaseHero(); throw error; });
  } else {
    // Active step flips only when a marker crosses the middle of the viewport.
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (!visible) return;
      const index = processMarkers.indexOf(visible.target as HTMLElement);
      if (index >= 0) setProcessStep(index);
    }, { rootMargin: '-45% 0px -45%', threshold: 0 });
    processMarkers.forEach((marker) => observer.observe(marker));

    if (!reducedMotion) {
      mountReveals(root, { hero: '.institutional-hero' });
      mountAnchors(false);
    }

    // Rail progress: CSS `animation-timeline` (putnam.css) when available; otherwise one
    // coalesced rAF with geometry cached until resize.
    let cleanupRail = () => {};
    if (supportsScrollTimeline()) {
      document.documentElement.classList.add('has-scroll-timeline');
    } else if (lineProgress && processTrack) {
      let progressFrame = 0;
      let trackTop = 0;
      let trackRange = 1;
      const measureTrack = () => {
        const rect = processTrack.getBoundingClientRect();
        trackTop = rect.top + window.scrollY;
        trackRange = Math.max(1, processTrack.offsetHeight - window.innerHeight);
      };
      const updateProgress = () => {
        progressFrame = 0;
        const progress = Math.min(1, Math.max(0, (window.scrollY - trackTop) / trackRange));
        lineProgress.style.transform = `scaleX(${progress})`;
      };
      const scheduleProgress = () => {
        if (progressFrame) return;
        progressFrame = window.requestAnimationFrame(updateProgress);
      };
      const refreshGeometry = () => {
        measureTrack();
        scheduleProgress();
      };
      window.addEventListener('scroll', scheduleProgress, { passive: true });
      window.addEventListener('resize', refreshGeometry, { passive: true });
      refreshGeometry();
      cleanupRail = () => {
        if (progressFrame) window.cancelAnimationFrame(progressFrame);
        window.removeEventListener('scroll', scheduleProgress);
        window.removeEventListener('resize', refreshGeometry);
      };
    }

    window.addEventListener('pagehide', () => {
      observer.disconnect();
      cleanupRail();
    }, { once: true });
  }
}
