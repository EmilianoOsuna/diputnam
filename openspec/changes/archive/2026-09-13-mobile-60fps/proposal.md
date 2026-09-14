## Why

Tras `mobile-polish-audit` y el primer intento de `mobile-60fps`, las seis rutas siguen dando tirones en móvil y la experiencia queda comprometida. El plan anterior se limitó a micro-optimizaciones (coalescer rAF, acotar `will-change`, refresh tras carga del hero) sin medir nunca en navegador —Playwright no estaba instalado— y sin tocar la causa raíz: en móvil todo el movimiento ligado al scroll se calcula en el hilo principal, un frame por detrás del scroll nativo (que corre en el compositor), sobre imágenes a pantalla completa con `filter` y un menú con `backdrop-filter`. Aunque el contador de frames marque 60, la escena siempre va 1–2 frames detrás del dedo y eso se percibe como tirón.

Hallazgos observados en el código actual:

- **Home (`motion.ts`)**: Lenis + GSAP ticker corren también en móvil. Cada frame de scroll ejecuta `ScrollTrigger.update()` → `onUpdate` con ~12 `gsap.set` (opacity, visibility, `clip-path`, `z-index`, `y`) sobre 4 paneles, más `setActive` que alterna `inert`, `aria-hidden` y clases en los 4 paneles y hace `blur()`; `updateScrollCue` lee `scrollHeight` en el mismo ciclo. Las imágenes de panel llevan `filter: saturate(0.78)` a pantalla completa y `transform: scale(1.04)`.
- **Header (`menu.ts`)**: en cada evento `scroll` de cualquier ruta se hace `getBoundingClientRect()` de todas las secciones con `data-header-theme` en un rAF independiente del de GSAP → lecturas de layout intercaladas con escrituras (forced synchronous layout por frame).
- **Menú móvil (`global.css`)**: overlay a pantalla completa con `backdrop-filter: blur(18px)` animando `opacity`/`transform` → re-blur de toda la pantalla en cada frame de apertura/cierre.
- **Páginas interiores (`eredita/unete/contacto/noticias-motion.ts`)**: instancian Lenis y el ticker de GSAP en móvil aunque el scroll sea nativo; descargan ~136 KB de `gsap` + `ScrollTrigger` + `lenis` antes de animar el hero. Los heros de Únete/Contacto/Noticias conservan `filter: saturate() sepia()` sobre la imagen a pantalla completa en móvil; el mapa de Contacto lleva un `iframe` con `filter: grayscale()`.
- **Medición**: `tests/putnam-performance.mjs` sólo cubre `/putnam`, sin throttling de CPU ni gesto táctil, y nunca se ha ejecutado. Playwright Chromium ya está instalado en este entorno, así que ahora sí es posible medir de forma reproducible.

## What Changes

- **Runtime de movimiento dividido por breakpoint**: en viewports `< 768px` ninguna ruta carga ni ejecuta Lenis, GSAP ni ScrollTrigger. Desktop (`≥ 768px`) conserva el motor actual sin cambios de comportamiento.
- **Home móvil en el compositor**: el barrido de escenas y el título persistente pasan a CSS scroll-driven animations (`animation-timeline` con `view-timeline` sobre los `scene-marker` y `timeline-scope` en `.home-experience`), animando sólo `transform`/`opacity`. El estado activo (`is-active`, `aria-hidden`, `inert`, `pointer-events`) se actualiza con un `IntersectionObserver` sobre los marcadores, no por frame. Sin soporte de `animation-timeline`, la home móvil degrada a paneles apilados a pantalla completa con `scroll-snap-type: y mandatory` (mismo flujo que reduced motion) — **cambio de comportamiento observable** respecto al barrido JS actual en esos navegadores.
- **Entradas y reveals móviles sin librería**: la animación de entrada del hero y los reveals por scroll de las páginas interiores se implementan con clases + transiciones CSS activadas por `IntersectionObserver`, cumpliendo el mismo lenguaje (aparición con desplazamiento sutil y escalonado). El rail de Proceso en Putnam y los rails de Únete/Contacto usan scroll-driven animation con fallback al rAF ya existente.
- **Cero trabajo por frame durante el scroll móvil**: el tema del header se resuelve con `IntersectionObserver` (callback sólo al cruzar fronteras); el scroll cue se actualiza al llegar/salir del final con el mismo mecanismo; no queda ningún listener de `scroll` que lea geometría por frame en móvil (excepto el rail de las pistas horizontales, que ya está coalescido y sólo corre mientras se hace swipe).
- **Sin filtros de pantalla completa**: la saturación de las imágenes Unsplash se hornea en la URL (`sat=`) y se retira el `filter` CSS de paneles de la home y heros interiores en todos los breakpoints; el `sepia(0.08)` se descarta por ser sub-perceptual. El `iframe` del mapa pierde el filtro en móvil. El menú móvil sustituye `backdrop-filter: blur` por fondo opaco de la paleta.
- **Medición reproducible como criterio de aceptación**: nueva prueba `tests/mobile-perf.mjs` que, para las seis rutas a 390×844 con `isMobile`/`hasTouch`, CPU throttling ×4 vía CDP y gesto de scroll sintetizado, mide intervalos de rAF, long tasks, layouts forzados y trabajo JS por frame, y falla por encima de umbrales documentados. `putnam-performance.mjs` se retira en favor de esta prueba. Se añade `npm run test:perf`.

## Capabilities

### New Capabilities

- `mobile-rendering-performance`: fluidez medible en móvil: presupuesto por frame, ausencia de trabajo JS ligado al scroll, ausencia de efectos de pantalla completa costosos, prueba automatizada con umbrales y degradación explícita.

### Modified Capabilities

- `home-ui-motion-readability`: el requisito "Responsive y movimiento reducido" cambia en móvil: el barrido de escenas debe ejecutarse en el compositor (sin cálculo JS por frame) y, cuando el navegador no soporte animaciones ligadas al scroll, la home móvil degrada a escenas apiladas con snap vertical en lugar del barrido.
- `mobile-page-motion`: los requisitos de entrada del hero y reveals añaden que en móvil no se carga ninguna librería de movimiento y que las animaciones no ejecutan trabajo por frame ligado al scroll; la barra de progreso de Proceso se liga al scroll desde el compositor.

## Impact

- `src/scripts/motion.ts`, `menu.ts`, `putnam-motion.ts`, `eredita-motion.ts`, `unete-motion.ts`, `contacto-motion.ts`, `noticias-motion.ts`: bifurcación por breakpoint con importación dinámica de Lenis/GSAP sólo en desktop; nuevo módulo compartido (p. ej. `src/scripts/mobile-motion.ts`) con IO + clases.
- `src/styles/global.css`, `putnam.css`, `eredita.css`, `unete.css`, `contacto.css`, `noticias.css`: keyframes y timelines de la home, clases de reveal, retirada de `filter`/`backdrop-filter`, snap fallback.
- `src/lib/images.ts` y páginas que usan `remoteImage`: parámetro de saturación horneada.
- `tests/mobile-perf.mjs` (nuevo), `tests/putnam-performance.mjs` (eliminado), `package.json` (`test:perf`), `tests/mobile-audit.mjs` (ajustes por el fallback de home).
- Desktop: sin cambio de comportamiento salvo la saturación horneada en lugar del filtro CSS (visualmente equivalente) y menú sin blur en `< 768px` únicamente.
- Sin dependencias nuevas. Peso JS en móvil baja de ~140 KB a < 10 KB por ruta.
