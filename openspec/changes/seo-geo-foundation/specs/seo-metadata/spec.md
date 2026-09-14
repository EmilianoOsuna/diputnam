## Purpose

Definir qué declara el `<head>` de cada página publicada para que buscadores, redes sociales y motores generativos identifiquen la URL canónica, el idioma, el mercado y el tipo de contenido de Putnam sin ambigüedad.

## ADDED Requirements

### Requirement: URL canónica absoluta

Cada página HTML SHALL declarar exactamente un `<link rel="canonical">` con la URL absoluta de su propia ruta bajo `https://diputnam.com`, con barra final. Los `hreflang` (`es`, `en`, `x-default`) y `og:url` SHALL usar la misma forma absoluta. Ninguna URL absoluta emitida por el sitio SHALL apuntar a `localhost`, a `workers.dev` ni a `www.diputnam.com`.

#### Scenario: Página estática en inglés
- **WHEN** se construye `/en/contact/`
- **THEN** el HTML contiene `<link rel="canonical" href="https://diputnam.com/en/contact/">`, `hreflang="es"` hacia `https://diputnam.com/contacto/` y `x-default` hacia `https://diputnam.com/contacto/`

#### Scenario: Nota sin traducción
- **WHEN** se construye una nota que existe solo en español
- **THEN** su canonical es su propia URL absoluta y no declara `hreflang="en"`

#### Scenario: Copia de vista previa
- **WHEN** el mismo build se sirve desde un host distinto a `diputnam.com` (p. ej. `*.workers.dev`)
- **THEN** el canonical sigue apuntando a `https://diputnam.com/...`, de modo que el host de vista previa no compite en el índice

### Requirement: Título y descripción con marca y mercado

Cada página SHALL tener un `<title>` de entre 30 y 60 caracteres que incluya "Putnam" y, en las páginas estáticas, el mercado ("La Paz" y/o "Bolivia") o el producto ("departamentos", "desarrollos inmobiliarios") en el idioma de la página, y una `meta description` de entre 110 y 155 caracteres que nombre qué ofrece la página y dónde. Los títulos y descripciones de páginas estáticas SHALL provenir del diccionario de interfaz por idioma; los de una nota SHALL provenir de sus campos de SEO opcionales y, en su ausencia, del título de la nota truncado en un límite de palabra a 60 caracteres más " | Putnam" y de su extracto truncado a 155. El H1 visible de cada página SHALL conservarse tal como está; solo cambia el `<title>`.

#### Scenario: Título estático en español
- **WHEN** se construye `/`
- **THEN** `<title>` es "Putnam · Desarrollos inmobiliarios en La Paz, Bolivia" (o una variante que cumpla longitud, marca y mercado) y la descripción menciona proyectos residenciales y Bolivia en menos de 155 caracteres

#### Scenario: Nota con título largo sin override
- **WHEN** una nota tiene un título de 95 caracteres y ningún campo `seo.title`
- **THEN** el `<title>` publicado tiene 60 caracteres o menos, termina en " | Putnam" y no corta una palabra a la mitad

#### Scenario: Nota con override
- **WHEN** el editor rellena `seo.title` y `seo.description` en el Studio
- **THEN** el `<title>` y la `meta description` de la nota usan esos valores en lugar de los derivados

#### Scenario: Título fuera de rango
- **WHEN** un `<title>` en `dist/` supera 60 caracteres o una descripción supera 155
- **THEN** el build falla nombrando la ruta y la longitud

### Requirement: Metadatos Open Graph y Twitter por página e idioma

Cada página SHALL declarar `og:type` (`website` para páginas estáticas, `article` para notas), `og:site_name` ("Putnam"), `og:title`, `og:description`, `og:url`, `og:locale` (`es_LA` o `en_US`) y `og:locale:alternate` cuando exista par, `og:image` absoluto de 1200×630 px con `og:image:width`, `og:image:height`, `og:image:alt` y `og:image:type`, y `twitter:card` con valor `summary_large_image`. Las notas SHALL añadir `article:published_time`, `article:modified_time` y `article:section`.

