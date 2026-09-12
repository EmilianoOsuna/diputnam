## Purpose

Asegurar que las páginas interiores ofrezcan en móvil la misma animación de entrada del hero y los mismos reveals por scroll que en desktop, sin comprometer la fluidez del scroll nativo ni la accesibilidad.

## ADDED Requirements

### Requirement: Animación de entrada del hero en móvil en todas las páginas interiores

Al cargar `/putnam/`, `/eredita/`, `/unete/`, `/contacto/` y `/noticias/` en un viewport móvil sin `prefers-reduced-motion`, el kicker, el título y el texto principal del hero SHALL animarse en entrada (aparición con desplazamiento sutil y escalonado) con el mismo lenguaje que en desktop. Ninguna página SHALL mostrar el hero estático de inicio mientras las demás lo animan.

#### Scenario: Hero de Putnam en móvil
- **WHEN** `/putnam/` se carga a 390 px
- **THEN** el kicker, el título "Una visión. Todo el proceso." y el lead aparecen con la animación de entrada escalonada, terminando completamente visibles en menos de 1.5 s

#### Scenario: Paridad entre páginas
- **WHEN** se comparan las cargas móviles de las cinco páginas interiores
- **THEN** todas ejecutan una animación de entrada equivalente en su hero

### Requirement: Reveals por scroll en móvil

Los grupos de contenido marcados para revelarse SHALL animarse al entrar en el viewport en móvil, igual que en desktop, y el contenido SHALL quedar totalmente visible una vez revelado. El desplazamiento de la página en móvil SHALL seguir siendo el nativo del navegador (sin smooth scroll por software).

#### Scenario: Grupos de Putnam en móvil
- **WHEN** la persona se desplaza por `/putnam/` en móvil hasta Principios, Diferencias y CTA
- **THEN** cada grupo aparece con su reveal al entrar en pantalla

#### Scenario: Scroll nativo
- **WHEN** la persona se desplaza en móvil por cualquier página interior
- **THEN** el desplazamiento responde con la inercia nativa del dispositivo

### Requirement: Degradación con movimiento reducido y sin JavaScript

Con `prefers-reduced-motion: reduce` o sin JavaScript, todo el contenido del hero y de los grupos revelables SHALL ser visible desde el primer render, sin depender de la animación.

#### Scenario: Movimiento reducido en Putnam
- **WHEN** `/putnam/` se abre en móvil con `prefers-reduced-motion: reduce`
- **THEN** el hero y todos los grupos están visibles sin animación y la sección Proceso conserva su contador y su barra de progreso

#### Scenario: Sin JavaScript
- **WHEN** `/putnam/` se abre con JavaScript deshabilitado
- **THEN** ningún contenido queda oculto por estados iniciales de animación
