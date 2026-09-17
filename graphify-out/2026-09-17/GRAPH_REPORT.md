# Graph Report - diputnam  (2026-09-16)

## Corpus Check
- 244 files · ~2,324,902 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2166 nodes · 2483 edges · 181 communities (178 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `927c136d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ADDED Requirements
- Requirements
- eredita.astro
- package.json
- ADDED Requirements
- Requirements
- Requirement: Movimiento premium y controlado
- Requirements
- ADDED Requirements
- ADDED Requirements
- Requirements
- ADDED Requirements
- ADDED Requirements
- Decisions
- Requirement: Navegación y contacto legibles
- Product
- SKILL.md
- design.md
- design.md
- design.md
- Decisions
- Decisions
- Requirement: Contenido inicial de la home
- menu.ts
- Requirement: Movimiento premium y controlado
- motion.ts
- proposal.md
- proposal.md
- proposal.md
- proposal.md
- proposal.md
- MODIFIED Requirements
- proposal.md
- tasks.md
- proposal.md
- proposal.md
- tasks.md
- Requirement: Acceso a la página institucional de Putnam
- Inspo.md
- tasks.md
- tasks.md
- design.md
- tasks.md
- design.md
- tasks.md
- tasks.md
- tasks.md
- README.md
- contacto-motion.ts
- eredita-motion.ts
- noticias-motion.ts
- putnam-motion.ts
- SKILL.md
- SKILL.md
- SKILL.md
- SKILL.md
- SKILL.md
- unete-motion.ts
- ADDED Requirements
- Requirement: Experiencia responsive y movimiento reducido
- proposal.md
- proposal.md
- design.md
- design.md
- Mobile 60fps validation notes
- tasks.md
- tasks.md
- putnam-performance.mjs
- Requirements
- Requirements
- Requirements
- Decisions
- Requirement: Reveals por scroll en móvil
- Requirement: Experiencia responsive y movimiento reducido
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- ADDED Requirements
- Decisions
- MODIFIED Requirements
- ADDED Requirements
- check-dist.mjs
- Requirement: Contenido inicial de la home
- tasks.md
- Requirement: Responsive y movimiento reducido
- seed.ts
- tasks.md
- Requirement: Imágenes locales resueltas en build-time
- index.ts
- sanity.config.ts
- Requirement: Movimiento premium y controlado
- Requirement: Responsive y movimiento reducido
- ADDED Requirements
- trace-mark.mjs
- seed-local.ts
- seed.en.ts
- proposal.md
- proposal.md
- proposal.md
- proposal.md
- proposal.md
- MODIFIED Requirements
- proposal.md
- tasks.md
- proposal.md
- proposal.md
- proposal.md
- proposal.md
- proposal.md
- proposal.md
- proposal.md
- tasks.md
- design.md
- proposal.md
- Requirement: Entrada por renglón en todos los títulos
- design.md
- proposal.md
- proposal.md
- Requirement: Movimiento editorial y smooth scroll
- tasks.md
- og.mjs
- proyecto.ts
- migrate-proyectos.ts
- contacto.ts
- tasks.md
- Requirement: Acceso a la página institucional de Putnam
- tasks.md
- design.md
- Requirement: Animación de entrada del hero en móvil en todas las páginas interiores
- tasks.md
- sanity.ts
- tasks.md
- tasks.md
- design.md
- tasks.md
- design.md
- design.md
- Requirement: Reveals de texto y grupos
- Requirement: Rutas reales en la navegación compartida
- Requirement: Contenido inicial de la home
- Requirement: Imágenes locales resueltas en build-time
- icons.mjs
- tasks.md
- tasks.md
- tasks.md
- tasks.md
- tasks.md
- vercel.json
- rename-proyecto-id.ts
- Requirement: Movimiento editorial y smooth scroll
- tasks.md
- proposal.md
- design.md
- tasks.md
- sitemap.xml.ts
- Requirement: Pista horizontal con swipe nativo en móvil
- Requirement: Pie de página compartido delgado con redes y crédito
- Requirement: Reveals por scroll en móvil
- proposal.md
- design.md
- tasks.md
- Requirement: Renglones de hero sin solaparse en móvil
- SocialLinks.astro

## God Nodes (most connected - your core abstractions)
1. `../components/SiteHead.astro` - 34 edges
2. `../components/CmsImg.astro` - 19 edges
3. `../components/SiteHeader.astro` - 19 edges
4. `Requirements` - 18 edges
5. `scripts` - 17 edges
6. `revealHeroLines()` - 17 edges
7. `ADDED Requirements` - 17 edges
8. `../components/ContactFooter.astro` - 16 edges
9. `revealTitles()` - 15 edges
10. `t()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `alternatesOf()` --indirect_call--> `href()`  [INFERRED]
  tests/check-dist.mjs → src/components/SiteHead.astro
- `observeTheme()` --indirect_call--> `section()`  [INFERRED]
  src/scripts/menu.ts → studio/schemaTypes/pages.ts
- `mount()` --references--> `lenis`  [EXTRACTED]
  src/scripts/desktop/contacto.ts → package.json
- `mount()` --references--> `lenis`  [EXTRACTED]
  src/scripts/desktop/eredita.ts → package.json
- `mount()` --references--> `lenis`  [EXTRACTED]
  src/scripts/desktop/home.ts → package.json

## Import Cycles
- None detected.

## Communities (181 total, 3 thin omitted)

### Community 0 - "ADDED Requirements"
Cohesion: 0.05
Nodes (43): ADDED Requirements, contacto-page Specification, Decision needed: Cortes de línea de h2, Decision needed: Envío del formulario, Decision needed: URL embed de Google Maps, Purpose, Requirement: Accesibilidad y reducción de movimiento, Requirement: Aceptación visual, responsive y de movimiento (+35 more)

### Community 1 - "Requirements"
Cohesion: 0.04
Nodes (48): contacto-page Specification, Decision needed: Cortes de línea de h2, Decision needed: Envío del formulario, Decision needed: URL embed de Google Maps, Purpose, Requirement: Accesibilidad y reducción de movimiento, Requirement: Aceptación visual, responsive y de movimiento, Requirement: Altura real del viewport, sin clamp del canvas (+40 more)

### Community 2 - "eredita.astro"
Cohesion: 0.14
Nodes (19): ../assets/putnam-dark.png, ../assets/putnam-light.png, ../i18n, ../lib/content, ../lib/images, ../styles/contacto.css, ../styles/global.css, ../styles/not-found.css (+11 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (33): groq-js, author, bugs, url, description, devDependencies, groq-js, homepage (+25 more)

### Community 4 - "ADDED Requirements"
Cohesion: 0.15
Nodes (19): ../components/SiteHead.astro, alternates, canonical, graph, image, pair, path, ui (+11 more)

### Community 5 - "Requirements"
Cohesion: 0.06
Nodes (34): home-ui Specification, Purpose, Requirement: Acceso a la página institucional de Putnam, Requirement: Animación y scroll, Requirement: Contenido inicial de la home, Requirement: Experiencia responsive y movimiento reducido, Requirement: Hero de Putnam, Requirement: Home visualmente fiel a la referencia (+26 more)

### Community 6 - "Requirement: Movimiento premium y controlado"
Cohesion: 0.08
Nodes (25): home-ui-motion-readability Specification, Purpose, Requirement: Legibilidad sobre imágenes, Requirement: Movimiento premium y controlado, Requirement: Responsive y movimiento reducido, Requirement: Stage de slides con título persistente, Requirement: Tipografía editorial de la referencia, Requirements (+17 more)

### Community 7 - "Requirements"
Cohesion: 0.08
Nodes (27): locales, otherLang(), pages, routes, failures, failures, navKeys, check() (+19 more)

### Community 8 - "ADDED Requirements"
Cohesion: 0.09
Nodes (34): CmsImage, Contacto, Eredita, erediteHero(), erediteIntro(), getContacto(), getEredita(), getHome() (+26 more)

### Community 9 - "ADDED Requirements"
Cohesion: 0.14
Nodes (27): astro, gsap, lenis, dependencies, astro, astro-portabletext, gsap, lenis (+19 more)

### Community 10 - "Requirements"
Cohesion: 0.06
Nodes (33): react, react-dom, sanity, @sanity/document-internationalization, @sanity/vision, allowScripts, esbuild@0.28.2, dependencies (+25 more)

### Community 11 - "ADDED Requirements"
Cohesion: 0.05
Nodes (36): eredita-project-lines Specification, Purpose, Requirement: Contador y barra de progreso visibles en todos los anchos, Requirement: Documentos legales por proyecto, Requirement: Masonry de galería consistente en móvil, Requirement: Metadatos y superficie de rastreo de las páginas de proyecto, Requirement: Migración del contenido existente sin pérdida, Requirement: Portada de la línea en la ruta de Ereditá (+28 more)

### Community 12 - "ADDED Requirements"
Cohesion: 0.07
Nodes (26): ADDED Requirements, Purpose, Requirement: Documentos legales por proyecto, Requirement: Metadatos y superficie de rastreo de las páginas de proyecto, Requirement: Migración del contenido existente sin pérdida, Requirement: Portada de la línea en la ruta de Ereditá, Requirement: Proyecto como documento editable, Requirement: Página de proyecto por idioma (+18 more)

### Community 13 - "Decisions"
Cohesion: 0.07
Nodes (26): Purpose, Requirement: Datos estructurados JSON-LD, Requirement: Directivas para robots y vista previa, Requirement: Metadatos Open Graph y Twitter por página e idioma, Requirement: Título y descripción con marca y mercado, Requirement: Un solo encabezado principal, Requirement: URL canónica absoluta, Requirements (+18 more)

### Community 14 - "Requirement: Navegación y contacto legibles"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Purpose, Requirement: Datos estructurados JSON-LD, Requirement: Directivas para robots y vista previa, Requirement: Metadatos Open Graph y Twitter por página e idioma, Requirement: Título y descripción con marca y mercado, Requirement: Un solo encabezado principal, Requirement: URL canónica absoluta (+17 more)

### Community 15 - "Product"
Cohesion: 0.08
Nodes (23): mobile-rendering-performance Specification, Purpose, Requirement: Degradación explícita sin pérdida de contenido, Requirement: Movimiento ligado al scroll ejecutado en el compositor, Requirement: Presupuesto de frame verificado en cada ruta, Requirement: Scroll móvil sin trabajo por frame en el hilo principal, Requirement: Sin efectos de pantalla completa costosos, Requirement: Sin librerías de movimiento en móvil (+15 more)

### Community 16 - "SKILL.md"
Cohesion: 0.08
Nodes (23): Purpose, Requirement: Accesibilidad de la galería, Requirement: Carga y peso de la galería, Requirement: Medio por defecto y selección por miniaturas, Requirement: Medios de una tipología editables en el CMS, Requirement: Reproducción del video, Requirements, Scenario: Formato de video no admitido (+15 more)

### Community 17 - "design.md"
Cohesion: 0.14
Nodes (20): erediteGallery, erediteHero, erediteIntro, erediteLegalDocs, erediteProject, erediteSections, erediteTypologies, Nota (+12 more)

### Community 18 - "design.md"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Purpose, Requirement: Degradación explícita sin pérdida de contenido, Requirement: Movimiento ligado al scroll ejecutado en el compositor, Requirement: Presupuesto de frame verificado en cada ruta, Requirement: Scroll móvil sin trabajo por frame en el hilo principal, Requirement: Sin efectos de pantalla completa costosos, Requirement: Sin librerías de movimiento en móvil (+14 more)

### Community 19 - "design.md"
Cohesion: 0.09
Nodes (22): ADDED Requirements, Purpose, Requirement: Accesibilidad de la galería, Requirement: Carga y peso de la galería, Requirement: Medio por defecto y selección por miniaturas, Requirement: Medios de una tipología editables en el CMS, Requirement: Reproducción del video, Scenario: Formato de video no admitido (+14 more)

### Community 20 - "Decisions"
Cohesion: 0.09
Nodes (22): mobile-horizontal-tracks Specification, Purpose, Requirement: Comportamiento en desktop y accesibilidad, Requirement: Contador y barra de progreso sincronizados con la tarjeta activa, Requirement: Encabezado de sección visible y ordenado en móvil, Requirement: Pista horizontal con swipe nativo en móvil, Requirement: Tarjeta completa en pantalla y alturas uniformes, Requirements (+14 more)

### Community 21 - "Decisions"
Cohesion: 0.08
Nodes (24): Purpose, putnam-institutional-page Specification, Requirement: Accesibilidad y mejora progresiva, Requirement: Dirección de arte clara, verde y con carácter, Requirement: Movimiento editorial y smooth scroll, Requirement: Narrativa institucional completa y editable, Requirement: Responsive sin pérdida de información, Requirement: Ruta institucional y continuidad de marca (+16 more)

### Community 22 - "Requirement: Contenido inicial de la home"
Cohesion: 0.09
Nodes (21): ADDED Requirements, Purpose, Requirement: Accesibilidad y mejora progresiva, Requirement: Dirección de arte clara, verde y con carácter, Requirement: Movimiento editorial y smooth scroll, Requirement: Narrativa institucional completa y editable, Requirement: Responsive sin pérdida de información, Requirement: Ruta institucional y continuidad de marca (+13 more)

### Community 23 - "menu.ts"
Cohesion: 0.22
Nodes (12): applyTheme(), header, logos, menuToggle, mobileViewport, observeTheme(), setMenuOpen(), showLogo() (+4 more)

### Community 24 - "Requirement: Movimiento premium y controlado"
Cohesion: 0.09
Nodes (21): crawl-surface Specification, Purpose, Requirement: Cabeceras y redirecciones del hosting, Requirement: Iconos y manifiesto, Requirement: llms.txt para motores generativos, Requirement: Página 404 bilingüe, Requirement: robots.txt, Requirement: Sitemap XML con alternativas de idioma (+13 more)

### Community 25 - "motion.ts"
Cohesion: 0.10
Nodes (32): root, gallery, root, mountHorizontalTrack(), pad(), TrackOptions, lineHost(), mountAnchors() (+24 more)

### Community 26 - "proposal.md"
Cohesion: 0.22
Nodes (14): ../assets/eredita-logo.png, ../styles/eredita.css, ../components/CmsImg.astro, position, src, altOf(), CARD_WIDTHS, imageSrc() (+6 more)

### Community 27 - "proposal.md"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Purpose, Requirement: Comportamiento en desktop y accesibilidad, Requirement: Contador y barra de progreso sincronizados con la tarjeta activa, Requirement: Encabezado de sección visible y ordenado en móvil, Requirement: Pista horizontal con swipe nativo en móvil, Requirement: Tarjeta completa en pantalla y alturas uniformes, Scenario: Alturas (+12 more)

### Community 28 - "proposal.md"
Cohesion: 0.10
Nodes (20): ADDED Requirements, Purpose, Requirement: Cabeceras y redirecciones del hosting, Requirement: Iconos y manifiesto, Requirement: llms.txt para motores generativos, Requirement: Página 404 bilingüe, Requirement: robots.txt, Requirement: Sitemap XML con alternativas de idioma (+12 more)

### Community 29 - "proposal.md"
Cohesion: 0.11
Nodes (18): dual-scene-sweep Specification, Purpose, Requirement: Accesibilidad y fallback, Requirement: Aceptación visual de estados intermedios, Requirement: Composición continua de dos escenas, Requirement: Copy recortado por el mismo borde, Requirement: Estados terminales deterministas, Requirements (+10 more)

### Community 30 - "proposal.md"
Cohesion: 0.11
Nodes (18): Purpose, Requirement: Contenido editorial servido desde el CMS en build, Requirement: Localización de campos y de documentos, Requirement: Migración inicial de contenido, Requirement: Regeneración del sitio al publicar, Requirement: Solo contenido publicado, Requirement: Studio accesible al administrador, Requirements (+10 more)

### Community 31 - "MODIFIED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Purpose, Requirement: Animación y scroll, Requirement: Contenido inicial de la home, Requirement: Experiencia responsive y movimiento reducido, Requirement: Hero de Putnam, Requirement: Home visualmente fiel a la referencia, Requirement: Verificación contra la referencia (+9 more)

### Community 32 - "proposal.md"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Purpose, Requirement: Accesibilidad y fallback, Requirement: Aceptación visual de estados intermedios, Requirement: Composición continua de dos escenas, Requirement: Copy recortado por el mismo borde, Requirement: Estados terminales deterministas, Scenario: Alineación del borde (+9 more)

### Community 33 - "tasks.md"
Cohesion: 0.11
Nodes (17): home-slide-sweep Specification, Purpose, Requirement: Barrido vertical de imagen sobre el copy, Requirement: Contenido accesible durante la transición, Requirement: Estado inicial determinista, Requirement: Texto central persistente, Requirement: Verificación del recorrido completo, Requirements (+9 more)

### Community 34 - "proposal.md"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Purpose, Requirement: Contenido editorial servido desde el CMS en build, Requirement: Localización de campos y de documentos, Requirement: Migración inicial de contenido, Requirement: Regeneración del sitio al publicar, Requirement: Solo contenido publicado, Requirement: Studio accesible al administrador (+9 more)

### Community 35 - "proposal.md"
Cohesion: 0.17
Nodes (11): documentoLegal, LegalDoc, nota, contacto, eredita, home, noticias, putnam (+3 more)

### Community 36 - "tasks.md"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Purpose, Requirement: Legibilidad sobre imágenes, Requirement: Movimiento premium y controlado, Requirement: Responsive y movimiento reducido, Requirement: Stage de slides con título persistente, Requirement: Tipografía editorial de la referencia, Scenario: Avance desde el hero (+8 more)

### Community 37 - "Requirement: Acceso a la página institucional de Putnam"
Cohesion: 0.12
Nodes (16): MODIFIED Requirements, Requirement: Comportamiento en desktop y accesibilidad, Requirement: Encabezado de sección visible y ordenado en móvil, Requirement: Pista horizontal con swipe nativo en móvil, Requirement: Tarjeta completa en pantalla y alturas uniformes, Scenario: Alturas, Scenario: Composición de Nuestra cultura en móvil, Scenario: Composición de Tipologías en móvil (+8 more)

### Community 38 - "Inspo.md"
Cohesion: 0.12
Nodes (16): dist, node_modules, **/*.ts, **/*.tsx, compilerOptions, allowImportingTsExtensions, esModuleInterop, jsx (+8 more)

### Community 39 - "tasks.md"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Purpose, Requirement: Barrido vertical de imagen sobre el copy, Requirement: Contenido accesible durante la transición, Requirement: Estado inicial determinista, Requirement: Texto central persistente, Requirement: Verificación del recorrido completo, Scenario: Aceptación visual y funcional (+7 more)

### Community 40 - "tasks.md"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Purpose, Requirement: Auto-ocultado del riel, Requirement: Barra de scroll nativa oculta con fallback, Requirement: Contraste y capas del riel, Requirement: Punto que refleja el progreso de scroll, Scenario: Extremos del documento, Scenario: Móvil sin riel (+7 more)

### Community 41 - "design.md"
Cohesion: 0.12
Nodes (15): Context, D1. Bifurcación por breakpoint con importación dinámica del motor desktop, D2. Barrido de la home en CSS con una animación por panel sobre el `view-timeline` de su marcador, D3. Fallback de la home sin `animation-timeline`: escenas apiladas con snap vertical, D4. Reveals y entradas móviles con clases + transiciones CSS activadas por `IntersectionObserver`, D5. Rail de Proceso ligado al scroll en CSS, con el rAF actual sólo como fallback, D6. Tema del header y scroll cue por `IntersectionObserver` (todas las rutas, todos los breakpoints), D7. Saturación horneada en la URL y retirada de `filter`/`backdrop-filter` (+7 more)

### Community 42 - "tasks.md"
Cohesion: 0.12
Nodes (15): Context, D1. `proyecto` como colección; `eredita` sigue siendo singleton de línea, D2. Rutas `/eredita/[slug]/` y `/en/eredita/[slug]/` con el mismo slug en ambos idiomas, D3. Enumeración de rutas de proyecto en sitemap, llms.txt y tests desde una única función, D4. Documentos legales: referencia opcional, filtro en la query, D5. Modelo de medios de tipología: `video` + `poster` + `images[]`, sin `image`, D6. Galería renderizada en build, conmutada con `hidden`, sin plantillas en cliente, D7. Tira superpuesta al área de medios con altura fija (+7 more)

### Community 43 - "design.md"
Cohesion: 0.12
Nodes (15): mobile-page-motion Specification, Purpose, Requirement: Animación de entrada del hero en móvil en todas las páginas interiores, Requirement: Degradación con movimiento reducido y sin JavaScript, Requirement: Reveals por scroll en móvil, Requirements, Scenario: Entrada sin librería, Scenario: Grupos de Putnam en móvil (+7 more)

### Community 44 - "tasks.md"
Cohesion: 0.15
Nodes (10): decode(), exists(), fail(), failures, htmlFiles, indexable, length(), locs (+2 more)

### Community 45 - "tasks.md"
Cohesion: 0.13
Nodes (14): brand-marks Specification, Purpose, Requirement: Encuadre de la marca de Ereditá en el hero, Requirement: Marca de agua legible y contenida en las secciones CTA, Requirement: Marcas con fallback y sin dependencia de un único derivado, Requirement: Nitidez del isotipo del header en pantallas de alta densidad, Requirements, Scenario: CTA en móvil (+6 more)

### Community 46 - "tasks.md"
Cohesion: 0.13
Nodes (14): Purpose, Requirement: Contenido editorial con fallback al español, Requirement: Rutas por idioma, Requirement: Selector de idioma en el header, Requirement: Strings de interfaz fuera de las plantillas, Requirements, Scenario: Cambio de idioma con par, Scenario: Cambio de idioma sin par (+6 more)

### Community 47 - "README.md"
Cohesion: 0.18
Nodes (10): Comandos, Cuando el dominio apunte a Vercel, Dominio, SEO y motores generativos, Estructura, Modelo de contenido, Primera puesta en marcha, Publicación automática, Putnam Desarrollos Inmobiliarios (+2 more)

### Community 48 - "contacto-motion.ts"
Cohesion: 0.14
Nodes (13): Context, Controlador de motion aislado, CSS portado y scoped por página, Datos compartidos y asset local, Decisions, Goals / Non-Goals, Interacciones compartidas, Markup accesible antes de motion (+5 more)

### Community 50 - "eredita-motion.ts"
Cohesion: 0.14
Nodes (13): Context, D1. Logos: SVG cuando sea posible; si no, `<picture>` PNG + WebP con densidad 3×, D2. Fondo base = crema; `theme-color` por página, D3. Home: medir el viaje desde el stage, no desde `innerHeight`, D4. Putnam móvil: reveals con GSAP + ScrollTrigger, sin Lenis, D5. Pistas horizontales: un helper `horizontal-track.ts` con `scroll-snap` nativo, D6. Auditoría: `tests/mobile-audit.mjs` + `npm run test:mobile`, D7. Pipeline de imágenes estático y verificable en Cloudflare (+5 more)

### Community 51 - "noticias-motion.ts"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Purpose, Requirement: Encuadre de la marca de Ereditá en el hero, Requirement: Marca de agua legible y contenida en las secciones CTA, Requirement: Marcas con fallback y sin dependencia de un único derivado, Requirement: Nitidez del isotipo del header en pantallas de alta densidad, Scenario: CTA en móvil, Scenario: Derivado optimizado ausente (+5 more)

### Community 52 - "putnam-motion.ts"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Purpose, Requirement: Contenido editorial con fallback al español, Requirement: Rutas por idioma, Requirement: Selector de idioma en el header, Requirement: Strings de interfaz fuera de las plantillas, Scenario: Cambio de idioma con par, Scenario: Cambio de idioma sin par (+5 more)

### Community 53 - "SKILL.md"
Cohesion: 0.15
Nodes (12): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+4 more)

### Community 54 - "SKILL.md"
Cohesion: 0.15
Nodes (12): MODIFIED Requirements, Requirement: Experiencia responsive y movimiento reducido, Requirement: Navegación y contacto legibles, Scenario: Apertura del menú mobile, Scenario: Bloqueo de interacción subyacente, Scenario: Cambio a desktop, Scenario: Cierre del menú mobile, Scenario: Contacto desde el menú (+4 more)

### Community 55 - "SKILL.md"
Cohesion: 0.14
Nodes (13): Purpose, Requirement: Datos de redes sociales reutilizados sin nuevos campos de CMS, Requirement: Isotipo del header con presencia visual suficiente, Requirement: Pie de página compartido delgado con redes y crédito, Requirements, Scenario: Crédito de autoría visible, Scenario: Grosor reducido sin overflow, Scenario: Header en desktop (+5 more)

### Community 56 - "SKILL.md"
Cohesion: 0.15
Nodes (12): Purpose, Requirement: Color base del documento dentro de la paleta, Requirement: Controles táctiles sin resaltado del navegador, Requirement: Señal de tema para el chrome del navegador, Requirements, Scenario: Chrome Android, Scenario: Imágenes aún no cargadas, Scenario: Menú abierto (+4 more)

### Community 57 - "SKILL.md"
Cohesion: 0.15
Nodes (12): Purpose, Requirement: Entrada por renglón en todos los títulos, Requirement: Las máscaras no recortan glifos, Requirement: Sin desborde de títulos en anchos móviles, Requirements, Scenario: Glifos completos, Scenario: h2 al entrar en viewport, Scenario: Hero de cualquier página (+4 more)

### Community 61 - "unete-motion.ts"
Cohesion: 0.15
Nodes (11): captionedImage, imageFields, kickerTitle, labelValue, localeImage, localeString, localeText, localeTitle (+3 more)

### Community 62 - "ADDED Requirements"
Cohesion: 0.17
Nodes (10): contact, homePanels, apply, culture, hero, openings, process, profile (+2 more)

### Community 63 - "Requirement: Experiencia responsive y movimiento reducido"
Cohesion: 0.17
Nodes (11): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, Planning a Change, The Stance, What You Don't Have To Do (+3 more)

### Community 64 - "proposal.md"
Cohesion: 0.17
Nodes (11): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, Planning a Change, The Stance, What You Don't Have To Do (+3 more)

### Community 65 - "proposal.md"
Cohesion: 0.17
Nodes (11): 1. Stage con media y copy independientes, 2. Barrido de abajo hacia arriba con `clip-path`, 3. Un progreso maestro para escena y copy, 4. Reset explícito del primer estado, 5. Fallback sin stage mejorado, Context, Decisions, Goals / Non-Goals (+3 more)

### Community 66 - "design.md"
Cohesion: 0.17
Nodes (11): 1. Astro como estructura multipágina mínima, 2. Fixtures locales con forma futura de Sanity, 3. Benchmark visual guiado por Playwright, 4. Lenis y GSAP con una sola integración de scroll, 5. Fallback responsive y movimiento reducido, Context, Decisions, Goals / Non-Goals (+3 more)

### Community 67 - "design.md"
Cohesion: 0.17
Nodes (11): 1. Un stage persistente con escenas controladas por scroll, 2. GSAP/ScrollTrigger como única fuente de sincronía, 3. Contraste por capas, no por mezcla de modos, 4. Tipografía autorizada con fallback explícito, 5. Fallback de accesibilidad antes de optimización, Context, Decisions, Goals / Non-Goals (+3 more)

### Community 68 - "Mobile 60fps validation notes"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Animación de entrada del hero en móvil en todas las páginas interiores, Requirement: Degradación con movimiento reducido y sin JavaScript, Requirement: Reveals por scroll en móvil, Scenario: Grupos de Putnam en móvil, Scenario: Hero de Putnam en móvil, Scenario: Movimiento reducido en Putnam (+3 more)

### Community 69 - "tasks.md"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Color base del documento dentro de la paleta, Requirement: Controles táctiles sin resaltado del navegador, Requirement: Señal de tema para el chrome del navegador, Scenario: Chrome Android, Scenario: Imágenes aún no cargadas, Scenario: Menú abierto (+3 more)

### Community 70 - "tasks.md"
Cohesion: 0.17
Nodes (11): Contenido local estructurado, Context, Decisions, Dirección de arte: “la línea que sostiene”, Goals / Non-Goals, Migration Plan, Motion progresivo y aislado por página, Navegación y accesibilidad (+3 more)

### Community 71 - "putnam-performance.mjs"
Cohesion: 0.15
Nodes (12): ADDED Requirements, Purpose, Requirement: Datos de redes sociales reutilizados sin nuevos campos de CMS, Requirement: Isotipo del header con presencia visual suficiente, Requirement: Pie de página compartido delgado con redes y crédito, Scenario: Crédito de autoría visible, Scenario: Grosor reducido sin overflow, Scenario: Header en desktop (+4 more)

### Community 72 - "Requirements"
Cohesion: 0.17
Nodes (11): cms-images Specification, Purpose, Requirement: Imágenes de contenido desde el CMS, Requirement: Punto focal y recorte editables, Requirement: Texto alternativo localizado, Requirement: Variantes responsivas y tratamiento tonal preservados, Requirements, Scenario: Alt en inglés (+3 more)

### Community 73 - "Requirements"
Cohesion: 0.17
Nodes (11): legal-docs Specification, Purpose, Requirement: Descarga servida desde el CDN del CMS, Requirement: Documento legal con archivo opcional, Requirement: Versionado explícito, Requirements, Scenario: Acceso al archivo, Scenario: Documento con archivo (+3 more)

### Community 74 - "Requirements"
Cohesion: 0.17
Nodes (11): noticias-cms Specification, Purpose, Requirement: Listado generado desde el CMS, Requirement: Nota editable con cuerpo, Requirement: Página de detalle por nota, Requirements, Scenario: Detalle en español con traducción, Scenario: Nota completa (+3 more)

### Community 75 - "Decisions"
Cohesion: 0.18
Nodes (10): 1. Una capa completa por escena, 2. Dos máscaras complementarias y ningún crossfade, 3. El progreso maestro solo selecciona el par y sus máscaras, 4. Ligero solapamiento técnico en el borde, 5. Un solo árbol editorial, Context, Decisions, Goals / Non-Goals (+2 more)

### Community 76 - "Requirement: Reveals por scroll en móvil"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: Animación de entrada del hero en móvil en todas las páginas interiores, Requirement: Reveals por scroll en móvil, Scenario: Entrada sin librería, Scenario: Grupos de Putnam en móvil, Scenario: Hero de Putnam en móvil, Scenario: Paridad entre páginas, Scenario: Rail de Proceso ligado al scroll (+2 more)

### Community 77 - "Requirement: Experiencia responsive y movimiento reducido"
Cohesion: 0.18
Nodes (10): MODIFIED Requirements, Requirement: Experiencia responsive y movimiento reducido, Requirement: Navegación y contacto legibles, Scenario: Cambio de orientación o tamaño, Scenario: Contacto legible, Scenario: Interacción de tarjeta en touch, Scenario: Movimiento reducido, Scenario: Navbar legible (+2 more)

### Community 78 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Purpose, Requirement: Entrada por renglón en todos los títulos, Requirement: Las máscaras no recortan glifos, Requirement: Sin desborde de títulos en anchos móviles, Scenario: Glifos completos, Scenario: h2 al entrar en viewport, Scenario: Hero de cualquier página (+2 more)

### Community 79 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Purpose, Requirement: Imágenes de contenido desde el CMS, Requirement: Punto focal y recorte editables, Requirement: Texto alternativo localizado, Requirement: Variantes responsivas y tratamiento tonal preservados, Scenario: Alt en inglés, Scenario: Guard de mocks (+2 more)

### Community 80 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Purpose, Requirement: Descarga servida desde el CDN del CMS, Requirement: Documento legal con archivo opcional, Requirement: Versionado explícito, Scenario: Acceso al archivo, Scenario: Documento con archivo, Scenario: Documento sin archivo (+2 more)

### Community 81 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Purpose, Requirement: Listado generado desde el CMS, Requirement: Nota editable con cuerpo, Requirement: Página de detalle por nota, Scenario: Detalle en español con traducción, Scenario: Nota completa, Scenario: Orden y destacada (+2 more)

### Community 82 - "Decisions"
Cohesion: 0.15
Nodes (12): Purpose, Requirement: Alineación de título y tarjetas en "Qué valoramos", Requirement: CTA final equilibrado, Requirement: Estado sin vacantes compacto, Requirement: Imagen en la sección de cultura, Requirements, Scenario: Alineación desktop, Scenario: Balance del CTA final en desktop (+4 more)

### Community 83 - "MODIFIED Requirements"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Alineación de título y tarjetas en "Qué valoramos", Requirement: CTA final equilibrado, Requirement: Estado sin vacantes compacto, Requirement: Imagen en la sección de cultura, Scenario: Alineación desktop, Scenario: Balance del CTA final en desktop (+3 more)

### Community 84 - "ADDED Requirements"
Cohesion: 0.18
Nodes (10): 1. Tipologías (Ereditá) y Proceso (Putnam) migran al track horizontal nativo, no a una nueva librería, 2. Cultura de Únete: solo se le agrega imagen, no se toca su mecánica, 3. Redes sociales del footer: se derivan de `organization.sameAs`, no de un campo nuevo, 4. Crédito de autoría: texto simple, sin icono nuevo hasta que se provea uno, 5. Formulario: barrido de texto en verde vía CSS, sin JS, Context, Decisions, Goals / Non-Goals (+2 more)

### Community 85 - "check-dist.mjs"
Cohesion: 0.18
Nodes (5): href(), alternatesOf(), failures, htmlFiles, pageAlternates

### Community 86 - "Requirement: Contenido inicial de la home"
Cohesion: 0.20
Nodes (9): ADDED Requirements, MODIFIED Requirements, Requirement: Contenido inicial de la home, Requirement: Navegación y contacto legibles, Scenario: Contacto legible, Scenario: Contenido disponible, Scenario: Copy breve, Scenario: Navbar legible (+1 more)

### Community 87 - "tasks.md"
Cohesion: 0.20
Nodes (9): 0. Pipeline de imágenes en Cloudflare (`static-image-pipeline`), 1. Base de auditoría, 2. Fondo base y theme-color (`site-shell-theme`), 3. Home: franja entre paneles (`home-ui-motion-readability`), 4. Logos (`brand-marks`), 5. Putnam móvil: hero y reveals (`mobile-page-motion`), 6. Pistas horizontales móviles (`mobile-horizontal-tracks`), 7. Cierre (+1 more)

### Community 88 - "Requirement: Responsive y movimiento reducido"
Cohesion: 0.20
Nodes (9): MODIFIED Requirements, Requirement: Responsive y movimiento reducido, Scenario: Barra de direcciones retraída durante la transición, Scenario: Barrido mobile sincronizado con el scroll nativo, Scenario: Cambio de altura del viewport a mitad de transición, Scenario: Movimiento reducido, Scenario: Navegador mobile sin animaciones ligadas al scroll, Scenario: Stage cubre el viewport en ambos estados de la barra (+1 more)

### Community 89 - "seed.ts"
Cohesion: 0.24
Nodes (9): client, buildDocs(), isoDate(), key(), loc(), run(), seedData, uploaded (+1 more)

### Community 90 - "tasks.md"
Cohesion: 0.22
Nodes (8): 1. Identidad canónica y `<head>`, 2. Datos de organización y JSON-LD, 3. Portadas OG e iconos, 4. Copy orientado a búsqueda, 5. Superficie de rastreo, 6. Guardas y documentación, 7. Publicación (requiere dominio y cuentas), Notas de implementación (2026-09-14)

### Community 91 - "Requirement: Imágenes locales resueltas en build-time"
Cohesion: 0.22
Nodes (8): Purpose, Requirement: Imágenes locales resueltas en build-time, Requirement: Paridad entre build local y build de producción, Requirements, Scenario: Build de producción en Cloudflare, Scenario: Comparación de artefactos, Scenario: Guard del build, static-image-pipeline Specification

### Community 92 - "index.ts"
Cohesion: 0.18
Nodes (14): en, Dictionary, es, dictionaries, reference, t(), Lang, notaPath() (+6 more)

### Community 93 - "sanity.config.ts"
Cohesion: 0.28
Nodes (5): projectId, schemaTypes, singletons, singletonTypes, structure()

### Community 94 - "Requirement: Movimiento premium y controlado"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: Movimiento premium y controlado, Scenario: Hover y navegación, Scenario: Movimiento reducido, Scenario: Recorrido normal en desktop, Scenario: Señal de avance, Scenario: Señal de regreso

### Community 95 - "Requirement: Responsive y movimiento reducido"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: Responsive y movimiento reducido, Scenario: Barra de direcciones retraída durante la transición, Scenario: Cambio de altura del viewport a mitad de transición, Scenario: Movimiento reducido, Scenario: Stage cubre el viewport en ambos estados de la barra, Scenario: Viewport mobile

### Community 96 - "ADDED Requirements"
Cohesion: 0.25
Nodes (7): ADDED Requirements, Purpose, Requirement: Imágenes locales resueltas en build-time, Requirement: Paridad entre build local y build de producción, Scenario: Build de producción en Cloudflare, Scenario: Comparación de artefactos, Scenario: Guard del build

### Community 97 - "trace-mark.mjs"
Cohesion: 0.25
Nodes (4): d, edges, loops, paths

### Community 98 - "seed-local.ts"
Cohesion: 0.25
Nodes (5): SeedDoc, assets, docs, out, stamp

### Community 99 - "seed.en.ts"
Cohesion: 0.25
Nodes (7): contacto, eredita, home, noticias, putnam, settings, unete

### Community 100 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 101 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 102 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 103 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 104 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 105 - "MODIFIED Requirements"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: Texto central persistente, Requirement: Verificación del recorrido completo, Scenario: Aceptación visual y funcional, Scenario: Copy durante el scroll, Scenario: Título enlazable

### Community 106 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 107 - "tasks.md"
Cohesion: 0.29
Nodes (6): 1. Datos, assets y navegación compartida, 2. Página Astro y contenido aprobado, 3. Fidelidad CSS y responsive, 4. Lenis y GSAP/ScrollTrigger, 5. Verificación de aceptación, 6. Navegación e interacciones compartidas

### Community 108 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 109 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 110 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 111 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 112 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 113 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 114 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 115 - "tasks.md"
Cohesion: 0.29
Nodes (6): 1. Modelo de contenido en el Studio, 2. Seed, dataset local y migración, 3. Consultas, rutas y diccionario, 4. Vistas, 5. Tests y verificación integral, 6. Despliegue y migración en producción

### Community 116 - "design.md"
Cohesion: 0.29
Nodes (6): Context, Decisions, Goals / Non-Goals, Migration Plan, Open Questions, Risks / Trade-offs

### Community 117 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 118 - "Requirement: Entrada por renglón en todos los títulos"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: Entrada por renglón en todos los títulos, Scenario: h2 al entrar en viewport, Scenario: Hero de cualquier página, Scenario: Salto editorial desde el CMS, Scenario: Sin JavaScript o con movimiento reducido

### Community 119 - "design.md"
Cohesion: 0.29
Nodes (6): Context, Decisions, Goals / Non-Goals, Migration Plan, Open Questions, Risks / Trade-offs

### Community 120 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 121 - "proposal.md"
Cohesion: 0.18
Nodes (10): ADDED Requirements, MODIFIED Requirements, Requirement: Barrido de texto en verde al interactuar con los campos, Requirement: Fidelidad visual y valores CSS aprobados, Requirement: Responsive derivado del mockup mobile, Scenario: Correo visible en el listado de canales, Scenario: Fidelidad desktop, Scenario: Fidelidad mobile (+2 more)

### Community 122 - "Requirement: Movimiento editorial y smooth scroll"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: Contador y barra de progreso visibles en todos los anchos, Requirement: Masonry de galería consistente en móvil, Requirement: Prioridad visual a imagen y video en cada tipología, Requirement: Tipologías sin secuestro de scroll en desktop, Scenario: Avance por gesto horizontal en desktop, Scenario: Entrada y salida de la sección, Scenario: Galería en móvil (+2 more)

### Community 123 - "tasks.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 124 - "og.mjs"
Cohesion: 0.38
Nodes (6): dictionaries, escape(), lines(), mark, PAGES, render()

### Community 125 - "proyecto.ts"
Cohesion: 0.29
Nodes (6): erediteHeroFields, erediteIntroFields, kicker, title, proyecto, Typology

### Community 126 - "migrate-proyectos.ts"
Cohesion: 0.33
Nodes (5): Eredita, Localized, Plan, toProjectTypology(), Typology

### Community 127 - "contacto.ts"
Cohesion: 0.29
Nodes (6): contactoChannels, contactoCta, contactoForm, contactoHero, contactoLocation, contactoReasons

### Community 128 - "tasks.md"
Cohesion: 0.33
Nodes (5): 1. Benchmark y tipografía, 2. Estructura visual del stage, 3. Scroll y transiciones, 4. Legibilidad y responsive, 5. Aceptación

### Community 129 - "Requirement: Acceso a la página institucional de Putnam"
Cohesion: 0.33
Nodes (5): ADDED Requirements, Requirement: Acceso a la página institucional de Putnam, Scenario: Escena Putnam preservada, Scenario: Navegación desde desktop, Scenario: Navegación desde el menú mobile

### Community 130 - "tasks.md"
Cohesion: 0.33
Nodes (5): 1. Prueba de rendimiento y baseline rojo, 2. Cambios compartidos: header, scroll cue, imágenes, menú, 3. Módulo móvil compartido y páginas interiores, 4. Home móvil en el compositor, 5. Validación en dispositivo y cierre

### Community 131 - "design.md"
Cohesion: 0.33
Nodes (5): Context, Decisions, Goals / Non-Goals, Migration Plan, Risks / Trade-offs

### Community 132 - "Requirement: Animación de entrada del hero en móvil en todas las páginas interiores"
Cohesion: 0.33
Nodes (5): MODIFIED Requirements, Requirement: Animación de entrada del hero en móvil en todas las páginas interiores, Scenario: Entrada sin librería, Scenario: Hero de Putnam en móvil, Scenario: Paridad entre páginas

### Community 133 - "tasks.md"
Cohesion: 0.33
Nodes (5): 1. i18n con datos locales, 2. Sanity Studio y modelo de contenido, 3. Sitio leyendo Sanity, 4. Publicación automática y cierre, Pendiente con el proyecto real (requiere cuenta Sanity)

### Community 134 - "sanity.ts"
Cohesion: 0.40
Nodes (4): env(), Fetch, localFile, remoteFetch()

### Community 135 - "tasks.md"
Cohesion: 0.40
Nodes (4): 1. Estructura del stage, 2. Barrido visual, 3. Estado y scroll, 4. Responsive y aceptación

### Community 136 - "tasks.md"
Cohesion: 0.40
Nodes (4): 1. Referencia y base, 2. Dirección visual de la home, 3. Movimiento e interacción, 4. Verificación del MVP

### Community 137 - "design.md"
Cohesion: 0.40
Nodes (4): Context, Decisions, Goals / Non-Goals, Risks / Trade-offs

### Community 138 - "tasks.md"
Cohesion: 0.40
Nodes (4): 1. Contenido y estructura compartida, 2. Página y dirección de arte, 3. Motion y responsive, 4. Entrega

### Community 139 - "design.md"
Cohesion: 0.40
Nodes (4): Context, Decisions, Goals / Non-Goals, Risks / Trade-offs

### Community 140 - "design.md"
Cohesion: 0.40
Nodes (4): Context, Decisions, Goals / Non-Goals, Risks / Trade-offs

### Community 141 - "Requirement: Reveals de texto y grupos"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: Reveals de texto y grupos, Scenario: Renglones reales a cada ancho, Scenario: Reveal reversible

### Community 142 - "Requirement: Rutas reales en la navegación compartida"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: Rutas reales en la navegación compartida, Scenario: Navegación cruzada, Scenario: Navegación en inglés

### Community 143 - "Requirement: Contenido inicial de la home"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: Contenido inicial de la home, Scenario: Contenido disponible, Scenario: Home en inglés

### Community 144 - "Requirement: Imágenes locales resueltas en build-time"
Cohesion: 0.40
Nodes (4): MODIFIED Requirements, Requirement: Imágenes locales resueltas en build-time, Scenario: Build de producción en Cloudflare, Scenario: Guard del build

### Community 146 - "tasks.md"
Cohesion: 0.50
Nodes (3): 1. Estructura de escenas, 2. Composición y movimiento, 3. Aceptación

### Community 147 - "tasks.md"
Cohesion: 0.50
Nodes (3): 1. Contenido y navegación, 2. Control direccional de scroll, 3. Verificación

### Community 148 - "tasks.md"
Cohesion: 0.50
Nodes (3): 1. Diagnóstico y alcance, 2. Responsive y accesibilidad, 3. Rendimiento y verificación

### Community 149 - "tasks.md"
Cohesion: 0.50
Nodes (3): 1. Estructura y estilos mobile, 2. Comportamiento accesible, 3. Verificación

### Community 150 - "tasks.md"
Cohesion: 0.50
Nodes (3): 1. Helper y estilos compartidos, 2. Páginas, 3. Verificación

### Community 166 - "Requirement: Movimiento editorial y smooth scroll"
Cohesion: 0.29
Nodes (6): MODIFIED Requirements, Requirement: Movimiento editorial y smooth scroll, Scenario: Navegación por anclas o regreso, Scenario: Proceso en una sola pantalla, Scenario: Recorrido con movimiento habilitado, Scenario: Sin scroll vertical adicional retenido

### Community 167 - "tasks.md"
Cohesion: 0.29
Nodes (6): 1. Header y footer compartidos (`site-shell-chrome`), 2. Ereditá — galería y tipologías (`eredita-project-lines`), 3. Putnam — sección de proceso (`putnam-institutional-page`), 4. Únete — cultura, alineación, vacíos y CTA (`unete-careers-page`), 5. Contacto — canales móviles, formulario y footer (`contacto-page`), 6. Cierre

### Community 168 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 169 - "design.md"
Cohesion: 0.33
Nodes (5): Context, Decisions, Goals / Non-Goals, Migration Plan, Risks / Trade-offs

### Community 170 - "tasks.md"
Cohesion: 0.50
Nodes (3): 1. Marcado y estilos, 2. Auto-ocultado en desktop, 3. Verificación integrada

### Community 172 - "sitemap.xml.ts"
Cohesion: 0.24
Nodes (8): ../lib/seo, ../styles/noticias.css, ../components/BodyImage.astro, formatDate(), getNotas(), truncate(), getStaticPaths(), getStaticPaths()

### Community 173 - "Requirement: Pista horizontal con swipe nativo en móvil"
Cohesion: 0.08
Nodes (23): MODIFIED Requirements, Requirement: Contador y barra de progreso sincronizados con la tarjeta activa, Requirement: Encabezado de sección visible y ordenado en móvil, Requirement: Pista horizontal con swipe nativo en móvil, Requirement: Tarjeta completa en pantalla y alturas uniformes, Scenario: Alturas, Scenario: Composición de Nuestra cultura en móvil, Scenario: Composición de Proceso en móvil (+15 more)

### Community 174 - "Requirement: Pie de página compartido delgado con redes y crédito"
Cohesion: 0.15
Nodes (12): ADDED Requirements, MODIFIED Requirements, Requirement: Menú móvil con contacto, redes y crédito, Requirement: Pie de página compartido delgado con redes y crédito, Scenario: Crédito de autoría visible, Scenario: Grosor reducido sin overflow, Scenario: Home en móvil sin pie fijo, Scenario: Menú abierto en el home (+4 more)

### Community 175 - "Requirement: Reveals por scroll en móvil"
Cohesion: 0.17
Nodes (11): ADDED Requirements, MODIFIED Requirements, Requirement: Reveals por scroll en móvil, Requirement: Título de CTA cerca del inicio de la sección en móvil, Scenario: CTA de Contacto, Scenario: Grupos de Putnam en móvil, Scenario: Paridad entre CTAs, Scenario: Párrafo suelto marcado para revelarse (+3 more)

### Community 176 - "proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 177 - "design.md"
Cohesion: 0.33
Nodes (5): Context, Decisions, Goals / Non-Goals, Migration Plan, Risks / Trade-offs

### Community 178 - "tasks.md"
Cohesion: 0.33
Nodes (5): 1. Reveals y espaciado (causa raíz de los huecos), 2. Footer y menú móvil, 3. Tipologías en pista horizontal (Ereditá), 4. Proceso Putnam en pista horizontal, 5. Verificación integrada

### Community 179 - "Requirement: Renglones de hero sin solaparse en móvil"
Cohesion: 0.40
Nodes (4): ADDED Requirements, Requirement: Renglones de hero sin solaparse en móvil, Scenario: Hero de Noticias en inglés, Scenario: Interlineado mínimo

### Community 180 - "SocialLinks.astro"
Cohesion: 0.40
Nodes (4): ICON_PATHS, socials, ui, socialLinks()

## Knowledge Gaps
- **1260 isolated node(s):** `name`, `version`, `description`, `dev`, `build` (+1255 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `ADDED Requirements` to `package.json`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **Why does `../components/SiteHead.astro` connect `ADDED Requirements` to `eredita.astro`, `ADDED Requirements`, `sitemap.xml.ts`, `check-dist.mjs`, `proposal.md`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _1260 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ADDED Requirements` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._
- **Should `Requirements` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._
- **Should `eredita.astro` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._