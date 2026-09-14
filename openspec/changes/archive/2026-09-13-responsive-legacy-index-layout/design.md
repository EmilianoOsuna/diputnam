## Context

`index.html` es un documento legado autónomo con estilos embebidos, varias páginas SPA, una sidebar fija de `10.5rem`, contenidos con `margin-left` equivalente y múltiples grids. Tiene breakpoints parciales en `991px` y `767px`, pero no una estrategia común para la navegación, las alturas de viewport, el touch ni el coste de sus imágenes base64. La app Astro actual vive en `src/` y ya tiene cambios OpenSpec separados para su menú mobile y su página institucional.

## Goals / Non-Goals

**Goals:**

- Establecer una sola estrategia responsive para el HTML legado, con un ancho de lectura completo en mobile.
- Hacer visibles y activables por toque/teclado navegación, tarjetas, CTA y contacto.
- Evitar recortes por `100vh`, contenedores con overflow y cambios de orientación.
- Medir visual y funcionalmente 320 px, un mobile alto/bajo y desktop.

**Non-Goals:**

- No rediseñar la home Astro ni duplicar el menú ya definido en `responsive-mobile-fullscreen-menu`.
- No migrar en esta propuesta el contenido del HTML a componentes Astro.
- No cambiar copy, identidad visual, destinos de enlaces ni introducir dependencias.

## Decisions

- **Breakpoint y composición:** conservar `767px` como frontera principal del legado y aplicar una composición de una columna a grids que no puedan sostener dos items legibles. Se descarta reducir todo por escala porque preserva el ancho útil y la lectura.
- **Navegación:** en mobile se usará un patrón de control/panel coherente con la navegación vigente del proyecto; si el legado deja de servirse antes de implementar, la tarea equivalente será retirar sidebar y offsets verificando que no queden referencias. Se descarta mantener la sidebar fija porque consume una fracción crítica del viewport.
- **Viewport y scroll:** reemplazar alturas rígidas solo donde impidan alcanzar contenido, priorizando `min-height` y unidades `svh/dvh` con fallback. El scroll seguirá perteneciendo al contenedor visible de la página; no se añadirá scroll-jacking.
- **Interacción:** conservar hover como mejora desktop, pero hacer que el destino y el contexto de cada tarjeta estén disponibles por foco y toque. Se descarta simular hover permanente, que deja estados pegados en touch.
- **Rendimiento de imágenes:** reservar dimensiones y convertir las imágenes grandes embebidas a assets locales optimizados solo si el documento continúa en uso; si es fallback no servido, registrar su retirada en la migración. No se cambiarán archivos binarios sin medición.
- **Verificación:** usar inspección automatizada de overflow/rectángulos y pruebas de interacción existentes, junto con capturas comparables. La validación se separará de la home Astro para evitar confundir regresiones.

## Risks / Trade-offs

- [El legado puede no ser una ruta servida actualmente] → confirmar su entrypoint durante implementación y limitar cambios al fallback si corresponde.
- [Un panel mobile puede duplicar enlaces] → conservar una única fuente de enlaces o verificar ausencia de duplicados en el DOM renderizado.
- [Cambiar overflow puede exponer animaciones antiguas] → probar cada página SPA y mantener recortes solo en elementos visuales internos.
- [Optimizar base64 puede alterar la apariencia] → comparar dimensiones, compresión y capturas antes de sustituir assets.

## Migration Plan

1. Confirmar si `index.html` se sirve directamente o funciona como referencia/fallback.
2. Aplicar la estrategia responsive solo al entrypoint confirmado y ejecutar pruebas mobile/desktop.
3. Comparar contra la home Astro y mantener sus cambios OpenSpec separados.
4. Si el legado no se sirve, retirar o aislarlo en una propuesta posterior, con enlaces y pruebas actualizados.
