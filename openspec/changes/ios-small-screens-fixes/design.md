## Context

Ver proposal.md — Why. Estado observado en el código:

- **Flechas**: `src/styles/global.css` declara DM Sans con el `unicode-range` latino de Google (incluye sólo `U+2191`/`U+2193`); `public/fonts/dm-sans-latin.woff2` no tiene glifo para `→` (U+2192) ni `↗` (U+2197) (verificado con `fontkitten`). `→` cae a la fuente del sistema; `↗` tiene la propiedad Emoji y en iOS cae a Apple Color Emoji. Hay ~30 usos en `src/views/*.astro` y `src/pages/404.astro`, siempre como `<span aria-hidden="true">→</span>` o `<i aria-hidden="true">↗</i>`, y el CSS los anima por selector de elemento (`.cta-actions a span`, `.index-row i`, `.panel-button span`, `.f-submit button span`, `.hero-index span`, `.ed-cta-link span`).
- **Slider de la home** (`mountSlider` en `src/scripts/motion.ts`, bloque `.home.is-slider` en `global.css`): listeners `touchstart/move/end` pasivos en `document`; `body.is-slider { height: 100dvh; overflow: hidden; touch-action: pinch-zoom }`; la experiencia es `position: fixed; inset: 0`; el stage es una columna flex de paneles `height: 100%` y se mueve con `translate: 0 <px>` a partir de `size = wrapper.clientHeight` medido al montar y en `resize`. Nada impide que Safari tome el gesto como scroll/rubber-band del documento (`overflow: hidden` en `body` no lo bloquea en iOS) ni que colapse su barra; cuando la altura del contenedor cambia, los paneles crecen pero el `translate` en px queda fijo hasta que corre JS.
- **Marca de agua de los CTA** (`putnam.css`, `unete.css`, `contacto.css`, `noticias.css`): `.cta-mark { position: absolute; right: -4%; bottom: 8%; width: 72vw }` en móvil, con secciones de `min-height: 0`; medido en Chromium a 390 px, la marca ocupa y = 196–477 y los enlaces y = 301–417 (se cruzan). `eredita.css` ya la tiene en flujo en móvil (`margin: 3rem auto 0`).
- **Marca del hero de Ereditá** (`eredita.css`): `.ed-hero-mark { position: absolute; top: 38vh; transform: translateY(-50%); width: 40vw }` en móvil; el hero es `min-height: 100svh` con el contenido alineado abajo. A 375 × 635 la marca (y = 184–299) pisa el enlace de regreso y el kicker (contenido desde y = 243). La clase `ed-hero-mark` vive en el `<img>` que Astro `<Picture>` envuelve en un `<picture>`.
- **Menú**: `.site-nav { background: rgba(244, 238, 223, 0.97) }` en móvil (elegido en su momento frente a `backdrop-filter`, ver `mobile-rendering-performance`).
- **Auditoría** (`tests/mobile-audit.mjs`): Chromium a 390 × 844 (slider también a 754); sólo comprueba que la marca del hero quepa horizontalmente. No hay WebKit instalado (`~/.cache/ms-playwright` sólo tiene Chromium).

## Goals / Non-Goals

**Goals:**
- Que las cuatro fallas visibles en iOS desaparezcan sin tocar desktop (≥ 768 px).
- Que la auditoría en Chromium capture las tres que son geométricas (solapes, slider tras cambio de altura) para que no vuelvan.
- Mantener el presupuesto de `mobile-rendering-performance` (sin trabajo por frame fuera del arrastre, sin `backdrop-filter`).

**Non-Goals:**
- Regenerar el subconjunto de fuentes para incluir flechas (no hay pipeline de subsetting en el repo y no resolvería la presentación emoji en navegadores sin el glifo).
- Cambiar el ritmo vertical de las secciones interiores en móvil (el hueco entre "Oportunidades" y "Proceso" en Únete es el padding de 6 rem de cada sección, no un defecto).
- Reproducir el colapso de la barra de Safari en Playwright (no es emulable); esa parte se cubre con el diseño resistente a cambios de altura y con la prueba en el iPhone real.

## Decisions

### D1. Flechas: SVG inline en un componente, dentro del mismo `<span>`/`<i>`

