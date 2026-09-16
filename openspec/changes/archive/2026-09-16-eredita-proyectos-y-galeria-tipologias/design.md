## Context

Ver `proposal.md` (Why). Estado actual que condiciona el diseño:

- `eredita` es un singleton en Sanity (`studio/schemaTypes/pages.ts`) con `hero`, `intro`, `gallery`, `typologies`, `legal`, `cta`; `src/views/eredita.astro` lo pinta y `getEredita` (`src/lib/content.ts`) lo consulta con GROQ localizado en build. Producción ya tiene contenido editado en el Studio (`diputnam.sanity.studio`, dataset `production`), así que el seed no es fuente de verdad del contenido.
- Cada tipología tiene una única `image` (`localeImage`) que se pinta con `CmsImg` (`srcset` de `CARD_WIDTHS`, `sat={SAT.card}`).
- La sección Tipologías tiene dos motores: en ≥ 900 px un track pinado que GSAP traslada un panel por gesto de rueda (`src/scripts/desktop/eredita.ts`, con `lenis.stop()` mientras se recorre) y en < 900 px una pista nativa con `scroll-snap` (`src/scripts/horizontal-track.ts`, compartida con Únete y Contacto). El spec `mobile-horizontal-tracks` exige alturas uniformes y ausencia de desbordamiento horizontal.
- Las rutas estáticas salen de `pages` en `src/i18n/routes.ts`; las notas son la única ruta dinámica (`src/pages/noticias/[slug].astro` con `getStaticPaths`). `SiteHead` ya admite `alternate`, `title`, `description`, `image` y `breadcrumbTitle`, y `jsonLd` construye el breadcrumb Inicio › sección › título.
- `sitemap.xml.ts` y `llms.txt.ts` enumeran `pages` + notas. Los tests (`seo-audit`, `i18n-sweep`, `mobile-audit`, `mobile-perf`, `contacto-sweep`) enumeran rutas desde `routes.ts` o listas literales; `mobile-perf` impone 10 KB gzip de JS de primera parte por ruta.
- El build offline usa `studio/.local/dataset.json` (generado por `seed-local.ts` a partir de `seed-docs.ts`) evaluado con `groq-js`; las referencias (`->`) funcionan en ese evaluador.
- El hero de Ereditá ya admite un mp4 subido a Sanity (`video.asset->url`), así que el patrón de video como `file` existe.

## Goals / Non-Goals

**Goals:**
- Que añadir un proyecto sea sólo crear un documento en el Studio: rutas, sitemap, hreflang, llms.txt y portada se derivan del CMS.
- Que la galería de medios no cambie el modelo de interacción de Tipologías (pin + un panel por gesto en desktop, swipe en móvil) ni su rendimiento móvil.
- Que la migración de producción sea idempotente y no pierda ediciones del administrador.

**Non-Goals:**
- Líneas adicionales a Ereditá como pestañas propias del header (p. ej. una segunda marca). El header sigue fijo; una nueva línea sería otro cambio.
- Lightbox/pantalla completa para los renders: la "vista en detalle" es el medio principal del panel, como en el boceto del cliente.
- Embeds de YouTube/Vimeo, subtítulos o audio: los videos son mp4 silenciosos de ambientación.
- Reordenar o rediseñar las secciones de la página de proyecto: conserva el layout actual de Ereditá.

## Decisions

### D1. `proyecto` como colección; `eredita` sigue siendo singleton de línea
Nuevo tipo de documento `proyecto` (título en Studio "Proyecto Ereditá") con `name` (string), `slug` (único, `a-z0-9-`, validado con `isUnique`), `order` (número), `status` (`localeString`), `card` (`image: localeImage`, `text: localeText`) y las secciones `hero`, `intro`, `gallery`, `typologies`, `legal`, `cta` **movidas** tal cual desde el singleton (mismos sub-schemas, así `getProyecto` reutiliza las proyecciones GROQ existentes). El singleton `eredita` queda con `hero`, `intro`, nueva sección `projects` (kicker, título, texto) y `cta`.

