## ADDED Requirements

### Requirement: Una escena por swipe en móvil
En viewports menores de 768 px, la home SHALL presentarse como un slider vertical a pantalla completa sin desplazamiento del documento (la barra de direcciones del navegador no se mueve). Un swipe vertical SHALL avanzar exactamente una escena: durante el arrastre la escena sigue al dedo 1:1, y al soltar SHALL aterrizar en la escena siguiente (o anterior) con una transición de 500 ms y curva `ease` ejecutada por el compositor, sin inercia, rebote ni saltos de más de una escena. Un flick rápido (< 300 ms) SHALL cambiar de escena siempre; un arrastre lento SHALL cambiar sólo si recorre al menos media pantalla y, si no, volver a la escena actual. En la primera y la última escena el arrastre en sentido contrario no SHALL mover nada. Durante la transición la imagen de cada escena SHALL desplazarse al 40 % de la velocidad de la escena (parallax), el bloque del título SHALL permanecer fijo en pantalla mientras la escena lo cubre o descubre, y el título SHALL derivar 60 px en sentido contrario. El gesto no SHALL aplicarse con el menú abierto ni bloquear el zoom, y la flecha de scroll SHALL avanzar una escena por pulsación y volver al inicio desde la última.

#### Scenario: Flick
- **WHEN** la persona hace un flick hacia arriba de menos de 300 ms sobre la escena 1 a 390 px
- **THEN** la escena 2 ocupa exactamente el viewport ~500 ms después, sin sobrepasarla, y el documento no se ha desplazado

#### Scenario: Arrastre corto
- **WHEN** la persona arrastra lentamente 200 px y suelta
- **THEN** la escena actual vuelve a ocupar el viewport

#### Scenario: Última escena
- **WHEN** la persona hace swipe hacia arriba estando en la última escena
- **THEN** nada se mueve y la flecha de scroll apunta hacia arriba

#### Scenario: Sin trabajo por frame
- **WHEN** se instrumenta `/` a 390×844 con un gesto de swipe y se cuentan los callbacks de `requestAnimationFrame` y `scroll` del sitio
- **THEN** son 0 durante el gesto, el aterrizaje y el reposo