`src/components/Arrow.astro` con `dir: 'right' | 'up-right'` y `as: 'span' | 'i'` (por defecto `span`). Renderiza `<span aria-hidden="true"><svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">…</svg></span>` con un trazo recto y una punta abierta, del mismo peso óptico que el `→` de DM Sans. Conservar el elemento envoltorio (`span` o `i`) mantiene válidos todos los selectores y transiciones de hover existentes sin tocar CSS; `1em`/`currentColor` hereda tamaño y color donde el CSS ya sube el `font-size` (`.index-row i { font-size: 1.4rem }`, `.panel-button span { 1.2rem }`). El SVG lleva `display: block` y `vertical-align: -0.1em` (regla única en `global.css`) para alinear con la línea base de la mayúscula.

Alternativas descartadas: (a) `↗&#xFE0E;` (selector de presentación de texto) — Safari lo respeta, pero el glifo sigue viniendo de una fuente del sistema distinta por plataforma y `→` seguiría cayendo a fallback; (b) icono por CSS `mask` — obliga a cambiar el markup igual y pierde la herencia de `currentColor` en algunos navegadores antiguos.

El `←` de `.ed-back` (U+2190, sin propiedad Emoji) y el `⌄` del select custom se dejan como están.

### D2. Slider: gesto exclusivo y posición de reposo sin píxeles

1. **Gesto exclusivo**: `.home.is-slider .home-experience { touch-action: none }` (sólo la experiencia; `body` conserva `pinch-zoom` para que el menú, que vive en el header, pueda desplazarse). `touchmove` pasa a `{ passive: false }` y llama a `event.preventDefault()` únicamente mientras `dragging` es verdadero y el toque empezó dentro de la experiencia; `touchstart`/`touchend` siguen pasivos, así los toques en el header, la hamburguesa y la flecha siguen generando `click`. Además `html.is-slider, body.is-slider { height: 100%; overflow: hidden; overscroll-behavior: none }` (la clase también en `<html>`), que elimina el rubber-band residual de iOS y evita que Safari colapse su barra. Es el mismo esquema que usa Swiper en iOS (`touch-action` + `preventDefault` en move).
2. **Siempre en px** (revisado el 18 sep tras la prueba en iPhone): la primera versión escribía el reposo en `%` para que un cambio de altura se recalculara sin JS, pero al pasar cada capa de `%` a px al iniciar un gesto (y al revés al aterrizar) Safari reconstruye la capa compuesta y las fotos con `decoding="async"` quedan en blanco un frame: parpadeo por foto en cada swipe. Ahora stage, fotos, copys y títulos se escriben siempre en px; el cambio de altura se cubre con `resize` de `window` y de `visualViewport` (re-render sin transición), y las fotos del slider llevan `decoding="sync"` (prop nueva de `CmsImg`). La posición al iniciar un gesto se lee por geometría (`getBoundingClientRect`), nunca con `getComputedStyle().translate`.
3. **Medida durante el arrastre**: `size` se lee en `touchstart` (`wrapper.clientHeight`, una lectura por gesto, no por frame) y también en `visualViewport.resize` además de `window.resize`; el `render()` en px se limita al arrastre y al fotograma de congelado al empezar un gesto (`getComputedStyle(...).translate` devuelve px aunque el estilo esté en %, así que el congelado no cambia).
4. `tests/mobile-perf.mjs` no debe ver más trabajo: no se añade ningún rAF ni handler de scroll.

Alternativa descartada: recalcular en `resize` con px (es lo que hay) — depende del orden y del momento en que iOS dispara `resize` respecto al crecimiento animado del contenedor fijo; el porcentaje elimina la dependencia.

### D3. Marca de agua de los CTA en flujo en móvil

En el bloque `@media (max-width: 767px)` de `putnam.css`, `unete.css`, `contacto.css` y `noticias.css`: `.cta-mark { position: static; display: block; width: 72vw; margin: 2.5rem -1rem 0 auto; }` (sangra por la derecha igual que hoy; `overflow: hidden` de la sección ya la recorta), y se reduce el `padding-bottom` de la sección (7 rem → 4 rem en Putnam, 5 rem → 3.5 rem en las otras) porque la marca ya aporta altura. Las secciones son `display: flex; flex-direction: column` (Únete/Contacto/Noticias) o bloque (Putnam), así que el orden DOM (acciones → marca) ya da el resultado; en Putnam la sección lleva `data-reveal-group` y la marca hereda la animación del grupo, sin cambios. Desktop conserva la regla absoluta.

### D4. Marca del hero de Ereditá en flujo en móvil