- Alternativa descartada: un array `projects[]` dentro del singleton. Un documento por proyecto da historial, borradores, previsualización y slugs validados por documento, y evita un singleton gigante.
- Alternativa descartada: tipo genérico `linea` + `proyecto.linea` referencia. Sólo hay una línea y no está pedida otra; añadirla después es añadir el campo referencia y un `[linea]` en la ruta, no rehacer el modelo.
- `structure.ts`: tras el ítem "Ereditá (línea)" se inserta `S.documentTypeListItem('proyecto').title('Proyectos Ereditá')` ordenado por `order`. `proyecto` no entra en `singletonTypes`.

### D2. Rutas `/eredita/[slug]/` y `/en/eredita/[slug]/` con el mismo slug en ambos idiomas
El proyecto se localiza a nivel de campo (como el resto del contenido fijo), así que un único documento sirve ambas rutas y el par `hreflang` es determinista: `projectPath(lang, slug)` en `routes.ts` (junto a `notaPath`). `src/pages/eredita/[slug].astro` y `src/pages/en/eredita/[slug].astro` hacen `getStaticPaths` con `getProyectos(lang)` y montan `src/views/proyecto.astro`; `src/views/eredita.astro` pasa a ser la portada.

- El `PageKey` sigue siendo `eredita` para header, `aria-current`, `pageTypeOf` y `og` por defecto; la página de proyecto pasa a `SiteHead` `page="eredita"`, `alternate={{ es: projectPath('es', slug), en: projectPath('en', slug) }}`, `title`/`description` propios, `image={ogUrl(hero.poster)}` (1200×630 con hotspot, como las notas) y `breadcrumbTitle={name}` para el tercer nivel del `BreadcrumbList`.
- `<title>`: `${name} · Ereditá | Putnam` recortado a 60; `description`: `truncate(intro.lead, 155)`. No se añaden claves `meta.*` por proyecto al diccionario (el contenido viene del CMS).
- 404 de slug inexistente: no hay nada que hacer; el host sirve `404.html` para rutas no generadas.

### D3. Enumeración de rutas de proyecto en sitemap, llms.txt y tests desde una única función
`getProyectos(lang)` devuelve `{ name, slug, order, status, card, updatedAt }`. `sitemap.xml.ts` añade una entrada por proyecto e idioma con `lastmod = _updatedAt` del proyecto; `llms.txt.ts` añade, bajo la línea de Ereditá de cada idioma, `  - [name](url): card.text`. `check-dist.mjs`/`seo-audit` ya comparan sitemap contra `dist/`, así que la coherencia se verifica sin código nuevo.

Los tests de Playwright corren contra `dist/` servido por `astro preview`; en vez de consultar Sanity desde los tests, un helper `tests/routes.mjs` exporta `routes` = `siteRoutes` + las carpetas `dist/eredita/*/` y `dist/en/eredita/*/` encontradas en disco (misma verdad que el sitemap). `i18n-sweep` valida el par de cada ruta de proyecto (`/eredita/<slug>/` ↔ `/en/eredita/<slug>/`); `mobile-audit` y `mobile-perf` usan el primer proyecto encontrado para las comprobaciones de la pista (`trackChecks` y `tracks`); `contacto-sweep` no cambia (la navegación no cambia).

### D4. Documentos legales: referencia opcional, filtro en la query
`documentoLegal.proyecto` (`reference` a `proyecto`, opcional, descripción "Vacío = se muestra en todos los proyectos"). `getLegalDocs(lang, projectId)` filtra `!defined(proyecto) || proyecto._ref == $projectId`. La migración no toca los documentos existentes (siguen siendo comunes). Alternativa descartada: array de documentos dentro del proyecto — rompería el versionado y la validación por documento que ya existen.

### D5. Modelo de medios de tipología: `video` + `poster` + `images[]`, sin `image`
En el objeto de tipología: `video` (`file`, `accept: video/mp4`, descripción con la recomendación H.264 ≤ 5 MB ≤ 1280 px), `poster` (`localeImage`, obligatorio cuando hay video), `images` (array de `localeImage` con campo extra `caption: localeString`, `layout: grid` en el Studio). Validación a nivel de objeto: `video` o al menos una imagen. `image` desaparece.

