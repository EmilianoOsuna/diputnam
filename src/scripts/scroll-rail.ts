// Fade for the custom scroll rail (mirrors tierra-taza): visible while scrolling, hidden 1 s
// after the last scroll event. Desktop only; the dot position itself is pure CSS.
if (matchMedia('(min-width: 768px)').matches) {
  const html = document.documentElement;
  let timer = 0;
  window.addEventListener('scroll', () => {
    html.classList.add('is-scrolling');
    clearTimeout(timer);
    timer = window.setTimeout(() => html.classList.remove('is-scrolling'), 1000);
  }, { passive: true });
}
