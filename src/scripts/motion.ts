import { releaseTitles, revealLines, settleLines, splitTitles, supportsScrollTimeline } from './mobile-motion';

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

// One swipe = one scene, Swiper-style: the page follows the finger 1:1 (native scrolling is
// off via touch-action), and on release the document glides to the next/previous marker top
// with the browser's smooth scroll, so the sweep lands without any fling or snap bounce.
// A quick flick (< 300 ms) always changes scene; a slow drag needs half a screen. No rAF, no
// scroll listener: the CSS scroll-driven animations do the drawing.
const mountSwipe = (targets: HTMLElement[]) => {
  document.body.classList.add('is-swipe');
  let startY = 0;
  let startScroll = 0;
  let startTime = 0;
  let tops: number[] = [];
  let maxScroll = 0;
  let dragging = false;
  const nearest = (y: number) => tops.reduce((best, top, index) => (Math.abs(top - y) < Math.abs(tops[best] - y) ? index : best), 0);
  const onStart = (event: TouchEvent) => {
    if (document.body.classList.contains('menu-open') || event.touches.length !== 1) return;
    dragging = true;
    startY = event.touches[0].clientY;
    startScroll = window.scrollY;
    startTime = event.timeStamp;
    tops = targets.map((target) => target.offsetTop);
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  };
  const onMove = (event: TouchEvent) => {
    if (!dragging) return;
    window.scrollTo({ top: Math.min(maxScroll, Math.max(0, startScroll + startY - event.touches[0].clientY)), behavior: 'auto' });
  };
  const onEnd = (event: TouchEvent) => {
    if (!dragging) return;
    dragging = false;
    const delta = startY - event.changedTouches[0].clientY;
    const quick = event.timeStamp - startTime < 300 && Math.abs(delta) > 10;
    const from = nearest(startScroll);
    let to = from;
    if (quick || Math.abs(delta) > window.innerHeight / 2) to = Math.min(targets.length - 1, Math.max(0, from + Math.sign(delta)));
    window.scrollTo({ top: Math.min(maxScroll, tops[to]), behavior: 'smooth' });
  };
  document.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: true });
  document.addEventListener('touchend', onEnd, { passive: true });
  document.addEventListener('touchcancel', onEnd, { passive: true });
};

if (!reducedMotion && home && panels.length > 1 && markers.length === panels.length && markerTrack) {
  if (desktop) {
    Promise.all([splitTitles(home, settleLines), import('./desktop/home')]).then(([, { mount }]) => {
      scrollToTarget = mount({ home, panels, markerTrack, stage, setActive }).scrollTo;
      releaseTitles();
    });
  } else {
    // Scene titles enter line by line; the intro title reveals on load, the others are
    // already in place when their scene sweeps in.
    splitTitles(home, settleLines).then((titles) => {
      titles.forEach((title) => { if (!title.closest('.panel--intro')) revealLines(title); });
      const intro = home.querySelector<HTMLElement>('.panel--intro h1');
      window.requestAnimationFrame(() => { if (intro) { void intro.offsetWidth; revealLines(intro); } releaseTitles(); });
    });
    if (supportsScrollTimeline()) {
      home.classList.add('is-enhanced', 'is-css-sweep');
      observeActive(markers);
      mountSwipe(markers);
    } else {
      home.classList.add('is-stacked');
      document.documentElement.classList.add('home-snap');
      sceneTargets = panels;
      observeActive(panels);
    }
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
