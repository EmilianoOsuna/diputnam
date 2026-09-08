## 1. Estructura de escenas

- [x] 1.1 Reagrupar cada entrada de `homePanels` como una escena completa con imagen, sombreado y copy en `index.astro`; verificar que el HTML renderizado conserva una sola instancia editorial y el orden actual.
- [x] 1.2 Retirar `media-stage`, `copy-stage` y la imagen proxy de `sweep-stage`; verificar con búsqueda que no quedan selectores ni atributos huérfanos.

## 2. Composición y movimiento

- [x] 2.1 Adaptar `global.css` para superponer las escenas completas en modo mejorado y conservarlas en flujo normal como fallback; verificar desktop, mobile y `prefers-reduced-motion` sin JavaScript animado.
- [x] 2.2 Sustituir en `motion.ts` el cambio de imagen base y `copyProgress` por máscaras complementarias del par saliente/entrante; verificar programáticamente los estados 0, 25, 50, 75 y 100 por ciento.
- [x] 2.3 Mantener visibles solo las dos escenas del intervalo y sincronizar su estado interactivo y `aria-hidden`; verificar que no hay controles duplicados accesibles ni foco en una escena inactiva.
- [x] 2.4 Ajustar el reset al inicio, refresh y navegación por anchors para la nueva estructura; verificar avance, reversa, regreso a `scrollY = 0` y recarga sin estilos residuales.

## 3. Aceptación

- [x] 3.1 Capturar con Playwright el primer barrido al 25, 50 y 75 por ciento en desktop y mobile; verificar que ambas imágenes y ambos títulos coinciden con el mismo borde y que ningún píxel de separación expone el fondo café.
- [x] 3.2 Ejecutar build, revisión de consola/requests, overflow horizontal y el detector Impeccable sobre los tres archivos modificados; verificar que todos los checks terminan sin errores no justificados.
