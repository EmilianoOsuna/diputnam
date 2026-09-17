## Why

La revisión en teléfono (capturas del 16 de septiembre de 2026) muestra siete problemas de móvil: el footer fijo del home está saturado, el footer verde en flujo de todas las páginas interiores se ve apretado, Tipologías (Ereditá) y Proceso (Putnam) volvieron a una pila vertical larga que entierra las imágenes, varias secciones y CTAs muestran un hueco enorme entre el título y el contenido, y en el hero de Noticias los descendentes de un renglón chocan con el siguiente. Todo es corregible sin tocar desktop.

## What Changes

- **Home en móvil**: el footer fijo desaparece a ≤767 px y sólo queda la flecha de scroll; el menú hamburguesa absorbe lo que mostraba (correo, teléfono, ciudad, iconos de WhatsApp/Instagram/Facebook y el crédito de autoría). Los iconos de redes pasan a un componente compartido `SocialLinks.astro` para no duplicar los paths SVG.
- **Footer en flujo (`.site-footer--flow`) en móvil**: más aire (padding y separación entre filas), marca y redes en una fila, navegación en su propia fila, datos de contacto y crédito al final, sin cambiar desktop.
- **Tipologías (Ereditá) en móvil**: vuelven a la pista horizontal con swipe nativo (existente en `horizontal-track.ts`, hoy usada por Únete y Contacto). La sección cabe en `100dvh`; cada tarjeta tiene el medio (imagen/video) como elemento dominante, con índice, título, subtítulo y CTA compactos; descripción y specs quedan en un `<details>` nativo. El contador grande `NN / TT` y la barra de progreso se muestran como en Nuestra cultura de Únete.
- **Proceso Putnam en móvil**: también pista horizontal con swipe, con el contador y la barra que hoy están ocultos en móvil.
- **Reveals de móvil (root cause del hueco)**: `.is-in [data-reveal]` es un selector descendiente; un `<p data-reveal-group>` sin hijos recibe `is-in` en sí mismo y nunca se vuelve visible, dejando su espacio vacío. Se corrige el selector (`.is-in[data-reveal]`), lo que arregla de golpe Proceso de selección, Oportunidades, Postulación espontánea, Canales, Ubicación, Formulario y todos los CTAs.
- **CTAs en móvil**: se reduce el margen superior del h2 y la altura mínima de la sección (Únete, Contacto, Noticias, Putnam) para que el título empiece cerca del inicio de la sección.
- **Heros en móvil**: interlineado del h1 de 0.92 a 0.98 en las cinco páginas interiores para que descendentes (g, p) no pisen el renglón siguiente; los títulos son editables desde el CMS, así que el arreglo es general y no sólo para Noticias.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `mobile-horizontal-tracks`: Tipologías vuelve a la pista horizontal (100dvh, medio dominante, contador grande y barra) y Proceso de Putnam se suma a las secciones con pista; se ajusta el requisito de encabezado/composición.
- `site-shell-chrome`: el pie de página fijo del home se oculta en móvil y su contenido pasa al menú; el pie en flujo gana aire en móvil.
- `mobile-page-motion`: los `<p data-reveal-group>` sin hijos SHALL revelarse; el rail de Proceso pasa a estar ligado al desplazamiento horizontal de la pista en vez de al scroll vertical del documento.
- `title-line-reveal`: los renglones de un hero no SHALL solaparse entre sí (interlineado mínimo en móvil).

## Impact

- `src/components/ContactFooter.astro`, `src/components/SiteHeader.astro`, nuevo `src/components/SocialLinks.astro`.
- `src/views/proyecto.astro` (details en la copia de tipología), `src/i18n/es.ts`, `src/i18n/en.ts` (etiqueta del details).
- `src/scripts/eredita-motion.ts`, `src/scripts/putnam-motion.ts` (montaje de `mountHorizontalTrack` en móvil).
- `src/styles/global.css` (footer, menú, reveals), `src/styles/eredita.css`, `src/styles/putnam.css`, `src/styles/unete.css`, `src/styles/contacto.css`, `src/styles/noticias.css`.
- `tests/mobile-audit.mjs`: `trackChecks` para la página de proyecto de Ereditá y `/putnam/`.
- Sin dependencias nuevas. Desktop no cambia.
