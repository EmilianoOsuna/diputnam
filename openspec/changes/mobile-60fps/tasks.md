## 1. Baseline y observabilidad

- [x] 1.1 Definir una matriz priorizada con `/putnam` (390x844 y un dispositivo/CPU móvil representativo), más `/` y `/eredita` como regresión; verificar que cada caso tenga una captura Performance comparable.
- [ ] 1.2 Medir baseline de `/putnam` tras hard refresh y durante el primer scroll del hero: frame pacing, long tasks, scripting, layout, paint, carga/decodificación de la imagen y tiempo hasta interacción; registrar las métricas para comparación.
- [x] 1.3 Añadir una prueba reproducible que visite `/putnam`, recoja frames/long tasks durante refresco y scroll, y documente umbrales de aceptación sin depender de la barra de gestos del sistema.

## 2. Actualizaciones de movimiento

- [ ] 2.1 Auditar primero `putnam-motion.ts` y después `motion.ts`, `eredita-motion.ts` y `menu.ts` para separar lecturas geométricas de escrituras visuales; verificar mediante Performance que no haya forced synchronous layout recurrente en el hero.
- [x] 2.2 Consolidar eventos de scroll/Lenis/ScrollTrigger y actualización del scroll cue en una cola por frame, preservando estados y navegación; verificar con pruebas existentes y conteo de callbacks por frame.
- [ ] 2.3 Cachear geometría y recalcularla solo en resize/orientación o cambios de viewport; verificar que Putnam siga alineado en scroll inicial, intermedio y final.

## 3. CSS y composición

- [ ] 3.1 Revisar primero la imagen/capas del hero en `putnam.css` y luego `global.css`/`eredita.css` para limitar `will-change` a elementos activos/próximos a animarse; verificar capas, memoria y área de paint en DevTools.
- [ ] 3.2 Convertir cualquier animación costosa identificada en baseline a `transform`/`opacity` o ajustar su estrategia de pintura sin alterar el diseño; verificar reducción de paint/layout en la misma matriz.
- [ ] 3.3 Mantener fallbacks de móvil, reduced motion y ausencia de overflow horizontal; verificar menú, scroll cue, contenido visible y navegación con `prefers-reduced-motion: reduce`.

## 4. Validación

- [ ] 4.1 Ejecutar `npm run test:sweep` y la prueba de rendimiento de `/putnam`; verificar que no haya regresiones funcionales.
- [ ] 4.2 Repetir las mediciones en Putnam móvil y desktop, comparar contra baseline y verificar cadencia estable cercana a 60 fps sin long tasks recurrentes durante refresco y scroll del hero.
- [x] 4.3 Documentar resultados, dispositivo/viewport y cualquier degradación aceptada; verificar que el informe excluya explícitamente la barra de gestos del celular (“café”) del alcance.
