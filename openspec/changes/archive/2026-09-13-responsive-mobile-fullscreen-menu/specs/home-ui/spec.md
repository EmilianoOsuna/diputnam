## MODIFIED Requirements

### Requirement: Navegación y contacto legibles

La home SHALL presentar los enlaces del navbar y los datos de contacto con un tamaño y contraste legibles en desktop y mobile, sin perder la composición editorial ni permitir desbordamiento horizontal. En mobile, el navbar SHALL ofrecer un control minimalista de tres líneas que abra una superficie de navegación full-screen, con enlaces principales en disposición vertical y datos de contacto visibles en la parte inferior. La superficie SHALL incluir un control de cierre reconocible en la misma posición, cubrir el viewport disponible y mantener el contenido navegable por toque y teclado.

#### Scenario: Navbar legible

- **WHEN** una persona inspecciona el navbar en cualquier viewport soportado
- **THEN** los enlaces y el indicador de idioma son distinguibles sin zoom adicional y conservan estados hover y focus visibles

#### Scenario: Contacto legible

- **WHEN** una persona llega al cierre de contacto
- **THEN** email, teléfono, ciudad y enlaces disponibles se distinguen con claridad y siguen siendo activables por teclado o toque

#### Scenario: Apertura del menú mobile

- **WHEN** una persona toca o activa con teclado el control de tres líneas en un viewport mobile
- **THEN** se muestra una superficie full-screen con la navegación principal en columna, el control cambia a estado de cierre y el estado se anuncia mediante `aria-expanded`

#### Scenario: Cierre del menú mobile

- **WHEN** una persona activa el control de cierre, presiona `Escape` o selecciona un enlace de navegación
- **THEN** la superficie se cierra, el foco regresa al control que abrió el menú y el estado de `aria-expanded` vuelve a `false`

#### Scenario: Contacto desde el menú

- **WHEN** una persona abre el menú mobile
- **THEN** el email y los datos de contacto disponibles permanecen visibles y activables en la zona inferior sin cubrirse por el viewport ni por el control de cierre

#### Scenario: Bloqueo de interacción subyacente

- **WHEN** la superficie full-screen está abierta
- **THEN** el scroll y los controles de la home subyacente no reciben interacción accidental hasta que el menú se cierre

### Requirement: Experiencia responsive y movimiento reducido

La home SHALL mantener la composición y la navegación utilizables en desktop y mobile. SHALL respetar `prefers-reduced-motion`, desactivando o reduciendo el movimiento sin ocultar contenido ni romper el flujo. El menú full-screen mobile SHALL permanecer funcional con movimiento reducido y SHALL evitar transiciones dependientes exclusivamente de animación para comunicar apertura o cierre.

#### Scenario: Movimiento reducido

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** la home muestra todo el contenido con transiciones mínimas o nulas y conserva navegación, contraste y orden de lectura, incluyendo apertura y cierre inmediatos del menú mobile

#### Scenario: Pantalla estrecha

- **WHEN** la home se abre en una pantalla mobile
- **THEN** ningún texto, imagen, control o sección se corta horizontalmente y el layout se adapta sin requerir gestos no evidentes

#### Scenario: Cambio a desktop

- **WHEN** el viewport cambia de mobile a desktop mientras el menú está abierto
- **THEN** el estado full-screen se elimina y la navegación desktop queda disponible sin overlay residual ni scroll bloqueado
