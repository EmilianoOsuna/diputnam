## MODIFIED Requirements

### Requirement: Texto central persistente
La home SHALL mantener únicamente el título enlazable de la escena activa anclado alrededor del centro del viewport durante el recorrido. El título SHALL permanecer disponible como navegación a su sección correspondiente y no SHALL estar acompañado por descripción, eyebrow o acción textual secundaria.

#### Scenario: Copy durante el scroll
- **WHEN** una persona desplaza la home entre dos escenas
- **THEN** el título activo permanece centrado mientras el barrido ocurre y el copy auxiliar no aparece

#### Scenario: Título enlazable
- **WHEN** una persona enfoca o selecciona el título central
- **THEN** el enlace expone un destino de sección válido y mantiene un estado focus visible

### Requirement: Verificación del recorrido completo
La implementación SHALL verificarse con Playwright en desktop y mobile, cubriendo el estado inicial, títulos enlazables, el barrido en progreso, la flecha en estado de avance y de regreso, el cambio de dirección al final, el regreso al inicio, refresh, movimiento reducido y ausencia de overflow horizontal.

#### Scenario: Aceptación visual y funcional
- **WHEN** se ejecutan las capturas y aserciones del recorrido completo
- **THEN** existe evidencia de que el copy está limitado al título enlazable, la flecha cambia de dirección al final, el hero se restaura al inicio, no hay errores de consola y no existe overflow horizontal
