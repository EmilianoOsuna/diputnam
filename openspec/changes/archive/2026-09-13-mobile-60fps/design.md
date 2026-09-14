## Context

Ver `proposal.md › Why` para el diagnóstico. Estado que condiciona el diseño:

- Astro 7 con un `<script src>` por página (`src/scripts/*-motion.ts`) que hoy importa Lenis/GSAP/ScrollTrigger estáticamente en todas las rutas salvo Putnam, que ya usa `import()` dinámico y salta Lenis en `< 768px`. Astro/rolldown separa los `import()` en chunks propios (`gsap.*.js` 70 KB, `ScrollTrigger.*.js` 43 KB, `lenis.*.js` 19 KB), así que la bifurcación por breakpoint basta para que móvil no los descargue.
- La home usa un stage sticky (`100lvh`) con cuatro paneles posicionados en absoluto y cuatro `scene-marker` de `100svh` debajo (`margin-top: -100lvh`). Los paneles se desplazan exactamente su propia altura (= altura del stage) durante cada transición; el copy se desplaza en sentido contrario `travel − 60px` para que el título quede anclado. Esa geometría es la que hay que reproducir en CSS.
- Playwright 1.63 con Chromium 1243 está instalado (`~/.cache/ms-playwright`), por lo que la prueba de rendimiento puede ejecutarse localmente contra `astro preview`. Chromium 1243 soporta `animation-timeline`, `view-timeline`, `timeline-scope`, `animation-range` y CDP `Emulation.setCPUThrottlingRate`/`Input.synthesizeScrollGesture`/`Tracing`.
- Las imágenes de home, heros y Proceso vienen de Unsplash (imgix), que acepta `sat=` en la URL; `src/lib/images.ts` ya centraliza la construcción de esas URLs. No hay imágenes de Contentful en uso hoy, aunque el helper las contempla.
- `openspec/specs/contacto-page` ya prohíbe `backdrop-filter` en el header; el menú móvil vive en `global.css` y no está cubierto por ninguna spec, así que retirar el blur no contradice requisitos.
- El dispositivo de referencia del usuario es un Android con Chrome (ver `mobile-polish-audit`). No se dispone de iOS para validar el fallback en Safari < 26.

## Goals / Non-Goals

**Goals:**

- Que en `< 768px` no exista ningún código propio que corra por frame ni por evento de scroll del documento, y que todo movimiento ligado al scroll sea declarativo (compositor).
- Que desktop conserve exactamente el comportamiento actual (Lenis + GSAP + pins + barrido JS), reorganizado en módulos cargados sólo allí.
- Que la prueba `npm run test:perf` sea el criterio de aceptación: rojo en el código actual, verde tras el cambio, y capaz de detectar regresiones de tipo "listener de scroll con lectura de layout".
- Reducir el JS móvil a un módulo pequeño compartido (`mobile-motion.ts`) + el script de página.

**Non-Goals:**

- Cambiar el diseño visual, la tipografía, el contenido o las rutas.
- Optimizar desktop más allá de lo que comparte con móvil (tema del header por IO, saturación horneada).
- Soportar el barrido de escenas en navegadores móviles sin `animation-timeline` (degradan a snap vertical).
- Medir en dispositivos físicos de forma automatizada; la validación en el Android del usuario sigue siendo manual.

## Decisions

### D1. Bifurcación por breakpoint con importación dinámica del motor desktop

Cada `*-motion.ts` queda como orquestador: evalúa una vez `matchMedia('(max-width: 767px)')` y `prefers-reduced-motion`; en móvil monta `mobile-motion.ts`; en desktop hace `import('./desktop/<page>.ts')` que contiene el código actual (Lenis, GSAP, pins, parallax) sin cambios de comportamiento. Las pistas horizontales (`horizontal-track.ts`) siguen montándose por `matchMedia('(max-width: 899px)')` como hoy, independientes del motor.

- *Alternativa*: `gsap.matchMedia` para desactivar animaciones en móvil manteniendo la librería. Descartada: el ticker de GSAP sigue corriendo y los 136 KB se descargan igual.
- *Alternativa*: reaccionar a `change` del `matchMedia` cambiando de motor en caliente. Descartada por complejidad; cruzar el breakpoint tras la carga (rotar una tablet de 760→1024 px) requiere recarga, y se documenta.

