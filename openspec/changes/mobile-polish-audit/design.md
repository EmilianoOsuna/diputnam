## Context

Ver `proposal.md` para la motivación. Estado observado que condiciona el diseño (medido con Playwright/Chromium 153 a 390×844 sobre `astro build` + `astro preview`, y confirmado por el usuario en Android Chrome y escritorio):

- **Logos.** `SiteHeader.astro` genera el isotipo con `getImage({ width: 120, format: 'webp' })` y lo pinta en un cajón de 44×52 px CSS (móvil) / 53×60 (desktop); en DPR 3 hacen falta ≥156 px. `eredita.astro` usa `<Image format="webp">` para la marca del hero: un único `<img>` WebP sin fallback. `src/assets/eredita-logo.png` es 2048², con el arte en el bbox (401,505)–(1636,1429): 5 % de cobertura, descentrado hacia abajo-derecha; al posicionarse con `right: 1rem; width: 52vw` el arte visible queda corrido y cortado. Los PNG de Putnam están razonablemente centrados (bbox 80,33–716,773 en 800²). `.cta-mark` usa `opacity: 0.2` sobre `#004b46` en cuatro páginas y `right: -4%` en móvil (sangrado intencional recortado por la sección). **Producción (Cloudflare Workers git-conectado, `diputnam.project0-0s.workers.dev`):** el HTML desplegado referencia toda imagen local como `/_image?href=%2F_astro%2F….png&w=…&f=webp` — el endpoint on-demand de Astro — y ese endpoint responde `404` porque el deploy es sólo de assets (no hay `_worker.js`). Los PNG/JPG originales sí se publican en `/_astro/` (200). Conteo de referencias rotas: home 3, Putnam 6, Ereditá 9, Únete 16, Contacto 16, Noticias 16 — incluye los heros de Únete y Contacto (`<Picture>`), no sólo los logos. **Log de build de Cloudflare (12 sep 2026 01:22 UTC, Node 24.18, npm 10.9):** `npm run build` genera correctamente las 25 imágenes optimizadas (`generating optimized images … 25/25`). Acto seguido `npx wrangler deploy` (wrangler 4.131.1) no encuentra `wrangler.jsonc` en el repo y entra en auto-setup: "Detected Project Settings – Framework: Astro", "Configuring project for Astro with `astro add cloudflare`" con respuesta automática *yes*; instala `@astrojs/cloudflare`, **reconstruye** (`adapter: @astrojs/cloudflare`, "Enabling image processing with Cloudflare Images") — build que emite `/_image?` y no genera derivados — y sube `dist/client` (37 archivos, ninguno `.webp/.avif`). La causa no es sharp ni Node: es la doble build con adapter que dispara la ausencia de configuración de wrangler en el repositorio.
- **Fondo café.** `global.css:26-33` fija `#594037` en `:root`, `html` y `body` (introducido en `e0883f8 feat: UI tinkering`; no pertenece a la paleta `--putnam-blue/sage/cream/ink` ni a `--putnam-deep/paper`). Ninguna página declara `theme-color`. El change `mobile-60fps` atribuyó el "indicador café" a la barra de gestos del teléfono; la evidencia actual muestra que el tono lo aporta el sitio.
- **Home.** `motion.ts` calcula `panelTravel = window.innerHeight` y traslada paneles saliente/entrante con ese valor; `.home-stage`/`.panel`/`.scene-marker` miden `100svh`. Con la barra de direcciones retraída `innerHeight = lvh > svh`, y la diferencia (60–120 px) queda descubierta entre ambos paneles mostrando el fondo del `body`. Reproducido forzando `svh = innerHeight − 90` → franja café de 90 px en el centro (`brownPct` 10 %).
- **Putnam.** `putnam-motion.ts` bifurca con `mobileViewport || reducedMotion` hacia una rama nativa (`is-native-motion`) que sólo gestiona el paso de Proceso y su rail; no hay `gsap.from` para el hero ni para `[data-reveal-group]`. Las otras cuatro páginas ejecutan GSAP en móvil (`eredita`, `unete` con Lenis incluido; `contacto`, `noticias` con `gsap.matchMedia` para parallax).
- **Pistas horizontales.** `eredita-motion.ts` y `unete-motion.ts` montan pin + track sólo en `(min-width: 900px)`. En `< 900px` el CSS apila (`.ed-h-track { display: block }`, `.un-culture { display: block }`), el `.pin-rail span` conserva el `width: 25%` estático y el contador `01`; Tipologías no tiene rail. La tarjeta intro de Tipologías es el primer `data-h-panel` dentro del track.
- **Herramientas.** Playwright 1.63 ya es dependencia; `tests/home-sweep.mjs` (`npm run test:sweep`) es el patrón existente (asserts con `node:assert`, `BASE_URL`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`). Chromium headless-shell 1243 quedó instalado en `~/.cache/ms-playwright` durante la auditoría.

## Goals / Non-Goals

**Goals:**
- Corregir las seis causas raíz con el menor número de superficies tocadas y sin regresión en desktop.
- Reutilizar un único helper para las dos pistas horizontales móviles (misma semántica de contador/rail).
- Dejar un script de auditoría móvil repetible que falle si reaparece cualquiera de los seis síntomas.

**Non-Goals:**
- Rediseñar la composición desktop de Tipologías o Nuestra cultura.
- Sustituir Lenis/GSAP o revisar el presupuesto de rendimiento de `mobile-60fps` más allá de no empeorarlo.
- Tocar `index.html` legado, copy o datos.

## Decisions

### D1. Logos: SVG cuando sea posible; si no, `<picture>` PNG + WebP con densidad 3×

- **Header.** Sustituir el `getImage(width: 120)` por dos `getImage` a 360 px (3× del cajón de 120 declarado) en WebP **y** PNG, y renderizar `<picture><source type="image/webp" srcset="… 1x, … 2x, … 3x"><img src=PNG …></picture>`; `menu.ts` sigue intercambiando `data-logo-*`, ahora sobre el `<img>` y el `<source>` (o, más simple, se conservan dos `<picture>` y se alterna `hidden`). Si el arte del isotipo se puede exportar limpio a SVG (trazo sólido, dos colores), se prefiere `putnam-mark.svg` inline con `currentColor` — elimina formato, densidad e intercambio de `src` a la vez. Como no tengo el vector, la tarea queda condicionada: "si existe SVG → inline; si no → `<picture>`".
- **Ereditá hero.** Recortar `eredita-logo.png` a su bbox con un margen del 4 % (sharp: `trim` o `extract`) y guardarlo como nuevo asset `eredita-logo.png` (800² aprox.); cambiar `<Image>` por `<Picture formats={['webp']} fallbackFormat="png">`. Con el arte recortado, `right: 1rem; width: 52vw` vuelve a significar lo que dice.
- **CTA `.cta-mark`.** Subir a `opacity: 0.32` y añadir `mix-blend-mode: luminosity`/`screen` sólo si el contraste con el texto lo permite (verificar con captura); mantener el sangrado `right: -4%` pero garantizar `overflow: hidden` en cada sección CTA (ya lo recorta hoy, se hace explícito).
- *Alternativas descartadas:* servir PNG sólo (pierde peso); confiar únicamente en el pipeline de build (fue precisamente lo que falló en producción, ver D7).

### D2. Fondo base = crema; `theme-color` por página

- `:root/html/body` → `var(--putnam-cream)` (`#f4eedf`), que ya es `--putnam-paper`/`--ed-paper` y coincide con la primera sección de Putnam/Únete/Contacto/Noticias/Ereditá tras el hero. La home pinta el hero encima con foto + `panel-shade`, y su `overscroll` superior mostrará crema; se añade `background: #0d1116` (el tono del `panel-shade`) a `.home-stage` para que los huecos de imagen en carga sean oscuros y no crema.
- `<meta name="theme-color" content="#f4eedf">` + `<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#003a36">` en las seis páginas. Se centraliza en un componente `SiteHead.astro` (charset, viewport, icon, preload de fuente, theme-color) para no repetirlo seis veces; `viewport` pasa a `width=device-width, initial-scale=1, viewport-fit=cover`.
- *Alternativa descartada:* verde profundo como base — deja un flash verde en todas las páginas claras al cargar.

### D3. Home: medir el viaje desde el stage, no desde `innerHeight`

- `viewportHeight` pasa a leerse como `stage.getBoundingClientRect().height` (equivale a `100svh`) en `refresh()` y en un `ResizeObserver` sobre `.home-stage`; `panelTravel` y `titleTravel` usan ese valor. Así la geometría coincide siempre con la caja que se recorta.
- Cinturón y tirantes: `.home.is-enhanced .panel` recibe `height: 100%` explícito y `.home-stage` un `background` oscuro (D2), de modo que si algún día vuelve a haber desfase, la franja sea del color de la escena y no café.
- *Alternativa descartada:* cambiar el stage a `100dvh` — hace que la caja cambie de alto mientras se hace scroll y provoca el salto de título que la spec de home prohíbe.

### D4. Putnam móvil: reveals con GSAP + ScrollTrigger, sin Lenis

- Se elimina la bifurcación por `mobileViewport`; sólo `reducedMotion` conserva la rama nativa. En móvil se importa GSAP/ScrollTrigger (dinámico, como hoy) pero **no** se instancia Lenis (`ScrollTrigger` escucha el scroll nativo). El resto de la rama GSAP (hero `gsap.from`, `[data-reveal-group]`, `processMarkers`, rail) se reutiliza tal cual; el parallax de `.cta-mark` y `[data-parallax]` se envuelve en `gsap.matchMedia('(min-width: 768px)')` igual que en `contacto-motion.ts`.
- Carga: el `import()` dinámico ya existía; se añade `will-change` acotado sólo durante la animación del hero para no penalizar el arranque medido en `mobile-60fps`.
- *Alternativa descartada:* CSS keyframes propias para Putnam — introduce un segundo lenguaje de motion y no cubre `[data-reveal-group]`.

### D5. Pistas horizontales: un helper `horizontal-track.ts` con `scroll-snap` nativo

- **Markup.** Tipologías: la tarjeta intro sale del track y se convierte en `<header class="ed-h-head">` (kicker, h2, intro, contador `data-track-current`/`data-track-total`, rail `data-track-rail`) encima del `div.ed-h-track`. Nuestra cultura: el `.pin-stage` ya es el encabezado; se le añaden los mismos `data-track-*` reutilizando `[data-pin-current]`/`[data-pin-rail]` como alias. En desktop, la tarjeta intro de Tipologías sigue siendo el primer panel del track: se rinde dos veces (header sólo `< 900px`, panel sólo `≥ 900px`) con `hidden` por media query, evitando lógica JS de recolocación.
- **CSS `< 900px`.** `.ed-h-track` / `.traits` → `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding-inline: var(--gutter); gap: 1rem; -webkit-overflow-scrolling: touch; scrollbar-width: none`. Tarjeta → `flex: 0 0 min(86vw, 26rem); scroll-snap-align: center`. Padding lateral con `padding-inline: var(--gutter)` y el truco `::after { content: ''; flex: 0 0 var(--gutter) }` para que la última tarjeta también encaje. `overscroll-behavior-x: contain` para no disparar navegación atrás en Android.
- **JS.** `mountHorizontalTrack({ track, cards, current, rail, total })`: `IntersectionObserver` (root = track, threshold 0.6) para la tarjeta activa + listener `scroll` con rAF que fija `rail.style.transform = scaleX((i+1)/n)` interpolado por `scrollLeft` (progreso continuo, no por saltos). Teclado: `tabindex="0"` en el track, flechas → `scrollBy` con `behavior: reducedMotion ? 'auto' : 'smooth'`. A11y: `role="group"` + `aria-roledescription="carrusel"` en el track, `aria-label="Tipología N de T"` en cada tarjeta, `aria-live="polite"` en el contador. Se monta en `gsap.matchMedia('(max-width: 899px)')` en ambos scripts (y devuelve el `unmount` para el cambio de breakpoint); el bloque `≥ 900px` no cambia.
- El rail estático de Únete pierde el `width: 25%` fijo: `transform: scaleX(var(--progress, .25)); transform-origin: left` de modo que el valor inicial lo ponga CSS y JS sólo anime la variable.
- *Alternativas descartadas:* pin vertical con GSAP en móvil (scroll atrapado, coste); librería de carrusel (peso, estilo ajeno).

### D7. Pipeline de imágenes estático y verificable en Cloudflare

- **Causa (ver Context › Log de build).** El auto-setup de wrangler inyecta `@astrojs/cloudflare` y reconstruye con el servicio de imágenes de Cloudflare Images, que en `output: 'static'` produce URLs `/_image?` sin worker que las sirva.
- **Fix: configuración de wrangler versionada, assets-only.** `wrangler.jsonc` en la raíz con `name: "diputnam"`, `compatibility_date`, `assets: { directory: "./dist", not_found_handling: "404-page" }` y sin `main`. Con el archivo presente, `wrangler deploy` no ejecuta el auto-setup, no instala el adapter y sube el `dist/` de la primera (y única) build estática, con sus `.webp/.avif`. `.wrangler/` se añade a `.gitignore`. No se añade `@astrojs/cloudflare`, ni `sharp` explícito, ni se cambia la versión de Node: no son la causa y añadirían ruido al lockfile. Los comandos del dashboard (`npm run build` / `npx wrangler deploy`) se mantienen.
- **Guard.** `tests/check-dist.mjs` como script `postbuild`: recorre `dist/**/*.html`, falla si encuentra `/_image?` en `src`/`srcset`/`href` de imagen, y verifica que cada `/_astro/*.{webp,avif,png,jpg}` referenciado existe en `dist/`. Se ejecuta también en el build de Cloudflare (por ser `postbuild`), así que un pipeline degradado hace fallar el deploy en lugar de publicar imágenes rotas.
- **Independencia del pipeline para las marcas.** D1 mantiene el isotipo y la marca de Ereditá servibles aun con el pipeline degradado (SVG inline o `<picture>` con `<img>` PNG cuyo `src` sea el archivo original de `/_astro/` o `public/`).
- *Alternativas descartadas:* `image.service = passthroughImageService()` (renuncia a WebP/AVIF y a los tamaños responsivos en todo el sitio); mover todas las imágenes a `public/` (mismo coste, pierde el `srcset` automático).

### D6. Auditoría: `tests/mobile-audit.mjs` + `npm run test:mobile`

- Mismo patrón que `home-sweep.mjs`. Para cada ruta a 390×844 (DPR 2, `isMobile`): `scrollWidth === clientWidth`; header `<img>` con `naturalWidth ≥ 300` o `<svg>` presente; `.ed-hero-mark` con `getBoundingClientRect()` dentro del viewport; `theme-color` presente; `html/body` background ≠ `rgb(89, 64, 55)`. Home: inyecta el desfase `svh = innerHeight − 90` (mismo truco de la reproducción) y comprueba `gap === 0` entre paneles visibles y `< 0.3 %` de píxeles café. Putnam: `opacity` del `h1` < 1 a los 80 ms y `=== 1` a los 1500 ms. Pistas: tras `scrollBy` al final del track, contador `04 / 04` y rail `scaleX ≈ 1`.
- Genera capturas en `tests/.artifacts/mobile/` (gitignored) para revisión humana.

## Risks / Trade-offs

- [Las pistas con `scroll-snap` cambian la altura del documento respecto al apilado actual] → `ScrollTrigger.refresh()` tras montar/desmontar la pista; la spec exige que el resto de la página siga midiendo bien.
- [`IntersectionObserver` con root = contenedor puede disparar dos tarjetas "activas" en anchos donde caben 1.5 tarjetas] → se elige la de mayor `intersectionRatio` y se desempata por proximidad al centro.
- [Reactivar GSAP en Putnam móvil cuesta ms de arranque] → sin Lenis, sin parallax en `< 768px`, `will-change` sólo en hero. **Medido (Chromium, 390×844, CPU ×4, mediana de 5):** DOMContentLoaded 219 → 220 ms (sin cambio); JS descargado 5 → 47 KB (GSAP + ScrollTrigger, Lenis sigue fuera de móvil); el hero empieza a revelarse a ~340 ms y termina a ~1.1 s. Con `import()` dinámico aparecía un parpadeo de ~220 ms (hero visible → oculto → animado); se elimina pre-ocultando el copy del hero con la clase `motion-pending` (script inline pre-paint, sólo sin `prefers-reduced-motion`) y usando `gsap.set` + `gsap.to`; salvaguardas: `catch` del import y timeout de 3 s liberan la clase, y sin JS nunca se añade.
- [Cambiar el fondo base a crema puede exponer un flash crema en la home antes de que cargue la foto del hero] → `.home-stage { background: #0d1116 }` (D2/D3) cubre el stage; el `<body>` crema sólo se ve en overscroll.
- [Recortar el PNG de Ereditá altera las proporciones que asumían `width: 52vw`/`min(42vw, 38rem)`] → ajustar los anchos a partir de captura; la spec fija el resultado (visible, dentro del viewport, margen ≥ 1rem), no el número.
- [`menu.ts` intercambia `img.src`; con `<picture>` el `<source>` gana] → si se conserva `<picture>`, alternar dos elementos con `hidden` en lugar de reescribir `src`.
- [Una futura versión de wrangler podría volver a intentar auto-configurar aunque exista `wrangler.jsonc`] → el guard `postbuild` no lo cubre (el adapter reconstruye después), así que 7.1 añade una comprobación contra el deploy (`curl` de imágenes = 200, `grep -c "/_image?"` = 0) que se repite tras cada despliegue relevante.

## Migration Plan

1. Primero D7 (pipeline + guard) en `dev`, push y comprobar en el deploy de preview de Cloudflare que `/_image?` desaparece y que las imágenes responden 200 — desbloquea la verificación real de todo lo demás en el Android del usuario.
2. Resto de grupos en `dev`; `npm run build` (con `postbuild`) + `npm run preview` + `npm run test:mobile` + `npm run test:sweep` en verde.
3. Verificación manual del usuario en su Android contra el deploy (logos, barras del navegador, franja de la home, hero de Putnam, swipe de las dos pistas).
4. Merge a `main`. Rollback: revertir el merge; `wrangler.jsonc` es inocuo por sí solo.

## Open Questions

- ¿Existe el isotipo Putnam en vector (SVG/AI)? Si sí, D1 usa SVG inline y se elimina el intercambio de `src` en `menu.ts`; si no, se sigue la vía `<picture>`. No cambia specs ni tareas (la tarea está redactada con ambas ramas).
