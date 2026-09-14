## Context

La home ya tiene un `site-nav` desktop, un botón `menu-toggle` y una clase `.site-nav.is-open` que crea un dropdown mobile. El comportamiento se controla desde `src/scripts/motion.ts`; los estilos responsive viven en `src/styles/global.css`. La home usa Lenis/GSAP cuando el movimiento no está reducido, por lo que el menú debe seguir funcionando fuera de esa rama y no agregar dependencias.

## Goals / Non-Goals

**Goals:**

- Convertir el patrón mobile existente en un overlay full-screen coherente con la referencia visual.
- Mantener un único control de apertura/cierre, navegación por teclado, foco visible y estado ARIA correcto.
- Evitar scroll subyacente mientras el overlay esté abierto y restaurarlo en todos los cierres y cambios de breakpoint.
- Preservar intacta la navegación desktop.

**Non-Goals:**

- No crear nuevas rutas, páginas ni un sistema de navegación para desktop.
- No agregar una librería de menú, focus trap o modal.
- No rediseñar imágenes, tipografía o contenido de la home fuera de lo necesario para el overlay.

## Decisions

- **Overlay full-screen en mobile.** Se usará una capa fija que cubra el viewport y se mostrará con el mismo fondo visual del sitio, una ligera capa de contraste y la composición editorial de la referencia. Se elige sobre un dropdown porque da más área táctil, evita que el menú compita con el hero y coincide con la imagen proporcionada.
- **Marcado semántico dentro del header.** La navegación y sus datos de contacto se mantendrán en HTML accesible, con enlaces reales y un botón único. Se evitará duplicar una segunda navegación para no crear estados divergentes.
- **Estado mínimo en TypeScript.** El script alternará una clase en el header/body, actualizará `aria-expanded` y `aria-label`, guardará el elemento que abrió el menú, bloqueará `document.body` y manejará `Escape`, foco inicial y restauración de foco. El control nativo de foco será suficiente para este menú acotado; no se agregará una dependencia de focus trap.
- **CSS para el ícono y la transición.** Las tres líneas serán spans decorativos y el estado abierto se convertirá visualmente en una “X” mediante CSS. La transición será opcional y respetará `prefers-reduced-motion`; la legibilidad y el estado ARIA no dependerán de ella.
- **Breakpoint existente.** Se conservará `max-width: 767px` como frontera responsive para limitar el alcance del cambio al comportamiento mobile ya definido.
- **Paneles móviles con texto contracompensado.** Cada panel completo recorrerá `100vh` hacia arriba y conservará `overflow: hidden`. Su título se trasladará hacia abajo dentro del panel por la distancia inversa menos 60 px; así permanece cerca del centro visual, nunca sale de su imagen y entrega el relevo al siguiente título sobre el mismo borde horizontal.

## Risks / Trade-offs

- [El bloqueo de `body` puede modificar el ancho visible al aparecer/desaparecer la scrollbar] → usar solo `overflow: hidden` y verificar que no produzca salto perceptible en los viewports soportados.
- [Un enlace puede cambiar de breakpoint antes de ejecutar el cierre] → escuchar `resize` y limpiar clase, foco y bloqueo cuando el viewport pase a desktop.
- [El contacto inferior puede competir con pantallas muy bajas] → usar `min-height: 100svh`, padding seguro y un flujo interno que pueda desplazarse dentro del overlay.
