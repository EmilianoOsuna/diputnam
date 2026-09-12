const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const siteNav = document.querySelector<HTMLElement>('.site-nav');
const mobileViewport = window.matchMedia('(max-width: 767px)');
let menuOrigin: Element | null = null;
let themeBeforeMenuLight = false;

const header = document.querySelector<HTMLElement>('[data-auto-theme]');
const logos = Array.from(header?.querySelectorAll<HTMLElement>('[data-logo]') ?? []);
const showLogo = (light: boolean) => logos.forEach((logo) => { logo.hidden = logo.dataset.logo !== (light ? 'light' : 'dark'); });
const themedSections = Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme]'));

// The header takes the theme of whichever section sits behind its centre line. A thin
// observation band there (3%–4% of the viewport) means the callback only runs when a
// section boundary crosses it, never per scroll frame.
let themeObserver: IntersectionObserver | null = null;
const applyTheme = (section: HTMLElement) => {
  if (!header || logos.length === 0) return;
  const light = section.dataset.headerTheme === 'light';
  header.classList.toggle('site-header--light', light);
  showLogo(light);
};
const observeTheme = () => {
  themeObserver?.disconnect();
  if (!header || logos.length === 0 || themedSections.length === 0) return;
  themeObserver = new IntersectionObserver((entries) => {
    const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top)[0];
    if (active) applyTheme(active.target as HTMLElement);
  }, { rootMargin: '-3% 0px -96% 0px', threshold: 0 });
  themedSections.forEach((section) => themeObserver!.observe(section));
};
// One-off re-sample (menu close), not scroll-driven.
const syncTheme = () => {
  const sampleY = window.innerHeight * 0.035;
  const section = themedSections.find((candidate) => { const rect = candidate.getBoundingClientRect(); return rect.top <= sampleY && rect.bottom > sampleY; });
  if (section) applyTheme(section);
};

observeTheme();

const setMenuOpen = (open: boolean) => {
  if (open && !mobileViewport.matches) return;
  if (open && header) {
    themeBeforeMenuLight = header.classList.contains('site-header--light');
    header.classList.remove('site-header--light');
    showLogo(false);
  }
  siteNav?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menuToggle?.setAttribute('aria-expanded', String(open));
  menuToggle?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = open ? 'hidden' : '';
  document.querySelectorAll<HTMLElement>('main, .site-footer, [data-scroll-cue]').forEach((element) => { element.inert = open; });
  if (open) {
    menuOrigin = document.activeElement;
    siteNav?.querySelector<HTMLAnchorElement>('a')?.focus();
  } else if (menuOrigin instanceof HTMLElement) {
    menuOrigin.focus();
    menuOrigin = null;
  }
  if (!open && header) {
    header.classList.toggle('site-header--light', themeBeforeMenuLight);
    showLogo(themeBeforeMenuLight);
    syncTheme();
  }
};

menuToggle?.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenuOpen(false); });
mobileViewport.addEventListener('change', ({ matches }) => { if (!matches) setMenuOpen(false); });
