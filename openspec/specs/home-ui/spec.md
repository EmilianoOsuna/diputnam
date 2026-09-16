# home-ui Specification

## Purpose

Define una home de Putnam que traduzca con alta fidelidad la experiencia visual de DSGN Interior, conservando la identidad de Putnam y dejando una base verificable para añadir el resto del sitio por cambios posteriores.

## Requirements

### Requirement: Home visualmente fiel a la referencia

La home SHALL reproducir visualmente la referencia `https://dsgninterior.se/en` como fuente de verdad para composición, jerarquía, proporciones, espaciado, tipografía, tratamientos de imagen, navegación, estados hover y ritmo de interacción. La adaptación SHALL cambiar únicamente la marca, colores, logo, textos e imágenes necesarios para representar a Putnam.

#### Scenario: Comparación visual en desktop

- **WHEN** la home de Putnam y la referencia se inspeccionan en un viewport desktop equivalente
- **THEN** el hero, la navegación, la retícula principal, la escala tipográfica y la distribución de espacios conservan el mismo lenguaje visual y comportamiento observable, adaptados al contenido de Putnam

#### Scenario: Comparación visual en mobile

- **WHEN** ambas experiencias se inspeccionan en un viewport mobile equivalente
- **THEN** la home mantiene la misma intención de composición, jerarquía y ritmo de la referencia sin desbordamientos, texto ilegible ni controles inaccesibles

### Requirement: Hero de Putnam

La home SHALL presentar un hero como primera señal de la marca, usando el logo de Putnam, una declaración principal basada en el contenido existente y una composición equivalente a la referencia en escala, alineación, contraste y presencia visual.

#### Scenario: Primera carga

- **WHEN** una persona visita `/` desde el inicio
- **THEN** el hero aparece completo, identifica a Putnam y deja visible una señal clara del siguiente contenido para invitar al scroll

### Requirement: Contenido inicial de la home

La home SHALL mostrar las cuatro escenas representativas del MVP: introducción de Putnam, proyecto destacado Ereditá, la firma Putnam y un cierre de contacto. Cada escena SHALL mostrar únicamente un título breve como copy visible principal; el título SHALL ser un hipervínculo a la sección correspondiente y SHALL ocupar como máximo dos renglones en el viewport objetivo. La home SHALL retirar el eyebrow, la descripción y las acciones textuales secundarias de las escenas. El título, la imagen y el `alt` de cada escena SHALL provenir del CMS, localizados, y la home SHALL existir en `/` y `/en/` con las mismas cuatro escenas.

#### Scenario: Contenido disponible

- **WHEN** la home termina de cargar
- **THEN** el contenido principal de Putnam y Ereditá se presenta dentro de la composición visual aprobada, con los títulos e imágenes publicados en el CMS

#### Scenario: Home en inglés

- **WHEN** se carga `/en/`
- **THEN** las cuatro escenas muestran el título en inglés (o el español como fallback) y enlazan a las rutas `/en/…`

### Requirement: Navegación y contacto legibles

La home SHALL presentar los enlaces del navbar y los datos de contacto con un tamaño y contraste legibles en desktop y mobile, sin perder la composición editorial ni permitir desbordamiento horizontal. En mobile, el navbar SHALL ofrecer un control minimalista de tres líneas que abra una superficie de navegación full-screen, con enlaces principales en disposición vertical y datos de contacto visibles en la parte inferior. La superficie SHALL incluir un control de cierre reconocible en la misma posición, cubrir el viewport disponible y mantener el contenido navegable por toque y teclado. En el HTML legado, la navegación SHALL transformarse en un control y panel adecuados para pantallas estrechas, o eliminarse junto con su offset si el documento deja de ser una entrada servida; no SHALL permanecer una sidebar fija que reduzca el ancho útil del contenido mobile. Las tarjetas y acciones SHALL seguir siendo comprensibles y activables por toque y teclado sin depender únicamente de `:hover`.

#### Scenario: Navbar legible

- **WHEN** una persona inspecciona el navbar en cualquier viewport soportado
- **THEN** los enlaces y el indicador de idioma son distinguibles sin zoom adicional, conservan estados hover y focus visibles, y en mobile no fuerzan una barra lateral fija ni un desbordamiento horizontal

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

#### Scenario: Interacción de tarjeta en touch

- **WHEN** una persona toca o enfoca una tarjeta de proyecto en un viewport sin hover
- **THEN** puede identificar el proyecto y activar su destino sin necesitar que el estado visual dependa de pasar el cursor

