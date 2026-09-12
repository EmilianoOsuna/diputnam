// Mobile motion runtime: no per-frame JavaScript. Reveals are CSS transitions switched on
// by one IntersectionObserver; scroll-linked progress is left to CSS scroll-driven
// animations (see `supportsScrollTimeline`). Hero entrances are pure CSS keyframes in
// each page's stylesheet, so nothing here runs before first paint.

export const supportsScrollTimeline = () => typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

interface RevealOptions {
  /** Ancestors whose contents are hero entrances (already animated by CSS keyframes). */
  hero?: string;
}

// Children of `[data-reveal-group]` and `.line > span` inside headings get `data-reveal`
// + a stagger index; the group/heading gains `is-in` once ~18% of the viewport bottom has
// passed (same threshold as the desktop `top 82%` trigger) and is then left alone.
export const mountReveals = (root: HTMLElement, { hero }: RevealOptions = {}) => {
  const inHero = (element: Element) => (hero ? element.closest(hero) !== null : false);
  const targets = new Map<Element, HTMLElement[]>();

  root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    if (inHero(group)) return;
    const children = group.children.length ? Array.from(group.children as HTMLCollectionOf<HTMLElement>) : [group];
    targets.set(group, children);
  });
  root.querySelectorAll<HTMLElement>('.line > span').forEach((span) => {
    if (inHero(span)) return;
    const heading = span.closest<HTMLElement>('h1, h2, h3') ?? span.parentElement!;
    if (heading.closest('[data-reveal-group]')) return;
    const list = targets.get(heading) ?? [];
    list.push(span);
    targets.set(heading, list);
  });

  targets.forEach((elements) => {
    elements.forEach((element, index) => {
      element.dataset.reveal = element.matches('.line > span') ? 'line' : '';
      element.style.setProperty('--i', String(index));
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -18% 0px', threshold: 0 });
  targets.forEach((_, container) => observer.observe(container));

  return () => {
    observer.disconnect();
    targets.forEach((elements, container) => {
      container.classList.remove('is-in');
      elements.forEach((element) => { delete element.dataset.reveal; element.style.removeProperty('--i'); });
    });
  };
};

// Same-page anchors scroll smoothly without a smooth-scroll library (native scroll on
// phones); `prefers-reduced-motion` gets an instant jump.
export const mountAnchors = (reducedMotion: boolean) => {
  const onClick = (event: MouseEvent) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const id = decodeURIComponent(link.getAttribute('href')!.slice(1));
    const target = id ? document.getElementById(id) : document.documentElement;
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };
  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
};
