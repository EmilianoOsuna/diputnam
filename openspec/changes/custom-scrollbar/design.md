## Context

- Desktop (`≥ 768px`, sin reduced motion) usa Lenis con `autoRaf: false` sobre el scroll nativo de `window` (`src/scripts/desktop/*.ts`); la posición real de scroll del documento sigue siendo la nativa, así que cualquier mecanismo ligado a `scrollY` funciona igual con y sin Lenis.
- `mobile-rendering-performance` prohíbe manejadores de `scroll`/rAF propios en `< 768px`; `tests/mobile-perf.mjs` lo verifica contando `addEventListener('scroll')` y rAF.
- `SiteHeader.astro` está en todas las rutas (incluida `/404`) y ya monta scripts compartidos (`menu.ts`, `controls.ts`). `.scroll-cue` vive fijo en `right: 1.6rem; bottom: 1.45rem; z-index: 11`; header/footer fijos en `z-index: 10`.
- `mobile-motion.ts` ya expone `supportsScrollTimeline()` (`CSS.supports('animation-timeline: view()')`); las animaciones de scroll móviles ya dependen de scroll-driven animations, así que el soporte del navegador es una premisa aceptada del proyecto.
- Referencia `~/Projects/tierra-taza/src/components/CustomScrollbar.jsx`: oculta la barra nativa, punto de 10 px en un contenedor fijo `right: 12px; top/bottom: 8px`, posición por `scroll` listener, auto-ocultado a 1 s.

## Goals / Non-Goals

**Goals:**
- Posición del punto 100 % declarativa (CSS), cero JS por frame en todas las rutas.
- Un solo punto de montaje (`SiteHeader.astro`) y un solo bloque de CSS en `global.css`.
- Degradación limpia: sin soporte de `animation-timeline`, todo queda como hoy.

**Non-Goals:**
- Arrastrar el punto para desplazarse. Con la barra nativa oculta se pierde el drag del sistema; se acepta a cambio del acabado (igual que en tierra-taza).
- Riel para scrollers internos (galerías, listas de `custom-select`, pistas horizontales): sólo el scroll del documento.
- Tematizar el punto según el tema del header.

## Decisions

1. **Posición por `animation-timeline: scroll(root)` en vez de listener de `scroll`.**
   El riel es `position: fixed; container-type: size`; el punto anima `translate: 0 0 → 0 calc(100cqh - 100%)` con `animation-timeline: scroll(root)` y `animation-fill-mode: both`. Corre en el compositor, avanza en el mismo frame que el scroll nativo, no necesita re-medición al cambiar la altura del documento y cumple `mobile-rendering-performance` sin excepciones. Alternativa descartada: replicar el `scroll` listener de tierra-taza (viola el spec móvil y añade trabajo por evento en desktop).

2. **Ocultar la barra nativa sólo dentro de `@supports (animation-timeline: scroll())`.**
   `html { scrollbar-width: none }` + `::-webkit-scrollbar { display: none }` y `.scroll-rail { display: block }` viven dentro del bloque `@supports`; fuera de él el riel es `display: none` y la barra nativa se conserva. Evita el caso "sin barra y sin indicador".

3. **Auto-ocultado: JS mínimo sólo en desktop; móvil sin riel.**
   `src/scripts/scroll-rail.ts` (montado desde `SiteHeader.astro` como `menu.ts`): si `matchMedia('(min-width: 768px)')`, un listener `scroll` pasivo en `window` que añade `is-scrolling` a `html` y lo quita con `setTimeout` de 1 s. En móvil no se registra nada y el riel es `display: none` (todo el bloque vive bajo `@media (min-width: 768px)`), así que la barra nativa móvil se conserva y `mobile-rendering-performance` se cumple sin excepciones. Alternativa descartada: engancharse a `lenis.on('scroll')` en cada motor de desktop (seis puntos de montaje en vez de uno y no cubre reduced-motion, que no carga Lenis).

4. **Color salvia sólido con sombra suave.**
   Réplica del punto de tierra-taza (color secundario + `shadow-sm shadow-black/20`): `--putnam-sage` con `box-shadow: 0 1px 2px rgba(0,0,0,.2)` se lee sobre crema y sobre verde/azul sin conocer el tema activo. Alternativas descartadas: `mix-blend-mode: difference` (tonos raros, se descartó en revisión) y alternar color con `data-auto-theme` del header.

5. **Geometría (igual a tierra-taza).** Riel `inset: 0.5rem 0.75rem 0.5rem auto; width: 1rem`, sin línea ni canal; punto de 0.625 rem centrado. `z-index: 100`. Transición `opacity 300ms ease`.

6. **`animation-timeline` en una regla aparte.** El minificador de CSS de la build funde `animation-timeline` dentro del shorthand `animation` cuando comparten bloque, y Chrome descarta la declaración completa (verificado: `dot.getAnimations()` vacío). La longhand vive en `.scroll-rail > .scroll-rail__dot { animation-timeline: scroll(root) }`.

## Risks / Trade-offs

- [`translate` animado con `calc(100cqh - 100%)` no soportado en algún motor viejo] → el bloque `@supports` comprueba `animation-timeline: scroll()`, que es más reciente que `cqh` y `translate`; si pasa, pasa todo.
- [Firefox: `animation-timeline` con `scroll(root)` en elemento fijo] → verificar en Firefox estable durante la implementación; si falla, el `@supports` del navegador debe reportar falso y caer a la barra nativa. Se anota como verificación explícita en tasks.
- [Ocultar la barra nativa cambia el ancho del viewport en escritorio (desaparece el canal de ~15 px en Windows)] → el sitio usa `100vw` sólo en dos puntos y ambos viven en layouts fluidos; comprobar que no aparece scroll horizontal en 1280/1440 tras el cambio.
- [Sin drag en el riel] → aceptado (ver Non-Goals). Rueda, teclado, gestos y anclas siguen funcionando.

## Migration Plan

Cambio puramente aditivo de CSS + un script de ~10 líneas. Rollback: eliminar el bloque `.scroll-rail` de `global.css` y las dos líneas de `SiteHeader.astro`.
