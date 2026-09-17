## MODIFIED Requirements

### Requirement: Pista horizontal con swipe nativo en móvil

En viewports menores de 900 px, las tarjetas de Tipologías (páginas de proyecto de Ereditá, `/eredita/<slug>/`), de Nuestra cultura (Únete) y de Motivos (Contacto), y en viewports menores de 768 px las etapas de Proceso (`/putnam/`), SHALL presentarse en una pista horizontal desplazable con el gesto nativo de swipe, con encaje (`scroll-snap`) por tarjeta. El scroll vertical de la página no SHALL quedar bloqueado ni secuestrado por la pista, y la pista no SHALL provocar desbordamiento horizontal del documento. La tira de miniaturas de cada tipología SHALL poder desplazarse con el dedo sin que ese gesto encaje la pista en otra tarjeta, y un swipe fuera de la tira SHALL seguir moviendo la pista.

#### Scenario: Swipe entre tipologías
- **WHEN** la persona desliza horizontalmente sobre la pista de Tipologías de `/eredita/eredita-art/` en un viewport de 390 px
- **THEN** la pista avanza y encaja en la siguiente tipología, ocupando el ancho útil del viewport sin cortar contenido esencial

#### Scenario: Swipe sobre la tira de miniaturas
- **WHEN** la persona desliza horizontalmente sobre la tira de miniaturas de una tipología con más miniaturas de las que caben
- **THEN** se desplaza la tira y la pista permanece encajada en la misma tipología

#### Scenario: Swipe entre valores de cultura
- **WHEN** la persona desliza horizontalmente sobre la pista de Nuestra cultura
- **THEN** la pista encaja en el siguiente valor y el resto de la página sigue desplazándose verticalmente con normalidad

#### Scenario: Swipe entre motivos de contacto
- **WHEN** la persona desliza horizontalmente sobre la pista de Motivos en `/contacto/`
- **THEN** la pista encaja en el siguiente motivo y el contador/barra se actualizan igual que en las otras dos secciones

#### Scenario: Swipe entre etapas del proceso
- **WHEN** la persona desliza horizontalmente sobre la pista de Proceso en `/putnam/` a 390 px
- **THEN** la pista encaja en la siguiente etapa, el contador y la barra se actualizan y el resto de la página sigue desplazándose verticalmente con normalidad

#### Scenario: Sin desbordamiento del documento
- **WHEN** se mide `document.documentElement.scrollWidth` en `/eredita/`, `/eredita/eredita-art/`, `/putnam/` y `/unete/` a 320, 390 y 768 px
- **THEN** es igual al ancho del viewport

### Requirement: Tarjeta completa en pantalla y alturas uniformes

En móvil, cada tarjeta de una pista SHALL caber completa a lo ancho del viewport (ancho del viewport menos los gutters laterales), de modo que al encajar se vea una tarjeta entera y la siguiente sólo asome por el espacio entre tarjetas. Todas las tarjetas de una misma pista SHALL tener la misma altura, con su contenido alineado al inicio. En Tipologías y Proceso, el medio (imagen o video) SHALL ser el elemento dominante de la tarjeta: SHALL ocupar más de la mitad de la altura de la tarjeta, y el bloque de texto visible bajo el medio SHALL limitarse a índice, título, subtítulo (Tipologías) o texto breve (Proceso) y la acción. En Tipologías, la descripción y las specs SHALL seguir disponibles dentro de la tarjeta mediante un control nativo de expandir/contraer, cerrado por defecto en móvil y sin control en desktop. La tira de miniaturas de una tipología SHALL ocupar un espacio de altura fija dentro del área de medios, de modo que el número de miniaturas (o su ausencia) no altere la altura de la tarjeta ni la coordenada en que empieza el bloque de texto.

#### Scenario: Tarjeta encajada
- **WHEN** una tarjeta de Tipologías está encajada a 390 px
- **THEN** sus bordes izquierdo y derecho quedan dentro del viewport y a la distancia del gutter, y la siguiente tarjeta asoma como máximo el ancho del `gap`

