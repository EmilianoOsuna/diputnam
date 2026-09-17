## 1. Marcado y estilos

- [x] 1.1 En `src/components/SiteHeader.astro`, añadir tras `</header>` el riel `<div class="scroll-rail" aria-hidden="true"><span class="scroll-rail__dot"></span></div>`; verificar con `npm run build` que el riel aparece una sola vez en el HTML de cada ruta de `dist/` (incluida `404.html`).
- [x] 1.2 En `src/styles/global.css`, añadir `.scroll-rail` (fixed, `inset: 0.5rem 0.75rem 0.5rem auto`, `width: 1rem`, `container-type: size`, `z-index: 100`, `pointer-events: none`, `display: none` por defecto, `opacity: 0`, transición 300 ms) y `.scroll-rail__dot` (0.625 rem, redondo, centrado, salvia, sombra suave, `animation: scroll-rail-dot linear both`), con `animation-timeline: scroll(root)` en una regla aparte y `@keyframes scroll-rail-dot { to { translate: 0 calc(100cqh - 100%); } }`; verificar en Chrome a 1280×800 que el punto recorre el riel entre `scrollY = 0` y el máximo.
- [x] 1.3 Bajo `@media (min-width: 768px)`, envolver en `@supports (animation-timeline: scroll())` las reglas `html { scrollbar-width: none } html::-webkit-scrollbar { display: none }` y `.scroll-rail { display: block }`; verificar que en 390×844 el riel es `display: none` y `scrollbar-width` sigue en `auto`.
- [x] 1.4 `html.is-scrolling .scroll-rail { opacity: 1 }` bajo el mismo media query; verificar en 1280×800 que está oculto en reposo.

## 2. Auto-ocultado en desktop

- [x] 2.1 Crear `src/scripts/scroll-rail.ts`: si `matchMedia('(min-width: 768px)').matches`, registrar `window.addEventListener('scroll', …, { passive: true })` que añade `is-scrolling` a `html` y lo retira con un `setTimeout` de 1000 ms reiniciado en cada evento. Montarlo en `SiteHeader.astro` junto a `menu.ts`; verificar en 1280×800 que aparece al desplazarse y desaparece ~1 s después, en la home (Lenis) y en `/putnam/`.
- [x] 2.2 Verificar con `prefers-reduced-motion: reduce` en desktop (sin Lenis) que el punto refleja el progreso y el auto-ocultado funciona.

## 3. Verificación integrada

- [x] 3.1 `npm run test:perf`: 0 handlers de `scroll` y 0 rAF propios en móvil en todas las rutas (las fallas de frame-interval/long-task en `/eredita/` se reproducen sin este cambio).
- [x] 3.2 `npm run test:sweep` y `npm run test:mobile`: sin regresiones atribuibles (las fallas de la galería de `/eredita/eredita-art/` se reproducen sin este cambio).
- [x] 3.3 Contraste del punto salvia sobre crema, verde profundo y azul; sin scroll horizontal en 1280 tras ocultar la barra nativa.
- [ ] 3.4 Probar en Firefox estable y Safari (si hay acceso) que el punto se mueve o, en su defecto, que la barra nativa se conserva.
- [x] 3.5 `graphify update .` para refrescar el grafo.
