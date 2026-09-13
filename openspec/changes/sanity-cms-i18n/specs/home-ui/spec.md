## MODIFIED Requirements

### Requirement: Contenido inicial de la home

La home SHALL mostrar las cuatro escenas representativas del MVP: introducción de Putnam, proyecto destacado Ereditá, la firma Putnam y un cierre de contacto. Cada escena SHALL mostrar únicamente un título breve como copy visible principal; el título SHALL ser un hipervínculo a la sección correspondiente y SHALL ocupar como máximo dos renglones en el viewport objetivo. La home SHALL retirar el eyebrow, la descripción y las acciones textuales secundarias de las escenas. El título, la imagen y el `alt` de cada escena SHALL provenir del CMS, localizados, y la home SHALL existir en `/` y `/en/` con las mismas cuatro escenas.

#### Scenario: Contenido disponible

- **WHEN** la home termina de cargar
- **THEN** el contenido principal de Putnam y Ereditá se presenta dentro de la composición visual aprobada, con los títulos e imágenes publicados en el CMS

#### Scenario: Home en inglés

- **WHEN** se carga `/en/`
- **THEN** las cuatro escenas muestran el título en inglés (o el español como fallback) y enlazan a las rutas `/en/…`
