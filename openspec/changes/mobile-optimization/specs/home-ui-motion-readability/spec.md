## ADDED Requirements

### Requirement: Una escena por swipe en móvil
En viewports menores de 768 px, un gesto de swipe vertical en la home SHALL avanzar exactamente una escena: durante el arrastre la escena sigue al dedo, y al soltar la página SHALL aterrizar en el inicio de la escena siguiente (o anterior) con una transición de 500 ms y curva `ease`, sin inercia, rebote ni saltos de más de una escena. Un flick rápido (< 300 ms) SHALL cambiar de escena siempre; un arrastre lento SHALL cambiar sólo si recorre al menos media pantalla y, si no, volver a la escena actual. En la primera y la última escena el arrastre en sentido contrario no SHALL producir rebote. El gesto no SHALL aplicarse con el menú abierto ni bloquear el zoom.

#### Scenario: Flick
- **WHEN** la persona hace un flick hacia arriba de menos de 300 ms sobre la escena 1 a 390 px
- **THEN** la página aterriza en el tope de la escena 2 en ~500 ms, sin sobrepasarla

#### Scenario: Arrastre corto
- **WHEN** la persona arrastra lentamente 200 px y suelta
- **THEN** la página vuelve al tope de la escena actual

#### Scenario: Última escena
- **WHEN** la persona hace swipe hacia arriba estando en la última escena
- **THEN** la página permanece en la última escena sin rebote
