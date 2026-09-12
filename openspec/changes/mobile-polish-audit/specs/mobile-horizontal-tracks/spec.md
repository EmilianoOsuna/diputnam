## Purpose

Definir cómo se comportan en móvil las secciones Tipologías (Ereditá) y Nuestra cultura (Únete): una pista horizontal navegable con el dedo cuyo contador y barra de progreso reflejan siempre la tarjeta activa.

## ADDED Requirements

### Requirement: Pista horizontal con swipe nativo en móvil

En viewports menores de 900 px, las tarjetas de Tipologías (Ereditá) y de Nuestra cultura (Únete) SHALL presentarse en una pista horizontal desplazable con el gesto nativo de swipe, con encaje (`scroll-snap`) por tarjeta. El scroll vertical de la página no SHALL quedar bloqueado ni secuestrado por la pista, y la pista no SHALL provocar desbordamiento horizontal del documento.

#### Scenario: Swipe entre tipologías
- **WHEN** la persona desliza horizontalmente sobre la pista de Tipologías en un viewport de 390 px
- **THEN** la pista avanza y encaja en la siguiente tipología, ocupando el ancho útil del viewport sin cortar contenido esencial

#### Scenario: Swipe entre valores de cultura
- **WHEN** la persona desliza horizontalmente sobre la pista de Nuestra cultura
- **THEN** la pista encaja en el siguiente valor y el resto de la página sigue desplazándose verticalmente con normalidad

#### Scenario: Sin desbordamiento del documento
- **WHEN** se mide `document.documentElement.scrollWidth` en `/eredita/` y `/unete/` a 320, 390 y 768 px
- **THEN** es igual al ancho del viewport

### Requirement: Contador y barra de progreso sincronizados con la tarjeta activa

Ambas secciones SHALL mostrar en móvil un contador `NN / TT` y una barra de progreso. La barra SHALL representar la fracción `activa / total` (llena al 100 % en la última tarjeta) y el contador SHALL indicar la tarjeta que ocupa el centro del viewport, actualizándose durante el desplazamiento horizontal sin saltos ni retrasos perceptibles.

#### Scenario: Estado inicial
- **WHEN** la pista se muestra sin haber interactuado
- **THEN** el contador marca `01 / TT` y la barra muestra la fracción `1 / TT`

#### Scenario: Última tarjeta
- **WHEN** la persona llega a la última tarjeta
- **THEN** el contador marca `TT / TT` y la barra está completa

#### Scenario: Tarjeta intermedia
- **WHEN** la tarjeta central es la tercera de cuatro
- **THEN** el contador marca `03 / 04` y la barra llena tres cuartos de su ancho

### Requirement: Encabezado de sección visible y ordenado en móvil

El encabezado de cada sección (kicker, título, texto introductorio, contador y barra) SHALL aparecer encima de la pista, alineado con el gutter de la página y sin solaparse con las tarjetas. En Tipologías, la tarjeta introductoria SHALL convertirse en ese encabezado y no ocupar una posición dentro de la pista; en Nuestra cultura el bloque `pin-stage` no SHALL quedar fijado en móvil.

#### Scenario: Composición de Tipologías en móvil
- **WHEN** `/eredita/` se abre a 390 px y se desplaza hasta Tipologías
- **THEN** se ve el encabezado (kicker, título, intro, contador, barra) y debajo la pista con las cuatro tipologías

#### Scenario: Composición de Nuestra cultura en móvil
- **WHEN** `/unete/` se abre a 390 px y se desplaza hasta Nuestra cultura
- **THEN** se ve el encabezado con el contador y la barra y debajo la pista con los cuatro valores, sin el bloque fijado ni espacio vacío residual

### Requirement: Comportamiento en desktop y accesibilidad

En viewports de 900 px o más, ambas secciones SHALL conservar el comportamiento actual (pin y avance controlado por scroll). La pista móvil SHALL ser navegable con teclado (foco en cada tarjeta y desplazamiento con flechas), anunciar la posición actual a tecnologías de asistencia y respetar `prefers-reduced-motion` desactivando el desplazamiento suave pero manteniendo el swipe.

#### Scenario: Desktop sin regresión
- **WHEN** `/eredita/` o `/unete/` se abre a 1440 px
- **THEN** Tipologías y Nuestra cultura se comportan como antes del cambio

#### Scenario: Movimiento reducido
- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` en un viewport móvil
- **THEN** la pista sigue siendo desplazable con el dedo y el contador/barra se actualizan, sin animaciones de desplazamiento suave
