# legal-docs Specification

## Purpose
Permitir que el administrador cargue, versione y reemplace los documentos legales que los compradores de Ereditá deben poder consultar, sin dejar tarjetas rotas cuando un documento aún no existe.

## Requirements

### Requirement: Documento legal con archivo opcional
Cada documento legal SHALL tener título y descripción localizados, orden de aparición, y un archivo PDF opcional. Solo SHALL aceptarse `application/pdf` como archivo.

#### Scenario: Documento sin archivo
- **WHEN** un documento publicado no tiene archivo
- **THEN** su tarjeta en `/eredita/` muestra título, descripción y el estado "Próximamente" (traducido), sin enlace de descarga

#### Scenario: Documento con archivo
- **WHEN** un documento publicado tiene archivo
- **THEN** su tarjeta ofrece un enlace que abre o descarga el PDF, con `type="application/pdf"` y el tamaño en MB visible

### Requirement: Versionado explícito
Cada documento con archivo SHALL declarar una etiqueta de versión y una fecha de vigencia, ambas obligatorias cuando hay archivo y visibles en la tarjeta. Reemplazar el archivo SHALL exigir actualizar la versión; el historial de versiones anteriores SHALL conservarse en el CMS.

#### Scenario: Reemplazo del PDF
- **WHEN** el administrador sustituye el reglamento v1 por v2 con nueva fecha y publica
- **THEN** la tarjeta muestra "v2 · <fecha>" y el enlace apunta al archivo nuevo; el archivo anterior sigue accesible desde el historial del CMS

#### Scenario: Versión sin actualizar
- **WHEN** el administrador cambia el archivo sin cambiar la versión
- **THEN** el Studio impide publicar e indica que la versión debe actualizarse

### Requirement: Descarga servida desde el CDN del CMS
Los PDF SHALL servirse desde el CDN del CMS con una URL estable por versión; el repositorio y el host del sitio no SHALL almacenar los archivos.

#### Scenario: Acceso al archivo
- **WHEN** un comprador pulsa el enlace de un documento
- **THEN** el PDF responde `200` con `Content-Type: application/pdf` desde el CDN
