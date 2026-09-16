# site-i18n Specification

## Purpose
Ofrecer el sitio completo en español e inglés con rutas propias por idioma, interfaz traducida en código y contenido editorial traducido desde el CMS, sin romper las rutas existentes en español.

## Requirements

### Requirement: Rutas por idioma
El español SHALL ser el idioma por defecto y conservar las rutas actuales sin prefijo (`/`, `/eredita/`, `/putnam/`, `/noticias/`, `/unete/`, `/contacto/`). El inglés SHALL servirse bajo el prefijo `/en/` con slugs en inglés donde el slug sea una palabra traducible (`/en/`, `/en/eredita/`, `/en/putnam/`, `/en/news/`, `/en/join/`, `/en/contact/`). Cada documento SHALL declarar `lang` acorde y SHALL incluir `<link rel="alternate" hreflang>` hacia su par en el otro idioma y `x-default` hacia el español.

#### Scenario: Página en inglés
- **WHEN** se solicita `/en/contact/`
- **THEN** responde `200` con `<html lang="en">`, toda la interfaz y el contenido en inglés, y un `hreflang="es"` que apunta a `/contacto/`

#### Scenario: Rutas en español intactas
- **WHEN** se solicitan las seis rutas en español existentes
- **THEN** responden `200` con el mismo contenido y estructura que antes del cambio, con `hreflang="en"` hacia su par

### Requirement: Selector de idioma en el header
El header compartido SHALL sustituir el indicador estático `ES` por un selector con las dos opciones. Seleccionar un idioma SHALL llevar a la misma página en el otro idioma cuando exista; cuando la página no tiene par (p. ej. una nota publicada solo en español), SHALL llevar a la portada de la sección en el otro idioma. El selector SHALL ser operable por teclado y visible en el menú full-screen móvil.

#### Scenario: Cambio de idioma con par
- **WHEN** la persona está en `/eredita/` y elige EN
- **THEN** navega a `/en/eredita/` y el selector marca EN como idioma actual

#### Scenario: Cambio de idioma sin par
- **WHEN** la persona está en `/noticias/<slug>/` de una nota sin traducción y elige EN
- **THEN** navega a `/en/news/`

### Requirement: Strings de interfaz fuera de las plantillas
Todo texto de interfaz (navegación, labels de formulario, CTAs, `<title>`, `meta description`, skip link, `aria-label`, textos de estado como "Próximamente") SHALL provenir de un diccionario por idioma mantenido en el código, no de literales en las plantillas ni del CMS. Ambos diccionarios SHALL tener el mismo conjunto de claves; una clave ausente en inglés SHALL fallar el build.

#### Scenario: Clave faltante
- **WHEN** se añade una clave al diccionario español sin su equivalente en inglés
- **THEN** `astro build` termina con error indicando la clave

#### Scenario: Sin literales sueltos
- **WHEN** se inspecciona el HTML generado en inglés
- **THEN** ningún texto de navegación, CTA o label aparece en español

### Requirement: Contenido editorial con fallback al español
Cuando un campo localizado del CMS no tiene valor en inglés, la página en inglés SHALL mostrar el valor en español en lugar de un campo vacío o un error de build. Las notas sin traducción no SHALL aparecer en el listado en inglés.

#### Scenario: Campo sin traducción
- **WHEN** una tipología de Ereditá tiene `description.en` vacío
- **THEN** `/en/eredita/` muestra `description.es` en ese bloque y el resto en inglés
