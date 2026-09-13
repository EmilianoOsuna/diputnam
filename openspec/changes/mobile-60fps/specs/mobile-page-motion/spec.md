## MODIFIED Requirements

### Requirement: Animación de entrada del hero en móvil en todas las páginas interiores

Al cargar `/putnam/`, `/eredita/`, `/unete/`, `/contacto/` y `/noticias/` en un viewport móvil sin `prefers-reduced-motion`, el kicker, el título y el texto principal del hero SHALL animarse en entrada (aparición con desplazamiento sutil y escalonado) con el mismo lenguaje que en desktop. Ninguna página SHALL mostrar el hero estático de inicio mientras las demás lo animan. En móvil la animación de entrada SHALL ejecutarse sin descargar ninguna librería de animación y SHALL animar únicamente `opacity` y `transform`; el hero SHALL quedar visible aunque el script de la página no llegue a ejecutarse.

#### Scenario: Hero de Putnam en móvil
- **WHEN** `/putnam/` se carga a 390 px
- **THEN** el kicker, el título "Una visión. Todo el proceso." y el lead aparecen con la animación de entrada escalonada, terminando completamente visibles en menos de 1.5 s

#### Scenario: Paridad entre páginas
- **WHEN** se comparan las cargas móviles de las cinco páginas interiores
- **THEN** todas ejecutan una animación de entrada equivalente en su hero

#### Scenario: Entrada sin librería
- **WHEN** se carga cualquiera de las cinco páginas interiores a 390 px y se inspeccionan las peticiones de scripts
- **THEN** no se solicita ningún módulo de animación ni de smooth scroll y el hero completa su entrada igualmente

### Requirement: Reveals por scroll en móvil

Los grupos de contenido marcados para revelarse SHALL animarse al entrar en el viewport en móvil, igual que en desktop, y el contenido SHALL quedar totalmente visible una vez revelado. El desplazamiento de la página en móvil SHALL seguir siendo el nativo del navegador (sin smooth scroll por software). Los reveals SHALL dispararse por observación de intersección y transiciones declarativas, sin ejecutar código propio en cada frame ni en cada evento de scroll. La barra de progreso de Proceso en `/putnam/` SHALL avanzar ligada al scroll desde el compositor, con el mismo mecanismo de degradación que el resto del movimiento.

#### Scenario: Grupos de Putnam en móvil
- **WHEN** la persona se desplaza por `/putnam/` en móvil hasta Principios, Diferencias y CTA
- **THEN** cada grupo aparece con su reveal al entrar en pantalla

#### Scenario: Scroll nativo
- **WHEN** la persona se desplaza en móvil por cualquier página interior
- **THEN** el desplazamiento responde con la inercia nativa del dispositivo

#### Scenario: Reveal sin trabajo por frame
- **WHEN** se instrumenta `/putnam/` a 390 px y se realiza un gesto de scroll continuo que revela Principios
- **THEN** el grupo se revela y el sitio no ejecuta ningún callback de `requestAnimationFrame` ni manejador de `scroll` del documento durante el gesto

#### Scenario: Rail de Proceso ligado al scroll
- **WHEN** la persona recorre los marcadores de Proceso en `/putnam/` a 390 px
- **THEN** la barra de progreso avanza en el mismo frame que el scroll, el contador pasa de `01` a `06` y al final la barra llega a `scaleX(1)`
