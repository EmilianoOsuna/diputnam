## Why

La home actual conserva la composición general de la referencia, pero su scroll todavía se comporta como una sucesión rígida de paneles. La tipografía Montserrat, el contraste insuficiente sobre las fotografías y la ausencia de una transición de slides realmente sincronizada con el scroll impiden alcanzar la experiencia premium de `https://dsgninterior.se/en`.

## What Changes

- Sustituir Montserrat por Cera Pro o por el fallback autorizado más cercano si no existe un archivo/licencia utilizable.
- Replantear la home como un stage visual de slides: el título permanece centrado mientras las imágenes entran y barren la escena con el scroll.
- Ajustar Lenis y GSAP/ScrollTrigger para lograr smooth scroll, parallax, crossfades y reveals sincronizados, con easing coherente y sin movimientos decorativos.
- Mejorar la legibilidad del header, footer y títulos mediante scrims y estados de contraste consistentes sobre cualquier imagen.
- Mantener logo, colores, contenido e imágenes de Putnam; no copiar código, assets ni contenido propietario de dsgn.
- Verificar el resultado con Playwright en desktop y mobile, incluyendo estados de scroll, carga inicial, hover y `prefers-reduced-motion`.

## Capabilities

### New Capabilities

- `home-ui-motion-readability`: comportamiento visual de la home relacionado con tipografía, contraste, stage de slides y transiciones ligadas al scroll.

### Modified Capabilities

- Ninguna. El cambio anterior aún no está archivado y no existe una spec principal bajo `openspec/specs/`; esta capacidad documenta el refinamiento incremental sin alterar sus artefactos.

## Impact

- Afecta la ruta Astro `/`, principalmente `src/pages/index.astro`, `src/styles/global.css` y `src/scripts/motion.ts`.
- Reutiliza Astro, Lenis, GSAP y las fixtures locales existentes; no agrega Sanity ni nuevas rutas.
- Puede requerir incorporar una fuente autorizada o definir un fallback visualmente equivalente.
- Añade verificación visual y funcional con Playwright para evitar regresiones de layout, contraste y movimiento.
