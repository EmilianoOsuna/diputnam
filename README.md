# Putnam Desarrollos Inmobiliarios

Sitio estático (Astro 7) en español e inglés cuyo contenido, imágenes y documentos se editan en Sanity.

## Estructura

| Carpeta | Qué contiene |
|---|---|
| `src/views/` | Una plantilla por página; reciben `lang` y leen el contenido del CMS con `src/lib/content.ts`. |
| `src/pages/` | Rutas: español sin prefijo, inglés bajo `/en/` con slugs traducidos (`src/i18n/routes.ts`). |
| `src/i18n/` | Textos de interfaz (`es.ts`, `en.ts`); ambos deben tener las mismas claves o el build falla. |
| `src/lib/` | `sanity.ts` (cliente), `content.ts` (consultas GROQ), `images.ts` (variantes del CDN de imágenes). |
| `studio/` | Sanity Studio: schemas, estructura y seed. Instalación aparte (`npm --prefix studio install`). |
| `tests/` | Comprobaciones Playwright y guard del build (`check-dist`). |

## Variables de entorno

Copia `.env.example` a `.env`:

```
SANITY_PROJECT_ID=<id del proyecto>
SANITY_DATASET=production
```

Sin ellas el build falla nombrando la variable ausente. Para trabajar sin proyecto (o en CI sin acceso) existe un dataset local:

```
node studio/scripts/seed-local.ts          # genera studio/.local/dataset.json
SANITY_LOCAL_DATASET=studio/.local/dataset.json npm run build
```

`SANITY_LOCAL_DATASET` tiene prioridad sobre el proyecto remoto: quítala de `.env` para construir contra Sanity.

## Comandos

```
npm run dev / build / preview
npm run test:i18n      # rutas, hreflang y selector de idioma
npm run test:sweep     # home
npm run test:mobile    # auditoría móvil de todas las rutas (incluye una nota)
npm run test:perf      # presupuesto de frames en móvil
npm run studio:dev     # Studio en local (studio/.env con SANITY_STUDIO_PROJECT_ID)
npm run studio:deploy  # publica el Studio en <nombre>.sanity.studio
npm run studio:seed    # carga el contenido inicial (una sola vez, requiere sanity login)
```

Los tests corren contra `astro preview` (o `BASE_URL`).

## Sanity

### Primera puesta en marcha

1. `cd studio && npx sanity login && npx sanity init --bare` — crea el proyecto y el dataset `production`; anota el `projectId`.
2. `studio/.env`: `SANITY_STUDIO_PROJECT_ID=<id>`, `SANITY_STUDIO_DATASET=production`. Raíz `.env`: `SANITY_PROJECT_ID=<id>`, `SANITY_DATASET=production`.
3. Revisa el inglés propuesto en `studio/scripts/seed.en.ts` y ejecuta `npm run studio:seed`. Sube las imágenes mock como assets y crea todo el contenido con ids fijos; volver a ejecutarlo reemplaza esos documentos y respeta los creados después en el Studio.
4. `npm run studio:deploy` e invita al administrador desde [sanity.io/manage](https://www.sanity.io/manage).

### Modelo de contenido

- **Secciones del sitio** (un documento fijo cada una): Inicio, Ereditá, La firma, Únete, Contacto, Noticias (portada) y Datos de contacto. Cada texto tiene español (obligatorio) e inglés (opcional; el sitio cae al español si falta). En los títulos, cada Intro es un salto de renglón.
- **Notas**: un documento por idioma, enlazados con el botón de traducciones del Studio. Una nota solo en español no aparece en `/en/news/`.
- **Documentos legales** (Ereditá): título, descripción, orden y PDF opcional. Sin archivo la tarjeta muestra "Próximamente"; con archivo son obligatorias la versión y la fecha de vigencia, y reemplazar el PDF sin cambiar la versión bloquea la publicación. Las versiones anteriores quedan en el historial del documento.
- **Imágenes**: todas con punto focal (hotspot) y recorte editables; el sitio genera las variantes por ancho y el tratamiento tonal desde el CDN de Sanity.

### Publicación automática

Solo se publica contenido con **Publish**. Cada publicación dispara un webhook que reconstruye el sitio:

- **Cloudflare (host actual)**: el webhook llama a GitHub (`repository_dispatch`) y `.github/workflows/deploy.yml` construye y ejecuta `wrangler deploy`. Secretos del repositorio: `SANITY_PROJECT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`; variable opcional `SANITY_DATASET`.
  - Webhook en [sanity.io/manage](https://www.sanity.io/manage) → API → Webhooks: URL `https://api.github.com/repos/EmilianoOsuna/diputnam/dispatches`, método `POST`, cabeceras `Accept: application/vnd.github+json` y `Authorization: Bearer <token de GitHub con permiso contents:write>`, cuerpo `{"event_type":"sanity-publish"}`, filtro GROQ `_type in ["home","eredita","putnam","unete","contacto","noticias","siteSettings","nota","documentoLegal","translation.metadata"]`, disparar en create/update/delete.
- **Vercel (destino)**: importa el repo, define `SANITY_PROJECT_ID` y `SANITY_DATASET`, crea un *Deploy Hook* y pon su URL en el webhook de Sanity (método `POST`, sin cabeceras). Después retira `.github/workflows/deploy.yml` y `wrangler.jsonc`.

## Migrar a Vercel

1. Importar el repositorio en Vercel (framework Astro, salida `dist/`).
2. Variables: `SANITY_PROJECT_ID`, `SANITY_DATASET`.
3. Crear un Deploy Hook (Settings → Git) y sustituir la URL del webhook de Sanity.
4. Borrar `.github/workflows/deploy.yml` y `wrangler.jsonc`.

Ningún código del sitio conoce el host.
