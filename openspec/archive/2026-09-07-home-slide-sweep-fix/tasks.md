## 1. Estructura del stage

- [x] 1.1 Separar en `src/pages/index.astro` las capas de media y copy del stage, manteniendo una sola fuente de datos y verificando que la home siga renderizando los cuatro textos y sus acciones
- [x] 1.2 Añadir el estado base de la primera escena y el fallback sin mejora JS, verificando que todas las escenas sigan visibles y accesibles con movimiento reducido

## 2. Barrido visual

- [x] 2.1 Reemplazar el clip-path horizontal por una máscara vertical que inicie debajo del viewport y avance hacia arriba, verificando visualmente el borde cruzando el título en 25%, 50% y 75% de una transición
- [x] 2.2 Ordenar las capas para que la imagen entrante cubra realmente el copy saliente y el copy nuevo aparezca al finalizar el cruce, verificando que el resultado no sea un fade de texto independiente
- [x] 2.3 Sincronizar título, descripción, acciones e índice con el barrido, verificando que el copy permanezca centrado y que avanzar y retroceder sean reversibles

## 3. Estado y scroll

- [x] 3.1 Sustituir callbacks de escena dispersos por un progreso maestro de ScrollTrigger, verificando que solo exista una escena activa por vez y que `aria-hidden` siga ese estado
- [x] 3.2 Implementar reset explícito al inicializar, refrescar y volver a `scrollY = 0`, verificando que la primera imagen no conserve `opacity` o `clip-path` residual
- [x] 3.3 Mantener Lenis y actualizar mediciones después de cargar imágenes, verificando scroll continuo, anchors funcionales y ausencia de saltos al cambiar de escena

## 4. Responsive y aceptación

- [x] 4.1 Ajustar el barrido para mobile y conservar el fallback de `prefers-reduced-motion`, verificando que el copy no se corte y que no exista overflow horizontal
- [x] 4.2 Ejecutar `npm run build` y la revisión Playwright desktop/mobile con capturas de inicio, mitad, final, regreso al top y refresh, verificando errores de consola, hero restaurado y barrido visible
