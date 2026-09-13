## Purpose

Permitir que el administrador publique notas con cuerpo, imagen y metadatos desde el CMS, con listado y página de detalle en cada idioma.

## ADDED Requirements

### Requirement: Nota editable con cuerpo
Cada nota SHALL tener título, slug, fecha, categoría, tags, extracto, tiempo de lectura, imagen destacada y cuerpo de texto enriquecido (párrafos, subtítulos, listas, enlaces, imágenes). Título, slug, fecha, categoría y extracto SHALL ser obligatorios; el cuerpo y la imagen, opcionales.

#### Scenario: Nota completa
- **WHEN** el administrador publica una nota con cuerpo e imagen
- **THEN** el listado muestra su fila con imagen y el detalle renderiza el cuerpo con subtítulos, listas y enlaces funcionales

### Requirement: Listado generado desde el CMS
`/noticias/` y `/en/news/` SHALL listar las notas publicadas en ese idioma ordenadas por fecha descendente, con la más reciente como destacada, filtros de categoría con conteo real y la imagen destacada en lugar del placeholder "Fotografía de obra". Cada fila SHALL enlazar a la página de detalle de la nota.

#### Scenario: Orden y destacada
- **WHEN** existen tres notas publicadas con fechas distintas
- **THEN** la más reciente ocupa el bloque destacado y las filas del índice aparecen de la más nueva a la más antigua

#### Scenario: Sin notas en un idioma
- **WHEN** no hay notas publicadas en inglés
- **THEN** `/en/news/` se genera con el hero y un estado vacío traducido, sin error de build

### Requirement: Página de detalle por nota
Cada nota publicada SHALL tener una ruta propia (`/noticias/<slug>/`, `/en/news/<slug>/`) con el shell compartido, el hero con título por renglón, fecha, categoría, tiempo de lectura, imagen destacada, cuerpo y un cierre con contacto. La página SHALL declarar `<title>`, `description` (extracto) y `hreflang` hacia su traducción cuando exista.

#### Scenario: Detalle en español con traducción
- **WHEN** una nota tiene documentos en ambos idiomas
- **THEN** `/noticias/<slug-es>/` incluye `hreflang="en"` hacia `/en/news/<slug-en>/` y el selector de idioma navega entre ambas

#### Scenario: Slug cambiado
- **WHEN** el administrador cambia el slug de una nota publicada
- **THEN** el siguiente build genera la nueva ruta y la anterior deja de existir; el listado enlaza a la nueva
