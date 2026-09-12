## MODIFIED Requirements

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

#### Scenario: Cambio de altura del viewport a mitad de transición

- **WHEN** la altura del viewport cambia mientras una transición está a medio camino
- **THEN** la geometría se recalcula y los paneles vuelven a quedar contiguos en el siguiente frame, sin salto visible del título
