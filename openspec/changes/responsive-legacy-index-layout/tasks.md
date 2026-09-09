## 1. Diagnóstico y alcance

- [x] 1.1 Confirmar el entrypoint de `index.html` frente a `src/pages/index.astro` y documentar qué rutas lo sirven.
- [x] 1.2 Inventariar sidebar, offsets, grids, alturas, overflow, estados hover e imágenes embebidas con sus viewports afectados.

## 2. Responsive y accesibilidad

- [x] 2.1 Implementar la navegación mobile del legado o retirar sidebar/offsets según el entrypoint confirmado, manteniendo foco y enlaces sin duplicados.
- [x] 2.2 Recomponer grids y bloques de contacto desde 320 px, con áreas táctiles, contraste y tipografía legibles.
- [x] 2.3 Hacer disponibles por foco/toque las acciones actualmente dependientes de `:hover`.
- [x] 2.4 Sustituir alturas/overflow problemáticos por un flujo alcanzable y adaptar el cambio de orientación y unidades de viewport.

## 3. Rendimiento y verificación

- [x] 3.1 Medir el peso de las imágenes base64 y optimizarlas o dejar documentada su no-servición, sin alterar apariencia aprobada.
- [ ] 3.2 Ejecutar build y pruebas existentes, más comprobaciones de overflow horizontal, navegación por teclado y toque.
- [ ] 3.3 Revisar capturas en 320 px, mobile alto/bajo, tablet y desktop; comprobar movimiento reducido y ausencia de overlay/scroll residual.
