## Why

El sitio ya es bilingüe, estático y lee de Sanity, pero hoy es prácticamente invisible para buscadores y motores generativos: `site` apunta a `http://localhost:4321`, no hay `canonical`, `robots.txt`, `sitemap.xml`, imagen Open Graph, datos estructurados ni página 404 (`wrangler.jsonc` la espera y no existe), el favicon es un PNG de 96 px y los `<title>` no nombran el mercado (La Paz, Bolivia) ni el producto (departamentos). Con el dominio `diputnam.com` a punto de contratarse, esta es la base que hay que tener lista **antes** del primer rastreo, para que Google, Bing y los asistentes (ChatGPT, Perplexity, Claude, Gemini) indexen la versión correcta desde el día uno y no una copia en `workers.dev`.

## What Changes

- **Identidad canónica**: `site: 'https://diputnam.com'` en Astro; `<link rel="canonical">` absoluto en cada página; `og:url` y `hreflang` pasan a URLs absolutas; redirección `www` → apex y `/ruta` → `/ruta/` documentadas para Cloudflare.
- **Metadatos sociales por página e idioma**: Open Graph (`og:type`, `og:title`, `og:description`, `og:image` 1200×630 con `width`/`height`/`alt`, `og:locale` + `og:locale:alternate`, `og:site_name`) y Twitter Card `summary_large_image`. Portada `og-cover.png` de marca generada desde una plantilla HTML con Playwright (ya es dependencia), una variante por página estática e idioma; las notas usan su imagen destacada recortada por el CDN de Sanity o la portada por defecto.
- **Datos estructurados JSON-LD**: `Organization` (con `PostalAddress`, `GeoCoordinates`, `ContactPoint`, `sameAs`, logo) y `WebSite` en todas las páginas; `WebPage`/`AboutPage`/`ContactPage`/`CollectionPage` según ruta; `BreadcrumbList` en interiores; `NewsArticle` en cada nota con `datePublished`, `dateModified`, `inLanguage`, `image` y `publisher`.
- **Superficie de rastreo**: `robots.txt` (permite rastreadores de buscadores y de IA, bloquea nada del sitio público, declara `Sitemap:`), `sitemap.xml` generado en build con `xhtml:link hreflang` por URL y `lastmod` desde Sanity, `llms.txt` bilingüe con la descripción de Putnam y enlaces a las páginas clave, `404.html` con `noindex` en ambos idiomas, `_headers` con caché inmutable para `/_astro/` y cabeceras de seguridad básicas.
- **Iconografía**: favicon SVG + PNG 32, `apple-touch-icon` 180, iconos 192/512 y `site.webmanifest` con nombre, colores de la paleta y `lang`, generados con `sharp` desde el mark de Putnam.
- **Copy orientado a búsqueda (sin cambiar la voz)**: `<title>` de 50–60 caracteres con marca + mercado (`Putnam · Desarrollos inmobiliarios en La Paz, Bolivia`), `meta description` de 120–155 caracteres con intención de búsqueda y ubicación, títulos de nota con override opcional (`seoTitle`) para que no superen 60 caracteres. Los H1 visibles se conservan.
- **Contenido editable de SEO en Sanity**: `siteSettings` gana `legalName`, `foundingYear`, `sameAs[]` (redes) y `description` localizada para `Organization`; `nota` gana un objeto `seo` opcional (`title`, `description`, `image`). Los `<title>`/`description` de páginas estáticas siguen en `src/i18n` como exige `site-i18n`.
- **Guardas de build**: `check-dist.mjs` verifica en cada HTML canonical absoluto igual a su ruta, un único `<h1>`, longitud de title/description, `og:image` absoluto y existente, JSON-LD parseable con `@type`, y que `sitemap.xml` y `dist/` listan exactamente las mismas rutas indexables. Nuevo `test:seo` con Playwright valida el render de `og-cover` y los metadatos en las doce rutas.
- **Fuera del código (tareas del usuario)**: verificar el dominio en Google Search Console y Bing Webmaster Tools, enviar el sitemap, crear/reclamar el Perfil de Negocio de Google de la oficina de San Miguel y enlazarlo en `sameAs`.

Sin cambios **BREAKING**: ninguna ruta cambia. Las doce URLs, el DOM visible y los tests actuales se conservan; solo crece el `<head>` y aparecen archivos nuevos en la raíz de `dist/`.

## Capabilities

### New Capabilities
- `seo-metadata`: qué declara el `<head>` de cada página (canonical, title/description con reglas de longitud y mercado, Open Graph/Twitter, `og-cover`, JSON-LD por tipo de página, directivas `robots`) y de dónde sale cada dato (diccionario, Sanity, ruta).
- `crawl-surface`: los archivos que el sitio expone a rastreadores y asistentes en la raíz (`robots.txt`, `sitemap.xml`, `llms.txt`, `404.html`, `site.webmanifest`, iconos, `_headers`) y la guarda de build que los mantiene coherentes con las rutas publicadas.

### Modified Capabilities
- (ninguna) — `site-i18n`, `sanity-content` y `noticias-cms` viven aún en la change `sanity-cms-i18n`; este cambio los respeta (títulos estáticos en `src/i18n`, contenido editorial en Sanity) y no altera sus requisitos.

## Impact

- `astro.config.mjs` (`site`, `trailingSlash: 'always'`), `src/components/SiteHead.astro` (crece: canonical, OG, JSON-LD), nuevo `src/lib/seo.ts` (URL absoluta, builders de JSON-LD, selección de `og:image`), `src/i18n/{es,en}.ts` (títulos/descripciones revisados + strings de 404), `src/lib/content.ts` (campos `seo`/`organization`, `_updatedAt`), vistas (`Props` de `SiteHead` con `type` de página y breadcrumb; `nota.astro` pasa `NewsArticle`), `src/pages/404.astro` + `src/pages/en/404` (una sola `404.html` bilingüe, ver diseño), `src/pages/sitemap.xml.ts`, `src/pages/llms.txt.ts`.
- `public/`: `robots.txt`, `_headers`, `site.webmanifest`, `favicon.svg`, `icons/`, `og/` (generados y versionados).
- `studio/schemaTypes/{siteSettings,nota}.ts`, `studio/scripts/seed*.ts` (nuevos campos con valores iniciales).
- `scripts/og.mjs` (plantilla + Playwright), `scripts/icons.mjs` (sharp), `tests/check-dist.mjs` (nuevas guardas), nuevo `tests/seo-sweep.mjs`, `package.json` (`test:seo`, `assets:og`, `assets:icons`).
- `README.md` (dominio, DNS/redirects en Cloudflare, Search Console, regenerar OG/iconos). Sin dependencias nuevas de runtime; `sharp` ya llega con Astro y `playwright` ya está instalado.
- Depende de que `sanity-cms-i18n` siga siendo la base (mismo `content.ts` y rutas); no requiere que sus tareas pendientes (cuenta Sanity) estén cerradas para implementarse con el dataset local.
