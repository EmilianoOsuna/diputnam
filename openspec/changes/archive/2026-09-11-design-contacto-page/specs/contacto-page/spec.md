# contacto-page Specification

## Purpose

Definir la implementación de `/contacto/` con fidelidad visual al mockup aprobado, reutilizando el shell Astro, los datos de contacto y la arquitectura Lenis + GSAP/ScrollTrigger ya usada por las páginas Ereditá y Putnam.

## Source of truth

- Desktop: `scratchpad/contacto/Main.dc.html`, artboard de `1440 × 9600`.
- Mobile: `scratchpad/contacto/Mobile.dc.html`, artboard de `390 × 9400`.
- Ambos HTML son byte por byte idénticos; las diferencias mobile provienen exclusivamente de sus media queries `max-width: 899px` y `max-width: 767px`.
- Movimiento: las cinco anotaciones de `scratchpad/contacto/canvas.json`.
- Convenciones de implementación: `src/pages/eredita.astro`, `src/pages/putnam.astro`, `src/styles/global.css`, `src/styles/eredita.css`, `src/styles/putnam.css`, `src/scripts/eredita-motion.ts`, `src/scripts/putnam-motion.ts` y `src/data/home.ts`.

## ADDED Requirements

### Requirement: Ruta Astro, shell compartido y assets

El sitio SHALL exponer `/contacto/` desde `src/pages/contacto.astro`. La página SHALL importar `src/styles/global.css` y un stylesheet propio `src/styles/contacto.css`, usar `<body class="contacto-page">`, renderizar un skip link a `#contenido`, reutilizar `SiteHeader` y `ContactFooter`, y cargar `src/scripts/contacto-motion.ts` al final del body. El `<main id="contenido" data-contacto>` SHALL contener las seis secciones del mockup en el mismo orden.

El hero aprobado `/tmp/claude-1000/-home-emiliano-osuna-Projects-Chambas-diputnam/abdd5823-6992-42f8-982e-9ff087683d58/scratchpad/contacto/contacto-hero.jpg` SHALL copiarse a `public/assets/contacto-hero.jpg` y referenciarse como `/assets/contacto-hero.jpg`, con dimensiones intrínsecas `1280 × 850` y alt `Interior residencial de un proyecto Putnam`. La marca decorativa del CTA SHALL reutilizar `/assets/putnam-light.png`, ya existente, con dimensiones intrínsecas `800 × 800`, `alt=""` y `aria-hidden="true"`. No SHALL mantenerse ninguna ruta relativa del scratchpad.

Los valores ya presentes en `contact` de `src/data/home.ts` SHALL alimentar email, teléfono, ciudad y URL completa de WhatsApp —incluido su texto precargado— en vez de duplicarlos en Astro. Los datos nuevos del mockup (dirección, horario, plazo de respuesta, URL de Maps y coordenadas) SHALL incorporarse al mismo objeto `contact` y reutilizarse en todos sus puntos de render.

#### Scenario: Carga directa

- **WHEN** una persona abre `/contacto/`
- **THEN** recibe la página completa con metadata en español, favicon `/assets/putnam-light.png`, header, seis secciones, footer y assets locales sin errores 404

#### Scenario: Datos consistentes

- **WHEN** se comparan hero, canales, ubicación, formulario, CTA, footer y menú mobile
- **THEN** email, teléfono, ciudad, dirección, horario, Maps y WhatsApp proceden de una única fuente local y no divergen

### Requirement: Mapeo exacto de estructura y clases

La implementación SHALL conservar estos nodos, clases, ids, orden y contenido visible del mockup; solo SHALL sustituir el header/footer duplicados por los componentes compartidos y el placeholder de mapa por el iframe requerido:

