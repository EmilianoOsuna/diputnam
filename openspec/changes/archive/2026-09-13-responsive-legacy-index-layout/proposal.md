## Why

El `index.html` legado declara viewport, pero su layout principal sigue suponiendo una pantalla amplia: mantiene una sidebar fija, offsets permanentes y varias retículas que pueden comprimir o cortar contenido en móviles. Conviene dejar definido un comportamiento responsive verificable antes de decidir si este HTML se conserva como fallback o se retira durante la migración a Astro.

## What Changes

- Adaptar la navegación lateral del HTML legado a una presentación usable en pantallas estrechas, sin conservar offsets que reduzcan el ancho de lectura.
- Recomponer grids, bloques de contacto y acciones para una columna cuando sea necesario, con áreas táctiles y tipografía legibles desde 320 px.
- Sustituir dependencias exclusivas de `:hover` por estados y acciones comprensibles mediante toque y teclado.
- Revisar alturas `100vh`, `overflow: hidden` y unidades del viewport para evitar recortes y scroll atrapado en navegadores móviles.
- Reducir el coste de carga de imágenes embebidas o, si el archivo deja de ser entrypoint, documentar su retirada segura como parte de la migración.
- Mantener intacto el comportamiento desktop y verificar que el layout no produzca desbordamiento horizontal.

## Capabilities

### New Capabilities

### Modified Capabilities

- `home-ui`: definir la composición responsive, navegación, interacción táctil y comportamiento de viewport del HTML legado mientras siga formando parte del proyecto.

## Impact

- `index.html`: estilos embebidos, navegación, grids, tarjetas, páginas internas y control de scroll.
- `openspec/specs/home-ui/spec.md`: delta de comportamiento responsive y accesible.
- Pruebas visuales/funcionales de la home en viewports mobile y desktop.
- No se requieren nuevas dependencias, APIs ni cambios de backend.
