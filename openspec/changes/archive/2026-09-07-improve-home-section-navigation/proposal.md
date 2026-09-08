## Why

La home todavía presenta demasiado copy auxiliar para una experiencia visual basada en escenas, y la señal de scroll incluye texto pequeño que compite con la composición. La navegación de secciones necesita ser más clara, legible y directa, especialmente en mobile.

## What Changes

- Convertir el título visible de cada escena en un hipervínculo hacia su sección correspondiente.
- Reducir cada título a un máximo de dos renglones y retirar el eyebrow, la descripción y los enlaces secundarios visibles de las escenas.
- Reemplazar la señal textual de scroll por una flecha minimalista animada fija en la esquina inferior derecha.
- Cambiar la flecha para indicar scroll hacia arriba al llegar al final, con un giro sutil y accesible.
- Aumentar ligeramente el tamaño y la legibilidad de los textos del navbar y del bloque de contacto.
- Mantener navegación por teclado, etiquetas accesibles y soporte para `prefers-reduced-motion`.

## Capabilities

### New Capabilities

### Modified Capabilities

- `home-ui`: Actualizar la jerarquía de copy, la navegación por títulos, la señal direccional de scroll y la legibilidad de navegación/contacto.
- `home-ui-motion-readability`: Definir el estado y la animación de la flecha, incluyendo el cambio de dirección al final y el comportamiento con movimiento reducido.
- `home-slide-sweep`: Mantener el recorrido de escenas compatible con títulos enlazables y el estado inicial/final del control de scroll.

## Impact

- `src/pages/index.astro`: estructura de títulos, enlaces y control de scroll.
- `src/data/home.ts`: copy corto de los títulos de escena.
- `src/scripts/motion.ts`: estado de dirección, navegación del control y transición de giro.
- `src/styles/global.css`: tipografía, eliminación de texto auxiliar, flecha, estados responsive y accesibilidad visual.
- `tests/home-sweep.mjs`: aserciones del nuevo contenido y del control de scroll.
- No se requieren nuevas dependencias ni cambios de API.