| Orden | Astro/HTML requerido | Contenido y mapeo |
|---|---|---|
| Header | `<SiteHeader />` antes de `main` | Misma apariencia de `.site-header`, `.brand--mark`, `.brand-copy`, `.site-nav` y `.menu-toggle`; logo claro sobre secciones oscuras y oscuro sobre secciones claras mediante los `data-header-theme` y `menu.ts` existentes. |
| 01 | `section.ct-hero#inicio[data-header-theme="light"]` | `.hero-copy` con `.section-kicker.fade-up` y `h1` de tres `.line > span`: “Conversemos”, “sobre tu próximo”, “proyecto.”; `.hero-details.fade-up` con `.hero-lead`, `.hero-index[href="#canales"]` y `.hero-meta`; `figure.hero-frame[data-parallax]` con la imagen aprobada. |
| 02 | `section.ct-channels#canales[data-header-theme="dark"]` | `header.ct-channels-head.grid-12`, kicker, `h2` y párrafo exactamente como el mockup; `.index-list` con cuatro `.index-row` en el mismo orden; `.kpis` con tres `.kpi` y los valores `24 – 48 h`, `Bolivia`, `1 : 1`. WhatsApp y correo SHALL ser enlaces; oficina y horario SHALL permanecer información no interactiva. |
| 03 | `section.ct-reasons#motivos[data-header-theme="light"]` | `.pin-stage` con kicker, `h2`, `.pin-counter` (`b` actual, separador y `03`) y `.pin-rail > span`; `.reasons` con tres `article.reason`, etiquetas, títulos, párrafos y enlaces exactos del mockup. Añadir data hooks, sin reemplazar las clases: `data-reasons`, `data-pin-stage`, `data-pin-current`, `data-pin-rail`, `data-reason` e índice. |
| 04 | `section.ct-location.grid-12#ubicacion[data-header-theme="dark"]` | `figure.ct-map` SHALL contener un iframe real de Google Maps para `−16.541498, −68.078775`, con `title="Mapa de la oficina de Putnam en San Miguel, La Paz"`, lazy loading y sin el SVG/texto placeholder; `.ct-location-copy`, `dl`, dirección, horario y CTA “Abrir en Google Maps” SHALL conservar markup y copy. |
| 05 | `section.ct-form#formulario[data-header-theme="dark"]` | `header.ct-form-head.grid-12`; formulario con seis `.f-row`, la variante `.f-row--text`, ids/labels `ct-nombre`, `ct-empresa`, `ct-email`, `ct-telefono`, `ct-motivo`, `ct-mensaje`, tipos, placeholders y seis options exactos; cierre `.f-submit`. |
| 06 | `section.ct-cta[data-header-theme="light"]` | Kicker, `h2`, párrafo, `.cta-actions` con WhatsApp y `img.cta-mark` exactamente como el mockup. |
| Footer | `<ContactFooter />` después de `main` | Debe producir `.site-footer.site-footer--flow#contacto` con email, teléfono, ciudad y WhatsApp existentes. |

Cada sección SHALL tener `aria-labelledby` y un encabezado con id; solo el hero SHALL contener `h1`. Los caracteres, mayúsculas, signos, separadores, flechas y espacios del copy aprobado SHALL preservarse. Los enlaces externos SHALL usar `target="_blank" rel="noreferrer"`; email y teléfono SHALL conservar esquemas `mailto:` y `tel:`.

La navegación compartida SHALL conservar el comportamiento accesible existente de `SiteHeader` (overlay mobile, `aria-expanded`, Escape, retorno de foco e inert del contenido). En todas las páginas, la marca SHALL apuntar a `/`, Ereditá a `/eredita/`, Putnam a `/putnam/` y Contacto a `/contacto/`; no se usarán anclas de páginas hermanas como destino principal.

#### Scenario: Comparación estructural

- **WHEN** se inspecciona el DOM renderizado frente al mockup
- **THEN** las clases, ids, jerarquía, orden, copy y elementos interactivos listados coinciden, salvo las sustituciones explícitas por componentes compartidos y mapa real

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
| Footer | `.site-footer--flow` en flujo, min-height `14rem`, padding `4rem var(--gutter)`, paper sobre deep; sin gradiente `::before`, conforme a las páginas internas existentes. |

Todos los bordes, opacidades rgba, filtros, márgenes, paddings, line-heights, letter-spacing, hover y focus del mockup SHALL trasladarse literalmente cuando no estén enumerados arriba. No se añadirán cards, iconos, sombras, radios, tipografías, colores ni decoraciones no presentes.

#### Scenario: Fidelidad desktop

- **WHEN** `/contacto/` se captura a `1440px` de ancho con fuentes e imágenes cargadas
- **THEN** composición, cortes de texto, espacios, retícula, escala, colores, gradientes, bordes, filtros y footer coinciden visualmente con `Main.dc.html`

### Requirement: Altura real del viewport, sin clamp del canvas

> [!WARNING]
> `--vh: min(100dvh, 1000px)` y su variante mobile `min(100dvh, 844px)` existen únicamente para limitar el artboard del mockup. En Astro están prohibidos.