### Requirement: Animación y scroll

La home SHALL reproducir el ritmo de movimiento de la referencia en transiciones de entrada, reveals, desplazamiento de imágenes, hover y cambios ligados al scroll, manteniendo continuidad entre secciones y evitando movimientos decorativos que no aporten a la composición.

#### Scenario: Recorrido normal

- **WHEN** una persona recorre la home con scroll vertical
- **THEN** las secciones y elementos visuales entran, salen o se transforman con transiciones suaves, coherentes y sincronizadas con el desplazamiento

#### Scenario: Interacción con elementos visuales

- **WHEN** una persona pasa el cursor sobre una navegación, enlace o pieza de proyecto
- **THEN** el estado interactivo conserva la respuesta visual equivalente a la referencia y sigue siendo comprensible sin depender exclusivamente del color

### Requirement: Experiencia responsive y movimiento reducido

La home SHALL mantener la composición y la navegación utilizables en desktop y mobile. SHALL respetar `prefers-reduced-motion`, desactivando o reduciendo el movimiento sin ocultar contenido ni romper el flujo. El menú full-screen mobile SHALL permanecer funcional con movimiento reducido y SHALL evitar transiciones dependientes exclusivamente de animación para comunicar apertura o cierre. El HTML legado SHALL adaptar sus grids, espacios y bloques de contenido desde 320 px, SHALL evitar alturas rígidas u overflow que oculten contenido esencial y SHALL usar unidades de viewport compatibles con barras de navegador cuando una sección ocupe la pantalla.

#### Scenario: Movimiento reducido

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** la home muestra todo el contenido con transiciones mínimas o nulas y conserva navegación, contraste y orden de lectura, incluyendo apertura y cierre inmediatos del menú mobile

#### Scenario: Pantalla estrecha

- **WHEN** la home se abre en una pantalla mobile de al menos 320 px de ancho
- **THEN** ningún texto, imagen, control o sección se corta horizontalmente, las retículas se recomponen a columnas legibles y el layout no requiere gestos no evidentes

#### Scenario: Pantalla móvil baja

- **WHEN** una persona abre una sección de altura de viewport en un navegador mobile con barras visibles
- **THEN** el contenido esencial y sus controles permanecen alcanzables mediante scroll y no quedan atrapados por `overflow: hidden` o una altura rígida

#### Scenario: Cambio a desktop

- **WHEN** el viewport cambia de mobile a desktop mientras el menú está abierto
- **THEN** el estado full-screen se elimina y la navegación desktop queda disponible sin overlay residual ni scroll bloqueado

#### Scenario: Cambio de orientación o tamaño

- **WHEN** el viewport cambia entre orientación vertical, horizontal, mobile y desktop
- **THEN** se recalculan los offsets y columnas sin dejar sidebar, overlay, scroll bloqueado o desbordamiento horizontal residual

### Requirement: Verificación contra la referencia

La implementación SHALL verificarse con Playwright mediante capturas y revisión de interacción de la referencia y de Putnam en al menos un viewport desktop y uno mobile. La validación SHALL cubrir como mínimo hero, layout, tipografía, scroll, hover, animaciones y ausencia de errores visibles.

#### Scenario: Revisión de aceptación

- **WHEN** se ejecutan las verificaciones visuales y funcionales del MVP
- **THEN** existen capturas comparables y evidencia de que el hero, el layout y las animaciones cumplen la fidelidad visual definida antes de considerar aprobada la fase

### Requirement: Acceso a la página institucional de Putnam

La navegación principal de la home SHALL incluir un enlace real a la página institucional de Putnam. El acceso SHALL funcionar desde navegación desktop y mobile sin eliminar la escena resumida de Putnam ni romper los demás enlaces internos de la home.

#### Scenario: Navegación desde desktop

- **WHEN** una persona activa “Putnam” en la navegación desktop de la home
- **THEN** el navegador abre la página institucional de Putnam en la misma pestaña

#### Scenario: Navegación desde el menú mobile

- **WHEN** una persona activa “Putnam” desde el menú mobile abierto
- **THEN** el menú se cierra y el navegador abre la página institucional sin dejar bloqueo de scroll o foco inconsistente

#### Scenario: Escena Putnam preservada

- **WHEN** una persona recorre las escenas de la home mediante scroll
- **THEN** la escena resumida de Putnam sigue apareciendo en su orden actual y el resto de anclas continúa llevando a su destino previsto
