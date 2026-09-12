import { supportsScrollTimeline } from './mobile-motion';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones run the scene sweep as CSS scroll-driven animations (global.css) with no
// per-frame JavaScript; the Lenis/GSAP engine is desktop-only and loaded on demand.
// Crossing the breakpoint after load needs a reload.
const desktop = window.matchMedia('(min-width: 768px)').matches;
const home = document.querySelector<HTMLElement>('[data-home]');
const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-panel]'));
const markers = Array.from(document.querySelectorAll<HTMLElement>('[data-scene-marker]'));
const markerTrack = document.querySelector<HTMLElement>('[data-scene-markers]');
const stage = document.querySelector<HTMLElement>('[data-stage]');
const scrollCue = document.querySelector<HTMLButtonElement>('[data-scroll-cue]');
const scrollEnd = document.querySelector<HTMLElement>('[data-scroll-end]');
let scrollToTarget = (target: Element) => target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
// Scene anchors: the markers drive the sweep, so they are the scroll targets; the stacked
// fallback hides them and scrolls to the panels themselves.
let sceneTargets: HTMLElement[] = markers;
let atEnd = false;

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

// The scene whose marker (or panel, when stacked) crosses the viewport's centre line is
// active; the observer only fires at those crossings.
const observeActive = (targets: HTMLElement[]) => {
  const observer = new IntersectionObserver((entries) => {
    const hit = entries.find((entry) => entry.isIntersecting);
    if (hit) setActive(targets.indexOf(hit.target as HTMLElement));
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
  targets.forEach((target) => observer.observe(target));
};

if (!reducedMotion && home && panels.length > 1 && markers.length === panels.length && markerTrack) {
  if (desktop) {
    import('./desktop/home').then(({ mount }) => {
      scrollToTarget = mount({ home, panels, markerTrack, stage, setActive }).scrollTo;
    });
  } else if (supportsScrollTimeline()) {
    home.classList.add('is-enhanced', 'is-css-sweep');
    observeActive(markers);
  } else {
    home.classList.add('is-stacked');
    document.documentElement.classList.add('home-snap');
    sceneTargets = panels;
    observeActive(panels);
  }
} else {
  document.documentElement.classList.add('reduced-motion');
  sceneTargets = panels;
}

if (scrollCue && scrollEnd) {
  new IntersectionObserver(([entry]) => {
    atEnd = entry.isIntersecting;
    scrollCue.dataset.direction = atEnd ? 'up' : 'down';
    scrollCue.setAttribute('aria-label', atEnd ? 'Volver al inicio' : 'Desplazarse a la siguiente sección');
  }, { threshold: 0 }).observe(scrollEnd);
}

scrollCue?.addEventListener('click', () => {
  if (atEnd) {
    scrollToTarget(sceneTargets[0] ?? document.documentElement);
    return;
  }
  const activeIndex = panels.findIndex((panel) => panel.classList.contains('is-active'));
  const nextTarget = sceneTargets[Math.min(Math.max(activeIndex, 0) + 1, sceneTargets.length - 1)];
  if (nextTarget) scrollToTarget(nextTarget);
});

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const id = link.getAttribute('href')?.slice(1);
    const index = id ? markers.findIndex((marker) => marker.dataset.sceneMarker === id) : -1;
    if (index < 0) return;
    event.preventDefault();
    scrollToTarget(sceneTargets[index]);
  });
});