Toda sección full-height, `.pin-stage` y cada `.reason` SHALL usar `100dvh` directamente (`height` o `min-height` según el mockup). No SHALL declararse `--vh`, `min(100dvh, 1000px)`, `min(100dvh, 844px)`, `100svh` ni un máximo equivalente para estas secciones.

#### Scenario: Viewport alto

- **WHEN** la página se abre en un viewport de más de `1000px` de alto
- **THEN** cada bloque full-height ocupa el `100dvh` completo y no queda topado a `1000px` o `844px`

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
- `.f-row` y `.f-submit`: columnas `2.5rem 1fr`, gaps `0.8rem`; inputs/select/textarea y texto auxiliar en columna `2`; botón columnas `1 / 3` y margin-top `1.2rem`.
- `.ct-cta`: padding `6rem 1rem 5rem`; `h2` margin `5rem 0 2rem`, `clamp(3.4rem, 16vw, 5.5rem)`; marca right `-4%`, bottom `8%`, width `72vw`; `.cta-actions` columna.
- Footer: dos columnas, gap `0.8rem`, min-height `18rem`, padding `4rem 1rem`, font-size `0.8rem`; `.footer-address` sin margin-left.

La página SHALL funcionar sin overflow horizontal desde `320px`; ninguna interacción SHALL depender de hover. Los estados hover del mockup SHALL conservar equivalentes `:focus-visible`.

#### Scenario: Fidelidad mobile

- **WHEN** `/contacto/` se captura a `390px` y se compara con `Mobile.dc.html`
- **THEN** el contenido, orden, reflow, tipografía, espaciado y proporciones coinciden sin overflow ni elementos cortados

### Requirement: Arquitectura Lenis + GSAP compartida por convención

`contacto-motion.ts` SHALL seguir el esqueleto de `eredita-motion.ts` y `putnam-motion.ts`, sin introducir otra librería, controlador global ni instancia duplicada:

1. Importar `Lenis`, `gsap` y `ScrollTrigger`; registrar el plugin.
2. Resolver `root` con `[data-contacto]` y salir si no existe o si `prefers-reduced-motion: reduce` coincide.
3. Añadir `body.is-motion-ready` solo después de confirmar root y motion permitido.
4. Crear `new Lenis({ anchors: true, autoRaf: false, lerp: 0.09 })`; conectar `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(time => lenis.raf(time * 1000))` y `gsap.ticker.lagSmoothing(0)`.
5. Encapsular selectores/tweens en `gsap.context(..., root)` y breakpoints en `gsap.matchMedia()`.
6. En `pagehide`, ejecutar `context.revert()`, `lenis.destroy()` y retirar el ticker, una sola vez.

No se implementará snap en la sección de motivos: el patrón aprobado es scroll continuo con scrub. Por ello Lenis SHALL permanecer activo durante el pin. `lenis.stop()`/`start()` solo sería necesario si posteriormente se aprueba navegación discreta/snap como la de Ereditá.

#### Scenario: Ciclo de vida

- **WHEN** la página se monta, hace scroll, cambia de breakpoint y se abandona
- **THEN** existe una sola instancia Lenis, ScrollTrigger se actualiza con ella y no quedan listeners, tickers, pins, transforms ni triggers residuales

### Requirement: Reveals de texto y grupos

El hero SHALL animar cada `.hero-copy h1 .line > span` de `yPercent: 110` a `0`, `duration: 0.9`, `stagger: 0.09`, `ease: 'expo.out'`. `.section-kicker.fade-up`, `.hero-details.fade-up` y sus lead/meta SHALL entrar con `autoAlpha: 0 → 1`, `y: 24 → 0`, `duration: 0.8`, `delay: 0.4` y ease de salida.

Todos los `h2` de las secciones 02, 04, 05 y 06 SHALL estar envueltos en spans `.line > span` con cortes editoriales explícitos y animarse con el patrón del hero cuando el título llegue al 80% del viewport: `scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none reverse' }`.

Los párrafos, las cuatro `.index-row` y los seis `.f-row` SHALL agruparse mediante `data-reveal-group`; cada grupo SHALL animar sus hijos de `autoAlpha: 0, y: 24` a su estado natural, `duration: 0.9`, `stagger: 0.08`, `ease: 'power3.out'`, con trigger `start: 'top 80%'` y `toggleActions: 'play none none reverse'`. El hero SHALL excluirse del loop genérico, igual que en los scripts de referencia.

