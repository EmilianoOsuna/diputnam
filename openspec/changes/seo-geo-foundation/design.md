## Context

Sitio estático Astro 7 (`output: static`, imágenes optimizadas en build, sin adaptador), publicado como *static assets* de Cloudflare Workers (`wrangler.jsonc`: `assets.directory: ./dist`, `not_found_handling: "404-page"`). Doce rutas estáticas en `src/i18n/routes.ts` más notas dinámicas por idioma; todo el contenido sale de Sanity vía `src/lib/content.ts` (o del dataset local `SANITY_LOCAL_DATASET`). `SiteHead.astro` centraliza el `<head>` y ya resuelve `hreflang` por página. `tests/check-dist.mjs` corre en `postbuild` y es el sitio natural para guardas de HTML. `playwright` es dependencia y `sharp` llega con Astro. Ver `proposal.md` para el porqué; los requisitos están en `specs/seo-metadata` y `specs/crawl-surface`.

Restricciones heredadas: `site-i18n` exige que `<title>`/`description` de páginas estáticas vivan en `src/i18n`; `home-ui` exige que las escenas de la home muestren solo un título (no se añade texto a la home); Cloudflare sirve un único `404.html`.

## Goals / Non-Goals

**Goals:**
- Un solo punto (`SiteHead` + `src/lib/seo.ts`) donde se derivan canonical, OG, JSON-LD y directivas a partir de `lang`, `page`, la ruta y los datos del CMS, para que una vista nueva quede cubierta con dos props.
- Archivos de raíz (`sitemap.xml`, `llms.txt`) generados desde las mismas fuentes que las páginas (rutas + `getNotas`), nunca mantenidos a mano.
- Que ningún metadato pueda quedar roto sin que el build falle.
- Cero dependencias nuevas de runtime.

**Non-Goals:**
- Texto oculto o contenido "para buscadores" en la home; la home se queda como la define `home-ui`.
- Blog/FAQ nuevos, tracking/analytics, consent banners: cambios aparte.
- Server-side rendering, edge functions o `X-Robots-Tag` por host: el canonical absoluto ya cubre el caso de vista previa.
- Verificación de dominio, Search Console, Perfil de Negocio: acciones del usuario, listadas en `tasks.md` pero fuera del código.

## Decisions

**D1 — `site` fijo a `https://diputnam.com` y `trailingSlash: 'always'`.** Todas las URLs absolutas se construyen con `new URL(path, Astro.site)` en `src/lib/seo.ts` (`absolute(path)`). No se parametriza por entorno: una vista previa en `workers.dev` debe canonicalizar a producción, no a sí misma. Alternativa descartada: `SITE_URL` por env — abre la puerta a publicar canonicals de preview por error.

**D2 — `SiteHead` crece, no se duplica.** Nuevas props: `kind` (`'website' | 'article'`, por defecto `website`), `pageType` (`WebPage | AboutPage | ContactPage | CollectionPage`, por defecto según `page`), `image?` (OG override), `article?` ({ published, modified, section, breadcrumbTitle }), `noindex?`. `SiteHead` llama a `src/lib/seo.ts` para: `canonical`, lista de `<meta property=og:*>`, `twitter:*`, `robots`, y `jsonLd({ lang, page, url, pageType, article, org, site })` que devuelve el `@graph`. Un único `<script type="application/ld+json" set:html={JSON.stringify(graph)}>` por página (texto escapado de `</script>` con `<`). Alternativa descartada: componente `<Seo>` separado de `<SiteHead>` — dos sitios donde olvidarse de algo.

**D3 — Datos de organización desde Sanity, cargados una vez por página.** `siteSettings` gana `organization`: `legalName`, `foundingYear`, `description` (`localeText`), `sameAs` (array de `url`), `logo` (imagen opcional; si falta se usa `/icons/icon-512.png`). `getSettings` devuelve `organization` junto al resto; las vistas ya llaman `getSettings`, así que `SiteHead` recibe `contact` (renombrado a `settings` en `Props` de `SiteHead`, las vistas siguen pasando el mismo objeto). El `@id` de la organización es `https://diputnam.com/#organization` y el de `WebSite` `https://diputnam.com/#website`, referenciados desde `publisher`, `isPartOf` y `about`. Alternativa: literales en `seo.ts` — contradice `sanity-content` y obliga a un deploy por cada cambio de red social.

