## MODIFIED Requirements

### Requirement: Responsive y movimiento reducido

La home SHALL conservar el stage, el orden de lectura, la navegación y la legibilidad en mobile. Cuando el sistema reporte `prefers-reduced-motion: reduce`, SHALL omitir o minimizar el smooth scroll, parallax y transiciones, manteniendo todas las imágenes, títulos, acciones y contenido accesibles. En mobile, la transición entre escenas SHALL cubrir el stage de forma continua: la distancia que recorren el panel saliente y el entrante SHALL coincidir con la altura real del stage en cada instante, de modo que un cambio de altura del viewport (barra de direcciones que se retrae o expande) nunca descubra el fondo del documento entre ambos paneles. En mobile, el barrido de escenas y el título persistente SHALL avanzar en el mismo frame que el scroll nativo, sin cálculo por frame en JavaScript, y el estado activo de cada escena SHALL cambiar sólo al cruzar el punto medio de la transición. Si el navegador no soporta animaciones ligadas al scroll, la home mobile SHALL degradar a escenas apiladas a pantalla completa con snap vertical, sin barrido, mostrando cada título dentro de su escena.

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

#### Scenario: Barrido mobile sincronizado con el scroll nativo

- **WHEN** en mobile se fija el scroll a una posición intermedia entre dos escenas y se inspecciona el stage en ese mismo frame
- **THEN** el panel saliente, el entrante y sus títulos ya están en la posición correspondiente a esa fracción, y durante un gesto de scroll continuo no se ejecuta ningún callback de `requestAnimationFrame` ni de `scroll` propio del sitio

#### Scenario: Navegador mobile sin animaciones ligadas al scroll

- **WHEN** la home se abre en un viewport mobile en un navegador sin soporte de `animation-timeline`
- **THEN** las cuatro escenas se presentan apiladas a pantalla completa con snap vertical, cada una con su imagen y título, y los enlaces de escena y el scroll cue siguen funcionando
