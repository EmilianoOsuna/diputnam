## Why

La barra de scroll nativa (gris, con flechas y canal del sistema) rompe el acabado premium del sitio: aparece como un elemento ajeno sobre los fondos crema/verde/azul y cambia de aspecto según sistema operativo. Queremos un indicador de scroll propio —un punto discreto sobre un riel fino en el borde derecho, como en `tierra-taza`— que se sienta parte del lenguaje visual y se esconda cuando nadie está desplazándose.

## What Changes

- Sólo en desktop (`≥ 768px`): se oculta la barra de scroll nativa del documento cuando el navegador soporta animaciones ligadas al scroll (`animation-timeline: scroll()`); si no las soporta, la barra nativa se conserva tal cual. En móvil no cambia nada: barra nativa y cero scripts.
- Se añade un punto ("bolita", réplica de `tierra-taza`) en el borde derecho cuya posición vertical refleja el progreso de scroll del documento. La posición se resuelve en CSS con `animation-timeline: scroll(root)`: cero JavaScript por frame, funciona igual con Lenis y sin él.
- El punto está oculto en reposo, aparece con fundido al hacer scroll y desaparece tras 1 s de inactividad (listener de `scroll` pasivo que sólo alterna una clase, registrado únicamente en desktop).
- El punto usa el salvia de la paleta con una sombra suave, legible sobre crema, verde profundo y azul sin depender del tema del header.
- El riel es puramente decorativo: `aria-hidden`, `pointer-events: none`, no se puede arrastrar. Se renderiza desde `SiteHeader.astro`, que ya está presente en todas las rutas (incluida `/404`).

## Capabilities

### New Capabilities
- `site-scroll-rail`: indicador de scroll propio del sitio (riel + punto) que sustituye la barra nativa, su comportamiento de auto-ocultado, su contraste sobre la paleta y el fallback a la barra nativa.

### Modified Capabilities
- (ninguna) — `mobile-rendering-performance` y `site-shell-chrome` se mantienen; esta capacidad se diseña para cumplirlas sin cambiar sus requisitos.

## Impact

- `src/styles/global.css`: reglas para ocultar la barra nativa bajo `@supports`, estilos del riel/punto y keyframes ligados a `scroll(root)`.
- `src/components/SiteHeader.astro`: marcado del riel y `<script src="../scripts/scroll-rail.ts">` junto a `menu.ts`/`controls.ts`.
- `src/scripts/scroll-rail.ts` (nuevo, ~10 líneas): auto-ocultado, sólo en `≥ 768px`.
- Sin dependencias nuevas. Sin cambios en Sanity, i18n, SEO ni en los motores Lenis/GSAP.
- Pruebas: `npm run test:perf` debe seguir reportando 0 handlers de scroll en móvil; `npm run test:sweep` y `test:mobile` sin cambios esperados.
