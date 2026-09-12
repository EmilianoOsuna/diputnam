# static-image-pipeline Specification

## Purpose

Garantizar que el sitio estático publicado en Cloudflare sirva todas sus imágenes locales como archivos generados en build-time, sin depender de ningún endpoint de optimización en tiempo de ejecución.

## Requirements

### Requirement: Imágenes locales resueltas en build-time

Todo `<img>`, `<source>` o `srcset` generado a partir de un asset local (`src/assets/*`) SHALL apuntar a un archivo existente bajo `/_astro/` (o a un recurso de `public/`). El HTML producido por el build de producción no SHALL contener referencias a `/_image?`.

#### Scenario: Build de producción en Cloudflare
- **WHEN** Cloudflare construye el sitio desde el repositorio y lo publica
- **THEN** cada URL de imagen local de las seis páginas responde `200` con `Content-Type` de imagen

#### Scenario: Guard del build
- **WHEN** el build genera un HTML con `/_image?` en cualquier atributo `src`/`srcset`
- **THEN** el build termina con error y el deploy no se publica

### Requirement: Paridad entre build local y build de producción

El conjunto de imágenes optimizadas generadas por el build de producción SHALL ser el mismo que genera el build local con la misma versión de Node y el mismo lockfile.

#### Scenario: Comparación de artefactos
- **WHEN** se listan los archivos `/_astro/*.{webp,avif,png,jpg}` del build local y se solicitan en el deploy
- **THEN** todos responden `200`