El contenido SHALL estar visible y en flujo antes de inicializar JS. CSS no SHALL ocultar `.line > span`, `.fade-up` ni `[data-reveal-group]` por defecto; cualquier estado inicial SHALL pertenecer a `gsap.from` después de `is-motion-ready`.

#### Scenario: Reveal reversible

- **WHEN** un título o grupo cruza el 80% del viewport hacia abajo y después hacia arriba
- **THEN** entra con los tiempos/stagger aprobados y revierte sin alterar el orden DOM ni dejar contenido inaccesible

### Requirement: Pin de motivos, contador y rail

Solo con `min-width: 900px`, ScrollTrigger SHALL fijar `.pin-stage` mientras se recorren los tres `.reason`. La sección conserva tres razones de `min-height: 100dvh`; configurar el trigger de pin con `.ct-reasons`, `start: 'top top'`, `end: 'bottom bottom'`, `pin: '.pin-stage'`, `pinSpacing: false` e `invalidateOnRefresh: true`. Esta geometría produce una sección de `3 × 100dvh` sin añadir marcadores artificiales.

Cada `.reason` SHALL crear un trigger equivalente al patrón de pasos de Putnam: `start: 'top 55%'`, `end: 'bottom 45%'`, y `onEnter`/`onEnterBack` SHALL llamar una única función `setReason(index)`. Esa función SHALL:

- actualizar `[data-pin-current]` a `01`, `02` o `03` con `padStart(2, '0')`;
- mantener el ancho de `[data-pin-rail]` coherente con el paso activo (`33.333%`, `66.667%` o `100%`);
- marcar solo la razón actual con `.is-active`;
- hacer fade del título que deja de estar activo y revelar el nuevo sin ocultar el artículo completo ni cambiar `aria-hidden`, pues las tres razones permanecen en el flujo semántico.

Como en el rail de proceso de `putnam-motion.ts`, un tween separado SHALL mover `[data-pin-rail]` de `width: '33.333%'` a `width: '100%'`, `ease: 'none'`, con `scrollTrigger: { trigger: '.ct-reasons', start: 'top top', end: 'bottom bottom', scrub: 0.45 }`; el counter discreto y el progreso continuo deberán coincidir al centro de cada razón. Al salir del `matchMedia`, SHALL matar triggers y limpiar pin spacers, clases, anchos y transforms. No SHALL capturarse wheel/touch ni detenerse Lenis.

#### Scenario: Recorrido pinned desktop

- **WHEN** las tres razones cruzan el centro en desktop
- **THEN** el stage izquierdo permanece fijo durante la sección, el contador avanza `01 → 02 → 03`, el rail `33.333% → 66.667% → 100%` y el estado revierte correctamente al subir

#### Scenario: Flujo mobile

- **WHEN** el viewport es menor de `900px`
- **THEN** no existe pin ni espacio artificial y las tres razones aparecen completas en flujo vertical

### Requirement: Parallax y temas de header

Dentro de `gsap.matchMedia('(min-width: 768px)')`, `[data-parallax]` del hero SHALL usar `gsap.fromTo` de `yPercent: -6` a `6`, `ease: 'none'`, con `start: 'top bottom'`, `end: 'bottom top'` y `scrub: 0.7`, igual que Ereditá. `.cta-mark` SHALL desplazarse de `y: -40` a `40`, `ease: 'none'`, con trigger `.ct-cta`, `start: 'top bottom'`, `end: 'bottom bottom'`, `scrub: 0.8`. La salida del media query SHALL limpiar `transform` de ambos.

Las secciones SHALL declarar los temas indicados en el mapeo para que `menu.ts` actualice color y logo del header compartido; no se creará un observer/controlador alterno.

#### Scenario: Parallax desktop

- **WHEN** el hero y CTA atraviesan el viewport a partir de `768px`
- **THEN** imagen y marca se desplazan de forma lenta, ligada al scroll y sin modificar layout

### Requirement: Accesibilidad y reducción de movimiento

Con `prefers-reduced-motion: reduce`, Lenis, pin, scrub, parallax y reveals SHALL quedar desactivados. CSS SHALL forzar transform none y opacity 1 para `[data-parallax]`, `[data-reveal-group]`, `.line > span`, `.fade-up`, `[data-pin-stage]` y `[data-pin-rail]`; la sección de motivos SHALL conservar el flujo mobile/no-pinned. Sin JavaScript, todo el contenido SHALL seguir visible y todos los enlaces/anclas SHALL funcionar.

