## MODIFIED Requirements

### Requirement: Navegación y contacto legibles

La home SHALL presentar los enlaces del navbar y los datos de contacto con un tamaño y contraste legibles en desktop y mobile, sin perder la composición editorial ni permitir desbordamiento horizontal. En el HTML legado, la navegación SHALL transformarse en un control y panel adecuados para pantallas estrechas, o eliminarse junto con su offset si el documento deja de ser una entrada servida; no SHALL permanecer una sidebar fija que reduzca el ancho útil del contenido mobile. Las tarjetas y acciones SHALL seguir siendo comprensibles y activables por toque y teclado sin depender únicamente de `:hover`.

#### Scenario: Navbar legible
- **WHEN** una persona inspecciona el navbar en cualquier viewport soportado
- **THEN** los enlaces y el indicador de idioma son distinguibles sin zoom adicional, conservan estados hover y focus visibles, y en mobile no fuerzan una barra lateral fija ni un desbordamiento horizontal

#### Scenario: Contacto legible
- **WHEN** una persona llega al cierre de contacto
- **THEN** email, teléfono, ciudad y enlaces disponibles se distinguen con claridad y siguen siendo activables por teclado o toque

#### Scenario: Interacción de tarjeta en touch
- **WHEN** una persona toca o enfoca una tarjeta de proyecto en un viewport sin hover
- **THEN** puede identificar el proyecto y activar su destino sin necesitar que el estado visual dependa de pasar el cursor

### Requirement: Experiencia responsive y movimiento reducido

La home SHALL mantener la composición y la navegación utilizables en desktop y mobile. SHALL respetar `prefers-reduced-motion`, desactivando o reduciendo el movimiento sin ocultar contenido ni romper el flujo. El HTML legado SHALL adaptar sus grids, espacios y bloques de contenido desde 320 px, SHALL evitar alturas rígidas u overflow que oculten contenido esencial y SHALL usar unidades de viewport compatibles con barras de navegador cuando una sección ocupe la pantalla.

#### Scenario: Movimiento reducido
- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** la home muestra todo el contenido con transiciones mínimas o nulas y conserva navegación, contraste y orden de lectura

#### Scenario: Pantalla estrecha
- **WHEN** la home se abre en una pantalla mobile de al menos 320 px de ancho
- **THEN** ningún texto, imagen, control o sección se corta horizontalmente, las retículas se recomponen a columnas legibles y el layout no requiere gestos no evidentes

#### Scenario: Pantalla móvil baja
- **WHEN** una persona abre una sección de altura de viewport en un navegador mobile con barras visibles
- **THEN** el contenido esencial y sus controles permanecen alcanzables mediante scroll y no quedan atrapados por `overflow: hidden` o una altura rígida

#### Scenario: Cambio de orientación o tamaño
- **WHEN** el viewport cambia entre orientación vertical, horizontal, mobile y desktop
- **THEN** se recalculan los offsets y columnas sin dejar sidebar, overlay, scroll bloqueado o desbordamiento horizontal residual
