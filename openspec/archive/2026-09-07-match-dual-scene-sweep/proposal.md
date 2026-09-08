## Why

El barrido actual no reproduce la composición de `dsgninterior.se/en`: durante la transición desaparece la imagen saliente, se expone el fondo café de la página y el título entrante aparece mediante un fade tardío. La home necesita conservar simultáneamente ambas escenas, divididas por el mismo borde móvil, para que imagen y título cambien como una sola composición continua.

## What Changes

- Mantener la escena saliente completa por encima del borde del barrido y revelar la escena entrante completa por debajo, sin mostrar fondos sólidos entre ambas.
- Recortar imagen, sombreado y copy de cada escena con máscaras complementarias controladas por el mismo progreso vertical.
- Mostrar simultáneamente los dos títulos durante el cruce, centrados en la misma posición y recortados por el borde de la imagen, sin crossfade independiente.
- Conservar el barrido reversible de abajo hacia arriba, el reset al inicio, el fallback sin JavaScript y la experiencia de movimiento reducido.
- Añadir aceptación visual con Playwright en estados intermedios para comparar la composición con la referencia.

## Capabilities

### New Capabilities

- `dual-scene-sweep`: Define la composición continua de dos escenas y el recorte sincronizado de sus imágenes y textos durante el barrido.

### Modified Capabilities

Ninguna. Los cambios anteriores aún no se han sincronizado con `openspec/specs/`.

## Impact

- Markup de escenas en `src/pages/index.astro`.
- Capas, máscaras y fallback en `src/styles/global.css`.
- Cálculo de progreso y estado accesible en `src/scripts/motion.ts`.
- Sin cambios de contenido, marca, rutas, Sanity ni dependencias.
