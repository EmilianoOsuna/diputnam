# typology-media-gallery Specification

## Purpose
Permitir que cada tipología de un proyecto muestre varios medios —un video por defecto y renders o fotos seleccionables— editables desde el CMS, para que el comprador pueda ver en detalle cada espacio (p. ej. el parrillero de la terraza) sin salir del panel.

## Requirements

### Requirement: Medios de una tipología editables en el CMS
Cada tipología SHALL tener un video opcional (archivo mp4 con imagen de póster) y una lista ordenada de imágenes (renders o fotos) con texto alternativo localizado y pie opcional. Sólo SHALL aceptarse `video/mp4` como video. Una tipología SHALL tener al menos un medio (video o una imagen) para poder publicarse. El Studio SHALL indicar junto al campo de video el tamaño y la resolución recomendados.

#### Scenario: Tipología con video e imágenes
- **WHEN** el administrador sube un mp4 con su póster y tres renders a "Áreas comunes" y publica
- **THEN** el panel de Áreas comunes muestra el video por defecto y cuatro miniaturas (video + tres renders)

#### Scenario: Tipología sólo con imágenes
- **WHEN** una tipología no tiene video y tiene una o más imágenes
- **THEN** el panel muestra la primera imagen por defecto; si hay una sola imagen, no muestra tira de miniaturas

#### Scenario: Tipología sin medios
- **WHEN** el administrador intenta publicar una tipología sin video ni imágenes
- **THEN** el Studio bloquea la publicación e indica el campo

#### Scenario: Formato de video no admitido
- **WHEN** el administrador intenta subir un `.mov` como video
- **THEN** el Studio rechaza el archivo

### Requirement: Medio por defecto y selección por miniaturas
El panel de cada tipología SHALL mostrar un medio principal en el área de imagen actual y una tira de miniaturas, una por medio, en el orden video (si existe) e imágenes según su orden en el CMS. Al activar una miniatura, el medio principal SHALL cambiar a ese medio sin recargar la página ni desplazar la pista de tipologías; la miniatura activa SHALL distinguirse visualmente. La miniatura del video SHALL identificarse como video (indicador de reproducción).

#### Scenario: Seleccionar un render
- **WHEN** la persona activa la miniatura del tercer render de Áreas comunes
- **THEN** el medio principal muestra ese render, la miniatura queda marcada como activa y el resto del panel (título, ficha, CTA) no cambia

#### Scenario: Volver al video
- **WHEN** tras ver un render la persona activa la miniatura del video
- **THEN** el video vuelve al área principal y se reproduce desde donde estaba o desde el inicio

#### Scenario: Tira desbordada
- **WHEN** las miniaturas no caben en el ancho del área de medios
- **THEN** la tira se desplaza horizontalmente y ofrece controles anterior/siguiente en desktop; la miniatura activa siempre queda visible dentro de la tira

### Requirement: Reproducción del video
El video principal SHALL reproducirse silenciado, en bucle e inline, sin controles nativos visibles, sólo mientras su panel es el visible; al abandonar el panel el video SHALL pausarse. Ningún video SHALL descargarse hasta que su panel esté visible por primera vez; antes de ello se muestra el póster. Con `prefers-reduced-motion: reduce` el video no SHALL reproducirse automáticamente: se muestra el póster con un control para reproducir, y el resto de la galería funciona igual.

#### Scenario: Panel activo en desktop
- **WHEN** la pista pinada avanza a Áreas comunes
- **THEN** su video empieza a reproducirse silenciado y el del panel anterior se pausa

#### Scenario: Panel fuera de vista en móvil
- **WHEN** la persona desliza la pista y el panel con video deja de estar en el centro
- **THEN** ese video se pausa y el del panel que entra (si tiene) se reproduce

#### Scenario: Sin descarga anticipada
- **WHEN** se carga `/eredita/eredita-art/` y no se llega a la sección de tipologías
- **THEN** no se solicita ningún archivo mp4

#### Scenario: Movimiento reducido
- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** el póster se muestra con un botón de reproducir y el video sólo arranca al pulsarlo

### Requirement: Carga y peso de la galería
Las miniaturas SHALL servirse en tamaños de miniatura (no la imagen completa) y las imágenes no seleccionadas SHALL cargarse de forma diferida. El primer medio de cada panel SHALL conservar el `srcset`, la calidad y el tratamiento tonal de la imagen de tipología actual. El script de la galería SHALL entrar en el presupuesto de JavaScript móvil vigente del sitio.

#### Scenario: Peso de las miniaturas
- **WHEN** se inspeccionan las imágenes de la tira
- **THEN** cada una se solicita con un ancho ≤ 320 px

#### Scenario: Presupuesto móvil
- **WHEN** se mide el JavaScript de primera parte descargado en `/eredita/eredita-art/` en móvil
- **THEN** sigue dentro del límite que aplica `test:perf`

### Requirement: Accesibilidad de la galería
La tira de miniaturas SHALL ser operable por teclado (foco en cada miniatura, activación con Enter/Espacio y desplazamiento con flechas), cada miniatura SHALL tener nombre accesible (pie o texto alternativo, o "Video" traducido), el estado activo SHALL exponerse a tecnologías de asistencia y el medio principal SHALL conservar el texto alternativo del medio seleccionado. El video SHALL llevar el nombre accesible de la tipología.

#### Scenario: Navegación por teclado
- **WHEN** la persona enfoca la tira y pulsa la flecha derecha dos veces y Enter
- **THEN** el tercer medio pasa a ser el principal y el foco permanece en su miniatura

#### Scenario: Lector de pantalla
- **WHEN** un lector de pantalla recorre la tira
- **THEN** anuncia cada miniatura con su nombre y cuál está seleccionada
