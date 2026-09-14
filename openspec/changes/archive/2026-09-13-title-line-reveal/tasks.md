## 1. Helper y estilos compartidos

- [x] 1.1 Añadir `splitLines(el)`/`restoreLines(el)` a `src/scripts/mobile-motion.ts` (D1: HTML original en `dataset`, palabras → `offsetTop` → `.line > span[data-reveal="line"]` con `--i`, saltos duros por `<br>`/`\n`, `fonts.ready`, re-split en `resize` sólo si cambia el ancho) y `revealLines(el)` que añade `is-in` y marca `is-done` al terminar (`transitionend`/`animationend`); verificar con Playwright que a 390 y 1440 px cada `.line` de todos los h1/h2 contiene exactamente una línea visual y que el HTML se restaura sin residuos tras `resize`
- [x] 1.2 Reglas compartidas en `global.css` (D2/D3): `.line` con holgura `0.25em` y margen negativo, `.line.is-done { overflow: visible }`, `[data-reveal='line']` desde `translateY(150%)`, keyframe/transición por renglón con `--i` en móvil; retirar las reglas `.line` de `unete.css`, `contacto.css`, `noticias.css`; verificar que la altura de un h1 es idéntica antes y después de segmentar y que ningún glifo queda fuera del área visible tras la entrada

## 2. Páginas

- [x] 2.1 Quitar los spans `.line > span` autorados de `unete.astro`, `contacto.astro`, `noticias.astro` (conservar `<br>` donde el corte editorial deba mantenerse) y aplicar el helper a h1 de hero y h2 de sección en las seis rutas: móvil desde `mountReveals` (hero inmediato, h2 por IO) y desktop desde `src/scripts/desktop/*.ts` (`gsap.from` sobre los renglones generados con los tiempos actuales, `onComplete` → `is-done`); verificar con el audit que las seis rutas entran por renglón a 390 px (renglón 2 desplazado a 80 ms, todo en su sitio a 1.5 s) y con `test:sweep`/captura a 1440 px que desktop conserva tiempos y reversa
- [x] 2.2 Home: segmentar los títulos de escena (`white-space: pre-line` → saltos duros) y animar el título de la escena activa por renglón en la entrada inicial (móvil CSS, desktop GSAP); verificar que el título persistente del barrido sigue anclado (audit de home en ambos modos y `test:sweep`)
- [x] 2.3 Ajustar `clamp()` móviles (D4) en `global.css` (home), `putnam/unete/contacto/noticias.css` (h1) y h2 grandes; verificar a 320 y 390 px que ninguna palabra supera el ancho de su título y `scrollWidth === clientWidth`

## 3. Verificación

- [x] 3.1 Añadir a `tests/mobile-audit.mjs` la comprobación de títulos (D5: palabra ≤ caja a 320/390, glifos dentro del área visible tras la entrada, una línea por máscara) y verificar que falla al inyectar `line-height: 0.6` en un título y pasa con el sitio corregido
- [ ] 3.2 `npm run build`, `test:sweep`, `test:mobile`, `test:perf` en verde (el helper no debe añadir callbacks por frame); commit en `dev` sin líneas de atribución y push con confirmación del usuario; revisión del usuario en Android
