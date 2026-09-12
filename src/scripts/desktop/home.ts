// Desktop home engine (≥ 768px, no reduced motion): Lenis smooth scroll drives a GSAP
// ScrollTrigger that sweeps the scene panels and holds the title. Loaded with import()
// so phones never download it; on phones the same sweep is a CSS scroll-driven animation.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HomeParts {
  home: HTMLElement;
  panels: HTMLElement[];
  markerTrack: HTMLElement;
  stage: HTMLElement | null;
  setActive: (index: number) => void;
}

export const mount = ({ home, panels, markerTrack, stage, setActive }: HomeParts) => {
  home.classList.add('is-enhanced');

  const lenis = new Lenis({ anchors: false, autoRaf: false, lerp: 0.085 });
  let scrollFrame = 0;
  // Panels travel exactly the stage's height (100svh). window.innerHeight is larger while a
  // phone's address bar is retracted, and that difference showed as a gap between panels.
  const measureStage = () => stage?.getBoundingClientRect().height || window.innerHeight;
  let viewportHeight = measureStage();

  lenis.on('scroll', ({ scroll }) => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      if (scroll <= 1) resetToFirstScene();
      ScrollTrigger.update();
    });
  });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const resetToFirstScene = () => {
    panels.forEach((panel, index) => {
      const visible = index === 0;
      panel.classList.toggle('is-visible', visible);
      gsap.set(panel.querySelector('.panel-media'), { yPercent: 0 });
      gsap.set(panel.querySelector('.panel-content'), { y: 0 });
      gsap.set(panel, {
        autoAlpha: visible ? 1 : 0,
        clipPath: 'none',
        y: visible ? 0 : viewportHeight,
        zIndex: visible ? 2 : 0,
      });
    });
    setActive(0);
  };

  resetToFirstScene();

  gsap.from('[data-site-header], .site-footer', { autoAlpha: 0, y: 14, duration: 0.9, ease: 'power3.out' });
  gsap.from('.panel--intro .panel-content > *', { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.08, ease: 'power3.out', delay: 0.18 });

  ScrollTrigger.create({
    trigger: markerTrack,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      if (self.progress <= 0.001 && window.scrollY <= 1) {
        resetToFirstScene();
        return;
      }
      const lastIndex = panels.length - 1;
      const sceneProgress = Math.min(lastIndex, Math.max(0, self.progress * lastIndex));
      const sceneIndex = Math.min(lastIndex - 1, Math.floor(sceneProgress));
      const transitionProgress = sceneProgress - sceneIndex;
      const incomingIndex = sceneIndex + 1;
      const activeIndex = transitionProgress < 0.5 ? sceneIndex : incomingIndex;
      const panelTravel = viewportHeight;
      const titleTravel = panelTravel - 60;

      setActive(activeIndex);
      panels.forEach((panel, index) => {
        const outgoing = index === sceneIndex;
        const incoming = index === incomingIndex;
        const visible = (outgoing && transitionProgress < 1) || (incoming && transitionProgress > 0);
        const panelY = outgoing
          ? -transitionProgress * panelTravel
          : incoming
            ? (1 - transitionProgress) * panelTravel
            : index < sceneIndex ? -panelTravel : panelTravel;

        panel.classList.toggle('is-visible', visible);
        gsap.set(panel, { autoAlpha: visible ? 1 : 0, clipPath: 'none', y: panelY, zIndex: incoming ? 2 : outgoing ? 1 : 0 });
        gsap.set(panel.querySelector('.panel-media'), { yPercent: 0 });
        gsap.set(panel.querySelector('.panel-content'), {
          y: outgoing
            ? transitionProgress * titleTravel
            : incoming
              ? -(1 - transitionProgress) * titleTravel
              : 0,
        });
      });
    },
  });

  const refresh = () => {
    viewportHeight = measureStage();
    if (window.scrollY <= 1) resetToFirstScene();
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  };
  window.addEventListener('load', refresh, { once: true });
  // Sync re-measure so ScrollTrigger's own (debounced) resize refresh already sees the
  // new stage height; the ResizeObserver below then reconciles the scene positions.
  window.addEventListener('resize', () => { viewportHeight = measureStage(); });
  if (stage && 'ResizeObserver' in window) {
    let stageFrame = 0;
    new ResizeObserver(() => {
      if (stageFrame) return;
      stageFrame = window.requestAnimationFrame(() => { stageFrame = 0; refresh(); });
    }).observe(stage);
  }
  panels.forEach((panel) => panel.querySelector('img')?.addEventListener('load', refresh, { once: true }));
  refresh();

  return { scrollTo: (target: Element) => lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 }) };
};