### D2. Barrido de la home en CSS con una animación por panel sobre el `view-timeline` de su marcador

- `.home-experience { timeline-scope: --scene-0, --scene-1, --scene-2, --scene-3 }` (los nombres se generan en Astro desde `homePanels`; `.scene-marker[data-index="n"] { view-timeline-name: --scene-n }`).
- Cada `.panel[data-index="n"]` recibe una única animación `scene-sweep` con `animation-timeline: --scene-n` y `animation-range: entry 0% exit 100%`, `fill-mode: both`, `timing: linear`. Como marcador y scrollport miden `100svh`, `entry 100%` coincide con `exit 0%`, así que las keyframes son: `0% → translateY(100%)`, `50% → translateY(0)`, `100% → translateY(-100%)`. El panel 0 arranca ya en el 50 % (su marcador está en pantalla en scroll 0) y el último nunca pasa del 50 % (el documento termina ahí). `translateY(100%)` del panel equivale a la altura del stage (`100lvh`), lo que preserva la continuidad con la barra de direcciones retraída que exige `home-ui-motion-readability`.
- `.panel-content` recibe la animación inversa `title-hold`: `0% → translateY(calc(-100lvh + 60px))`, `50% → 0`, `100% → translateY(calc(100lvh - 60px))`, sobre la misma timeline y rango.
- No se anima `opacity`, `visibility`, `clip-path` ni `z-index`: fuera de su rango cada panel queda desplazado ±100 % y el `overflow: hidden` del stage lo recorta; saliente y entrante son contiguos y nunca se solapan, así que el orden de pintado no importa.
- Estado activo (`is-active`, `aria-hidden`, `inert`, `pointer-events`) por `IntersectionObserver` sobre los marcadores con `rootMargin: '-50% 0px -50% 0px'`: se dispara sólo al cruzar el punto medio de cada transición (mismo umbral 0,5 que hoy).
- Entrada inicial (header/footer y stagger del copy intro) con `@keyframes` CSS y `animation-delay` escalonado por `--i`, sin JS.
- *Alternativa*: `scroll(root)` con porcentajes calculados por índice. Descartada: acopla las keyframes al número de escenas y a la longitud total del documento; con `view-timeline` cada panel sólo conoce su marcador.
- *Alternativa*: dos animaciones (entrada/salida) con `animation-composition: add`. Descartada: una sola animación con tres keyframes cubre el caso sin depender de `animation-composition`.

### D3. Fallback de la home sin `animation-timeline`: escenas apiladas con snap vertical

Detección con `CSS.supports('animation-timeline: view()')` en el script y `@supports not (animation-timeline: view())` en CSS. Sin soporte, `.home` recibe `is-stacked`: el stage deja de ser sticky, los paneles vuelven a flujo (`position: relative; height: 100svh; scroll-snap-align: start`), los marcadores se ocultan y `html` lleva `scroll-snap-type: y mandatory` sólo en esa página. El scroll cue y los enlaces `#id` navegan con `scrollIntoView`.

- *Alternativa*: mantener el motor GSAP actual como fallback en modo "lite". Descartada: obliga a mantener dos motores móviles y el problema de latencia (JS detrás del scroll nativo) persistiría precisamente en los navegadores que caen al fallback.

### D4. Reveals y entradas móviles con clases + transiciones CSS activadas por `IntersectionObserver`

`mobile-motion.ts` expone `mountReveals(root)`: marca cada hijo de `[data-reveal-group]` (fuera del hero) con `data-reveal` y `--i`; un único IO con `rootMargin: '0px 0px -18% 0px'` (equivale a `start: 'top 82%'`) añade `is-in` y deja de observar. CSS: `[data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity .9s, transform .9s cubic-bezier(.22,1,.36,1); transition-delay: calc(var(--i) * 70ms) }` y `.is-in { opacity: 1; transform: none }`, todo dentro de `@media (max-width: 767px) and (prefers-reduced-motion: no-preference)`. La entrada del hero es una `@keyframes` CSS escalonada dentro de la misma media query; arranca desde `opacity: 0` en la propia keyframe, por lo que no hay flash sin necesidad de `motion-pending` (que se conserva sólo para el flujo desktop de Putnam) y sin JS el contenido termina visible igualmente.

