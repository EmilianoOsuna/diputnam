# home-ui-motion-readability Specification

## Purpose

Definir el comportamiento visual que hace que la home de Putnam se sienta como una experiencia editorial premium, fiel al hero, al layout y al ritmo de scroll observable en DSGN Interior, sin perder identidad ni legibilidad.

## Requirements

### Requirement: Tipografía editorial de la referencia

La home SHALL usar Cera Pro cuando exista un archivo o licencia autorizada para Putnam. Si no existe, SHALL usar una alternativa autorizada que conserve de forma verificable sus proporciones, peso, ritmo y apariencia; Montserrat no SHALL permanecer como tipografía principal.

#### Scenario: Tipografía en la home

- **WHEN** una persona inspecciona el hero, la navegación y el footer
- **THEN** la tipografía mantiene el carácter geométrico y editorial de la referencia, con jerarquía y espaciado equivalentes, sin recurrir a Montserrat

### Requirement: Legibilidad sobre imágenes

La home SHALL mantener legibles el logo, la navegación, los títulos, los metadatos y las acciones sobre cualquier imagen del MVP. El contraste SHALL provenir de un tratamiento visual consistente que no destruya la lectura de la fotografía ni dependa únicamente de cambiar el color del texto.

#### Scenario: Imagen clara detrás del contenido

- **WHEN** el slide activo muestra una zona clara detrás del header o del título
- **THEN** todos los textos y controles conservan contraste suficiente y sus límites siguen siendo identificables

#### Scenario: Cambio de imagen

- **WHEN** una nueva imagen cubre la escena durante el scroll
- **THEN** la legibilidad se conserva durante toda la transición, sin flashes de texto perdido ni controles que desaparezcan visualmente

### Requirement: Stage de slides con título persistente

La home SHALL presentar sus contenidos como una secuencia de escenas a pantalla completa donde el título activo permanece centrado en el viewport mientras el scroll provoca el barrido de la imagen saliente por la entrante. El cambio de título SHALL estar sincronizado con esa transición y no SHALL depender de que el texto completo se desplace fuera del centro como contenido ordinario.

#### Scenario: Avance desde el hero

- **WHEN** una persona hace scroll desde el hero hacia la siguiente escena
- **THEN** el título permanece anclado alrededor del centro de la pantalla, la imagen siguiente entra como una cubierta continua y el nuevo título reemplaza al anterior mediante una transición suave

#### Scenario: Retroceso de escena

- **WHEN** una persona hace scroll hacia arriba después de avanzar
- **THEN** la escena anterior vuelve con el mismo lenguaje de barrido, sincronía y continuidad, sin saltos ni títulos duplicados

### Requirement: Movimiento premium y controlado

La home SHALL responder al scroll con movimiento continuo, parallax sutil, reveals y transiciones de entrada/salida coherentes con la referencia. Las animaciones SHALL tener duración, easing y continuidad suficientes para no sentirse rígidas, pero no SHALL bloquear la navegación ni introducir movimiento ornamental sin relación con el contenido. La home SHALL añadir una flecha minimalista fija en la esquina inferior derecha como única señal visual de scroll. Mientras exista contenido por recorrer, la flecha SHALL apuntar hacia abajo y tener una animación sutil; cuando la persona llegue al final del documento, SHALL apuntar hacia arriba mediante un giro sutil. El control SHALL seguir siendo comprensible y respetar `prefers-reduced-motion`.

#### Scenario: Recorrido normal en desktop

- **WHEN** una persona recorre la home a velocidad normal
- **THEN** el movimiento de scroll, las imágenes y los títulos se perciben sincronizados y fluidos, sin quedarse estáticos entre escenas ni saltar de estado

#### Scenario: Hover y navegación

- **WHEN** una persona pasa el cursor sobre enlaces, navegación o controles del menú
- **THEN** el estado responde con una transición breve y clara, consistente con el lenguaje visual del stage

#### Scenario: Señal de avance

- **WHEN** la persona se encuentra antes del final de la home
- **THEN** observa una flecha sin texto en la esquina inferior derecha apuntando hacia abajo con movimiento sutil

#### Scenario: Señal de regreso

- **WHEN** la persona llega al final de la home
- **THEN** la flecha gira sutilmente para apuntar hacia arriba y activa el desplazamiento hacia el inicio al seleccionarla

#### Scenario: Movimiento reducido de la flecha

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** la flecha conserva su dirección y función, pero no ejecuta animaciones continuas ni un giro animado

### Requirement: Responsive y movimiento reducido

La home SHALL conservar el stage, el orden de lectura, la navegación y la legibilidad en mobile. Cuando el sistema reporte `prefers-reduced-motion: reduce`, SHALL omitir o minimizar el smooth scroll, parallax y transiciones, manteniendo todas las imágenes, títulos, acciones y contenido accesibles. En mobile, la transición entre escenas SHALL cubrir el stage de forma continua: la distancia que recorren el panel saliente y el entrante SHALL coincidir con la altura real del stage en cada instante, de modo que un cambio de altura del viewport (barra de direcciones que se retrae o expande) nunca descubra el fondo del documento entre ambos paneles.

#### Scenario: Viewport mobile

- **WHEN** la home se inspecciona en un viewport mobile equivalente al de la referencia
- **THEN** el título, el menú, los controles y las imágenes caben en la pantalla sin desbordamiento horizontal ni superposición incoherente

#### Scenario: Movimiento reducido

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** la home muestra el contenido completo en un flujo estable, sin depender de una animación para descubrir texto o acciones

#### Scenario: Barra de direcciones retraída durante la transición

- **WHEN** la persona hace scroll en un navegador móvil y la barra de direcciones se retrae, haciendo que `window.innerHeight` supere la altura del stage
- **THEN** el panel saliente y el entrante permanecen contiguos (sin franja del color de fondo entre ellos) en cualquier punto de la transición

#### Scenario: Stage cubre el viewport en ambos estados de la barra
- **WHEN** la barra de direcciones se retrae o se muestra en cualquier punto del recorrido de la home
- **THEN** el stage cubre todo el alto visible: no aparece ninguna franja del color del documento entre el stage y el borde inferior o superior del viewport

#### Scenario: Cambio de altura del viewport a mitad de transición

- **WHEN** la altura del viewport cambia mientras una transición está a medio camino
- **THEN** la geometría se recalcula y los paneles vuelven a quedar contiguos en el siguiente frame, sin salto visible del título