La marca del hero es el logotipo del proyecto (no una marca de agua como las de los CTA) y la regla es que nunca vaya sobre texto, en ningún viewport. En desktop ya se cumple: a 1366 × 768 y 1512 × 982 (laptops de 14") la marca ocupa x 915–1270 / 1022–1406 y el bloque de texto termina en x 873 / 877, sin intersección en `/eredita/` ni en la página de proyecto; no se toca, sólo se añade la comprobación. En móvil:

En `eredita.css` (móvil): `.ed-hero { flex-direction: column; justify-content: flex-end; align-items: stretch; }`, `.ed-hero > picture { display: block; align-self: flex-end; margin: 0 0 clamp(1.5rem, 5vh, 3rem); }` y `.ed-hero-mark { position: static; top: auto; right: auto; width: 40vw; transform: none; }`. El bloque de texto sigue abajo; la marca queda encima de él y sube cuando el texto crece. El `min-height: 100svh` y el `padding` inferior no cambian. La animación `m-fade-up` del hero sólo afecta a `.ed-hero-content > :not(h1)`, así que la marca no se ve afectada. En `/eredita/` y en las páginas de proyecto el markup es el mismo (`<Picture class="ed-hero-mark">` seguido de `.ed-hero-content`), así que una sola regla cubre ambas.

Alternativa descartada: mantenerla absoluta con `top` en `svh` o `%` — sigue chocando con títulos de 4–5 renglones en 320–375 px.

### D5. Menú opaco

`.site-nav { background: var(--putnam-cream) }` en móvil (sin alfa). Sin `backdrop-filter`, en línea con `mobile-rendering-performance`.

### D6. Auditoría

- Nueva pasada `shortViewports = [{375, 635}, {360, 640}]` en `tests/mobile-audit.mjs`, limitada a: sin overflow horizontal en todas las rutas, no-intersección marca-vs-texto en `/eredita/` y en la página de proyecto, y marca-de-agua-debajo-de-enlaces en `/putnam/`, `/unete/`, `/contacto/`, `/noticias/` (helper `intersects(a, b)` con `getBoundingClientRect`). Se reutiliza el mismo `context` cambiando `setViewportSize`.
- Slider: nuevo check "scene after viewport height change": cargar a 390 × 754, pulsar la flecha hasta la escena 2, `setViewportSize(390 × 844)` y comprobar que el panel activo cubre el viewport; se comprueba además que `wrapper.style.translate` en reposo termina en `%`, para que el test falle si se vuelve a px aunque el `resize` de Chromium lo disimule.
- Flechas: check "no arrow characters in action links" (`document.body.innerText` de `a, button` no contiene `→` ni `↗`) y que cada `Arrow` tenga `svg` con `stroke: currentColor`.
- WebKit: script `test:mobile:webkit` = `PLAYWRIGHT_BROWSER=webkit node tests/mobile-audit.mjs`; el audit elige `webkit` o `chromium` según la variable y salta con aviso si el navegador no está instalado. Instalación con `npx playwright install webkit` (puede necesitar `--with-deps`); no es obligatoria para `npm run build`.

## Risks / Trade-offs

- [`touch-action: none` desactiva pinch-zoom sobre las escenas de la home en móvil] → la meta viewport sigue permitiendo zoom (no afecta a la auditoría de accesibilidad); el menú y las páginas interiores conservan el zoom. Si se quiere conservar el pinch en la home, la alternativa es `touch-action: pinch-zoom` + `preventDefault` sólo con un dedo — se prueba primero `none` por ser el comportamiento verificado en Swiper.
- [`touchmove` no pasivo] → Chrome avisa en consola sólo si el handler no llama `preventDefault`; se limita al arrastre activo dentro de la experiencia.
- [El porcentaje en `translate` del stage depende del número de paneles] → se calcula en runtime desde `panels.length`; el test comprueba el aterrizaje de todas las escenas.
- [La marca en flujo alarga los CTA en móvil] → compensado con menos `padding-bottom`; se comparan capturas antes/después.
- [WebKit de Playwright no reproduce la barra de Safari ni Apple Color Emoji] → la verificación final es en el iPhone real (URL de preview de Vercel) con las mismas capturas del reporte; la pasada WebKit sólo valida el gesto y el layout.
- [Reemplazo masivo de flechas] → el check de la auditoría y `grep -rn "→\|↗" src/views src/pages` tras el cambio garantizan que no quede ninguna.
