// Hide-on-scroll header: transparent over the top of the page, gone while the reader
// scrolls down, back on the first upward move with a solid section-coloured background
// (see `.site-header.is-scrolled` in global.css) so it never sits on top of copy. The
// listener only toggles classes when the state changes, so scrolling stays cheap. The home
// has no content passing under the header (full-screen stage/slider) and keeps its own
// entrance animation, so it is left alone.
const header = document.querySelector<HTMLElement>('[data-site-header]');

if (header && !document.body.classList.contains('home-page')) {
  const TOP = 96; // about one header height: above it the header is transparent, as designed
  const DEAD_ZONE = 4; // px of movement ignored, so touch jitter does not flicker it
  let lastY = window.scrollY;

  const update = () => {
    const y = window.scrollY;
    if (document.body.classList.contains('menu-open')) { lastY = y; return; }
    header.classList.toggle('is-scrolled', y > TOP);
    if (y <= TOP) header.classList.remove('is-hidden');
    else if (y > lastY + DEAD_ZONE) header.classList.add('is-hidden');
    else if (y < lastY - DEAD_ZONE) header.classList.remove('is-hidden');
    if (Math.abs(y - lastY) > DEAD_ZONE) lastY = y;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}
