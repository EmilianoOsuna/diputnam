## Why

Una auditoría del sitio en móvil (Playwright, Chromium, viewport 390×844 + verificación en el Android del usuario contra el deploy de Cloudflare) confirma seis defectos visibles que degradan la percepción premium del sitio: logos que no se ven o quedan descentrados, franjas cafés durante el scroll de la home, barras del navegador teñidas de café, el hero de Putnam sin animación en móvil, y dos secciones (Tipologías de Ereditá y Nuestra cultura de Únete) que en móvil pierden su interacción, su contador y su barra de progreso. Todos tienen causa raíz identificada en el código actual y deben corregirse juntos antes de seguir sumando páginas.

## What Changes

- **Imágenes locales rotas en producción (Cloudflare)**: el deploy git-conectado en `diputnam.project0-0s.workers.dev` emite para toda imagen de `astro:assets` URLs del endpoint on-demand `/_image?href=…` que devuelve 404 porque el sitio es estático (sin `_worker.js`). Rompe el logo del header en las seis páginas, la marca de Ereditá, las marcas de agua CTA y los heros de Únete y Contacto (66 referencias rotas en total). El log de build muestra que la primera build estática es correcta, pero `npx wrangler deploy` sin `wrangler.jsonc` en el repo auto-configura el proyecto con `astro add cloudflare`, reconstruye con el adapter y despliega esa segunda build sin imágenes optimizadas. Se corrige versionando la configuración de wrangler (assets-only) y se añade un guard post-build que falla si `dist/` contiene `/_image?`.
- **Logos (header + hero de Ereditá + marca de agua CTA)**: además, servir el isotipo Putnam del header con resolución suficiente para pantallas 2×/3× (hoy se genera a 120 px para un cajón que necesita ~160 px) y con fallback PNG o como SVG. Recortar el lienzo transparente descentrado del PNG de Ereditá (el arte ocupa el 5 % de un lienzo de 2048² y queda corrido a la derecha). Subir la legibilidad de la marca de agua `.cta-mark` (hoy `opacity: 0.2` sobre verde profundo).
- **Fondo base y chrome del navegador**: retirar el `#594037` (café, ajeno a la paleta) de `:root`/`html`/`body` y sustituirlo por un color de la paleta; declarar `<meta name="theme-color">` (con variante para `prefers-color-scheme`) en las seis páginas para que Chrome Android y Safari iOS no tiñan sus barras de café.
- **Home en móvil**: eliminar la franja café que aparece entre panel saliente y entrante cuando la barra de direcciones se retrae. Causa: `motion.ts` usa `window.innerHeight` como distancia de viaje mientras el stage mide `100svh`; el desfase (`innerHeight − svh`, ~60–120 px) queda descubierto. Reproducido: franja de 90 px en el centro de la pantalla.
- **Putnam en móvil**: el hero y los grupos `data-reveal-group` deben animarse como en las demás páginas. Hoy `putnam-motion.ts` entra en una rama nativa (`is-native-motion`) que no ejecuta ningún reveal. Se mantiene el scroll nativo (sin Lenis) en móvil para respetar el objetivo de 60 fps del change `mobile-60fps`.
- **Tipologías (Ereditá) y Nuestra cultura (Únete) en móvil**: convertir ambas en pistas horizontales con swipe nativo y `scroll-snap`, con contador y barra de progreso que reflejen la tarjeta activa. Hoy ambos efectos son `min-width: 900px` en JS; en móvil las tarjetas se apilan, el contador queda en "01", la barra de Únete en 25 % fijo y Tipologías no tiene barra.
- **Herramienta de auditoría**: dejar un script Playwright reutilizable (`tests/mobile-audit.mjs`) que capture las páginas en móvil, detecte desbordamiento horizontal y verifique los puntos anteriores (logos visibles, ausencia de franjas, progreso de las pistas).

Fuera de alcance: cambios de contenido/copy, rediseño de desktop, y el `index.html` legado.

## Capabilities

### New Capabilities

- `static-image-pipeline`: Toda imagen local optimizada por Astro SHALL resolverse a un archivo estático en el build de producción; ningún HTML desplegado puede depender del endpoint `/_image`.
- `brand-marks`: Renderizado de las marcas (isotipo Putnam del header, marca de Ereditá en el hero, marca de agua en CTA) con formato, resolución, contraste y encuadre correctos en cualquier viewport y densidad.
- `site-shell-theme`: Color base del documento y `theme-color` compartidos por todas las páginas para que ningún fondo ajeno a la paleta se vea en el sitio ni en el chrome del navegador móvil.
- `mobile-horizontal-tracks`: Comportamiento en móvil (< 900 px) de las secciones Tipologías (Ereditá) y Nuestra cultura (Únete): pista horizontal con swipe nativo, `scroll-snap`, contador y barra de progreso sincronizados.
- `mobile-page-motion`: Paridad de animaciones de entrada y reveals en móvil entre las páginas interiores (Putnam incluida), manteniendo scroll nativo y degradación con `prefers-reduced-motion`.

### Modified Capabilities

- `home-ui-motion-readability`: el requisito "Responsive y movimiento reducido" pasa a exigir que en móvil la transición entre escenas no descubra el fondo del documento cuando cambia la altura del viewport (barra de direcciones que se retrae/expande).

## Impact

- `src/styles/global.css` (fondo base, header/brand, stage de la home), `src/styles/eredita.css`, `src/styles/unete.css`, `src/styles/putnam.css` (y el resto para `.cta-mark`).
- `src/scripts/motion.ts` (viaje de paneles), `src/scripts/putnam-motion.ts` (reveals en móvil), `src/scripts/eredita-motion.ts` y `src/scripts/unete-motion.ts` (pistas móviles), posible extracción de un helper compartido `src/scripts/horizontal-track.ts`.
- `src/components/SiteHeader.astro` (logo con fallback/densidad), `src/pages/*.astro` (meta `theme-color`, marca Ereditá con `<Picture>`).
- `src/assets/eredita-logo.png` recortado (o un `eredita-logo.svg` si el arte lo permite) y opcionalmente SVG del isotipo Putnam.
- Deploy de Cloudflare: `wrangler.jsonc` versionado (assets-only), `.wrangler/` en `.gitignore`, y script `postbuild` (`tests/check-dist.mjs`) que falla si `dist/**/*.html` contiene `/_image?`.
- `tests/mobile-audit.mjs` nuevo + script `test:mobile` en `package.json`. Playwright ya es dependencia; se requiere `npx playwright install chromium` en el entorno (ya instalado localmente durante la auditoría).
- Sin cambios de API ni dependencias nuevas.
