# site-shell-chrome Specification

## Purpose

Definir el tamaño visual del isotipo del header y el diseño del pie de página compartido (grosor, redes sociales, crédito de autoría) que se repiten en las seis páginas del sitio a través de `SiteHeader.astro` y `ContactFooter.astro`.

## Requirements

### Requirement: Isotipo del header con presencia visual suficiente

La caja visual del isotipo del header (`.brand--mark`) SHALL leerse con presencia suficiente junto al resto de la navegación, sin depender de agrandar la resolución intrínseca ya cubierta por `brand-marks`. El isotipo SHALL crecer respecto a su tamaño actual tanto en desktop como en móvil, conservando la proporción del arte y sin invadir la navegación ni desbordar el header a ningún ancho ≥ 320 px.

#### Scenario: Header en desktop
- **WHEN** el header se inspecciona en un viewport ≥ 1280 px
- **THEN** el isotipo ocupa una caja visiblemente mayor que la actual (no una mera mejora de nitidez) y el layout del header no se desborda ni solapa la navegación

#### Scenario: Header en móvil
- **WHEN** el header se inspecciona en un viewport de 390 px
- **THEN** el isotipo crece de forma proporcional al ajuste de desktop y el header conserva su altura utilizable para el botón de menú

### Requirement: Pie de página compartido delgado con redes y crédito

El pie de página compartido (`.site-footer` fijo y su variante en flujo `.site-footer--flow`) SHALL reducir su grosor (altura mínima y padding vertical) respecto a los valores actuales en las seis páginas, sin recortar ni superponer el contenido de contacto existente (correo, teléfono, ciudad, WhatsApp). SHALL incorporar una fila de iconos de redes sociales —WhatsApp (desde `contact.whatsapp`), y Facebook/Instagram cuando existan URLs equivalentes en `contact.organization.sameAs`— y una línea de crédito de autoría ("Código y diseño · Emiliano Osuna" o su equivalente en inglés) alineada al extremo derecho del pie de página. Ningún ícono SHALL renderizarse para una red sin URL configurada en `sameAs`.

#### Scenario: Pie de página con redes configuradas
- **WHEN** `organization.sameAs` incluye una URL de Facebook y una de Instagram
- **THEN** el pie de página muestra tres iconos operables (WhatsApp, Facebook, Instagram), cada uno enlazando a su URL correspondiente con `target="_blank" rel="noreferrer"`

#### Scenario: Pie de página sin redes adicionales configuradas
- **WHEN** `organization.sameAs` está vacío
- **THEN** el pie de página muestra únicamente el icono de WhatsApp (siempre disponible vía `contact.whatsapp`) sin huecos ni iconos rotos

#### Scenario: Crédito de autoría visible
- **WHEN** se inspecciona el pie de página fijo de cualquier página o el pie en flujo de Contacto
- **THEN** la línea de crédito de autoría está presente, alineada a la derecha, y no interfiere con los datos de contacto ni con los iconos de redes

#### Scenario: Grosor reducido sin overflow
- **WHEN** el pie de página se inspecciona en desktop y en 390 px
- **THEN** su altura mínima y padding son visiblemente menores que en la versión anterior, todo el contenido permanece legible y no hay desbordamiento horizontal

### Requirement: Datos de redes sociales reutilizados sin nuevos campos de CMS

Los iconos de redes del pie de página SHALL derivarse exclusivamente de datos ya editables desde el Studio (`contact.whatsapp` y `contact.organization.sameAs`), sin introducir un nuevo campo de CMS para este propósito. La identificación de cada red (Facebook, Instagram) SHALL basarse en el dominio de cada URL de `sameAs`.

#### Scenario: URL de red no reconocida
- **WHEN** `organization.sameAs` contiene una URL cuyo dominio no corresponde a Facebook ni Instagram (p. ej. LinkedIn o Google Business)
- **THEN** esa URL no produce un icono en el pie de página y no genera un error de render
