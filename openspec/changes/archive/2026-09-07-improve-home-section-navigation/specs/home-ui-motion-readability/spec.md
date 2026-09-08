## MODIFIED Requirements

### Requirement: Movimiento premium y controlado
La home SHALL conservar el movimiento continuo del stage y añadir una flecha minimalista fija en la esquina inferior derecha como única señal visual de scroll. Mientras exista contenido por recorrer, la flecha SHALL apuntar hacia abajo y tener una animación sutil; cuando la persona llegue al final del documento, SHALL apuntar hacia arriba mediante un giro sutil. El control SHALL seguir siendo comprensible, no bloquear la navegación y respetar `prefers-reduced-motion`.

#### Scenario: Señal de avance
- **WHEN** la persona se encuentra antes del final de la home
- **THEN** observa una flecha sin texto en la esquina inferior derecha apuntando hacia abajo con movimiento sutil

#### Scenario: Señal de regreso
- **WHEN** la persona llega al final de la home
- **THEN** la flecha gira sutilmente para apuntar hacia arriba y activa el desplazamiento hacia el inicio al seleccionarla

#### Scenario: Movimiento reducido
- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** la flecha conserva su dirección y función, pero no ejecuta animaciones continuas ni un giro animado

#### Scenario: Recorrido normal en desktop
- **WHEN** una persona recorre la home a velocidad normal
- **THEN** el movimiento de scroll, las imágenes, los títulos y la flecha se perciben sincronizados y fluidos, sin quedarse estáticos entre escenas ni saltar de estado

#### Scenario: Hover y navegación
- **WHEN** una persona pasa el cursor sobre enlaces, navegación o controles del menú
- **THEN** el estado responde con una transición breve y clara, consistente con el lenguaje visual del stage
