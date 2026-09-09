## Why

En móvil, la página de Putnam todavía muestra un hero trabado al refrescar y durante el primer desplazamiento. La propuesta anterior era demasiado transversal: podía mejorar callbacks o estilos en varias rutas sin demostrar que el hero de `/putnam` —su imagen, overlays y arranque de Lenis/GSAP— hubiera mejorado realmente. El indicador visible tipo “café” pertenece a la barra de gestos del celular y queda fuera del sitio y fuera de este change.

## What Changes

- Medir primero `/putnam` en carga inicial, refresco y scroll del hero con DevTools/Performance y dispositivos representativos; usar las demás rutas como regresión.
- Corregir el trabajo que ocurre durante el arranque del hero: carga/decodificación de la imagen, inicialización de Lenis/GSAP y animaciones de entrada.
- Reducir repintados y trabajo de layout durante scroll, transiciones y apertura del menú móvil.
- Consolidar animaciones en propiedades compositoras (`transform` y `opacity`) y aplicar `will-change` de forma acotada a elementos realmente animados.
- Evitar lecturas y escrituras DOM intercaladas (layout thrashing), actualizando indicadores y estilos en lotes sincronizados con `requestAnimationFrame`.
- Definir degradaciones seguras para móvil y `prefers-reduced-motion`, preservando contenido, navegación y accesibilidad.
- Validar que el cambio no introduzca overflow horizontal ni regresiones visuales en desktop.

## Capabilities

### New Capabilities

- `mobile-rendering-performance`: Requisitos de fluidez, medición y comportamiento degradado para la experiencia móvil a 60 fps.

### Modified Capabilities

<!-- No se modifican requisitos existentes; la optimización se encapsula como una capacidad nueva. -->

## Impact

- Scripts de movimiento y scroll en `src/scripts/` (`motion.ts`, `eredita-motion.ts`, `putnam-motion.ts`, `menu.ts`).
- CSS global y específico de las páginas en `src/styles/`, incluyendo capas animadas, parallax, menú móvil y scroll cue.
- Pruebas de interacción/rendimiento móvil y configuración de build, sin añadir APIs públicas ni dependencias obligatorias. El criterio primario de aceptación será Putnam; cualquier ajuste compartido deberá conservar la experiencia de inicio y menú.
