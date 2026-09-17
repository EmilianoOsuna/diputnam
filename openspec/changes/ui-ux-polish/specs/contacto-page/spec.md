## MODIFIED Requirements

### Requirement: Fidelidad visual y valores CSS aprobados

`contacto.css` SHALL portar los estilos del mockup bajo `.contacto-page` sin renombrar selectores ni aproximar valores. SHALL reutilizar de `global.css` la tipografía DM Sans/Josefin Sans, reset, header, navegación, menú, skip link y estados reduced-motion; no SHALL duplicar ni degradar esas reglas compartidas. Como mínimo, los siguientes tokens y relaciones exactas SHALL gobernar todo el layout:

- Tokens: `--putnam-green: #004b46`, `--putnam-deep: #003a36`, `--putnam-paper: #f4eedf`, `--putnam-sand: #e8deca`, `--putnam-dusk: #0e1613`, `--gutter: clamp(1.25rem, 3vw, 3.5rem)`.
- `.contacto-page`: fondo `var(--putnam-paper)` y `overflow-x: clip`.
- `.grid-12`: 12 columnas `minmax(0, 1fr)` con gap `2rem`.
- `.section-kicker`: `0.72rem/1`, peso `600`, tracking `0.16em`, uppercase.
- `.cta-actions`: flex, gap `1rem`; links de `min(18rem, 100%)`, padding vertical `1rem`, borde superior de `1px`, `0.83rem`, tracking `0.08em`, uppercase.
- `.hero-index`: inline-flex, `min-height: 2.75rem`, margin-top `1rem`, gap `1.2rem`, `0.68rem`, tracking `0.11em`, uppercase.

La geometría y tipografía desktop SHALL conservar exactamente:

| Bloque | Valores aprobados |
|---|---|
| `.ct-hero` | `height: 100dvh`; flex vertical al fondo; gap `clamp(2rem, 4dvh, 3.5rem)`; padding `7rem var(--gutter) 2.5rem`; overflow hidden; isolation isolate. |
| Hero media | `.hero-frame` absolute full-bleed, z-index `-2`; imagen `100% × 115%`, `object-fit: cover`, filtro `saturate(0.65) sepia(0.08)`, scale `1.02`; conservar ambos gradientes exactos del mockup. |
| Hero copy | ancho `min(66rem, 78vw)`; kicker margin-bottom `1.5rem`; `h1` `clamp(3.4rem, min(7.6vw, 13dvh), 8rem)`, peso `500`, line-height `0.9`, tracking `-0.055em`; lead ancho `min(34rem, 60vw)`, `clamp(0.95rem, 1.15vw, 1.15rem)/1.45`; meta `0.72rem`, tracking `0.12em`, alineado a la derecha. |
| `.ct-channels` | centrado vertical; `min-height: 100dvh`; padding `clamp(6rem, 10vw, 9rem) var(--gutter) clamp(5rem, 9vw, 8rem)`. Head margin-bottom `clamp(3.5rem, 6vw, 6rem)`; columnas `1/9` y `9/13`; `h2` ancho `min(52rem, 100%)`, `clamp(2.6rem, 5vw, 4.8rem)/0.98`, tracking `-0.045em`. |
| Índice/KPIs | `.index-list` margin-left `12%`; filas `4rem 1fr 3rem`, gap `1.5rem`, padding `1.9rem 0`; `strong` `clamp(1.6rem, 2.8vw, 2.8rem)/1.05`; `.kpis` tres columnas, gap `2rem`, margin `clamp(3rem, 5vw, 4.5rem) 0 0 12%`; conservar bordes y colores rgba exactos. |
| `.ct-reasons` | grid de 12 columnas, gap `2rem`, padding horizontal `var(--gutter)`, texto paper sobre deep. `.pin-stage` columnas `1/6`, altura `100dvh`, padding `7rem 0 3rem`; `.reasons` columnas `7/13`; cada `.reason` `min-height: 100dvh`, gap `1.2rem`, padding `4rem 0`; `h3` `clamp(2.6rem, 4.2vw, 4.7rem)/0.92`, tracking `-0.055em`. |
| Pin UI | `h2` ancho `22rem`, `clamp(2.4rem, 4vw, 3.8rem)/0.98`; counter `0.68rem`, `b` `clamp(4rem, 7vw, 7rem)/0.85`; rail `1px`, margin-top `1.6rem`, progreso inicial `33.3%` y `2px`. |
| `.ct-location` | `min-height: 100dvh`, padding `clamp(6rem, 10vw, 9rem) var(--gutter)`, fondo sand; mapa columnas `1/8`, aspect-ratio `5/4`, fondo `#dccfb5`; copy columnas `9/13`; `h2` `clamp(2.2rem, 3.4vw, 3.2rem)/1.02`, tracking `-0.035em`. |
| `.ct-form` | `min-height: 100dvh`, mismo padding vertical aprobado; head margin-bottom `clamp(3.5rem, 6vw, 5.5rem)`, columnas `1/9` y `9/13`; `h2` `clamp(3.4rem, 7.6vw, 8rem)/0.9`, tracking `-0.06em`; form margin-left `12%`. |
| Campos | filas `4rem 16rem 1fr`, gap `1.5rem`, padding `1.5rem 0`; controles transparentes, sin border/radius, `clamp(1.3rem, 1.9vw, 1.9rem)/1.15`, tracking `-0.025em`; textarea `min-height: 6rem`; select con appearance none y chevron aprobado; submit conserva grid, padding y colores exactos. |
| `.ct-cta` | `min-height: 100dvh`, padding `8rem var(--gutter) 6rem`, alineado al fondo, paper sobre green; `h2` max-width `72rem`, margin `3rem 0 2rem`, `clamp(3.4rem, 8.2vw, 8.4rem)/0.89`, tracking `-0.06em`; `.cta-mark` derecha `clamp(1rem, 4vw, 5rem)`, bottom `9%`, ancho `min(42vw, 42rem)`, opacity `0.2`. |
| Footer | `.site-footer--flow` en flujo, delgado conforme al estándar compartido de `site-shell-chrome` (no `min-height: 14rem` fijo), paper sobre deep, con la fila de iconos de redes y el crédito de autoría de `site-shell-chrome`; sin gradiente `::before`. |