- Alternativa descartada: array polimórfico `media[]` de `{image | video}`. La UI del Studio sería más confusa para "un video por defecto y luego renders", y el orden "video primero" es una regla del sitio, no del editor.
- La proyección GROQ entrega `media: [{ kind: 'video', src, poster, alt }, { kind: 'image', image, caption }...]` ya ordenados, para que la vista no razone.
- `card`/portada usa `images[0]` (o `poster`) como imagen de la tipología cuando haga falta una sola (p. ej. previsualización en Studio: `media: 'images.0'`).

### D6. Galería renderizada en build, conmutada con `hidden`, sin plantillas en cliente
`src/views/proyecto.astro` pinta dentro de `.ed-h-media`:
- Un contenedor de medios con **todos** los medios pre-renderizados: el video como `<video muted loop playsinline preload="none" poster=…>` y cada imagen con `CmsImg` (mismos `base`/`widths`/`quality`/`sat` que hoy). Sólo el medio por defecto va sin `hidden`; el resto lleva `hidden` y `loading="lazy"`, y como un `<img>` con `display:none` no se descarga hasta mostrarse, la carga diferida sale gratis.
- Una tira `role="tablist"` con un `button role="tab"` por medio (miniatura Sanity `w=160/240/320` con `sizes` de ~4.5 rem, `aria-selected`, `aria-controls`), y dos botones prev/next ocultos hasta que `scrollWidth > clientWidth`. Se omite la tira cuando hay un solo medio.
- `src/scripts/typology-media.ts` (objetivo ≤ 2 KB gzip): (a) click/teclado en tabs → conmutar `hidden` + `aria-selected`, `scrollIntoView({ inline: 'nearest' })` del tab activo; flechas izquierda/derecha mueven el foco dentro de la tira y detienen la propagación para no llegar al `keydown` de la pista; (b) un `IntersectionObserver` (threshold 0.6) sobre `[data-h-panel]` que reproduce el video del panel visible si es el medio seleccionado y pausa el resto — funciona igual con el track trasladado por GSAP en desktop y con el scroll nativo en móvil, así que no se acopla a ninguno de los dos motores; (c) con `prefers-reduced-motion` no hay autoplay: se muestra el póster con un botón "Reproducir" que llama a `play()`.
- Se monta desde `eredita-motion.ts` (que también usa la portada; sus consultas son no-op si no hay track), antes y con independencia de `splitTitles`/GSAP, igual que la pista móvil, para que funcione con movimiento reducido.

### D7. Tira superpuesta al área de medios con altura fija
La tira va posicionada en la base de `.ed-h-media` (degradado inferior, altura fija ≈ 4.5 rem, `overflow-x: auto`, `scroll-snap-type: x proximity`, `overscroll-behavior-x: contain`, `touch-action: pan-x`). Así el número de miniaturas no cambia la altura de la tarjeta ni la coordenada del bloque de texto (`mobile-horizontal-tracks`), y el swipe sobre la tira desplaza la tira sin propagarse a la pista; fuera de la tira la pista sigue respondiendo. En desktop la rueda sobre la tira sigue capturada por el `wheel` de `window` (un panel por gesto), como exige el spec.

### D8. Migración leyendo producción, no el seed
`studio/scripts/migrate-proyectos.ts` (`sanity exec --with-user-token`):
1. Lee `*[_id == "eredita"][0]` publicado.
2. Si no existe `proyecto-eredita-art`, lo crea con `name: "EREDITÁ Art"`, `slug: eredita-art`, `order: 1`, `card.image = hero.poster`, `card.text = intro.lead`, y copia `hero`, `intro`, `gallery`, `typologies` (cada `image` → `images[0]` con `_key`, sin `image`), `legal`, `cta`. Si existe, no lo toca (idempotente; las ediciones posteriores del administrador mandan).
3. En la misma transacción, `unset` de `gallery`, `typologies`, `legal` en el singleton y `setIfMissing` de `projects: { kicker, title, text }` con textos por defecto.
`seed-docs.ts` produce el mismo par (singleton recortado + `proyecto-eredita-art`); `seed-local.ts` fabrica además un asset de video (`sanity.fileAsset`, `.mp4`) para una tipología, de modo que el dataset local ejercita el camino con video (los assets locales ya son URLs ficticias que no se descargan durante los tests, y con `preload="none"` el video tampoco se solicita hasta que el panel está activo).

