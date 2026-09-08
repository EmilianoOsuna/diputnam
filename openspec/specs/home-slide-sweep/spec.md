# home-slide-sweep Specification

## Purpose

Definir una transición de escenas donde la imagen tenga protagonismo físico sobre el texto central, reproduciendo el barrido vertical de la referencia y manteniendo el hero estable al regresar al inicio.

## Requirements

### Requirement: Texto central persistente

La home SHALL mantener únicamente el título enlazable de la escena activa anclado alrededor del centro del viewport durante el recorrido. El título SHALL permanecer disponible como navegación a su sección correspondiente y no SHALL estar acompañado por descripción, eyebrow o acción textual secundaria. El copy no SHALL desplazarse verticalmente como un bloque normal para provocar el cambio de escena.

#### Scenario: Copy durante el scroll

- **WHEN** una persona desplaza la home entre dos escenas
- **THEN** el título activo permanece centrado mientras el barrido ocurre y el copy auxiliar no aparece

#### Scenario: Título enlazable

- **WHEN** una persona enfoca o selecciona el título central
- **THEN** el enlace expone un destino de sección válido y mantiene un estado focus visible

### Requirement: Barrido vertical de imagen sobre el copy

La imagen entrante SHALL subir desde el borde inferior del viewport y cubrir progresivamente la imagen saliente y el copy central hasta ocupar toda la escena. El cambio SHALL ser perceptible como una cubierta continua y no como un fade independiente de imagen y texto.

#### Scenario: Avance de escena

- **WHEN** una persona hace scroll hacia la siguiente escena
- **THEN** se observa el borde de la imagen entrante avanzando de abajo hacia arriba, cruzando el área del título y reemplazando la escena anterior sin un simple fundido

#### Scenario: Retroceso de escena

- **WHEN** una persona hace scroll hacia arriba
- **THEN** la imagen anterior deshace el barrido desde arriba hacia abajo y el copy de la escena anterior reaparece en el mismo centro, sin saltos ni estados intermedios corruptos

### Requirement: Estado inicial determinista

La home SHALL restablecer de forma determinista la primera escena cuando el scroll está en el inicio del documento. La primera imagen, el primer copy y el índice inicial SHALL permanecer visibles después de cualquier recorrido previo, retorno por navegación o refresh en `#inicio`.

#### Scenario: Regreso manual al tope

- **WHEN** una persona avanza varias escenas y después vuelve a `scrollY = 0`
- **THEN** la primera imagen y su copy aparecen completos, el índice activo vuelve a `01` y ninguna capa de escena queda oculta por un `clip-path` residual

#### Scenario: Recarga en el inicio

- **WHEN** la home se recarga con el viewport en el inicio
- **THEN** el hero se muestra desde su estado base antes de cualquier interacción, sin depender de que un callback de una transición anterior se ejecute

### Requirement: Contenido accesible durante la transición

La home SHALL conservar un estado estable para movimiento reducido, JavaScript no disponible y viewports mobile. El contenido completo SHALL seguir disponible y el barrido SHALL poder omitirse sin ocultar títulos, acciones o imágenes.

#### Scenario: Movimiento reducido o fallback

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` o la mejora de scroll no se inicializa
- **THEN** las escenas se muestran en flujo normal, con todos sus textos y acciones accesibles, sin depender del barrido

#### Scenario: Pantalla mobile

- **WHEN** la transición se inspecciona en un viewport mobile
- **THEN** el borde de la imagen sigue siendo visible, el copy no queda cortado por el barrido y la navegación permanece utilizable

### Requirement: Verificación del recorrido completo

La implementación SHALL verificarse con Playwright en desktop y mobile, cubriendo el estado inicial, títulos enlazables, el barrido en progreso, la flecha en estado de avance y de regreso, el cambio de dirección al final, el regreso al inicio, refresh, movimiento reducido y ausencia de overflow horizontal.

#### Scenario: Aceptación visual y funcional

- **WHEN** se ejecutan las capturas y aserciones del recorrido completo
- **THEN** existe evidencia de que la imagen cubre el copy, el hero se restaura al inicio, no hay errores de consola y no existe overflow horizontal
