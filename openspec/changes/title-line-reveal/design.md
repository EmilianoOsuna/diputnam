## Context

Ver `proposal.md`. Estado relevante: los h1 de Únete/Contacto/Noticias y varios h2 llevan `.line > span` autorados (`overflow: hidden` en `.line`, `line-height: 0.9`), animados por GSAP en desktop (`yPercent: 110 → 0`) y por `[data-reveal='line']` + IO en móvil (`mobile-60fps`). Putnam/Ereditá/home entran en bloque. Medición a 390/1440 px: máscaras recortan 12/23 px arriba y abajo; en 390 px "que construye con criterio,", "sobre tu próximo", "avances de obra", "¿Prefieres escribirnos"… se parten dentro de una máscara; "Conversemos" desborda 8 px en la home.

## Goals / Non-Goals

**Goals:** un solo helper de renglones para las seis rutas; máscara sin recorte; ningún desborde de palabra en 320–390 px; desktop y móvil con el mismo lenguaje.
**Non-Goals:** cambiar tipografía, jerarquía o copy; animar h3 de tarjetas/pasos; añadir SplitText u otra dependencia.

## Decisions

- **D1. `splitLines(el)` en runtime (mobile-motion.ts, compartido con desktop).** Guarda el HTML original en `dataset`, sustituye `<br>` y `\n` (`white-space: pre-line` en la home) por saltos duros, envuelve cada palabra en `<span>` inline, lee `offsetTop` de cada uno, agrupa por línea y reconstruye `<span class="line"><span>…</span></span>` por renglón; los saltos duros cierran renglón siempre. Se ejecuta tras `document.fonts.ready` y se repite en `resize` (debounce 150 ms, sólo si cambia el ancho) restaurando el HTML original antes de medir. Sin JS, los títulos quedan en flujo. *Alternativa*: cortes autorados por breakpoint (estado actual) — descartado por QA: se parten en móvil y cada nuevo copy exige mantenimiento.
- **D2. Máscara con holgura y retirada al terminar.** `.line { display:block; overflow:hidden; padding-block: 0.25em; margin-block: -0.25em }` (los márgenes negativos anulan el padding en el flujo, así el interlineado no cambia); el span interior parte de `translateY(150%)` para quedar totalmente oculto pese al padding. Al completar la entrada se añade `is-done` a `.line` → `overflow: visible`, de modo que sombra y glifos no dependen de la holgura. *Alternativa*: `clip-path: inset(-0.25em 0)` — misma idea, pero `overflow` es más simple de depurar y compatible.
- **D3. Un solo atributo de estado.** El helper marca cada renglón como `data-reveal="line"` con `--i` (índice del renglón dentro del título); móvil usa la transición CSS existente y desktop usa `gsap.from(spans, { yPercent: 110 … })`. Para el hero, en móvil los renglones se animan con `@keyframes` inmediatamente tras segmentar (JS añade `is-in` al h1 en el siguiente frame); antes de que corra JS el h1 es visible: un frame de flash es aceptable frente a ocultar por CSS el título (accesibilidad sin JS). *Alternativa*: ocultar por CSS hasta que JS corra — descartado (título invisible sin JS).
- **D4. Tamaños.** Home móvil: `clamp(3rem, 12.5vw, 4.6rem)` en `.panel h1, .panel h2` (Conversemos = 11 caracteres → a 320 px ≈ 40 px). h1 de hero interiores: `clamp(3.1rem, 13.5vw, 5.2rem)`. h2 `h2-xl`/CTA móviles: `clamp(3.2rem, 14vw, 5.5rem)`. Se verifica con la comprobación nueva del audit (ancho de palabra ≤ ancho del título en 320 y 390).
- **D5. Verificación.** `tests/mobile-audit.mjs`: para cada h1/h2 visible a 320 y 390 px, ancho máximo de palabra (Range por palabra) ≤ `clientWidth` y `scrollWidth === clientWidth`; para cada `.line` tras la entrada, los rects de glifos están dentro del rect visible (o `overflow` ya es `visible`); número de líneas visuales por máscara = 1.

## Risks / Trade-offs

- [Reflow al segmentar en carga] → una sola lectura de layout por título tras `fonts.ready`, antes de la primera entrada; no hay trabajo por frame.
- [Cortes distintos a los editoriales] → los cortes son los del navegador; si un corte concreto importa, se controla con `max-width` del título, no con spans.
- [Flash de un frame antes de enmascarar en el hero móvil] → se segmenta en el primer script del módulo y se marca en el mismo tick; verificado a 80 ms en el audit (opacidad/desplazamiento inicial del renglón).
- [`text-shadow` cortado durante la animación] → visible sólo mientras el renglón se desplaza; al terminar la máscara se retira.