Inputs SHALL tener `name`, labels asociados, autocomplete pertinente, foco visible y validación HTML nativa para campos obligatorios que se acuerden. El iframe SHALL tener title; imágenes decorativas alt vacío; el hero alt descriptivo; el mapa SHALL ser navegable sin bloquear scroll de página. Objetivos táctiles SHALL ser de al menos `44 × 44px` donde aplique.

#### Scenario: Movimiento reducido o JS ausente

- **WHEN** se solicita reduced motion o JavaScript no se ejecuta
- **THEN** no hay smooth scroll, pin ni transforms persistentes y toda la página conserva orden, legibilidad y navegación

### Requirement: Decisiones pendientes con default implementable

La primera implementación SHALL aplicar los defaults documentados abajo para formulario, cortes de línea y mapa, sin bloquear el resto de la página; cualquier sustitución posterior SHALL requerir una decisión explícita y conservar los demás requisitos de este spec.

#### Scenario: Implementación sin decisiones posteriores

- **WHEN** comienza la implementación y no se han aprobado definiciones adicionales
- **THEN** se usan el formulario no transmisor, los cortes editoriales escritos en Astro y el iframe sin API key descritos como defaults

#### Decision needed: Envío del formulario

El mockup usa `action="#"` y `button type="button"`; el repositorio no define endpoint, servicio ni política de tratamiento de datos. Default recomendado: implementar el formulario como UI no transmisora, mantener `type="button"`, no emitir requests ni mostrar un éxito falso y dirigir contacto inmediato a email/WhatsApp. Antes de habilitar `type="submit"`, SHALL aprobarse endpoint, campos obligatorios, validación, consentimiento, manejo de errores/spam y mensaje de éxito.

#### Decision needed: Cortes de línea de h2

La anotación exige reveals por línea, pero los scripts existentes no incluyen SplitText ni helper de segmentación. Default recomendado: spans `.line > span` escritos en Astro con cortes aprobados para `1440px` y `390px`, sin dependencia nueva. Si QA demuestra cortes intermedios incorrectos, SHALL aprobarse primero un helper compartido o el plugin SplitText ya incluido en GSAP; no se añadirá otro paquete.

#### Decision needed: URL embed de Google Maps

La anotación exige iframe real, pero solo aporta coordenadas y enlace de Maps. Default recomendado: iframe sin API key con `https://www.google.com/maps?q=-16.541498,-68.078775&output=embed`; el CTA conserva `https://maps.app.goo.gl/uLKQ1rPhj3DSpW1U8`. Sustituir el embed solo si Putnam entrega una URL oficial distinta.

### Requirement: Aceptación visual, responsive y de movimiento

La implementación no SHALL considerarse terminada hasta completar esta lista:

- [ ] `npm run build` termina sin errores y `/contacto/` se genera.
- [ ] Solo existen una instancia Lenis y un controlador de motion scoped a `[data-contacto]`; `pagehide` limpia todos los recursos.
- [ ] Captura desktop a `1440px` coincide con `Main.dc.html` en las seis secciones y footer: layout, copy, clases, fuentes, tamaños, line-height, tracking, márgenes, padding, colores, opacidades, bordes, gradientes, filtros y assets.
- [ ] Captura mobile a `390px` coincide con `Mobile.dc.html`; prueba adicional a `320px` no presenta overflow horizontal, solapamientos ni texto/controles cortados.
- [ ] Viewport de altura mayor a `1000px` confirma `100dvh` real; búsqueda en la implementación no encuentra `--vh`, `min(100dvh, 1000px)`, `min(100dvh, 844px)` ni sustituciones `100svh` para secciones full-height.
- [ ] Header cambia de tema en cada límite, usa logo correcto y el menú mobile abre/cierra por botón, enlace, Escape y cambio de breakpoint, conservando foco e inert.
- [ ] Hero revela tres líneas con `110% → 0`, `0.9s`, stagger `0.09`, `expo.out`; kicker/lead/meta entran con delay `0.4s`.
- [ ] Títulos 02/04/05/06 disparan a `top 80%`; párrafos, índice y campos revelan desde `24px` con stagger `0.08` y revierten al subir.
- [ ] En `≥900px`, motivos ocupa `3 × 100dvh`, stage queda pinned, contador/rail avanzan y revierten; en `<900px`, todo vuelve al flujo sin spacer residual.
- [ ] En `≥768px`, hero recorre `yPercent -6 → 6` con scrub `0.7` y marca CTA `y -40 → 40` con scrub `0.8`; al cambiar breakpoint se limpian transforms.
- [ ] `prefers-reduced-motion: reduce` y prueba con JS desactivado mantienen todo visible, navegable y sin pin/parallax/smooth scroll.
- [ ] Hero carga desde `/assets/contacto-hero.jpg`; CTA desde `/assets/putnam-light.png`; no hay rutas scratchpad ni assets rotos.
- [ ] Email, `tel:`, WhatsApp y Google Maps abren destinos correctos; los datos coinciden con `home.ts`; el formulario cumple el default no transmisor hasta que exista una decisión de backend.
- [ ] Semántica, jerarquía de headings, skip link, labels, iframe title, alt, keyboard, foco visible y targets táctiles pasan revisión manual.

