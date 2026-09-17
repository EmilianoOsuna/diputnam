// Sets the `src` of every MapEmbed iframe as it is about to enter the viewport (see
// components/MapEmbed.astro). The margin is small on purpose: on the Ereditá pages the map
// starts ~100px below the hero, and any wider margin would load Maps on every first paint.
// Old browsers without IntersectionObserver load at once.
export const mountLazyMaps = (root: ParentNode = document) => {
  const frames = Array.from(root.querySelectorAll<HTMLIFrameElement>('iframe[data-lazy-map]'));
  const load = (frame: HTMLIFrameElement) => { if (frame.dataset.src) { frame.src = frame.dataset.src; delete frame.dataset.src; } };
  if (!('IntersectionObserver' in window)) { frames.forEach(load); return; }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) { load(entry.target as HTMLIFrameElement); observer.unobserve(entry.target); }
  }, { rootMargin: '64px 0px' });
  frames.forEach((frame) => observer.observe(frame));
};
