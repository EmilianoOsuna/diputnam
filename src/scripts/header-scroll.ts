// Hide-on-scroll header: transparent over the top of the page, gone while the reader
// scrolls down, back on the first upward move with a solid section-coloured background
// (the `::before` layer in global.css) so it never sits on top of copy. The background
// opacity is written as `--header-bg`, 0 → 1 over the first FADE px, so it fades with the
// scroll instead of popping; beyond that zone nothing is written per event, and the
// hide/show classes only toggle when the state changes. The home has no content passing
// under the header (full-screen stage/slider) and keeps its own entrance, so it is left alone.
const header = document.querySelector<HTMLElement>('[data-site-header]');

if (header && !document.body.classList.contains('home-page')) {
  const TOP = 24; // up to here the header is transparent and always shown, as designed
  const FADE = 96; // px over which the background reaches full opacity
  const DEAD_ZONE = 4; // px of movement ignored, so touch jitter does not flicker it
  let lastY = window.scrollY;
  let lastAlpha = -1;

  const update = () => {
    const y = window.scrollY;
    const alpha = Math.min(1, Math.max(0, (y - TOP) / FADE));
    if (alpha !== lastAlpha) { header.style.setProperty('--header-bg', alpha.toFixed(3)); lastAlpha = alpha; }
    if (document.body.classList.contains('menu-open')) { lastY = y; return; }
    if (y <= TOP) header.classList.remove('is-hidden');
    else if (y > lastY + DEAD_ZONE) header.classList.add('is-hidden');
    else if (y < lastY - DEAD_ZONE) header.classList.remove('is-hidden');
    if (Math.abs(y - lastY) > DEAD_ZONE) lastY = y;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}