**D4 — OG por página estática: PNG generados con Playwright y versionados.** `scripts/og-template.html` (fondo crema `#f4eedf` o verde `#003a36`, mark de Putnam, nombre de la página y tagline en tipografía del sitio, 1200×630) y `scripts/og.mjs` que la renderiza para cada `(page, lang)` y para la portada por defecto → `public/og/{cover,home,eredita,putnam,noticias,unete,contacto}-{es,en}.png`. Se generan localmente (`npm run assets:og`) y se commitean: CI no instala navegadores de Playwright y 14 PNG (~60 KB cada uno) son aceptables en git. `seo-audit` comprueba que cada `og:image` local existe y mide 1200×630 leyendo la cabecera PNG. Alternativa descartada: `satori`/`@vercel/og` — dependencia nueva y fuentes a mano; generar en CI — requiere `playwright install` en el workflow y alarga cada deploy por contenido.

**D5 — OG de notas desde el CDN de Sanity.** `images.ts` gana `ogUrl(image)`: `?w=1200&h=630&fit=crop&crop=focalpoint&fp-x=<hotspot.x>&fp-y=<hotspot.y>&q=80&auto=format` (más `rect` si hay crop, reutilizando la función existente). Sin imagen → `og/cover-<lang>.png`. `og:image:type` se declara `image/jpeg` para el CDN (con `auto=format` los bots reciben JPEG al no enviar `Accept: image/webp`).

**D6 — Sitemap y llms.txt como endpoints estáticos de Astro.** `src/pages/sitemap.xml.ts` y `src/pages/llms.txt.ts` exportan `GET` y se emiten como `dist/sitemap.xml` y `dist/llms.txt`. Fuentes: `routes.ts` (`pages`, `notaPath`), `getNotas('es')`/`getNotas('en')` con `translation.slug`, y `getSettings`. `lastmod`: para notas `_updatedAt` (nuevo campo en `notaFields`; con `perspective: 'published'` es la fecha de la última publicación); para páginas estáticas el `_updatedAt` del singleton correspondiente (nuevo `getUpdatedAt(id)`), no la fecha del build, para que `lastmod` sea veraz y Google no lo descarte. `x-default` en el sitemap apunta a la URL en español como en el HTML. Alternativa descartada: `@astrojs/sitemap` — no conoce slugs traducidos distintos (`/noticias/` ↔ `/en/news/`) ni `lastmod` por documento.

**D7 — `404.html` único, bilingüe y editorial.** `src/pages/404.astro` + `src/styles/not-found.css`: una sección a pantalla completa en el lenguaje de los cierres CTA del sitio (verde profundo, kicker `404 · Página no encontrada`, título con corte editorial vía `Lines`, lead, dos acciones con línea superior, mark de Putnam como marca de agua) y un índice numerado de las cinco secciones como salida. Dos bloques `<section lang="es">` / `<section lang="en" hidden>` con strings de `ui.notFound.*`; un `<script is:inline>` muestra el bloque inglés cuando `location.pathname.startsWith('/en/')`, actualiza `<html lang>` e imprime la ruta solicitada en el kicker. Entradas escalonadas solo con CSS (sin runtime de motion; respeta `prefers-reduced-motion`). Sin JS se ve el español. `noindex` y sin `hreflang`. Cloudflare la sirve con estado 404 gracias a `not_found_handling: "404-page"`.

**D8 — Iconos derivados del mark con `sharp`, una vez.** `scripts/icons.mjs` toma `src/assets/putnam-dark.png` (o el SVG si el usuario lo aporta; ver Open Questions) y escribe `public/favicon.ico` (32), `public/favicon.svg` (envoltorio SVG con el PNG embebido en base64 si no hay vector; se reemplaza por el vector real cuando exista), `public/apple-touch-icon.png` (180, fondo crema, sin transparencia), `public/icons/icon-192.png`, `public/icons/icon-512.png`, y `public/site.webmanifest`. Se sustituye el `favicon.png` de 96 px. `SiteHead` enlaza `icon` SVG + PNG 32, `apple-touch-icon` y `manifest`.

**D9 — Copy: reglas más que reescritura.** Títulos con patrón `<Página> · <qualificador de mercado/producto> | Putnam` (home: `Putnam · Desarrollos inmobiliarios en La Paz, Bolivia`), 30–60 caracteres; descripciones 110–155 con verbo + oferta + lugar. Valores propuestos para los doce pares en `tasks.md` 4.1; el usuario los aprueba en revisión. Para notas, `nota.seo` (`title`, `description`, `image`) opcional en el Studio, con fallback por truncado en límite de palabra (`truncate(text, 60, ' | Putnam')`). H1 y copy visible intactos.

