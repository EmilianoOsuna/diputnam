import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const home = document.querySelector<HTMLElement>('[data-home]');
const panels = gsap.utils.toArray<HTMLElement>('[data-panel]');
const markers = gsap.utils.toArray<HTMLElement>('[data-scene-marker]');
const markerTrack = document.querySelector<HTMLElement>('[data-scene-markers]');
const scrollCue = document.querySelector<HTMLButtonElement>('[data-scroll-cue]');
let scrollToTarget = (target: Element) => target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
let cueFrame = 0;
let queuedScroll = window.scrollY;

const updateScrollCue = (scroll = window.scrollY) => {
  if (!scrollCue) return;
  const atEnd = scroll + window.innerHeight >= document.documentElement.scrollHeight - 2;
  scrollCue.dataset.direction = atEnd ? 'up' : 'down';
  scrollCue.setAttribute('aria-label', atEnd ? 'Volver al inicio' : 'Desplazarse a la siguiente sección');
};

if (!reducedMotion && home && panels.length > 1 && markers.length === panels.length && markerTrack) {
  home.classList.add('is-enhanced');

  const lenis = new Lenis({ anchors: false, autoRaf: false, lerp: 0.085 });
  scrollToTarget = (target) => lenis.scrollTo(target, { offset: 0, duration: 1.2 });

  lenis.on('scroll', ({ scroll }) => {
    if (scroll <= 1) resetToFirstScene();
    updateScrollCue(scroll);
    ScrollTrigger.update();
  });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const setActive = (index: number) => {
    const focused = document.activeElement;
    const focusedPanel = focused instanceof HTMLElement ? focused.closest<HTMLElement>('[data-panel]') : null;
    if (focusedPanel && focusedPanel !== panels[index]) focused.blur();

    panels.forEach((panel, panelIndex) => {
      const active = panelIndex === index;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', String(!active));
      panel.inert = !active;
    });
  };

  const resetToFirstScene = () => {
    panels.forEach((panel, index) => {
      const visible = index === 0;
      panel.classList.toggle('is-visible', visible);
      gsap.set(panel.querySelector('.panel-media'), { yPercent: 0 });
      gsap.set(panel.querySelector('.panel-content'), { y: 0 });
      gsap.set(panel, {
        autoAlpha: visible ? 1 : 0,
        clipPath: 'none',
        y: visible ? 0 : window.innerHeight,
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
      const panelTravel = window.innerHeight;
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
    if (window.scrollY <= 1) resetToFirstScene();
    ScrollTrigger.refresh();
    updateScrollCue();
  };
  window.addEventListener('load', refresh, { once: true });
  panels.forEach((panel) => panel.querySelector('img')?.addEventListener('load', refresh, { once: true }));
  refresh();

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href')?.slice(1);
      const marker = id ? document.querySelector<HTMLElement>(`[data-scene-marker="${id}"]`) : null;
      if (!marker) return;
      event.preventDefault();
      scrollToTarget(marker);
    });
  });
} else {
  document.documentElement.classList.add('reduced-motion');
}

scrollCue?.addEventListener('click', () => {
  const targets = markers.length ? markers : panels;
  const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  if (atEnd) {
    scrollToTarget(targets[0] ?? document.documentElement);
    return;
  }

  const activeIndex = panels.findIndex((panel) => panel.classList.contains('is-active'));
  const nextTarget = targets[Math.min(Math.max(activeIndex, 0) + 1, targets.length - 1)];
  if (nextTarget) scrollToTarget(nextTarget);
});

const scheduleScrollCue = (scroll = window.scrollY) => {
  queuedScroll = scroll;
  if (cueFrame) return;
  cueFrame = window.requestAnimationFrame(() => {
    cueFrame = 0;
    updateScrollCue(queuedScroll);
  });
};

window.addEventListener('scroll', () => scheduleScrollCue(), { passive: true });
window.addEventListener('resize', () => scheduleScrollCue());
updateScrollCue();