- *Alternativa*: `gsap.from` con `import()` sólo de `gsap` (sin ScrollTrigger). Descartada: sigue descargando 70 KB y arrancando el ticker; el reveal con `toggleActions … reverse` de desktop no se replica en móvil (una vez revelado, el grupo se queda visible, como exige `mobile-page-motion`).

### D5. Rail de Proceso ligado al scroll en CSS, con el rAF actual sólo como fallback

`.process { timeline-scope: --process }`, `.process-markers { view-timeline-name: --process }`, `.process-rail span { animation: rail-grow linear both; animation-timeline: --process; animation-range: contain 0% contain 100% }` (`contain` en un elemento más alto que el scrollport va de "borde superior alineado arriba" a "borde inferior alineado abajo", que es exactamente `(scrollY − trackTop) / (trackHeight − innerHeight)` del código actual). Los pasos activos usan el IO ya escrito en la rama reduced-motion de `putnam-motion.ts`, que pasa a ser la rama móvil general. Sin `animation-timeline`, se monta el `scroll` + rAF existente (coalescido, geometría cacheada) y la prueba de rendimiento lo tolera sólo cuando `CSS.supports` es falso.

### D6. Tema del header y scroll cue por `IntersectionObserver` (todas las rutas, todos los breakpoints)

`menu.ts` sustituye el listener de `scroll` + `getBoundingClientRect` por un IO sobre `[data-header-theme]` con `rootMargin: '-3% 0px -96% 0px'` (banda de ~1 % del alto del viewport a la altura del centro del header). El callback aplica el tema de la entrada que intersecta; se recrea en `resize` (raro). El scroll cue observa un centinela al final del documento (`[data-scroll-end]`) para alternar `data-direction`. Ambos mecanismos sirven también a desktop, donde eliminan las lecturas por frame sin cambiar cuándo cambia el tema.

### D7. Saturación horneada en la URL y retirada de `filter`/`backdrop-filter`

`remoteImage(src, width, quality, { sat })` añade `sat=` para `images.unsplash.com` (imgix). Equivalencias iniciales: `saturate(0.78)` → `sat=-22`; `saturate(0.65)` → `sat=-35`; `saturate(0.62)` → `sat=-38`; `saturate(0.85)` → `sat=-15`; `saturate(0.92)` → `sat=-8`; `sepia(0.08)` se descarta. Se retira el `filter` CSS de `.panel-media`, `.hero-frame img`, `.process-media img`, `.ed-hero-media img`, `.ed-masonry-item img`, `.ed-h-media img` y `.nw-featured-media img` en todos los breakpoints (una sola URL por `srcset`, sin bifurcar `<picture>` por media). `.ct-map iframe` pierde el filtro en `< 768px`. `.site-nav` móvil pasa a `background: rgba(244, 238, 223, 0.97)` sin `backdrop-filter`.

- *Alternativa*: mantener el filtro sólo en desktop. Descartada: obligaría a dos juegos de URLs o a un `<picture>` por breakpoint para cada imagen; la diferencia visual entre filtro CSS y `sat` de imgix es menor que la variación entre pantallas.

### D8. `tests/mobile-perf.mjs` como criterio de aceptación