**D10 — Guardas en `tests/seo-audit.mjs`, encadenado en `postbuild`.** `check-dist.mjs` conserva lo suyo (imágenes, `lang`, `hreflang` recíproco) y añade canonical absoluto = ruta. `seo-audit.mjs` valida por HTML: un `<h1>`, longitudes de `<title>`/`description`, meta `robots`, set completo de `og:*`/`twitter:*`, `og:image` absoluto (local existente y 1200×630, o host `cdn.sanity.io`), JSON-LD parseable con `Organization`, `WebSite` y el tipo de página esperado, `NewsArticle` con fechas ISO en notas, iconos y manifiesto enlazados existentes; y por sitio: `robots.txt` con `Sitemap:`, `sitemap.xml` ≡ HTML indexables de `dist/` (excluye `404.html`) con `xhtml:link` coherentes, `llms.txt` con las doce rutas y las notas, `_headers` presente. `postbuild` = `check-dist && seo-audit`; `npm run test:seo` lo ejecuta suelto.

**D11 — Hosting: `_headers` en `public/`, redirects documentados.** `_headers` con `Cache-Control` inmutable para `/_astro/*`, `/fonts/*`, `/og/*`, `/icons/*`, y cabeceras de seguridad globales (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`; sin CSP en este cambio por el iframe de Maps, GSAP inline y Sanity CDN). `www` → apex: el README instruye añadir `diputnam.com` y `www.diputnam.com` como *custom domains* del Worker y un `_redirects` con `https://www.diputnam.com/* https://diputnam.com/:splat 301`; HTTPS forzado y `auto-trailing-slash` los da Cloudflare por defecto. En Vercel (README "Migrar a Vercel") equivale a `vercel.json` `redirects`/`headers`.

## Risks / Trade-offs

- [Ereditá no está en La Paz o Putnam no quiere geolocalizar los títulos] → los strings viven en `src/i18n`; cambiar un título es un commit. Se confirma en la revisión de copy (4.1) antes de publicar.
- [`sameAs` vacío o redes inexistentes] → el JSON-LD omite `sameAs` cuando el array está vacío; el usuario aporta enlaces cuando existan.
- [PNG de OG desactualizados frente a un cambio de tagline] → `seo-audit` no puede detectar texto en un PNG; el README documenta `npm run assets:og` al cambiar la plantilla, y la plantilla lee el tagline del diccionario para que solo haya una fuente.
- [`_updatedAt` ausente en el dataset local] → `seed-local.ts` estampa `_updatedAt` con la fecha del seed; `lastmod` cae a `date` de la nota si falta.
- [Cloudflare aún no está delante de `diputnam.com` cuando se implemente] → todo el cambio se verifica en local y en `workers.dev`; los canonicals ya apuntan al dominio final, así que el corte de DNS no requiere redeploy.
- [`og:locale` `es_LA` no lo reconocen todas las plataformas] → es el código de Facebook para español latinoamericano; X/LinkedIn lo ignoran sin error. Alternativa `es_ES` se evita por señalar mercado equivocado.
- [Bloquear o permitir bots de IA es una decisión de negocio] → se permite explícitamente (objetivo GEO); revertirlo es editar `robots.txt`.

## Migration Plan

1. Implementar y verificar con el dataset local (`SANITY_LOCAL_DATASET`), `npm run build` (incluye `check-dist` + `seo-audit`), `test:mobile`, `test:sweep`, `test:i18n`.
2. Regenerar `og/` e iconos localmente y commitearlos.
3. Push a `main` → deploy en `workers.dev`; validar con el *Rich Results Test*, el *Sharing Debugger* de Meta y el *Post Inspector* de LinkedIn contra la URL de preview (los canonicals apuntarán a `diputnam.com`, esperado).
4. Cuando el dominio esté en Cloudflare: custom domains + `_redirects` para `www`, verificar en Search Console y Bing, enviar `sitemap.xml`.
5. Rollback: revertir el commit; no hay datos ni rutas nuevas. Los campos nuevos de Sanity son opcionales y quedan inertes.

## Open Questions

Resueltas con el usuario (2026-09-14):
- Logo vectorial: no existe. Se parte del PNG (D8); el usuario aportará el vector después si hace falta y se reemplaza sin tocar el HTML.
- `sameAs`: Instagram `https://www.instagram.com/putnamdesarrollosinmobiliarios`. `legalName`/NIT: pendiente del dueño; el JSON-LD lo omite mientras tanto.
- Ereditá está en La Paz, Bolivia: los títulos lo geolocalizan.
- Titulares de 4.1: aprobados sin revisión previa por el usuario.