Todos los bordes, opacidades rgba, filtros, márgenes, paddings, line-heights, letter-spacing, hover y focus del mockup SHALL trasladarse literalmente cuando no estén enumerados arriba, salvo la fila de Footer, que sigue el estándar compartido descrito arriba. No se añadirán cards, iconos, sombras, radios, tipografías, colores ni decoraciones no presentes salvo los iconos de redes y el crédito de autoría ya previstos en `site-shell-chrome`.

#### Scenario: Fidelidad desktop

- **WHEN** `/contacto/` se captura a `1440px` de ancho con fuentes e imágenes cargadas
- **THEN** composición, cortes de texto, espacios, retícula, escala, colores, gradientes, bordes, filtros coinciden visualmente con `Main.dc.html`, y el footer sigue el estándar delgado compartido con iconos de redes y crédito de autoría

### Requirement: Responsive derivado del mockup mobile

La implementación SHALL usar el mismo DOM en todos los tamaños. Debido a que los dos HTML aprobados son idénticos, SHALL aplicar exactamente estas diferencias y ninguna variante de contenido:

En `max-width: 899px`:

- Los dos hijos de `.ct-channels-head`, `.ct-map`, `.ct-location-copy` y los dos hijos de `.ct-form-head` pasan a `grid-column: 1 / 13`; los párrafos laterales reciben `margin-top: 1.5rem`.
- `.ct-reasons` pasa a block; `.pin-stage` deja de ser pinned/sticky, usa `position: static`, `height: auto`, `min-height: 0`, padding `6rem 0 2rem`; su `h2` amplía max-width a `26rem`.
- Cada `.reason` usa `min-height: 0` y padding `3rem 0`; `.ct-location-copy` recibe margin-top `3rem`.
- El script SHALL omitir pin, counter transitions y rail scrub por debajo de `900px`, limpiar transforms/estados y mantener los tres motivos visibles en flujo normal.

