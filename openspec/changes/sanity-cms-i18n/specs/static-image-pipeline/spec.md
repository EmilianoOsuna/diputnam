## MODIFIED Requirements

### Requirement: Imágenes locales resueltas en build-time

Todo `<img>`, `<source>` o `srcset` generado a partir de un asset local (`src/assets/*`) SHALL apuntar a un archivo existente bajo `/_astro/` (o a un recurso de `public/`). Las imágenes de contenido SHALL apuntar al CDN del CMS (`cdn.sanity.io`) con las variantes generadas por parámetros de URL. El HTML producido por el build de producción no SHALL contener referencias a `/_image?` ni a los hosts de imágenes mock (`images.unsplash.com`, `images.ctfassets.net`).

#### Scenario: Build de producción en Cloudflare
- **WHEN** el host construye el sitio desde el repositorio y lo publica
- **THEN** cada URL de imagen local de las doce páginas responde `200` con `Content-Type` de imagen y cada URL de contenido apunta a `cdn.sanity.io`

#### Scenario: Guard del build
- **WHEN** el build genera un HTML con `/_image?` o con un host de imágenes mock en cualquier atributo `src`/`srcset`
- **THEN** el build termina con error y el deploy no se publica
