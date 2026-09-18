## ADDED Requirements

### Requirement: Flechas de acción como icono vectorial

Las flechas que acompañan a enlaces y botones de acción (`→` y `↗` en CTAs, filas de índice, botones de formulario y enlaces de sección) SHALL renderizarse como un icono vectorial inline que hereda el color y el tamaño del texto, nunca como un carácter sujeto a la presentación emoji del sistema. El icono SHALL ser decorativo (`aria-hidden`) y conservar el texto accesible del enlace, la dirección de la flecha y las transiciones de hover/foco existentes.

#### Scenario: Flecha en Safari iOS
- **WHEN** un enlace con flecha `↗` o `→` se muestra en Safari iOS o en cualquier navegador sin el glifo en la fuente del sitio
- **THEN** la flecha se dibuja monocroma en el color del texto, con el mismo trazo en todas las plataformas, sin fondo ni relleno de emoji

#### Scenario: Texto accesible intacto
- **WHEN** una tecnología de asistencia lee un enlace de acción
- **THEN** anuncia sólo el texto del enlace (por ejemplo, "Escríbenos"), sin describir la flecha

### Requirement: Menú móvil opaco

La superficie del menú móvil SHALL ser opaca: el contenido de la página que queda debajo no SHALL traslucir en ningún grado, ni en pantallas de alto contraste.

#### Scenario: Menú abierto sobre la home
- **WHEN** el menú se abre sobre el hero de la home en un teléfono
- **THEN** el título del hero y la imagen no son perceptibles a través del fondo del menú
