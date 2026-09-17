## Context

Ver proposal.md — Why. Estado observado en el código:

- `src/scripts/horizontal-track.ts` ya implementa la pista móvil (swipe + snap, contador, rail, teclado, `aria`) y la montan `unete-motion.ts` (`.traits`) y `contacto-motion.ts` (`.reasons`) con `matchMedia('(max-width: 899px)')`. `tests/mobile-audit.mjs` tiene `trackChecks(route, selector, total)` para esas dos rutas.
- El commit `4a915c5` ("fully polished") reemplazó la pista de Tipologías por una pila vertical (`.ed-h-track { display: block }` a ≤899 px, `.ed-h-progress { display: none }`), en contra de la spec `mobile-horizontal-tracks` vigente. Proceso de Putnam nunca tuvo pista: a ≤767 px oculta `.process-media-slot` y `.process-progress` y apila los paneles.
- `typology-media.ts` ya maneja la tira de miniaturas con `stopPropagation` en `keydown` y la tira lleva `touch-action: pan-x; overscroll-behavior-x: contain`, así que la convivencia tira/pista descrita en la spec no requiere código nuevo.
- Reveals móviles: `mobile-motion.ts` trata un `[data-reveal-group]` sin hijos como su propio elemento revelable (le pone `data-reveal` y luego `is-in`), pero `global.css` sólo tiene `.is-in [data-reveal]` (descendiente). Los `<p data-reveal-group>` de Únete (5), Contacto (4), Noticias (3) y Nota (1) nunca llegan a `opacity: 1` en móvil; su caja sigue ocupando espacio, de ahí los "huecos".
- CTAs finales: `.un-cta`, `.ct-cta`, `.nw-cta` usan `min-height: 100dvh; justify-content: flex-end` y en móvil `h2 { margin: 5rem 0 2rem }`; `.institutional-cta` usa `min-height: 90svh` y `h2 { margin: 7rem 0 4rem }`.
- Heros: los h1 móviles de las cinco interiores usan `line-height: 0.92` (Putnam, Únete, Noticias; Contacto/Ereditá por revisar en tareas).
- Footer: `ContactFooter.astro` renderiza dos variantes (fija en home, en flujo en interiores) y contiene los paths SVG de redes. `SiteHeader.astro` ya tiene `.mobile-menu-contact` (correo, teléfono, ciudad, WhatsApp en texto) dentro del panel del menú.
- `tests/mobile-perf.mjs` sólo cuenta manejadores de `scroll` en `window`/`document` y rAF globales mientras `perf.counting`; la pista escucha `scroll` en su propio elemento.

## Goals / Non-Goals

**Goals:**
- Reutilizar `mountHorizontalTrack` tal cual para Tipologías y Proceso; sólo CSS + dos montajes.
- Arreglar los huecos en su causa (un selector), no sección por sección.
- Cero cambios de comportamiento en ≥900 px (Ereditá/Únete/Contacto) y ≥768 px (Putnam, home).

**Non-Goals:**
- Rediseñar el footer de desktop o el menú de desktop.
- Convertir el rail de Proceso a `animation-timeline: scroll()` (la pista ya provee contador + rail; el test de perf no cuenta listeners de elementos).
- Tocar el CMS o los esquemas de Sanity.

## Decisions

1. **Tipologías: `<details>` nativo para descripción + specs en móvil; `open` en desktop por JS.**
   Para que la sección quepa en `100dvh` con el medio dominante hay que sacar ~200 px de copy de la vista inicial. `<details class="ed-h-more">` con `<summary>` (etiqueta i18n nueva `ui.eredita.details`) es el control nativo más barato y accesible. El markup se renderiza con `open` (desktop lo necesita visible y no hay CSS que abra un details cerrado); en móvil, el mismo `sync` de `matchMedia('(max-width: 899px)')` que monta la pista quita `open` a todos los details, y lo devuelve al desmontar. El `summary` se oculta con CSS en ≥900 px.
   Alternativas: ocultar desc/specs en móvil (pierde información de compra) · área de copy con scroll interno (affordance invisible) · modal (JS y foco extra).

2. **Layout de Tipologías en móvil = `100dvh` con flex column.**
   `.ed-typologies` pasa a `display: flex; flex-direction: column; height: 100dvh; padding-top: 5.5rem` (bajo el header fijo); `.ed-typ-stage` es el encabezado (kicker, h2 más compacto, intro en 2 líneas máx con `-webkit-line-clamp`, luego `.ed-h-progress` estilizado como `.pin-counter`/`.pin-rail` de Únete: número `4rem`, total pequeño, rail debajo); `.ed-h-track { flex: 1; min-height: 0 }` con los mismos tokens de pista que `.traits` (`--track-gutter`, `gap 0.75rem`, `scroll-snap-type: x mandatory`, `scroll-padding-inline`, `::after` de 0.01px, scrollbar oculta). Cada `.ed-h-panel` es `display: grid; grid-template-rows: minmax(0, 1fr) auto; flex: 0 0 calc(100vw - 2*var(--track-gutter))`: el medio ocupa la fila flexible (`.ed-h-media { height: 100%; min-height: 0; aspect-ratio: auto }`) y la copia la fila `auto`. Con details cerrado, la copia son ~4 elementos (index/tag, h3, subtítulo, CTA) ≈ 150 px; en 844 px de alto el medio queda en ~350 px (>50 % de la tarjeta). El `.ed-h-thumbs` sigue absoluto dentro del medio, altura fija.
   Con details abierto la sección crece por encima de `100dvh` (la fila `auto` crece): aceptable, es acción explícita del usuario; `height` pasa a `min-height` para no recortar.