#### Scenario: Revisión final

- **WHEN** cada casilla se verifica en desktop, mobile, reduced motion y sin JavaScript
- **THEN** la página puede aprobarse por fidelidad visual y de movimiento sin inventar arquitectura ni comportamiento fuera del mockup

### Requirement: Rutas reales en la navegación compartida

La marca y cada entrada del navbar SHALL producir los mismos destinos reales desde home, Ereditá, Putnam y Contacto: `/`, `/eredita/`, `/putnam/` y `/contacto/`. El enlace activo no SHALL depender de que la persona haya llegado desde una ruta específica, y el menú mobile SHALL conservar esos mismos destinos.

#### Scenario: Navegación cruzada
- **WHEN** una persona abre cualquier página y selecciona cada entrada del navbar
- **THEN** Ereditá, Putnam y Contacto abren sus rutas dedicadas y la marca vuelve a `/`

### Requirement: Header limpio sobre cualquier fondo

El header compartido SHALL iniciar pegado al borde superior del viewport sin línea, borde u `outline` visible sobre el hero. No SHALL renderizar sombra, gradiente, `backdrop-filter` ni pseudo-elemento oscurecedor; el color del texto y logo SHALL cambiar únicamente con el tema de la sección.

#### Scenario: Header sobre hero y fondo claro
- **WHEN** el header cruza el hero, una sección clara o una sección oscura
- **THEN** no aparece una línea superior ni una sombra/gradiente, y solo cambia el contraste de logo y texto

### Requirement: Dropdown custom accesible

Los selects de formularios SHALL presentar un control custom con el estilo del sistema y una lista de opciones que pueda abrirse con click, Enter, Space o ArrowDown, navegarse con ArrowUp/ArrowDown, cerrarse con Escape y confirmarse con Enter. El control SHALL mantener una asociación de label, estado `aria-expanded`, opción activa y valor seleccionado; SHALL conservar un fallback de formulario operable cuando JavaScript no esté disponible.

#### Scenario: Selección con mouse y teclado
- **WHEN** una persona abre el motivo de contacto, pasa el cursor sobre una opción y confirma una opción
- **THEN** la opción se resalta de forma sutil, el valor queda visible en el campo y el estado accesible refleja el cambio sin emitir un request

#### Scenario: Dropdown sin JavaScript
- **WHEN** JavaScript está desactivado
- **THEN** el campo permanece seleccionable con el control nativo y conserva su label, opciones y valor enviado si posteriormente se conecta un endpoint

### Requirement: Estados interactivos compartidos

En todas las páginas, enlaces, botones, campos, selects custom y controles de navegación SHALL tener estados hover y focus-visible sutiles, con transiciones breves de opacidad, color, borde o desplazamiento de icono. Ningún estado SHALL usar cursor magnético, capturar el puntero, bloquear scroll ni depender exclusivamente de hover; con reduced motion SHALL eliminarse la transición no esencial y conservarse el foco visible.

#### Scenario: Hover y foco de controles
- **WHEN** una persona pasa el mouse sobre un enlace, botón o campo, o llega a él con teclado
- **THEN** el control comunica su interactividad con una animación discreta y foco visible, sin alterar layout ni perder accesibilidad

#### Scenario: Interacción consistente entre rutas
- **WHEN** se repiten los mismos controles en home, Ereditá, Putnam y Contacto
- **THEN** comparten la misma respuesta visual y los mismos límites de movimiento
