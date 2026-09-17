// Typology media gallery: every medium is already in the HTML, so switching is only a
// matter of `hidden` + `aria-selected`; the video plays while its panel is on screen and
// is the selected medium, and pauses otherwise. Panel visibility comes from an
// IntersectionObserver, which works the same under the GSAP-translated desktop track
// and the native swipe track on phones.
const PANEL_VISIBLE = 0.6;

export const mountTypologyMedia = (root: HTMLElement) => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const galleries = Array.from(root.querySelectorAll<HTMLElement>('[data-media]'));
  if (!galleries.length) return () => {};
  const visible = new WeakSet<HTMLElement>();

  // Plays the video only when its panel is visible, it is the selected medium and motion is welcome.
  const sync = (gallery: HTMLElement) => {
    const video = gallery.querySelector<HTMLVideoElement>('video[data-video]');
    if (!video) return;
    const shown = !(video.closest('[role="tabpanel"]') as HTMLElement).hidden;
    // Inside the desktop pinned slot every gallery intersects at once; only the one the
    // engine marked `is-active` counts as on screen (see desktop/eredita.ts).
    const onScreen = visible.has(gallery) && (!gallery.parentElement?.hasAttribute('data-media-slot') || gallery.classList.contains('is-active'));
    const play = gallery.querySelector<HTMLElement>('[data-play]');
    if (shown && onScreen && !reducedMotion) video.play().catch(() => {});
    else if (!shown || !onScreen) { video.pause(); if (play && reducedMotion) play.hidden = false; }
  };

  const cleanups: (() => void)[] = [];
  galleries.forEach((gallery) => {
    const tabs = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panes = Array.from(gallery.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
    const strip = gallery.querySelector<HTMLElement>('[role="tablist"]');
    const prev = gallery.querySelector<HTMLButtonElement>('[data-thumbs-prev]');
    const next = gallery.querySelector<HTMLButtonElement>('[data-thumbs-next]');
    const play = gallery.querySelector<HTMLButtonElement>('[data-play]');
    const video = gallery.querySelector<HTMLVideoElement>('video[data-video]');

    const select = (index: number) => {
      tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
      panes.forEach((pane, i) => { pane.hidden = i !== index; });
      tabs[index]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
      sync(gallery);
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      // Arrows move the focus along the strip (manual activation) and never reach the
      // swipe track, whose own arrow keys would change the typology.
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        event.stopPropagation();
        tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length].focus();
      });
    });

    // Prev/next only when the strip overflows; each press scrolls most of a strip width.
    if (strip && prev && next) {
      const arrows = () => { const overflow = strip.scrollWidth > strip.clientWidth + 1; prev.hidden = !overflow; next.hidden = !overflow; };
      const scroll = (direction: 1 | -1) => strip.scrollBy({ left: direction * strip.clientWidth * 0.8, behavior: reducedMotion ? 'auto' : 'smooth' });
      prev.addEventListener('click', () => scroll(-1));
      next.addEventListener('click', () => scroll(1));
      arrows();
      window.addEventListener('resize', arrows, { passive: true });
      cleanups.push(() => window.removeEventListener('resize', arrows));
    }

    // Reduced motion: no autoplay; the poster stays until the person asks for the video.
    if (play && video) {
      if (reducedMotion) play.hidden = false;
      play.addEventListener('click', () => { play.hidden = true; video.play().catch(() => {}); });
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const gallery = entry.target as HTMLElement;
      if (entry.intersectionRatio >= PANEL_VISIBLE) visible.add(gallery);
      else visible.delete(gallery);
      sync(gallery);
    });
  }, { threshold: [0, PANEL_VISIBLE] });
  galleries.forEach((gallery) => {
    observer.observe(gallery);
    // The desktop engine toggles `is-active` and asks for a resync instead of driving playback.
    gallery.addEventListener('typology-sync', () => sync(gallery));
  });

  return () => { observer.disconnect(); cleanups.forEach((cleanup) => cleanup()); };
};