En `max-width: 767px`:

- Se reutilizan el header y menú mobile de `global.css`; no se aplica el `display:none` aislado del mockup sobre `.site-nav`, porque rompería `.site-nav.is-open` y la accesibilidad compartida.
- `.ct-hero`: padding `6rem 1rem 2rem`; `.hero-copy` width auto; `h1` `clamp(3.3rem, 15vw, 5.2rem)/0.92`; `.hero-details` columna y alineado al inicio; lead `min(28rem, 92%)`; meta alineada a la izquierda.
- `.ct-channels`, `.ct-location` y `.ct-form`: padding `6rem 1rem`; `.ct-reasons`: padding `0 1rem 3rem`.
- `.index-list`, `.kpis` y form: margin-left `0`; filas del índice `2.5rem 1fr 2rem`, gap `0.8rem`; KPIs una columna, gap `1.4rem`; número del pin `4rem`.
- El valor de cada canal (`.index-row strong`, incluido el correo) SHALL permanecer completamente visible entre 320px y 767px, sin recortarse ni ocultarse: SHALL ajustar tamaño de fuente y/o partir en varias líneas (`overflow-wrap: anywhere` o equivalente) en vez de desbordar o quedar tapado por columnas vecinas.
- `.f-row` y `.f-submit`: columnas `2.5rem 1fr`, gaps `0.8rem`; inputs/select/textarea y texto auxiliar en columna `2`; botón columnas `1 / 3` y margin-top `1.2rem`.
- `.ct-cta`: padding `6rem 1rem 5rem`; `h2` margin `5rem 0 2rem`, `clamp(3.4rem, 16vw, 5.5rem)`; marca right `-4%`, bottom `8%`, width `72vw`; `.cta-actions` columna.
- Footer: delgado conforme al estándar compartido de `site-shell-chrome` (no `min-height: 18rem` fijo), dos columnas de contacto más la fila de iconos de redes y el crédito de autoría, sin overflow horizontal; `.footer-address` sin margin-left.

La página SHALL funcionar sin overflow horizontal desde `320px`; ninguna interacción SHALL depender de hover. Los estados hover del mockup SHALL conservar equivalentes `:focus-visible`.

#### Scenario: Fidelidad mobile

- **WHEN** `/contacto/` se captura a `390px` y se compara con `Mobile.dc.html`
- **THEN** el contenido, orden, reflow, tipografía, espaciado y proporciones coinciden sin overflow ni elementos cortados

#### Scenario: Correo visible en el listado de canales
- **WHEN** `/contacto/` se abre entre 320px y 767px y se inspecciona la fila de correo en `.ct-channels`
- **THEN** la dirección completa (`Desarrollos.Putnam@outlook.com` u otra configurada) es legible en su totalidad, sin recortarse por el borde de la fila ni superponerse con la columna del icono

## ADDED Requirements

### Requirement: Barrido de texto en verde al interactuar con los campos

Cada fila de campo del formulario (`.f-row`) SHALL comunicar su estado hover/foco mediante un barrido de color de izquierda a derecha que pinta el texto de la etiqueta y del valor/placeholder en `var(--putnam-green)`, en vez de depender de una línea que aparezca o se resalte debajo del campo al interactuar. La transición SHALL ser suave (no instantánea) y SHALL tener un equivalente `:focus-within`/`:focus-visible` para que la interacción no dependa exclusivamente de hover, conforme al requisito de "Estados interactivos compartidos".

#### Scenario: Hover sobre un campo
- **WHEN** una persona pasa el cursor sobre una fila de campo del formulario
- **THEN** la etiqueta y el texto del campo se pintan de verde mediante un barrido animado de izquierda a derecha, sin que aparezca o se anime una línea inferior como señal principal de la interacción

#### Scenario: Foco por teclado
- **WHEN** una persona llega a un campo del formulario con Tab
- **THEN** el campo recibe la misma transición de color que el hover (o un equivalente accesible) además de conservar el foco visible del sistema
