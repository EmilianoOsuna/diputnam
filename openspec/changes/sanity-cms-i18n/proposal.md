## Why

Todo el contenido del sitio vive en `src/data/*.ts` y en los `.astro`, y todas las imágenes son mocks remotos de Unsplash/Contentful: el administrador de Putnam no puede publicar una nota, subir una foto real de obra ni cargar los PDF que la sección "Documentación para compradores" de Ereditá promete (hoy son cuatro tarjetas "Próximamente" sin archivo). Además el sitio es solo en español y la firma necesita una versión en inglés para inversionistas. Sanity.io en free tier cubre contenido, imágenes y archivos sin cambiar la naturaleza estática del sitio; el i18n nativo de Astro cubre el idioma sin librerías.

## What Changes

- **Sitio bilingüe (es/en) con i18n nativo de Astro**: `es` como locale por defecto sin prefijo (`/eredita/`), inglés bajo `/en/` (`/en/eredita/`). Los strings de interfaz (navegación, labels, CTAs, `<title>`/`description`, textos de formulario) salen de los `.astro` a `src/i18n/{es,en}.ts`. Cada página declara `hreflang` y un selector de idioma sustituye el `ES` estático del header. **BREAKING** para los tests: las rutas auditadas pasan de seis a doce.
- **Sanity Studio como CMS**: proyecto Sanity free tier con Studio en `studio/` (mismo repo) y schemas que espejan el contenido actual. Contenido fijo localizado a nivel de campo (`{ es, en }`); noticias localizadas a nivel de documento (`@sanity/document-internationalization`) para poder publicar una nota en un solo idioma.
- **Noticias editables con página de detalle**: documento `nota` (título, extracto, cuerpo en Portable Text, fecha, categoría, tags, imagen, tiempo de lectura). `/noticias/` se genera desde Sanity y cada nota obtiene `/noticias/<slug>/` (y `/en/news/<slug>/` cuando exista traducción). Las filas del listado dejan de enlazar a WhatsApp.
- **Documentos legales para compradores editables**: documento `documentoLegal` con archivo PDF **opcional** (si falta, la tarjeta sigue mostrando "Próximamente") y **versionado explícito** (versión + fecha de vigencia visibles en la tarjeta, además del historial de Sanity). El admin sube o reemplaza el PDF desde el Studio y el sitio lo sirve desde el CDN de Sanity.
- **Todas las imágenes pasan a Sanity**: paneles del home, hero/galería/tipologías de Ereditá, imagen editorial de Putnam, heros de Contacto/Únete/Noticias y la imagen destacada de cada nota se cargan en el Studio con hotspot/crop. `src/lib/images.ts` gana una rama para `cdn.sanity.io` que conserva `srcset`, calidad, formato automático y el tratamiento tonal (`sat`). Se retiran los mocks de Unsplash/Contentful y los JPG de `src/assets/` que eran contenido (los logos siguen siendo assets locales).
- **Fetch en build, sin adapter**: `@sanity/client` consulta GROQ durante `astro build`; el sitio sigue siendo 100 % estático. Un webhook de Sanity dispara un deploy hook del host al publicar; el diseño no se acopla a Cloudflare (host provisional) ni a Vercel (host destino).
- **Saltos de línea editoriales**: los títulos que hoy llevan `\n` (home) o `<br class="cut">` se modelan en Sanity como texto plano con saltos de línea que el helper `splitLines` ya interpreta como renglón duro.

## Capabilities

### New Capabilities

- `site-i18n`: rutas `es`/`en`, strings de UI en código, selector de idioma, `hreflang`, fallback al español cuando falta traducción.
- `sanity-content`: proyecto Sanity, Studio, schemas localizados, cliente de build, contrato de datasets (`production`) y regeneración del sitio vía webhook.
- `noticias-cms`: listado y página de detalle de notas generadas desde Sanity, con localización por documento.
- `legal-docs`: documentos para compradores con PDF opcional y versionado.
- `cms-images`: imágenes de contenido servidas desde el pipeline de Sanity con hotspot/crop, `srcset` y tratamiento tonal.

### Modified Capabilities

- `static-image-pipeline`: el requisito se amplía para admitir imágenes remotas de `cdn.sanity.io` (generadas por URL, no en build) manteniendo la prohibición de `/_image?` para assets locales; el guard del build también verifica que ninguna URL de contenido apunte a Unsplash/Contentful.
- `home-ui`: "Contenido inicial de la home" pasa de "datos locales intercambiables por Sanity en una fase posterior" a contenido servido desde Sanity; navegación y contacto añaden el selector de idioma.
- `contacto-page`: "Rutas reales en la navegación compartida" incluye las rutas `/en/…`; los textos visibles del mockup se obtienen de `src/i18n` y Sanity, no del literal en `.astro`.
- `title-line-reveal`: los saltos duros de renglón provienen del contenido (saltos de línea en el texto de Sanity) y del `<br>` de i18n; la entrada por renglón debe funcionar igual en las doce rutas.

## Impact

- **Dependencias nuevas**: `@sanity/client`, `@sanity/image-url` (sitio); `sanity`, `@sanity/vision`, `@sanity/document-internationalization` (Studio, workspace propio en `studio/`).
- **Código**: `astro.config.mjs` (i18n), `src/pages/**` (rutas `[locale]` o carpeta `en/`, nueva `noticias/[slug].astro`), `src/components/*` (selector de idioma, `hreflang`), `src/i18n/*`, `src/lib/{sanity,images}.ts`, `src/data/*` (se eliminan progresivamente), `tests/*.mjs` (doce rutas, guard de mocks), `wrangler.jsonc`/config de Vercel (variables `SANITY_PROJECT_ID`, `SANITY_DATASET`).
- **Operación**: cuenta Sanity del cliente, tokens de solo lectura en el host, deploy hook, Studio desplegado en `<proyecto>.sanity.studio`. Sin Studio publicado el admin no puede editar.
- **Contenido**: migración única de `src/data/*.ts` y de las imágenes mock a Sanity (script de seed) para que el sitio no quede vacío tras el cambio. Las traducciones al inglés del contenido editorial se cargan como parte de la migración.
