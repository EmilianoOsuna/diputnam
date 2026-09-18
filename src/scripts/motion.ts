import { releaseTitles, revealLines, settleLines, splitTitles } from './mobile-motion';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Phones run the scene slider below (touch-driven, compositor transitions, no per-frame
// JavaScript); the Lenis/GSAP engine is desktop-only and loaded on demand.
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

// Phone home: a full-screen vertical slider modelled on Swiper (vertical, speed 500,
// resistanceRatio 0, parallax). The document does not scroll; the stage is a column of
// 100%-tall panels moved with `translate`, and each panel's media (60% of a screen), copy
// (100%, so the title stays put while the panel wipes over it) and title (-60px drift)
// get their parallax from the panel's progress, exactly as Swiper's parallax module does.
// Drags follow the finger with transitions off; releasing turns the 500 ms `ease` CSS
// transition back on and sets the final position, so the landing runs in the compositor.
//
// The gesture belongs to the slider alone: `touch-action: none` on the experience plus
// `preventDefault()` on every move of an active drag keep Safari iOS from panning or
// rubber-banding the document (and from collapsing its toolbar mid-gesture). At rest the
// positions are written as percentages of each layer's own box, so a viewport height
// change (toolbar, rotation) is re-laid out by CSS with the active scene still covering
// the screen even before any resize handler runs; pixels are only used while dragging.
const mountSlider = (wrapper: HTMLElement) => {
  home!.classList.add('is-slider');
  document.documentElement.classList.add('is-slider');
  document.body.classList.add('is-slider');
  const medias = panels.map((panel) => panel.querySelector<HTMLElement>('.panel-media'));
  const copies = panels.map((panel) => panel.querySelector<HTMLElement>('.panel-content'));
  const titles = panels.map((panel) => panel.querySelector<HTMLElement>('h1, h2'));
  const last = panels.length - 1;
  let index = 0;
  let size = wrapper.clientHeight;
  let position = 0; // wrapper translate in px while dragging, 0 … -last*size
  let startY = 0;
  let startPosition = 0;
  let startTime = 0;
  let dragging = false;

  // Dragging and landing: everything in px from the measured size.
  const render = (translate: number) => {
    position = translate;
    wrapper.style.translate = `0 ${translate}px`;
    panels.forEach((_, i) => {
      const progress = Math.max(-1, Math.min(1, (-translate - i * size) / size));
      medias[i]?.style.setProperty('translate', `0 ${0.6 * size * progress}px`);
      copies[i]?.style.setProperty('translate', `0 ${size * progress}px`);
      titles[i]?.style.setProperty('translate', `0 ${-60 * progress}px`);
    });
  };
  // Resting: the stage and the media are one screen tall, so their position is written as
  // a percentage of their own box and survives a viewport height change without JS. The
  // copies keep px: the active one is at 0 and the neighbours sit off-screen inside their
  // clipped panels, so a stale value is never visible. Written only once the landing has
  // finished (same position, so nothing moves) — transitions always run px → px, which
  // every engine interpolates.
  const settle = () => {
    position = -index * size;
    wrapper.style.translate = `0 ${-index * 100}%`;
    panels.forEach((_, i) => {
      const progress = Math.max(-1, Math.min(1, index - i));
      medias[i]?.style.setProperty('translate', `0 ${60 * progress}%`);
      copies[i]?.style.setProperty('translate', `0 ${size * progress}px`);
      titles[i]?.style.setProperty('translate', `0 ${-60 * progress}px`);
    });
  };
  // Freeze wherever the stage is right now (mid-landing included) in px, transitions off,
  // so the next movement starts from the rendered position whatever unit it was written in.
  const freeze = () => {
    const top = wrapper.getBoundingClientRect().top - wrapper.parentElement!.getBoundingClientRect().top;
    wrapper.classList.add('is-dragging');
    render(top);
    void wrapper.offsetHeight;
  };
  let landing = 0;
  const slideTo = (next: number) => {
    index = Math.max(0, Math.min(last, next));
    freeze();
    wrapper.classList.remove('is-dragging');
    render(-index * size);
    setActive(index);
    setCue(index === last);
    window.clearTimeout(landing);
    landing = window.setTimeout(() => { if (!dragging) settle(); }, 560);
  };

  const onStart = (event: TouchEvent) => {
    if (document.body.classList.contains('menu-open') || event.touches.length !== 1) return;
    if (!(event.target instanceof Node) || !wrapper.parentElement?.contains(event.target)) return;
    dragging = true;
    startY = event.touches[0].clientY;
    startTime = event.timeStamp;
    size = wrapper.clientHeight;
    window.clearTimeout(landing);
    freeze();
    startPosition = position;
  };
  const onMove = (event: TouchEvent) => {
    if (!dragging) return;
    if (event.cancelable) event.preventDefault();
    render(Math.max(-last * size, Math.min(0, startPosition + event.touches[0].clientY - startY)));
  };
  const onEnd = (event: TouchEvent) => {
    if (!dragging) return;
    dragging = false;
    const delta = startY - event.changedTouches[0].clientY;
    const quick = event.timeStamp - startTime < 300 && Math.abs(delta) > 10;
    slideTo(quick || Math.abs(delta) > size / 2 ? index + Math.sign(delta) : index);
  };
  const onResize = () => { size = wrapper.clientHeight; if (!dragging) { wrapper.classList.add('is-dragging'); settle(); void wrapper.offsetHeight; wrapper.classList.remove('is-dragging'); } };
  document.addEventListener('touchstart', onStart, { passive: true });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd, { passive: true });
  document.addEventListener('touchcancel', onEnd, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.visualViewport?.addEventListener('resize', onResize, { passive: true });

  settle();
  setCue(last === 0);
  return slideTo;
};

const setCue = (end: boolean) => {
  if (!scrollCue) return;
  atEnd = end;
  scrollCue.dataset.direction = end ? 'up' : 'down';
  scrollCue.setAttribute('aria-label', end ? 'Volver al inicio' : 'Desplazarse a la siguiente sección');
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
    if (stage) {
      const slideTo = mountSlider(stage);
      scrollToTarget = (target) => slideTo(markers.indexOf(target as HTMLElement));
    } else {
      sceneTargets = panels;
      observeActive(panels);
    }
  }
} else {
  document.documentElement.classList.add('reduced-motion');
  sceneTargets = panels;
}

if (scrollCue && scrollEnd && !home?.classList.contains('is-slider')) {
  new IntersectionObserver(([entry]) => setCue(entry.isIntersecting), { threshold: 0 }).observe(scrollEnd);
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
