## Why

Las capturas de un iPhone (Safari iOS, 17 de septiembre de 2026) muestran cuatro problemas que la auditoría móvil en Chromium a 390 × 844 no detecta: las flechas `↗` se dibujan como emoji azul, la marca de agua de los CTA y la marca de Ereditá del hero se enciman con los enlaces y el kicker, el slider de la home no responde bien al swipe y deja ver la escena anterior en la orilla superior, y el menú móvil deja traslucir el título de la home. Reproducido en Chromium a 375 × 635 (viewport real de un iPhone con la barra de Safari desplegada): la marca del hero de Ereditá pisa el kicker y el enlace de regreso, y la marca de agua del CTA de Putnam cubre ambos enlaces en cualquier tamaño.

## What Changes

- **Flechas como icono, no como carácter**: `↗` (U+2197) tiene propiedad Emoji y el subconjunto latino de DM Sans no lo incluye (tampoco `→`), así que iOS lo resuelve con Apple Color Emoji. Todas las flechas `→` y `↗` de enlaces y botones (CTAs, filas de índice, botón del formulario, `panel-button`, `hero-index`, `ed-cta-link`, 404) pasan a un componente `Arrow.astro` con un SVG inline (`currentColor`, `1em`) dentro del mismo `<span>`/`<i>` `aria-hidden`, de modo que el CSS de hover/transición existente sigue aplicando y el glifo es idéntico en todos los sistemas.
- **Slider de la home en iOS**: el gesto pasa a ser exclusivo del slider (`touch-action: none` en la experiencia fija, `touchmove` no pasivo con `preventDefault()` mientras se arrastra, `overscroll-behavior: none` y `html/body` sin scroll), para que Safari no lo convierta en pan/rubber-band del documento ni colapse su barra. Todas las capas se posicionan en px (cambiar de unidad hace que Safari reconstruya la capa y las fotos parpadeen); un cambio de altura del viewport (barra de Safari, rotación) se re-renderiza sin transición en `resize` de `window` y de `visualViewport`, y las fotos del slider se decodifican de forma síncrona.
- **Marca de agua de los CTA en móvil** (Putnam, Únete, Contacto, Noticias): deja de ser absoluta y pasa al flujo debajo de los enlaces, alineada a la derecha y sangrando por el borde como hoy; nunca se cruza con las acciones. Desktop no cambia.
- **Marca de Ereditá en el hero** (`/eredita/` y páginas de proyecto): no es una marca de agua, es el logotipo del proyecto y no debe ir sobre ningún texto en ningún viewport. En móvil deja de anclarse a `38vh` (unidad que en iOS es el viewport grande) y pasa al flujo, sobre el bloque de texto y alineada a la derecha; el texto la empuja hacia arriba cuando crece (títulos largos, viewports cortos) en vez de encimarse. En desktop ya está en su propia columna (verificado a 1366 × 768 y 1512 × 982, laptops de 14"); se añade la comprobación para que no regrese.
- **Menú móvil opaco**: el fondo crema pasa de `rgba(…, 0.97)` a opaco; en pantallas OLED el 3 % restante deja ver el título del hero.
- **Auditoría móvil**: nueva pasada a 375 × 635 y 360 × 640 con comprobaciones de no-intersección (marca del hero vs. contenido, marca de agua vs. enlaces) y del slider tras un cambio de altura del viewport a mitad de recorrido; ejecución opcional en WebKit de Playwright cuando esté instalado. Verificación final en el iPhone real con la URL de preview.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `brand-marks`: la marca del hero de Ereditá (logotipo, no marca de agua) no SHALL solaparse con ningún texto del hero en ningún viewport ≥ 320 × 568, móvil o desktop; la marca de agua de los CTA no SHALL cruzarse con las acciones en móvil.
- `home-slide-sweep`: en móvil el swipe SHALL ser exclusivo del slider (sin pan del documento) y un cambio de altura del viewport no SHALL dejar visible la escena vecina.
- `site-shell-theme`: las flechas de acción SHALL renderizarse como icono vectorial (nunca como emoji) y el menú móvil SHALL ser opaco.

## Impact

- Nuevo `src/components/Arrow.astro`; sustitución de los `<span>`/`<i>` con `→`/`↗` en `src/views/{contacto,unete,noticias,nota,putnam,eredita,proyecto}.astro` y `src/pages/404.astro`.
- `src/scripts/motion.ts` (`mountSlider`), `src/styles/global.css` (bloque `.is-slider`, `.site-nav`), `src/styles/{putnam,unete,contacto,noticias}.css` (marca de agua en móvil), `src/styles/eredita.css` (hero en móvil).
- `tests/mobile-audit.mjs` (pasada de viewports cortos, intersecciones, slider tras resize), `tests/eredita-gallery.mjs` (marca del hero vs. texto a 14"), `package.json` (script opcional `test:mobile:webkit`).
- Sin dependencias nuevas obligatorias; WebKit de Playwright es opcional. Desktop no cambia.
