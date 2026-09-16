# sanity-content Specification

## Purpose
Definir el CMS como fuente de verdad del contenido editorial: qué edita el administrador, cómo llega al sitio estático y cómo se regenera el sitio al publicar.

## Requirements

### Requirement: Contenido editorial servido desde el CMS en build
El sitio SHALL obtener todo el contenido editorial (textos de escenas y secciones, notas, tipologías, documentos, imágenes de contenido, datos de contacto) desde el CMS durante el build y SHALL seguir publicándose como HTML estático sin servidor ni funciones en runtime. `src/data/*.ts` no SHALL contener contenido editorial al cerrar el cambio.

#### Scenario: Build con CMS accesible
- **WHEN** se ejecuta el build con las credenciales de solo lectura del proyecto
- **THEN** las doce rutas y una por proyecto e idioma se generan con el contenido publicado y ningún `.html` referencia texto o imagen que no provenga del CMS o del diccionario de interfaz

#### Scenario: Build sin credenciales
- **WHEN** faltan las variables del proyecto o el dataset
- **THEN** el build termina con un error explícito que nombra la variable ausente

### Requirement: Solo contenido publicado
El sitio SHALL construirse únicamente con documentos publicados; los borradores no SHALL aparecer en producción.

#### Scenario: Borrador pendiente
- **WHEN** el administrador edita una nota y no pulsa Publicar
- **THEN** el siguiente build muestra la versión publicada anterior

### Requirement: Localización de campos y de documentos
El contenido fijo (escenas del home, Ereditá, Putnam, Únete, contacto, documentos legales) SHALL localizarse a nivel de campo, con español obligatorio e inglés opcional. Las notas SHALL localizarse a nivel de documento: cada idioma es un documento propio, vinculados entre sí, y una nota puede existir en un solo idioma.

#### Scenario: Traducción parcial de contenido fijo
- **WHEN** el administrador rellena solo el español de un campo
- **THEN** el Studio permite publicar y el sitio en inglés aplica el fallback definido en `site-i18n`

#### Scenario: Nota en un solo idioma
- **WHEN** existe una nota en español sin documento vinculado en inglés
- **THEN** aparece en `/noticias/` y no en `/en/news/`

### Requirement: Regeneración del sitio al publicar
Publicar, actualizar o despublicar cualquier documento en el CMS SHALL disparar una regeneración del sitio en el host activo. El mecanismo SHALL depender solo de una URL de deploy hook configurable, de modo que cambiar de Cloudflare a Vercel no requiera tocar código ni schemas.

#### Scenario: Publicar una nota
- **WHEN** el administrador publica una nota
- **THEN** en menos de cinco minutos la nota aparece en producción sin intervención manual

#### Scenario: Cambio de host
- **WHEN** se sustituye la URL del deploy hook por la de Vercel
- **THEN** el flujo de publicación sigue funcionando sin otros cambios

### Requirement: Studio accesible al administrador
El administrador SHALL poder editar contenido desde un Studio publicado con autenticación, con los tipos de documento ordenados por sección del sitio, vistas previas de imagen y validaciones (campos obligatorios, slugs únicos, formato de archivo).

#### Scenario: Validación de publicación
- **WHEN** el administrador intenta publicar una nota sin título en español o con slug duplicado
- **THEN** el Studio bloquea la publicación e indica el campo

### Requirement: Migración inicial de contenido
El contenido actual de `src/data/*.ts` y las imágenes mock SHALL cargarse en el CMS mediante un script reproducible antes de que el sitio deje de leer los datos locales, de modo que el sitio publicado no pierda contenido en ningún momento.

#### Scenario: Seed reproducible
- **WHEN** se ejecuta el script de migración contra un dataset vacío
- **THEN** el build posterior produce las mismas seis rutas en español con el mismo contenido visible que el build previo al cambio