#### Scenario: Página estática comparte su portada
- **WHEN** `/eredita/` se comparte en WhatsApp, LinkedIn o X
- **THEN** la vista previa muestra una imagen 1200×630 con el mark de Putnam y el nombre de la página en español, el título y la descripción de la página

#### Scenario: Nota con imagen destacada
- **WHEN** una nota tiene imagen destacada
- **THEN** `og:image` es esa imagen recortada a 1200×630 respetando su hotspot, y `og:image:alt` es el alt de la imagen

#### Scenario: Nota sin imagen destacada
- **WHEN** una nota no tiene imagen
- **THEN** `og:image` es la portada por defecto del idioma de la nota

#### Scenario: Imagen inexistente
- **WHEN** un `og:image` apunta a un archivo local que no está en `dist/`
- **THEN** el build falla nombrando la ruta y la imagen

### Requirement: Datos estructurados JSON-LD

Cada página SHALL incluir un bloque `<script type="application/ld+json">` con un `@graph` válido que contenga `Organization` (nombre, `legalName` si existe, `url`, `logo`, `description` en el idioma de la página, `address` de tipo `PostalAddress` con ciudad y país, `geo`, `contactPoint` con teléfono y correo, `sameAs` con las redes registradas) y `WebSite` (`url`, `name`, `inLanguage`). Además la página SHALL declarar su tipo: `WebPage` en la home, `AboutPage` en la firma, `ContactPage` en contacto, `CollectionPage` en noticias, `WebPage` en Ereditá y Únete, y `NewsArticle` en cada nota con `headline`, `datePublished`, `dateModified`, `inLanguage`, `image`, `author` y `publisher` apuntando a la `Organization`. Las páginas interiores SHALL incluir `BreadcrumbList` (Inicio › sección › nota). Los datos de organización SHALL provenir del CMS y no de literales en el código.

#### Scenario: Organización coherente en ambos idiomas
- **WHEN** se construyen `/putnam/` y `/en/putnam/`
- **THEN** ambos JSON-LD tienen la misma `Organization` con `@id` `https://diputnam.com/#organization`, misma dirección, teléfono y `sameAs`, y `description` en el idioma correspondiente

#### Scenario: Nota como artículo
- **WHEN** se construye `/noticias/<slug>/`
- **THEN** su JSON-LD contiene un `NewsArticle` cuyo `datePublished` coincide con la fecha de la nota, `dateModified` con la última publicación en el CMS y `mainEntityOfPage` con su canonical

#### Scenario: JSON-LD inválido
- **WHEN** un bloque JSON-LD no parsea o carece de `@type`
- **THEN** el build falla nombrando la ruta

### Requirement: Directivas para robots y vista previa

Las páginas indexables SHALL declarar `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`. La página 404 SHALL declarar `noindex`. Ninguna página indexable SHALL contener texto oculto añadido solo para buscadores: el contenido que ven los rastreadores SHALL ser el mismo que ve la persona.

#### Scenario: Página indexable
- **WHEN** se construye cualquiera de las doce rutas o una nota
- **THEN** la meta `robots` permite indexar y la vista previa de imagen grande

#### Scenario: Página 404
- **WHEN** se construye `404.html`
- **THEN** declara `noindex` y no aparece en el sitemap

### Requirement: Un solo encabezado principal

Cada página SHALL tener exactamente un `<h1>` cuyo texto describa la página, y los `<h2>` SHALL corresponder a las secciones visibles. El texto del `<h1>` SHALL estar presente en el HTML servido sin depender de JavaScript.

#### Scenario: Auditoría de encabezados
- **WHEN** se inspecciona el HTML de `dist/` de cualquier ruta con JavaScript desactivado
- **THEN** hay un único `<h1>` con texto no vacío
