## Why

El cliente revisó `/eredita/` y pidió dos cosas que el modelo de contenido actual no permite sin tocar código: (1) que cada tipología (Monoambiente, 1 dormitorio, 2 dormitorios, Áreas comunes) muestre más de una imagen —un video por defecto y renders/fotos seleccionables para ver el detalle, p. ej. el parrillero de la terraza— y (2) que Ereditá pase a ser una **línea de edificios** con subproyectos: la pestaña Ereditá abre la línea, dentro está EREDITÁ Art y el administrador puede añadir "EREDITÁ 2, 3…" desde el Studio. Hoy `eredita` es un singleton con una sola imagen por tipología y sin noción de proyecto.

## What Changes

- **Ereditá como línea con página por proyecto**. `/eredita/` (y `/en/eredita/`) pasa a ser la portada de la línea: hero con la marca, concepto de la línea y la lista de proyectos publicados. Cada proyecto es un documento `proyecto` en Sanity con su slug y se publica en `/eredita/<slug>/` y `/en/eredita/<slug>/` con el layout actual de Ereditá (intro con datos, galería, tipologías, documentación para compradores, cierre). El contenido actual del singleton se migra al primer proyecto, `eredita-art`. **BREAKING** para el schema `eredita`: `gallery`, `typologies` y `legal` salen del singleton y viven en `proyecto`; el Studio muestra "Ereditá (línea)" y la colección "Proyectos Ereditá".
- **Galería de medios por tipología**. Cada tipología reemplaza `image` por un video opcional (mp4 subido a Sanity, con póster) y una lista de imágenes (renders/fotos con pie). En el panel se muestra por defecto el video (autoplay silencioso, en bucle, sólo mientras el panel está visible) o la primera imagen si no hay video, y una tira de miniaturas permite seleccionar cada medio. Funciona en el track pinado de desktop y en la pista swipe de móvil, con teclado, `prefers-reduced-motion` y sin descargar videos de paneles no visibles.
- **Documentos legales por proyecto**. `documentoLegal` gana una referencia opcional a `proyecto`: un documento sin referencia se muestra en todos los proyectos (comportamiento actual); con referencia, sólo en ese proyecto.
- **Superficie de rastreo y navegación**. Las páginas de proyecto entran en `sitemap.xml`, `llms.txt`, `hreflang`, breadcrumbs JSON-LD, Open Graph (imagen del hero del proyecto) y el selector de idioma; la pestaña Ereditá del header, la escena del home y la 404 siguen apuntando a `/eredita/`. Las suites de tests que enumeran rutas (`seo-audit`, `i18n-sweep`, `mobile-audit`, `mobile-perf`) incorporan las rutas de proyecto desde el mismo origen que el build.
- **Migración sin pérdida**. Script reproducible que lee el `eredita` publicado en producción, crea `proyecto` `eredita-art` con su galería/tipologías/legal (cada `image` de tipología pasa a `images[0]`), y recorta el singleton; `seed-docs.ts` y el dataset local se actualizan al nuevo modelo para que `astro build` offline y los tests sigan funcionando.

## Capabilities

### New Capabilities

- `eredita-project-lines`: Ereditá como línea con portada y colección de proyectos editables en el CMS; rutas `/eredita/<slug>/` por idioma, lista de proyectos en la portada, metadatos SEO/hreflang/sitemap/llms.txt de las páginas de proyecto, documentos legales por proyecto y migración del contenido existente al proyecto EREDITÁ Art.
- `typology-media-gallery`: galería de medios por tipología (video por defecto + renders/fotos seleccionables) editable en el Studio, con reglas de reproducción, carga diferida, accesibilidad y comportamiento en desktop pinado y en la pista móvil.

### Modified Capabilities

- `mobile-horizontal-tracks`: la pista de Tipologías vive ahora en las páginas de proyecto (`/eredita/<slug>/`), no en `/eredita/`; cada tarjeta incorpora la tira de miniaturas, que no debe romper el swipe de la pista, las alturas uniformes ni la prohibición de desbordamiento horizontal.

Nota: los requisitos "Rutas por idioma" (`site-i18n`), "Sitemap XML con alternativas de idioma" y "llms.txt" (`crawl-surface`) de los cambios `sanity-cms-i18n` y `seo-geo-foundation` (aún no archivados) enumeran "las doce rutas estáticas". Este cambio las extiende con las rutas de proyecto; el detalle se especifica en `eredita-project-lines` y al sincronizar specs debe leerse "las doce rutas estáticas más una ruta por proyecto e idioma".

## Impact

- **Studio** (`studio/schemaTypes/pages.ts`, `objects.ts`, `documentoLegal.ts`, `index.ts`, `structure.ts`): nuevo tipo `proyecto`, singleton `eredita` recortado, objeto de medio de tipología, referencia opcional en `documentoLegal`, colección "Proyectos Ereditá" en la estructura.
- **Sitio**: `src/i18n/routes.ts` (`projectPath`), `src/i18n/{es,en}.ts` (labels de la portada y de la galería), `src/lib/content.ts` (`getEredita` recortado, `getProyectos`, `getProyecto`, `getLegalDocs(lang, projectId)`), `src/views/eredita.astro` (portada de línea), nueva `src/views/proyecto.astro`, nuevas rutas `src/pages/eredita/[slug].astro` y `src/pages/en/eredita/[slug].astro`, `src/pages/sitemap.xml.ts`, `src/pages/llms.txt.ts`, `src/lib/seo.ts` (breadcrumb del proyecto), `src/styles/eredita.css`, nuevo `src/scripts/typology-media.ts` y ajustes en `eredita-motion.ts`.
- **Seed y migración**: `studio/scripts/seed-docs.ts`, `seed-data/eredita.ts`, nuevo `studio/scripts/migrate-proyectos.ts`; regenerar `studio/.local/dataset.json`.
- **Tests**: `tests/seo-audit.mjs`, `i18n-sweep.mjs`, `mobile-audit.mjs`, `mobile-perf.mjs`, `contacto-sweep.mjs` (lista de rutas y selector de la pista), presupuesto JS móvil (10 KB gzip) con el nuevo script de galería.
- **Operación**: los videos se sirven desde el CDN de Sanity (plan free: ~10 GB/mes de ancho de banda). Cada video debe subirse comprimido (H.264, ≤ 5 MB, ≤ 1280 px) y sólo se reproduce el del panel visible; si el consumo se dispara, mover los mp4 a otro origen es un cambio de campo (URL) sin tocar el frontend.
- **Sin dependencias nuevas.**
