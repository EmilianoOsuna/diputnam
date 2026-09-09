const menuToggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const siteNav = document.querySelector<HTMLElement>('.site-nav');
const mobileViewport = window.matchMedia('(max-width: 767px)');
let menuOrigin: Element | null = null;
let themeBeforeMenuLight = false;

const header = document.querySelector<HTMLElement>('[data-auto-theme]');
const logo = header?.querySelector<HTMLImageElement>('[data-logo-dark]');
const themedSections = Array.from(document.querySelectorAll<HTMLElement>('[data-header-theme]'));
let themeFrame = 0;

const updateHeaderTheme = () => {
  themeFrame = 0;
  if (!header || !logo || themedSections.length === 0) return;
  const sampleY = header.getBoundingClientRect().bottom / 2;
  const activeSection = themedSections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= sampleY && rect.bottom > sampleY;
  });
  if (!activeSection) return;
  const light = activeSection.dataset.headerTheme === 'light';
  header.classList.toggle('site-header--light', light);
  logo.src = light ? logo.dataset.logoLight ?? logo.src : logo.dataset.logoDark ?? logo.src;
};

const scheduleThemeUpdate = () => {
  if (!themeFrame) themeFrame = window.requestAnimationFrame(updateHeaderTheme);
};

window.addEventListener('scroll', scheduleThemeUpdate, { passive: true });
window.addEventListener('resize', scheduleThemeUpdate);
updateHeaderTheme();

const setMenuOpen = (open: boolean) => {
  if (open && !mobileViewport.matches) return;
  if (open && header && logo) {
    themeBeforeMenuLight = header.classList.contains('site-header--light');
    header.classList.remove('site-header--light');
    logo.src = logo.dataset.logoDark ?? logo.src;
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
  if (!open && header && logo) {
    header.classList.toggle('site-header--light', themeBeforeMenuLight);
    logo.src = themeBeforeMenuLight ? logo.dataset.logoLight ?? logo.src : logo.dataset.logoDark ?? logo.src;
    scheduleThemeUpdate();
  }
};

menuToggle?.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
siteNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenuOpen(false); });
mobileViewport.addEventListener('change', ({ matches }) => { if (!matches) setMenuOpen(false); });
