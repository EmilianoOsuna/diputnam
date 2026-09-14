## Purpose

Definir los archivos que el sitio expone en su raíz para rastreadores, asistentes de IA, navegadores y la plataforma de hosting, y la guarda que los mantiene coherentes con las rutas realmente publicadas.

## ADDED Requirements

### Requirement: robots.txt

El sitio SHALL servir `/robots.txt` que permita el rastreo de todo el sitio público a todos los agentes, incluidos los rastreadores de motores generativos (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `Bingbot`, `Applebot-Extended`), sin reglas `Disallow` sobre rutas que existan, y que declare `Sitemap: https://diputnam.com/sitemap.xml`.

#### Scenario: Rastreador generativo
- **WHEN** `PerplexityBot` o `ClaudeBot` solicitan `/robots.txt`
- **THEN** obtienen `200 text/plain` y ninguna regla les niega `/`, `/en/` ni `/noticias/`

#### Scenario: Ubicación del sitemap
- **WHEN** un rastreador lee `/robots.txt`
- **THEN** encuentra la línea `Sitemap:` con la URL absoluta del sitemap

### Requirement: Sitemap XML con alternativas de idioma

El sitio SHALL servir `/sitemap.xml` generado en cada build que liste exactamente las URLs indexables publicadas (las doce rutas estáticas y todas las notas de ambos idiomas), cada una con su URL absoluta canónica, `lastmod` en ISO 8601 (fecha de última publicación en el CMS para notas; fecha del build para páginas estáticas), y elementos `xhtml:link rel="alternate" hreflang` para `es`, `en` y `x-default` coherentes con los `hreflang` del HTML. El sitemap no SHALL incluir la página 404, `llms.txt` ni recursos.

#### Scenario: Coherencia con el build
- **WHEN** termina el build
- **THEN** el conjunto de `<loc>` del sitemap es idéntico al conjunto de páginas HTML indexables en `dist/`; cualquier diferencia hace fallar el build nombrando las rutas

#### Scenario: Nota con traducción
- **WHEN** una nota en español tiene traducción en inglés
- **THEN** la entrada de cada una lleva `xhtml:link` hacia la otra y `x-default` hacia la española

### Requirement: llms.txt para motores generativos

El sitio SHALL servir `/llms.txt` en formato Markdown con: un encabezado `# Putnam`, un resumen en una frase de lo que hace Putnam y dónde, una sección en español y otra en inglés con enlaces absolutos y descripciones de una línea a las seis páginas principales, la lista de notas publicadas con fecha, y los datos de contacto públicos (correo, teléfono, ciudad). Su contenido SHALL derivar del mismo CMS y diccionario que las páginas, no de un texto mantenido aparte.

#### Scenario: Consulta de un asistente
- **WHEN** un asistente de IA descarga `/llms.txt`
- **THEN** recibe `200 text/plain; charset=utf-8` con la descripción de Putnam, enlaces a `/`, `/eredita/`, `/putnam/`, `/noticias/`, `/unete/`, `/contacto/` y sus pares en `/en/`, y las notas publicadas

#### Scenario: Nueva nota publicada
- **WHEN** se publica una nota en el CMS y el sitio se reconstruye
- **THEN** `/llms.txt` la lista sin edición manual

### Requirement: Página 404 bilingüe

El sitio SHALL publicar `404.html` en la raíz de `dist/` para que el hosting la sirva con estado `404` ante cualquier ruta inexistente. La página SHALL mostrar en español, y en inglés cuando la URL solicitada empieza por `/en/`, un mensaje breve y enlaces a la home y a contacto de ese idioma, con el header del sitio y `noindex`.

#### Scenario: Ruta inexistente en español
- **WHEN** se solicita `/proyectos/`
- **THEN** el servidor responde `404` con la página en español y enlaces a `/` y `/contacto/`

#### Scenario: Ruta inexistente en inglés
- **WHEN** se solicita `/en/projects/`
- **THEN** el servidor responde `404` y la página presenta el mensaje en inglés con enlaces a `/en/` y `/en/contact/`

### Requirement: Iconos y manifiesto

El sitio SHALL servir `favicon.svg`, `favicon.ico` (32 px), `apple-touch-icon.png` (180 px), iconos PNG de 192 y 512 px y `site.webmanifest` con `name` "Putnam", `short_name`, `lang`, `theme_color` y `background_color` de la paleta, todos derivados del mark oficial de Putnam. Cada página SHALL enlazar `icon` (SVG y PNG), `apple-touch-icon` y `manifest`.

#### Scenario: Pestaña y pantalla de inicio
- **WHEN** se abre cualquier ruta en Safari iOS y se añade a la pantalla de inicio
- **THEN** el icono es el mark de Putnam a 180 px sin bordes blancos y el nombre es "Putnam"

#### Scenario: Recurso ausente
- **WHEN** un icono o el manifiesto enlazados desde el HTML no existen en `dist/`
- **THEN** el build falla nombrando el recurso

### Requirement: Cabeceras y redirecciones del hosting

El build SHALL incluir un archivo de cabeceras para el hosting que fije `Cache-Control: public, max-age=31536000, immutable` para `/_astro/*` y `/fonts/*`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy` restrictiva para todas las rutas. El proyecto SHALL documentar la redirección `301` de `www.diputnam.com` y de `http://` hacia `https://diputnam.com` y la normalización a barra final, de modo que exista una única forma canónica de cada URL.

#### Scenario: Recurso con hash
- **WHEN** se solicita `/_astro/<archivo-con-hash>.css`
- **THEN** la respuesta lleva `Cache-Control` inmutable de un año

#### Scenario: Host alternativo
- **WHEN** se solicita `https://www.diputnam.com/eredita`
- **THEN** la respuesta final es `301` hacia `https://diputnam.com/eredita/`
