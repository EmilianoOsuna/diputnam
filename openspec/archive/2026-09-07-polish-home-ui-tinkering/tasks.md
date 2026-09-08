## 1. Benchmark y tipografía

- [x] 1.1 Capturar con Playwright la referencia y Putnam en desktop y mobile, incluyendo hero, estado inicial y al menos dos puntos de scroll, para conservar evidencia comparable del layout y la transición
- [x] 1.2 Resolver Cera Pro con archivo/licencia autorizada o seleccionar un fallback autorizado, integrarlo en la home y verificar con estilos computados que Montserrat ya no sea la fuente principal
- [x] 1.3 Retirar la excepción de Impeccable que justifica Montserrat y verificar que el hook no reporte esa fuente después del cambio

## 2. Estructura visual del stage

- [x] 2.1 Ajustar `src/pages/index.astro` para separar el progreso vertical de la escena persistente y exponer las capas de imagen, título, metadatos e índice activo sin duplicar contenido accesible
- [x] 2.2 Mantener los datos locales y el contenido de Putnam/Ereditá mientras se conectan las escenas al nuevo stage, verificando que la home siga renderizando todos los títulos, acciones y enlaces
- [x] 2.3 Implementar el fallback mobile y de movimiento reducido para que el contenido siga en flujo estable cuando el pinning o la animación no estén activos

## 3. Scroll y transiciones

- [x] 3.1 Reescribir la secuencia de `src/scripts/motion.ts` para sincronizar Lenis con un timeline reversible de ScrollTrigger, verificando scroll suave y ausencia de errores de consola
- [x] 3.2 Animar las capas de imagen con barrido/crossfade y parallax sutil ligado al progreso, verificando que avanzar y retroceder produzca la misma transición sin saltos
- [x] 3.3 Mantener el título activo centrado y sincronizar su entrada/salida con la imagen entrante, verificando que no viaje fuera del centro como texto normal del documento
- [x] 3.4 Ajustar reveals, hover, easing y refresh posterior a la carga de medios, verificando que el primer hero aparezca visible y que el recorrido no deje escenas congeladas

## 4. Legibilidad y responsive

- [x] 4.1 Ajustar `src/styles/global.css` para eliminar la dependencia de `mix-blend-mode`, reforzar scrims en header/footer y conservar el detalle de las imágenes, verificando contraste en imágenes claras y oscuras
- [x] 4.2 Recalibrar escala, espaciado, menú y footer en desktop/mobile, verificando `document.documentElement.scrollWidth <= window.innerWidth` y ausencia de superposición visible
- [x] 4.3 Verificar `prefers-reduced-motion: reduce`, navegación por teclado y que el contenido completo siga disponible sin depender de timelines

## 5. Aceptación

- [x] 5.1 Ejecutar build y una revisión Playwright final en desktop y mobile con capturas, comprobando hero, tipografía, contraste, scroll hacia arriba/abajo, hover y errores de consola
- [x] 5.2 Comparar las capturas finales contra la referencia y registrar únicamente ajustes necesarios de proporción, ritmo y legibilidad antes de marcar la spec como completa
