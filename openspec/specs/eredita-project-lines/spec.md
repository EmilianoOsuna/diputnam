# eredita-project-lines Specification

## Purpose
Definir Ereditá como una línea de edificios editable desde el CMS: una portada de línea en `/eredita/` y una página por proyecto (EREDITÁ Art, y los que el administrador añada) con el contenido comercial, sin tocar código para publicar un proyecto nuevo.

## Requirements

### Requirement: Proyecto como documento editable
El CMS SHALL ofrecer una colección "Proyectos Ereditá" donde cada proyecto tiene: nombre (p. ej. "EREDITÁ Art"), slug único, orden, estado localizado (p. ej. "En preventa"), tarjeta (imagen y texto breve localizado) y las secciones de contenido comercial hoy propias de Ereditá —hero (kicker, título, subtítulo, imagen, video opcional), introducción (entrada, puntos, datos), galería, tipologías (según `typology-media-gallery`), encabezado de documentación y cierre— localizadas a nivel de campo con español obligatorio e inglés opcional. Publicar un proyecto nuevo no SHALL requerir cambios de código.

#### Scenario: Alta de un proyecto nuevo
- **WHEN** el administrador crea "EREDITÁ 2" con slug `eredita-2`, rellena los campos obligatorios y publica
- **THEN** tras la siguiente regeneración el sitio publica `/eredita/eredita-2/` y `/en/eredita/eredita-2/` y la portada de la línea lo lista, sin intervención del equipo de desarrollo

#### Scenario: Slug duplicado o inválido
- **WHEN** el administrador intenta publicar un proyecto con un slug ya usado por otro proyecto o con caracteres fuera de `a-z0-9-`
- **THEN** el Studio bloquea la publicación e indica el campo

#### Scenario: Proyecto en borrador
- **WHEN** existe un proyecto sin publicar
- **THEN** no aparece en la portada, no tiene ruta en `dist/` ni entrada en el sitemap

### Requirement: Portada de la línea en la ruta de Ereditá
`/eredita/` y `/en/eredita/` SHALL ser la portada de la línea: hero con la marca de Ereditá (kicker, título, subtítulo, imagen o video), introducción de la línea (entrada, puntos, datos) y una sección "Proyectos" con una tarjeta por proyecto publicado ordenada por el campo orden, cada una con imagen, nombre, estado, texto breve y enlace a la página del proyecto en el mismo idioma, seguida del cierre con contacto. La pestaña Ereditá del header, la escena del home y los enlaces de la 404 SHALL seguir apuntando a `/eredita/` (o `/en/eredita/`).

#### Scenario: Un solo proyecto publicado
- **WHEN** sólo existe EREDITÁ Art publicado y se abre `/eredita/`
- **THEN** la sección Proyectos muestra una tarjeta "EREDITÁ Art" cuyo enlace lleva a `/eredita/eredita-art/`

#### Scenario: Varios proyectos
- **WHEN** hay tres proyectos publicados con orden 1, 2 y 3
- **THEN** la portada los lista en ese orden, cada uno enlazando a su propia ruta

#### Scenario: Navegación compartida intacta
- **WHEN** se inspecciona el header en cualquier ruta
- **THEN** los enlaces de navegación son exactamente `/eredita/`, `/putnam/`, `/noticias/`, `/unete/`, `/contacto/` (o sus pares en `/en/`), sin una entrada por proyecto

### Requirement: Página de proyecto por idioma
Cada proyecto publicado SHALL generarse como HTML estático en `/eredita/<slug>/` (español) y `/en/eredita/<slug>/` (inglés) con el mismo slug, y SHALL presentar en este orden: hero del proyecto, introducción con datos, galería, tipologías, documentación para compradores y cierre, con el mismo shell (header, footer, selector de idioma) que el resto del sitio. Un enlace visible en el hero o la introducción SHALL llevar de vuelta a la portada de la línea.

#### Scenario: Ruta en español
- **WHEN** se solicita `/eredita/eredita-art/`
- **THEN** responde `200` con `<html lang="es">`, el contenido publicado del proyecto y las seis secciones en el orden indicado

#### Scenario: Ruta en inglés con traducción parcial
- **WHEN** se solicita `/en/eredita/eredita-art/` y algún campo carece de inglés
- **THEN** responde `200` con `<html lang="en">`, la interfaz en inglés y el español como fallback en los campos sin traducción

#### Scenario: Selector de idioma
- **WHEN** la persona está en `/eredita/eredita-art/` y elige EN
- **THEN** navega a `/en/eredita/eredita-art/`, y viceversa

#### Scenario: Slug inexistente
- **WHEN** se solicita `/eredita/no-existe/`
- **THEN** el hosting sirve la página 404 del sitio

### Requirement: Metadatos y superficie de rastreo de las páginas de proyecto
Cada página de proyecto SHALL declarar canónica absoluta igual a su ruta, `hreflang` recíproco hacia su par y `x-default` hacia la ruta en español, `<title>` y `meta description` derivados del nombre y la entrada del proyecto (con los límites de longitud del resto del sitio), imagen social tomada de la imagen del hero del proyecto en 1200×630, y datos estructurados `WebPage` con `BreadcrumbList` Inicio › Ereditá › <nombre>. `sitemap.xml` SHALL listar cada página de proyecto en ambos idiomas con `lastmod` igual a la última publicación del proyecto y sus alternativas de idioma, y `llms.txt` SHALL listar los proyectos publicados bajo Ereditá en cada sección de idioma. La comprobación de coherencia entre sitemap y `dist/` SHALL seguir fallando ante cualquier diferencia.

