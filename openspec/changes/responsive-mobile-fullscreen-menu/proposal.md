## Why

En mobile, la navegación actual usa el texto “menu” y abre un dropdown pequeño que no corresponde con el lenguaje editorial de la referencia visual ni ofrece una superficie cómoda para explorar el sitio. Se necesita un patrón claro, táctil y consistente con la pantalla de menú compartida: apertura full-screen con fondo visual, navegación amplia y cierre explícito.

## What Changes

- Reemplazar el control textual mobile por un ícono minimalista de tres líneas.
- Convertir la navegación mobile en una vista full-screen del viewport, manteniendo el estilo visual de Putnam y la referencia proporcionada.
- Mostrar los enlaces principales en una composición editorial vertical con email y datos de contacto en la parte inferior.
- Cambiar el ícono a estado de cierre al abrir y permitir cerrar el menú desde el mismo control.
- Mantener la navegación desktop sin cambios.
- Mantener accesibilidad de teclado, foco, etiquetas ARIA, cierre con `Escape` y soporte para `prefers-reduced-motion`.

## Capabilities

### New Capabilities

<!-- No se introduce una capacidad independiente; el menú forma parte de la navegación responsive existente. -->

### Modified Capabilities

- `home-ui`: modificar los requisitos de navegación responsive para definir el menú mobile full-screen, sus estados y su accesibilidad.

## Impact

- `src/pages/index.astro`: marcado del botón mobile y estructura de navegación/contacto reutilizable.
- `src/styles/global.css`: estilos, capas, estados y responsive del menú; se elimina el dropdown actual.
- `src/scripts/motion.ts`: apertura/cierre, bloqueo del scroll, foco y cierre con teclado.
- No se requieren nuevas dependencias ni cambios de API.