Por ruta: contexto `390×844`, `isMobile`, `hasTouch`, DPR 2; sesión CDP con `Emulation.setCPUThrottlingRate({ rate: 4 })`. `addInitScript` instala sondas antes de cualquier script del sitio: envuelve `requestAnimationFrame` y `addEventListener('scroll', …)` (en `window`/`document`) para contar invocaciones de callbacks registrados por el sitio (las sondas propias usan la referencia original y no se cuentan); muestrea intervalos entre frames con su propio rAF; `PerformanceObserver` de `longtask`. Tras `networkidle` + 1 s, se activa `Tracing` con `disabled-by-default-devtools.timeline` y se sintetiza un gesto táctil (`Input.synthesizeScrollGesture`, `yDistance: -1600`, `speed: 1200`) seguido de otro de vuelta; se paran las sondas y el trace. Métricas: p50/p95 de intervalo, frames > 33 ms, long tasks ≥ 50 ms durante el gesto, layouts forzados (eventos `Layout` con `beginData.stackTrace`) durante el gesto, callbacks rAF/scroll del sitio. Umbrales según `mobile-rendering-performance`. Para las pistas horizontales se sintetiza un gesto horizontal aparte con umbral "≤ 1 callback por frame". Sale con código ≠ 0 si cualquier ruta falla y recoge todos los fallos (patrón de `mobile-audit.mjs`). `putnam-performance.mjs` se elimina.

## Risks / Trade-offs

- [Safari iOS < 26 no soporta `animation-timeline`] → fallback D3 (apilado con snap), verificado emulando `CSS.supports` falso en la prueba; se acepta que en esos navegadores no haya barrido.
- [Diferencia tonal entre `sat=` de imgix y `saturate()` CSS] → capturas antes/después a 1440 y 390 px en la tarea de imágenes; ajustar valores de `sat` si el usuario nota deriva.
- [`Tracing` en headless puede omitir eventos o ser ruidoso] → el conteo de layouts forzados se limita a la ventana del gesto y se compara contra el baseline rojo; si resulta inestable, el criterio de "cero trabajo por frame" (conteo de callbacks) sigue siendo el primario y es determinista.
- [Rendimiento de headless ≠ Android real] → el throttling ×4 y el gesto táctil acercan la medición; la validación final es manual en el Android del usuario contra el deploy de `dev`.
- [Cambiar el tema del header por IO altera en unos px el punto de cambio] → la banda `-3%/-96%` se ajusta para coincidir con el punto de muestreo actual (`header.bottom / 2`); `mobile-audit.mjs` ya verifica el cambio de tema en Putnam.
- [Sin Lenis en móvil, los enlaces `#id` y el scroll cue usan `scrollIntoView` nativo] → `html { scroll-behavior: smooth }` dentro de `prefers-reduced-motion: no-preference` en las rutas móviles; en la home apilada, el snap garantiza que caen en escena.
- [Cruzar el breakpoint tras la carga no cambia de motor] → se documenta; el listener de `matchMedia` ya existente en las pistas horizontales sigue funcionando.

## Migration Plan

1. Escribir `tests/mobile-perf.mjs` y ejecutarlo contra el código actual: guardar la salida como baseline rojo en la tarea correspondiente (no en el repo).
2. Aplicar D6 y D7 (compartidos, bajo riesgo) y volver a medir.
3. Aplicar D1 + D4 + D5 en las cinco páginas interiores; verificar `test:mobile`, `test:sweep`, `test:perf`.
4. Aplicar D2 + D3 en la home; verificar los tres tests y las capturas de `mobile-audit` (franja entre paneles, cobertura del stage).
5. Push a `dev`, esperar deploy de Cloudflare, revisión manual del usuario en Android (seis rutas + menú + pistas).
6. Rollback: cada paso va en su commit; revertir por commit conserva los pasos anteriores verdes.

## Open Questions

- Valores finales de `sat` por imagen (se ajustan visualmente en la tarea de imágenes; no cambian specs ni tareas).
- Si el usuario dispone de un iPhone para comprobar el fallback D3 en Safari; si no, se valida sólo por emulación.

## Resultado (13 sep 2026)

- `npm run test:perf`: seis rutas en verde; 0 callbacks rAF/scroll del sitio durante el gesto (baseline: 1.100–1.500 por gesto), 0 en reposo (baseline: ~62/500 ms), sin librerías de movimiento en móvil, < 3 KB gzip de JS por ruta.
- Revisión en el Android del usuario: sin tirones en ninguna ruta. Follow-up abierto: unificar el lenguaje de entrada de los títulos de hero (unos entran en bloque, otros por renglón).
- `diputnam.project0-0s.workers.dev` seguía sirviendo el build anterior tras el push a `dev`; el audit remoto queda por correr contra el deploy que tome estos commits.
