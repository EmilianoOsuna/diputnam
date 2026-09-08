## Purpose

Define una home de Putnam que traduzca con alta fidelidad la experiencia visual de DSGN Interior, conservando la identidad de Putnam y dejando una base verificable para añadir el resto del sitio por cambios posteriores.

## ADDED Requirements

### Requirement: Home visualmente fiel a la referencia
La home SHALL reproducir visualmente la referencia `https://dsgninterior.se/en` como fuente de verdad para composición, jerarquía, proporciones, espaciado, tipografía, tratamientos de imagen, navegación, estados hover y ritmo de interacción. La adaptación SHALL cambiar únicamente la marca, colores, logo, textos e imágenes necesarios para representar a Putnam.

#### Scenario: Comparación visual en desktop
- **WHEN** la home de Putnam y la referencia se inspeccionan en un viewport desktop equivalente
- **THEN** el hero, la navegación, la retícula principal, la escala tipográfica y la distribución de espacios conservan el mismo lenguaje visual y comportamiento observable, adaptados al contenido de Putnam

#### Scenario: Comparación visual en mobile
- **WHEN** ambas experiencias se inspeccionan en un viewport mobile equivalente
- **THEN** la home mantiene la misma intención de composición, jerarquía y ritmo de la referencia sin desbordamientos, texto ilegible ni controles inaccesibles

### Requirement: Hero de Putnam
La home SHALL presentar un hero como primera señal de la marca, usando el logo de Putnam, una declaración principal basada en el contenido existente y una composición equivalente a la referencia en escala, alineación, contraste y presencia visual.

#### Scenario: Primera carga
- **WHEN** una persona visita `/` desde el inicio
- **THEN** el hero aparece completo, identifica a Putnam y deja visible una señal clara del siguiente contenido para invitar al scroll

### Requirement: Contenido inicial de la home
La home SHALL mostrar únicamente contenido representativo del MVP: introducción de Putnam, proyecto destacado Ereditá, una vista previa del portafolio y un cierre de contacto. El contenido SHALL usar datos locales intercambiables por Sanity en una fase posterior.

#### Scenario: Contenido disponible
- **WHEN** la home termina de cargar
- **THEN** el contenido principal de Putnam y Ereditá se presenta dentro de la composición visual aprobada, sin depender de páginas internas todavía inexistentes

### Requirement: Animación y scroll
La home SHALL reproducir el ritmo de movimiento de la referencia en transiciones de entrada, reveals, desplazamiento de imágenes, hover y cambios ligados al scroll, manteniendo continuidad entre secciones y evitando movimientos decorativos que no aporten a la composición.

#### Scenario: Recorrido normal
- **WHEN** una persona recorre la home con scroll vertical
- **THEN** las secciones y elementos visuales entran, salen o se transforman con transiciones suaves, coherentes y sincronizadas con el desplazamiento

#### Scenario: Interacción con elementos visuales
- **WHEN** una persona pasa el cursor sobre una navegación, enlace o pieza de proyecto
- **THEN** el estado interactivo conserva la respuesta visual equivalente a la referencia y sigue siendo comprensible sin depender exclusivamente del color

### Requirement: Experiencia responsive y movimiento reducido
La home SHALL mantener la composición y la navegación utilizables en desktop y mobile. SHALL respetar `prefers-reduced-motion`, desactivando o reduciendo el movimiento sin ocultar contenido ni romper el flujo.

#### Scenario: Movimiento reducido
- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** la home muestra todo el contenido con transiciones mínimas o nulas y conserva navegación, contraste y orden de lectura

#### Scenario: Pantalla estrecha
- **WHEN** la home se abre en una pantalla mobile
- **THEN** ningún texto, imagen, control o sección se corta horizontalmente y el layout se adapta sin requerir gestos no evidentes

### Requirement: Verificación contra la referencia
La implementación SHALL verificarse con Playwright mediante capturas y revisión de interacción de la referencia y de Putnam en al menos un viewport desktop y uno mobile. La validación SHALL cubrir como mínimo hero, layout, tipografía, scroll, hover, animaciones y ausencia de errores visibles.

#### Scenario: Revisión de aceptación
- **WHEN** se ejecutan las verificaciones visuales y funcionales del MVP
- **THEN** existen capturas comparables y evidencia de que el hero, el layout y las animaciones cumplen la fidelidad visual definida antes de considerar aprobada la fase