#### Scenario: Sitemap con proyectos
- **WHEN** termina el build con EREDITÁ Art publicado
- **THEN** el sitemap contiene `/eredita/eredita-art/` y `/en/eredita/eredita-art/`, cada una con `xhtml:link` hacia la otra y `x-default` hacia la española, y el conjunto de `<loc>` coincide con las páginas HTML de `dist/`

#### Scenario: Metadatos del proyecto
- **WHEN** se inspecciona `<head>` de `/en/eredita/eredita-art/`
- **THEN** `link[rel=canonical]` es `https://diputnam.com/en/eredita/eredita-art/`, `hreflang="es"` apunta a `/eredita/eredita-art/`, `og:image` es una URL absoluta de 1200×630 y el JSON-LD incluye un `BreadcrumbList` de tres elementos

#### Scenario: llms.txt
- **WHEN** un asistente descarga `/llms.txt`
- **THEN** encuentra, bajo el enlace a Ereditá de cada idioma, una línea por proyecto publicado con su URL absoluta y su texto breve

### Requirement: Documentos legales por proyecto
Cada documento legal SHALL poder referenciar opcionalmente un proyecto. La sección "Documentación para compradores" de un proyecto SHALL mostrar los documentos que lo referencian y los que no referencian ningún proyecto, en el orden definido; un documento que referencia otro proyecto no SHALL aparecer.

#### Scenario: Documento común
- **WHEN** un documento publicado no referencia ningún proyecto
- **THEN** aparece en la documentación de todos los proyectos

#### Scenario: Documento propio de un proyecto
- **WHEN** el reglamento de copropiedad referencia EREDITÁ 2
- **THEN** aparece en `/eredita/eredita-2/` y no en `/eredita/eredita-art/`

### Requirement: Migración del contenido existente sin pérdida
El contenido publicado hoy en Ereditá (galería, tipologías, encabezado de documentación, y copias de hero e introducción) SHALL migrarse a un proyecto `eredita-art` mediante un script reproducible que lea el documento publicado —no el seed— de modo que ninguna edición hecha por el administrador en el Studio se pierda, y que cada imagen de tipología pase a ser la primera imagen de su galería. El seed y el dataset local SHALL producir el mismo modelo, de forma que un build offline genere la portada y `/eredita/eredita-art/`.

#### Scenario: Migración en producción
- **WHEN** se ejecuta la migración contra el dataset de producción y se regenera el sitio
- **THEN** `/eredita/eredita-art/` muestra las mismas tipologías, galería y documentos que mostraba `/eredita/` antes del cambio, y `/eredita/` muestra la portada con la tarjeta de EREDITÁ Art

#### Scenario: Migración repetida
- **WHEN** el script se ejecuta por segunda vez
- **THEN** no duplica el proyecto ni sobrescribe ediciones posteriores del administrador en `eredita-art`

#### Scenario: Build offline
- **WHEN** se construye con el dataset local regenerado
- **THEN** `dist/` contiene `eredita/index.html`, `eredita/eredita-art/index.html` y sus pares en `en/`

### Requirement: Masonry de galería consistente en móvil

La galería de fotografías y renders de un proyecto (`.ed-masonry`) SHALL mostrarse en al menos 2 columnas tipo Pinterest en móvil (< 640 px), en vez de apilarse en una sola columna. La alternancia de alturas entre columnas SHALL conservarse como en desktop/tablet.

#### Scenario: Galería en móvil
- **WHEN** se abre la página de un proyecto en un viewport de 390 px y se llega a la galería
- **THEN** las imágenes se distribuyen en al menos 2 columnas de alturas variables, no en una columna única

### Requirement: Tipologías sin secuestro de scroll en desktop

La sección de tipologías de un proyecto (`.ed-typologies`) SHALL permanecer en una sola `100dvh` y permitir avanzar entre paneles mediante scroll/gesto horizontal nativo (el mismo track con `scroll-snap` ya usado en móvil), en vez de fijar la página e interceptar la rueda del mouse (`event.preventDefault()`) para forzar un avance discreto panel por panel. La página SHALL permanecer desplazable con normalidad durante toda la interacción: ningún gesto de scroll vertical u horizontal sobre la sección SHALL bloquearse ni redirigirse artificialmente.

#### Scenario: Avance por gesto horizontal en desktop
- **WHEN** una persona usa el trackpad o la rueda del mouse con desplazamiento horizontal sobre la sección de tipologías en desktop
- **THEN** los paneles se desplazan según el gesto, sin que la página quede fijada ni el scroll de la rueda quede interceptado

#### Scenario: Entrada y salida de la sección
- **WHEN** una persona hace scroll vertical normal hasta llegar a la sección de tipologías y continúa después de recorrerla
- **THEN** la sección ocupa una sola `100dvh` de alto en el documento, sin espacio adicional reservado antes o después para un scroll fijado

### Requirement: Contador y barra de progreso visibles en todos los anchos

El contador (`01/0N`) y la barra de progreso de la sección de tipologías (`.ed-h-progress`, hoy oculta con `display: none` a partir de 900 px) SHALL ser visibles y reflejar el panel activo tanto en móvil como en desktop.

#### Scenario: Progreso en desktop
- **WHEN** una persona avanza entre tipologías en un viewport ≥ 900 px
- **THEN** el contador y la barra de progreso se actualizan de forma visible con cada cambio de panel, igual que en móvil

### Requirement: Prioridad visual a imagen y video en cada tipología

Dentro de cada panel de tipología, el área de imagen/video (`.ed-h-media`) SHALL ocupar al menos el 55% del ancho del panel en desktop, de modo que la imagen o el video reciban más peso visual que el bloque de texto/ficha técnica.

#### Scenario: Proporción del panel en desktop
- **WHEN** se inspecciona un panel de tipología en un viewport ≥ 1024 px
- **THEN** el área de medios ocupa al menos el 55% del ancho del panel y el bloque de texto ocupa el resto
