## Why

Tras `mobile-60fps` el sitio ya es fluido, pero los títulos no comparten un lenguaje de entrada: Únete, Contacto y Noticias entran por renglón (máscaras `.line > span` escritas a mano), mientras Putnam, Ereditá y la home entran en bloque. Además las máscaras recortan los glifos: con `line-height: 0.9` y `overflow: hidden` se cortan ~0.2em arriba y abajo (acentos como la Ú de "Únete", descendentes de "próximo/proyecto", y el `text-shadow`), y en móvil varios renglones autorados para 1440 px se parten en dos líneas dentro de una sola máscara. Por último, "Conversemos" en la home desborda 8 px a 390 px y el panel lo recorta.

## What Changes

- **Un solo lenguaje de entrada para todos los títulos** (h1 de hero y h2 de sección, en las seis rutas, móvil y desktop): cada renglón visual sube desde una máscara con escalonado de 90 ms; kicker y párrafos conservan el fade + subida.
- **Renglones calculados en runtime** por un helper compartido (`splitLines`): las palabras se miden y se agrupan por su línea real, una vez al cargar y al cambiar de viewport; los `.line > span` escritos en Astro se eliminan. Sin JavaScript el título queda visible en flujo. **Cambio observable:** los cortes de línea ya no son editoriales fijos sino los del navegador a cada ancho.
- **Máscara que no recorta**: cada renglón lleva margen interno de 0,25em arriba y abajo compensado con margen negativo (interlineado intacto) y la máscara se retira al terminar la animación, de modo que acentos, descendentes y sombra nunca quedan cortados.
- **Sin desborde de palabras**: los `clamp()` de h1/h2 grandes se ajustan para que ninguna palabra sobresalga de su contenedor entre 320 y 390 px (home "Conversemos" incluido); nueva comprobación en `tests/mobile-audit.mjs` que falla si algún título tiene una palabra más ancha que su caja o un renglón enmascarado recorta glifos.

## Capabilities

### New Capabilities

- `title-line-reveal`: lenguaje único de entrada por renglón para h1/h2, sin recorte de glifos y sin desborde a anchos móviles.

### Modified Capabilities

- `contacto-page`: el requisito "Reveals de texto y grupos" deja de exigir spans `.line > span` con cortes editoriales escritos en Astro y pasa a exigir el helper compartido de segmentación por renglón (la decisión pendiente "Cortes de línea de h2" se resuelve a favor del helper).
- `mobile-page-motion`: la animación de entrada del hero en móvil se define como entrada por renglón (no "aparición con desplazamiento sutil" del bloque).

## Impact

- `src/scripts/mobile-motion.ts` (helper `splitLines`, reveals por renglón), `src/scripts/desktop/*.ts` (GSAP anima los renglones generados), `src/scripts/motion.ts`/`desktop/home.ts` (títulos de escena).
- `src/pages/{unete,contacto,noticias}.astro`: se retiran los spans `.line`; `src/pages/putnam.astro` conserva los `<span>` de línea del h1 como texto normal.
- `src/styles/*.css`: reglas de máscara compartidas en `global.css`, retirada de `.line` por página, ajustes de `clamp()`.
- `tests/mobile-audit.mjs`: comprobación de recorte/desborde de títulos. Sin dependencias nuevas (no se usa SplitText).