### D9. Diccionario de interfaz
Nuevas claves en `es.ts`/`en.ts` (`index.ts` ya aborta el build si `en` no las espeja): `eredita.viewProject` ("Ver proyecto"), `eredita.backToLine` ("Volver a Ereditá"), `eredita.media.video` ("Video"), `eredita.media.play` ("Reproducir"), `eredita.media.prev`/`next`, `eredita.media.aria` ("Medios de la tipología"), `eredita.projectTitle(name)` para el `<title>`.

## Risks / Trade-offs

- [Ancho de banda del CDN de Sanity con videos en autoplay] → `preload="none"`, reproducción sólo del panel visible, recomendación de peso en el Studio; si el consumo se acerca al límite del plan, el campo `video` puede pasar a aceptar una URL externa sin cambiar la vista (la proyección ya entrega `src`).
- [Presupuesto de 10 KB gzip de JS móvil] → el script de galería se escribe sin dependencias y se mide en `test:perf`; si se supera, se recorta la lógica de prev/next (sólo CSS `overflow`) antes que la de reproducción.
- [Scroll anidado en la pista móvil (tira dentro de la tarjeta)] → `overscroll-behavior-x: contain` y `touch-action: pan-x` en la tira; verificar en iOS Safari, que ignora `overscroll-behavior` parcialmente: si encadena, alternativa de respaldo es limitar la tira en móvil a botones prev/next sin scroll táctil.
- [Paneles con vídeo y reduced motion en desktop pinado] → el botón "Reproducir" es un elemento normal del panel; el `wheel` capturado no afecta al click.
- [Ventana entre desplegar el Studio con el nuevo schema y ejecutar la migración] → el singleton conserva sus campos hasta el `unset`; el Studio sólo los muestra como "campos desconocidos". El sitio no se despliega hasta que la migración termina (ver plan).
- [Rollback] → el contenido movido sigue en el historial del documento `eredita` en Sanity (restaurable desde el Studio) y `proyecto-eredita-art` puede borrarse; el código se revierte con `git revert`.
- [Ereditá con un solo proyecto durante meses] → la portada se diseña para verse completa con una tarjeta (hero + intro + una tarjeta ancha + cierre), no como una rejilla vacía.

## Migration Plan

1. Merge del código (schema, sitio, seed, tests) sin push a `main` todavía; `npm run studio:build` y `node studio/scripts/seed-local.ts` + build offline + suites en verde.
2. `npm run studio:deploy` (schema nuevo en `diputnam.sanity.studio`).
3. `cd studio && npx sanity exec scripts/migrate-proyectos.ts --with-user-token` contra `production`; verificar en el Studio "Proyectos Ereditá → EREDITÁ Art" y que "Ereditá (línea)" no tiene campos desconocidos.
4. Push a `main` → Vercel construye; comprobar `/eredita/`, `/eredita/eredita-art/`, `/en/eredita/eredita-art/`, `sitemap.xml`, `llms.txt`.
5. Rollback: revertir el commit del sitio y restaurar el documento `eredita` desde el historial de Sanity; el documento `proyecto` puede quedarse (nadie lo lee).

## Open Questions

- Textos definitivos de la portada de la línea (kicker/título/texto de "Proyectos" y el `status` de EREDITÁ Art): la migración pone valores por defecto razonables y el cliente los edita en el Studio; no afecta al código.
- Si el cliente quiere que la tarjeta de proyecto muestre datos (entrega, tipologías) además del texto breve: se añadirían como `labelValue[]` en `card` sin tocar rutas ni galería.
