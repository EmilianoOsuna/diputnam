## Purpose

Esta capacidad define una experiencia móvil fluida y medible para las escenas animadas del sitio, manteniendo el contenido accesible mientras se reduce el trabajo de renderizado por frame.

## ADDED Requirements

### Requirement: Mobile motion SHALL target stable frame pacing
En viewport móvil, el desplazamiento y las transiciones del sitio SHALL priorizar una cadencia estable de hasta 60 fps, evitando trabajo innecesario de layout y pintura durante la interacción.

#### Scenario: Smooth mobile scroll
- **WHEN** una persona desplaza una página móvil con animaciones habilitadas
- **THEN** las escenas visibles se actualizan sin saltos perceptibles y el trabajo de cada frame no provoca long tasks recurrentes

#### Scenario: Animated layers remain compositor-friendly
- **WHEN** un elemento visual cambia durante scroll o una transición
- **THEN** el cambio se realiza mediante propiedades que no requieren recalcular el layout de sus hermanos y no genera repintados amplios evitables

### Requirement: Motion updates SHALL avoid forced synchronous layout
El sitio SHALL agrupar lecturas y escrituras relacionadas con geometría y estado visual, y SHALL evitar alternarlas repetidamente dentro del mismo ciclo de scroll o animación.

#### Scenario: Scroll-driven updates
- **WHEN** ocurren múltiples eventos de scroll antes del siguiente frame
- **THEN** se procesa como máximo una actualización visual por frame y no se fuerza una lectura de layout después de una escritura visual

### Requirement: Mobile fallback SHALL preserve usability
Si el dispositivo no puede sostener la animación o la persona solicita movimiento reducido, el sitio SHALL reducir o desactivar efectos costosos sin ocultar contenido ni romper navegación, menú o controles.

#### Scenario: Reduced motion
- **WHEN** `prefers-reduced-motion: reduce` está activo
- **THEN** parallax, transiciones no esenciales y animaciones continuas se desactivan o acortan, manteniendo estados finales y controles utilizables

#### Scenario: Narrow viewport regression check
- **WHEN** se prueba una ruta en un viewport móvil estrecho
- **THEN** no aparece overflow horizontal causado por la optimización y todo el contenido sigue siendo alcanzable
