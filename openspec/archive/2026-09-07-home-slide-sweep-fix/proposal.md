## Why

La home ya tiene un fade elegante, pero todavía no reproduce el gesto visual principal de dsgn: el texto permanece en el centro y la imagen de la siguiente escena sube para barrerlo. Además, al regresar al tope del documento la sincronización actual puede dejar la primera imagen oculta, rompiendo el hero.

## What Changes

- Convertir el texto central en una capa sticky persistente, independiente de las capas de imagen.
- Cambiar el crossfade actual por un barrido vertical: la imagen entrante sube desde abajo, cubre progresivamente el texto y termina ocupando toda la escena.
- Sincronizar el reemplazo del título, descripción y metadatos con el progreso del barrido, manteniendo la lectura centrada durante la transición.
- Hacer que el estado inicial y el retorno a `scrollY = 0` restablezcan siempre la primera imagen, su texto y su índice activo.
- Mantener Lenis, GSAP, el contenido local, el logo, los colores y el alcance exclusivo de la home.
- Verificar avance, retroceso, retorno al inicio, mobile, movimiento reducido y ausencia de errores con Playwright.

## Capabilities

### New Capabilities

- `home-slide-sweep`: transición vertical de escenas con texto central persistente y recuperación determinista del hero.

### Modified Capabilities

- Ninguna. Las capacidades anteriores pertenecen a cambios aún no archivados; esta spec documenta el comportamiento adicional sin editar sus artefactos.

## Impact

- Afecta únicamente `src/pages/index.astro`, `src/scripts/motion.ts` y `src/styles/global.css`.
- Reutiliza GSAP, ScrollTrigger y Lenis ya instalados; no requiere dependencias nuevas ni Sanity.
- Cambia el mecanismo observable de transición de la home, pero conserva navegación, contenido, identidad visual y fallback de accesibilidad.