3. **Proceso Putnam: pista a ≤767 px, sin restricción de 100dvh.**
   El usuario pidió sólo scroll horizontal. `.process-track` recibe los mismos tokens de pista; `.process-panel` = grid `auto auto` con `.process-media { aspect-ratio: 4/3 }` y copia debajo (número, h3, p). `.process-progress` vuelve a mostrarse (`display: flex; flex-direction: column`) entre el kicker y la pista; ya tiene el contador grande (`clamp(4rem, …)`), sólo hay que apilar rail bajo el contador. `putnam-motion.ts` monta `mountHorizontalTrack` con `matchMedia('(max-width: 767px)')` (el breakpoint de Putnam), `current: [data-pin-current]`, `rail: [data-pin-rail]`, `label: 'Etapa'`. Como el módulo desktop sólo se carga a ≥768 px, no hay conflicto con `desktop/putnam.ts` sobre los mismos `data-pin-*`. El `.process-media-slot` sigue oculto en móvil (el medio vive en cada tarjeta).
   Alternativa: rail por `animation-timeline: scroll()` de la pista — compositor puro, pero el contador seguiría necesitando IO; no vale una segunda ruta de código.

4. **Reveals: `.is-in[data-reveal], .is-in [data-reveal]`.** Un selector; corrige 13 párrafos en 4 vistas y no cambia desktop (la regla está bajo `(max-width: 767px)`). Se añade un check en `tests/mobile-audit.mjs` que recorra `[data-reveal-group]` sin hijos y verifique `opacity === '1'` tras scroll.

5. **CTAs móviles.** En `(max-width: 767px)`: `.un-cta, .ct-cta, .nw-cta { min-height: 0; justify-content: flex-start }`, `h2 { margin: 1.25rem 0 2rem }`; `.institutional-cta { min-height: 0 }`, `h2 { margin: 1.25rem 0 2.5rem }`. La marca decorativa (`.cta-mark`, absoluta) conserva su posición relativa al fondo. Ereditá (`.ed-cta`, `min-height: 72svh`, `h2 margin 2.5rem`) queda igual: no lo mencionó y su composición es distinta.

6. **Interlineado de heros móviles: 0.98 en las cinco interiores.** Los títulos vienen del CMS; corregir sólo Noticias dejaría la misma colisión latente en cualquier otra. Sube ~6 % la altura del h1; los heros tienen `height: 100dvh` con `justify-content: flex-end` y hueco de sobra en 390 × 844. Tarea de verificación: `npm run test:mobile` (sin desborde) y captura de los cinco heros.

7. **Footer home móvil fuera; `SocialLinks.astro` compartido.** `@media (max-width: 767px) { .home-page .site-footer { display: none } }` — lo más corto; `.scroll-cue` es independiente y sigue fija. Los paths SVG salen de `ContactFooter.astro` a `src/components/SocialLinks.astro` (props `contact`, `lang`; devuelve la fila `<div class="footer-social">…`), usado por el footer (ambas variantes) y por `.mobile-menu-contact` en `SiteHeader.astro`, que además incluye el enlace `.footer-credit`. El texto "WhatsApp ↗" actual del menú se sustituye por la fila de iconos para no duplicar WhatsApp.

8. **Footer en flujo móvil.** Sólo CSS en el bloque `(max-width: 767px)` de `global.css`: `.site-footer--flow { gap: 1.75rem; padding: 2.75rem 1rem 2.25rem }`, `.footer-top { display: grid; grid-template-columns: 1fr auto; row-gap: 1.75rem; align-items: center }` (marca | redes; nav en `grid-column: 1 / -1`), `.footer-nav { gap: 0.75rem 1.25rem; font-size: 0.85rem }`, `.footer-bottom { display: flex; justify-content: space-between; align-items: flex-end }` con `.footer-contact { gap: 0.45rem }`. Cinco reglas; los colores por página no cambian.

## Risks / Trade-offs

- [`100dvh` en Tipologías con teléfonos bajos (667 px) deja poco medio] → el medio es `minmax(0, 1fr)`: nunca desborda; en 667 px queda ~230 px, aún mayoritario. La intro se limita a 2 líneas para no comerse altura. Si en revisión se ve escaso, el fallback es `min-height: 100dvh` sin tope (la sección crece).
- [`<details>` cerrado por JS: sin JS en móvil los details quedan `open`] → degrada a la pila completa dentro de la tarjeta (todo visible), sin pérdida de contenido; coherente con "sin JavaScript todo visible".
- [El observer de `mountHorizontalTrack` marca `is-active` en `.ed-h-panel`; `typology-media.ts` observa `[data-media]` para reproducir video] → sin acoplamiento: uno toca clases, el otro `IntersectionObserver` propio. Verificar que el video de la tipología activa sigue autoreproduciéndose al encajar.
- [Ereditá carga `desktop/eredita.ts` a ≥768 px pero el CSS de la pista aplica hasta 899 px] → ya es así hoy para el bloque vertical; entre 768 y 899 el módulo desktop pinea un stage que el CSS no fija. Fuera de alcance; se documenta.
- [Subir `line-height` de heros cambia el look aprobado] → 0.92 → 0.98 es sutil; se comparan capturas antes/después en las tareas.
- [Quitar el footer fijo del home en móvil elimina el correo visible sin abrir el menú] → decisión explícita del usuario; el menú lo expone a un toque.

## Migration Plan

Un solo PR, sin datos ni CMS. Rollback = revert del commit. Antes de merge: `npm run build`, `npm run test:mobile`, `npm run test:perf`, `npm run test:eredita`, `npm run test:sweep`, `graphify update .`.
