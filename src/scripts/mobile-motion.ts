// Mobile motion runtime: no per-frame JavaScript. Reveals are CSS transitions switched on
// by one IntersectionObserver; scroll-linked progress is left to CSS scroll-driven
// animations (see `supportsScrollTimeline`). Hero entrances are pure CSS keyframes in
// each page's stylesheet, so nothing here runs before first paint.

export const supportsScrollTimeline = () => typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');

interface RevealOptions {
  /** Ancestors whose contents are hero entrances: their split title reveals right away. */
  hero?: string;
}

// Split titles (`[data-lines]`) reveal line by line; children of `[data-reveal-group]`
// (minus split titles) fade up with a stagger. Groups/titles gain `is-in` once ~18% of the
// viewport bottom has passed (same threshold as the desktop `top 82%` trigger) and are then
// left alone. Hero titles reveal on the next frame instead of waiting for the observer.
export const mountReveals = (root: HTMLElement, { hero }: RevealOptions = {}) => {
  const inHero = (element: Element) => (hero ? element.closest(hero) !== null : false);
  const groups = new Map<Element, HTMLElement[]>();
  const titles: HTMLElement[] = [];

  root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    if (inHero(group)) return;
    const children = (group.children.length ? Array.from(group.children as HTMLCollectionOf<HTMLElement>) : [group]).filter((child) => child.dataset.lines === undefined);
    if (children.length) groups.set(group, children);
  });
  root.querySelectorAll<HTMLElement>('[data-lines]').forEach((title) => {
    if (inHero(title)) window.requestAnimationFrame(() => { void title.offsetWidth; revealLines(title); });
    else titles.push(title);
  });

  groups.forEach((elements) => {
    elements.forEach((element, index) => {
      element.dataset.reveal = '';
      element.style.setProperty('--i', String(index));
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target as HTMLElement;
      if (target.dataset.lines !== undefined) revealLines(target);
      else target.classList.add('is-in');
      observer.unobserve(target);
    });
  }, { rootMargin: '0px 0px -18% 0px', threshold: 0 });
  groups.forEach((_, group) => observer.observe(group));
  titles.forEach((title) => observer.observe(title));

  return () => {
    observer.disconnect();
    groups.forEach((elements, group) => {
      group.classList.remove('is-in');
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

// ---------------------------------------------------------------------------------------
// Runtime line splitting for titles. Every h1/h2 is rebuilt as one `.line > span` per
// visual line the browser actually produced at this width (words are measured by
// offsetTop), so reveals animate real lines on every viewport and the markup needs no
// hand-authored breaks. `<br>` and, under `white-space: pre-*`, `\n` force a break.
// Runs once after fonts are ready and again when the viewport width changes.

const TITLE_SELECTOR = 'h1, h2:not(.visually-hidden)';

// Titles whose only child is a wrapper (the home's `<h1><a>…</a></h1>`) are split inside it.
const lineHost = (title: HTMLElement) =>
  title.childNodes.length === 1 && title.firstElementChild ? (title.firstElementChild as HTMLElement) : title;

interface Token { text: string; breakBefore: boolean }

const tokenize = (host: HTMLElement): Token[] => {
  const preserveNewlines = getComputedStyle(host).whiteSpace.startsWith('pre');
  const tokens: Token[] = [];
  let pendingBreak = false;
  const pushWords = (text: string) => {
    const chunks = preserveNewlines ? text.split(/\n/) : [text];
    chunks.forEach((chunk, index) => {
      if (index > 0) pendingBreak = true;
      for (const word of chunk.split(/\s+/).filter(Boolean)) {
        tokens.push({ text: word, breakBefore: pendingBreak });
        pendingBreak = false;
      }
    });
  };
  host.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) pushWords(node.textContent ?? '');
    else if (node instanceof HTMLBRElement) { if (getComputedStyle(node).display !== 'none') pendingBreak = true; }
    else if (node instanceof HTMLElement) {
      const block = getComputedStyle(node).display === 'block';
      if (block) pendingBreak = true;
      pushWords(node.textContent ?? '');
      if (block) pendingBreak = true;
    }
  });
  return tokens;
};

export const restoreLines = (title: HTMLElement) => {
  const host = lineHost(title);
  if (title.dataset.lineSource === undefined) return;
  host.innerHTML = title.dataset.lineSource;
  delete title.dataset.lines;
};

export const splitLines = (title: HTMLElement): HTMLElement[] => {
  const host = lineHost(title);
  if (title.dataset.lineSource === undefined) title.dataset.lineSource = host.innerHTML;
  else host.innerHTML = title.dataset.lineSource;

  const tokens = tokenize(host);
  host.textContent = '';
  const probes = tokens.map((token) => {
    if (token.breakBefore) host.append(document.createElement('br'));
    else if (host.lastChild) host.append(' ');
    const probe = document.createElement('span');
    probe.style.display = 'inline'; // page CSS may make title spans block-level
    probe.textContent = token.text;
    host.append(probe);
    return probe;
  });

  const lines: string[][] = [];
  let lastTop = Number.NaN;
  probes.forEach((probe, index) => {
    const top = probe.offsetTop;
    if (tokens[index].breakBefore || Math.abs(top - lastTop) > 1 || !lines.length) lines.push([]);
    lines[lines.length - 1].push(tokens[index].text);
    lastTop = top;
  });

  host.textContent = '';
  const spans = lines.map((words, index) => {
    const line = document.createElement('span');
    line.className = 'line';
    const inner = document.createElement('span');
    inner.textContent = words.join(' ');
    inner.dataset.reveal = 'line';
    inner.style.setProperty('--i', String(index));
    line.append(inner);
    host.append(line);
    return inner;
  });
  title.dataset.lines = String(lines.length);
  return spans;
};

// The mask only matters while a line is travelling; afterwards it is opened so glyphs and
// text-shadow are never clipped, whatever the line-height.
export const finishLine = (span: Element) => span.parentElement?.classList.add('is-done');

/** Splits every title under `root` once fonts are ready; re-splits when the width changes. */
export const splitTitles = async (root: ParentNode, onResplit?: (title: HTMLElement) => void): Promise<HTMLElement[]> => {
  const titles = Array.from(root.querySelectorAll<HTMLElement>(TITLE_SELECTOR)).filter((title) => title.textContent?.trim());
  if ('fonts' in document) await document.fonts.ready;
  titles.forEach(splitLines);

  let width = window.innerWidth;
  let timer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      titles.forEach((title) => {
        splitLines(title);
        onResplit?.(title);
      });
    }, 150);
  }, { passive: true });
  return titles;
};

/** Lets titles paint again once their start state is in place (see SiteHead.astro). */
export const releaseTitles = () => document.documentElement.classList.remove('titles-pending');

/** Reveals a split title's lines (CSS transition) and opens each mask when it lands. */
export const revealLines = (title: HTMLElement) => {
  title.querySelectorAll<HTMLElement>('[data-reveal="line"]').forEach((span) => {
    span.addEventListener('transitionend', () => finishLine(span), { once: true });
  });
  title.classList.add('is-in');
};

/** Titles already revealed keep their lines open after a re-split. */
export const settleLines = (title: HTMLElement) => {
  if (!title.classList.contains('is-in')) return;
  title.querySelectorAll('.line').forEach((line) => line.classList.add('is-done'));
};
