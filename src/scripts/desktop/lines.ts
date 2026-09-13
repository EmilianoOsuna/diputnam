// Desktop title reveals over the lines produced by `splitLines`: each line slides up out of
// its mask (yPercent 160 → 0 — past the mask's slack — 0.9 s, 90 ms stagger, expo.out); masks open when the line
// lands and close again if the reveal is reversed.
import type { gsap as Gsap } from 'gsap';
import { finishLine } from '../mobile-motion';

type GsapLike = typeof Gsap;

const lineSpans = (title: Element) => Array.from(title.querySelectorAll<HTMLElement>('.line > span'));
const closeMasks = (spans: HTMLElement[]) => spans.forEach((span) => span.parentElement?.classList.remove('is-done'));

export const revealHeroLines = (gsap: GsapLike, title: Element | null, vars: Record<string, unknown> = {}) => {
  if (!title) return;
  const spans = lineSpans(title);
  if (!spans.length) return;
  gsap.from(spans, {
    yPercent: 160,
    duration: 0.9,
    stagger: 0.09,
    ease: 'expo.out',
    ...vars,
    onStart: () => closeMasks(spans),
    onComplete: () => spans.forEach(finishLine),
  });
};

/** Every split title outside `hero` reveals line by line when it reaches `start`. */
export const revealTitles = (gsap: GsapLike, root: ParentNode, hero: string, start = 'top 80%') => {
  root.querySelectorAll<HTMLElement>('[data-lines]').forEach((title) => {
    if (title.closest(hero)) return;
    const spans = lineSpans(title);
    if (!spans.length) return;
    gsap.from(spans, {
      yPercent: 160,
      duration: 0.9,
      stagger: 0.09,
      ease: 'expo.out',
      scrollTrigger: { trigger: title, start, toggleActions: 'play none none reverse' },
      onStart: () => closeMasks(spans),
      onComplete: () => spans.forEach(finishLine),
      onReverseComplete: () => closeMasks(spans),
    });
  });
};

/** Reveal-group children minus split titles (those animate through `revealTitles`). */
export const groupTargets = (group: HTMLElement) =>
  (group.children.length ? Array.from(group.children as HTMLCollectionOf<HTMLElement>) : [group]).filter((child) => child.dataset.lines === undefined);
