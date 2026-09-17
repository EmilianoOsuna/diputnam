## ADDED Requirements

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
