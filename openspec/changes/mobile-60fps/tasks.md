## 1. Baseline y observabilidad

- [ ] 1.1 Definir una matriz de rutas, viewport móviles y dispositivos/CPU throttling, y verificar que cada caso tenga una captura Performance comparable.
- [ ] 1.2 Medir baseline de FPS/frame pacing, long tasks, eventos de layout y áreas de paint durante scroll, transición, menú móvil y reduced motion; verificar que las métricas queden registradas para comparación.

## 2. Actualizaciones de movimiento

- [ ] 2.1 Auditar `motion.ts`, `eredita-motion.ts`, `putnam-motion.ts` y `menu.ts` para separar lecturas geométricas de escrituras visuales; verificar mediante Performance que no haya forced synchronous layout recurrente.
- [x] 2.2 Consolidar eventos de scroll/Lenis/ScrollTrigger y actualización del scroll cue en una cola por frame, preservando estados y navegación; verificar con pruebas existentes y conteo de callbacks por frame.
- [ ] 2.3 Cachear geometría y recalcularla solo en resize/orientación o cambios de viewport; verificar que las escenas sigan alineadas en scroll inicial, intermedio y final.

## 3. CSS y composición

- [ ] 3.1 Revisar capas animadas de `global.css`, `eredita.css` y `putnam.css` para limitar `will-change` a elementos activos/próximos a animarse; verificar capas y memoria en DevTools.
- [ ] 3.2 Convertir cualquier animación costosa identificada en baseline a `transform`/`opacity` o ajustar su estrategia de pintura sin alterar el diseño; verificar reducción de paint/layout en la misma matriz.
- [ ] 3.3 Mantener fallbacks de móvil, reduced motion y ausencia de overflow horizontal; verificar menú, scroll cue, contenido visible y navegación con `prefers-reduced-motion: reduce`.

## 4. Validación

- [ ] 4.1 Ejecutar `npm test` (o el comando de pruebas configurado) y verificar que no haya regresiones funcionales.
- [ ] 4.2 Repetir las mediciones en móvil y desktop, comparar contra baseline y verificar cadencia estable cercana a 60 fps sin long tasks recurrentes durante las interacciones objetivo.
- [x] 4.3 Documentar resultados, dispositivo/viewport y cualquier degradación aceptada; verificar que el informe excluya explícitamente la barra de gestos del celular (“café”) del alcance.