#### Scenario: Alturas
- **WHEN** se miden las tarjetas de Tipologías de `/eredita/eredita-art/` a 390 px, con tipologías de distinto número de medios
- **THEN** todas tienen la misma altura, y en cada una la imagen y el bloque de texto empiezan a la misma coordenada vertical

#### Scenario: Medio dominante
- **WHEN** se mide una tarjeta de Tipologías o de Proceso encajada a 390 × 844 px con el control de detalles cerrado
- **THEN** el área del medio mide más de la mitad de la altura de la tarjeta

#### Scenario: Detalles de la tipología
- **WHEN** la persona activa el control de detalles de una tipología a 390 px
- **THEN** la descripción y las specs se muestran dentro de la misma tarjeta, y la pista sigue encajada en esa tipología

#### Scenario: Detalles en desktop
- **WHEN** `/eredita/eredita-art/` se abre a 1440 px
- **THEN** la descripción y las specs de cada tipología se ven directamente, sin control de expandir/contraer visible

### Requirement: Contador y barra de progreso sincronizados con la tarjeta activa

Todas las secciones con pista SHALL mostrar en móvil un contador `NN / TT` y una barra de progreso. La barra SHALL representar la fracción `activa / total` (llena al 100 % en la última tarjeta) y el contador SHALL indicar la tarjeta que ocupa el centro del viewport, actualizándose durante el desplazamiento horizontal sin saltos ni retrasos perceptibles. En Tipologías y Proceso el contador SHALL presentarse con el mismo tamaño y disposición que en Nuestra cultura de Únete: número activo grande, total pequeño a continuación y la barra debajo, entre el encabezado y la pista.

#### Scenario: Estado inicial
- **WHEN** la pista se muestra sin haber interactuado
- **THEN** el contador marca `01 / TT` y la barra muestra la fracción `1 / TT`

#### Scenario: Última tarjeta
- **WHEN** la persona llega a la última tarjeta
- **THEN** el contador marca `TT / TT` y la barra está completa

#### Scenario: Tarjeta intermedia
- **WHEN** la tarjeta central es la tercera de cuatro
- **THEN** el contador marca `03 / 04` y la barra llena tres cuartos de su ancho

#### Scenario: Contador de Tipologías y Proceso
- **WHEN** se comparan a 390 px el contador de Tipologías en `/eredita/eredita-art/`, el de Proceso en `/putnam/` y el de Nuestra cultura en `/unete/`
- **THEN** los tres tienen el mismo tamaño de número activo y la misma disposición (número, total, barra debajo)

### Requirement: Encabezado de sección visible y ordenado en móvil

El encabezado de cada sección (kicker, título, texto introductorio, contador y barra) SHALL aparecer encima de la pista, alineado con el gutter de la página y sin solaparse con las tarjetas. En Tipologías, la tarjeta introductoria SHALL convertirse en ese encabezado y no ocupar una posición dentro de la pista; en Nuestra cultura el bloque `pin-stage` no SHALL quedar fijado en móvil. En Tipologías, encabezado, contador, barra y pista SHALL caber juntos en la altura del viewport (`100dvh`) a 390 × 844 px con el control de detalles cerrado, de modo que la sección se vea completa sin desplazar la página.

#### Scenario: Composición de Tipologías en móvil
- **WHEN** `/eredita/eredita-art/` se abre a 390 × 844 px y se desplaza hasta Tipologías
- **THEN** se ve el encabezado (kicker, título, intro, contador, barra) y debajo la pista con las tipologías del proyecto, y la altura total de la sección es menor o igual que la del viewport

#### Scenario: Composición de Proceso en móvil
- **WHEN** `/putnam/` se abre a 390 px y se desplaza hasta Proceso
- **THEN** se ve el kicker, el contador y la barra y debajo la pista con las etapas, cada una con su imagen (o marcador de imagen pendiente), número, título y texto

#### Scenario: Composición de Nuestra cultura en móvil
- **WHEN** `/unete/` se abre a 390 px y se desplaza hasta Nuestra cultura
- **THEN** se ve el encabezado con el contador y la barra y debajo la pista con los cuatro valores, sin el bloque fijado ni espacio vacío residual
