// Mobile horizontal track: native swipe + scroll-snap, with a counter and a progress rail
// that follow the card nearest the centre. Shared by Ereditá (typologies) and Únete (culture).
interface TrackOptions {
  track: HTMLElement;
  cards: HTMLElement[];
  current?: HTMLElement | null;
  rail?: HTMLElement | null;
  label: string;
  reducedMotion?: boolean;
  onChange?: (index: number) => void;
}

const pad = (index: number) => String(index + 1).padStart(2, '0');

export const mountHorizontalTrack = ({ track, cards, current, rail, label, reducedMotion = false, onChange }: TrackOptions) => {
  const total = cards.length;
  if (!total) return () => {};
  let active = -1;
  let frame = 0;

  track.dataset.track = '';
  track.setAttribute('role', 'group');
  track.setAttribute('aria-roledescription', 'carrusel');
  track.setAttribute('aria-label', label);
  track.tabIndex = 0;
  cards.forEach((card, index) => {
    card.dataset.trackCard = '';
    card.setAttribute('aria-label', `${label} ${index + 1} de ${total}`);
  });
  current?.setAttribute('aria-live', 'polite');

  const setActive = (index: number) => {
    if (index === active) return;
    active = index;
    if (current) current.textContent = pad(index);
    cards.forEach((card, cardIndex) => card.classList.toggle('is-active', cardIndex === index));
    onChange?.(index);
  };

  // Continuous progress as a fractional card index (interpolated between card centres),
  // so the rail reads exactly (i + 1) / total when card i sits in the middle; the scroll
  // edges pin it to the first/last card even when those cannot be centred.
  const updateProgress = () => {
    frame = 0;
    const range = track.scrollWidth - track.clientWidth;
    let position = 0;
    if (track.scrollLeft >= range - 1) position = total - 1;
    else if (track.scrollLeft > 1) {
      const centre = track.scrollLeft + track.clientWidth / 2;
      const centres = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
      const found = centres.findIndex((value) => value >= centre);
      if (found === -1) position = total - 1;
      else {
        const to = Math.max(1, found);
        const from = to - 1;
        const span = centres[to] - centres[from] || 1;
        position = Math.min(total - 1, Math.max(0, from + (centre - centres[from]) / span));
      }
    }
    rail?.style.setProperty('--progress', ((position + 1) / total).toFixed(4));
  };
  const scheduleProgress = () => {
    if (!frame) frame = window.requestAnimationFrame(updateProgress);
  };

  // Card nearest the track centre wins; ties between two partially visible cards resolve
  // by centre distance so wide viewports never flip between neighbours.
  const observer = new IntersectionObserver((entries) => {
    const trackCentre = track.getBoundingClientRect().left + track.clientWidth / 2;
    const candidates = entries.filter((entry) => entry.isIntersecting);
    if (!candidates.length) return;
    const best = candidates.sort((a, b) => {
      const ratio = b.intersectionRatio - a.intersectionRatio;
      if (Math.abs(ratio) > 0.1) return ratio;
      const centre = (rect: DOMRectReadOnly) => Math.abs(rect.left + rect.width / 2 - trackCentre);
      return centre(a.boundingClientRect) - centre(b.boundingClientRect);
    })[0];
    setActive(cards.indexOf(best.target as HTMLElement));
  }, { root: track, threshold: [0.5, 0.6, 0.75] });
  cards.forEach((card) => observer.observe(card));

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const target = cards[Math.max(0, Math.min(total - 1, active + (event.key === 'ArrowRight' ? 1 : -1)))];
    if (!target) return;
    event.preventDefault();
    track.scrollTo({ left: target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  track.addEventListener('scroll', scheduleProgress, { passive: true });
  track.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', scheduleProgress, { passive: true });
  setActive(0);
  updateProgress();

  return () => {
    observer.disconnect();
    track.removeEventListener('scroll', scheduleProgress);
    track.removeEventListener('keydown', onKeydown);
    window.removeEventListener('resize', scheduleProgress);
    if (frame) window.cancelAnimationFrame(frame);
    delete track.dataset.track;
    track.removeAttribute('role');
    track.removeAttribute('aria-roledescription');
    track.removeAttribute('aria-label');
    track.removeAttribute('tabindex');
    cards.forEach((card) => { delete card.dataset.trackCard; card.removeAttribute('aria-label'); });
    current?.removeAttribute('aria-live');
    rail?.style.removeProperty('--progress');
  };
};
