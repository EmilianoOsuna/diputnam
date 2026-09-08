## Context

El proyecto actual es un `index.html` monolítico con varias vistas simuladas mediante `showPage()`, CSS inline, contenido fijo, imágenes remotas y logos embebidos. Esta fase solo valida la dirección de la home; las páginas internas y el CMS no deben condicionar el experimento visual.

## Goals / Non-Goals

**Goals:**

- Crear una base mínima de Astro para la ruta `/`.
- Tomar `https://dsgninterior.se/en` como benchmark visual obligatorio y documentar sus decisiones observables antes de ajustar la home.
- Igualar primero hero, navegación, retícula, escala tipográfica, espaciado, tratamiento de imágenes, ritmo de scroll y animaciones.
- Conservar los tokens de color y el logo actuales de Putnam.
- Mantener una forma de datos local que pueda sustituirse por consultas a Sanity sin rediseñar los componentes.
- Validar visualmente con Playwright en desktop y mobile antes de dar por aprobada la fase.

**Non-Goals:**

- Migrar todas las vistas actuales.
- Configurar Sanity Studio o crear schemas de producción.
- Crear un sistema de diseño general, una librería de componentes o un CMS abstraction layer.
- Copiar código, assets protegidos o contenido editorial de DSGN Interior.
- Resolver todavía formularios, noticias, servicios, equipo, legales o páginas de detalle.

## Decisions

### 1. Astro como estructura multipágina mínima

La home vivirá en una ruta Astro real y no conservará la navegación SPA basada en ocultar y mostrar páginas. Esto prepara rutas independientes para fases posteriores y evita que el prototipo dependa de estado global innecesario.

Alternativa descartada: seguir extendiendo `index.html`. Mantendría la deuda actual y dificultaría medir qué parte del resultado pertenece al rediseño.

### 2. Fixtures locales con forma futura de Sanity

El contenido inicial se mantendrá local y pequeño, con campos previsibles para título, slug, resumen, imagen, categoría y orden. Sanity se integrará después de aprobar la dirección visual.

Alternativa descartada: conectar Sanity en esta fase. Añadiría configuración, credenciales, schemas y decisiones editoriales antes de saber si la home funciona visualmente.

### 3. Benchmark visual guiado por Playwright

Antes de ajustar la implementación se inspeccionará la referencia en sus viewports reales o equivalentes y se capturarán estados de carga, scroll y hover relevantes. Las capturas de Putnam se revisarán contra esos estados para corregir proporciones y movimiento, no solo colores.

La fidelidad buscada es de comportamiento y composición: hero, layout, tipografía, espaciado, imágenes, transiciones y ritmo. La identidad de Putnam seguirá siendo la fuente de logo, color, textos e imágenes.

### 4. Lenis y GSAP con una sola integración de scroll

Lenis manejará el smooth scroll global y GSAP/ScrollTrigger manejará los reveals, transforms y animaciones ligadas al scroll. El ciclo de actualización se centralizará para evitar múltiples listeners y desincronización.

Las animaciones se limitarán a las que existan en la composición aprobada. No se añadirá una capa genérica de animaciones para futuras páginas.

### 5. Fallback responsive y movimiento reducido

El layout podrá conservar la intención editorial de la referencia en desktop, pero en mobile priorizará lectura, navegación y estabilidad. Cualquier comportamiento horizontal o de pinning que no sea cómodo en mobile tendrá un fallback vertical o estático.

`prefers-reduced-motion` será una condición de ejecución desde el inicio, no un ajuste posterior.

## Risks / Trade-offs

- [La fidelidad visual puede confundirse con copiar la identidad de DSGN Interior] -> Mantener logo, colores, contenido e imágenes de Putnam; replicar patrones observables, no assets ni código.
- [Lenis y ScrollTrigger pueden degradar mobile o accesibilidad] -> Probar en mobile realista, usar fallback nativo y respetar `prefers-reduced-motion`.
- [Las imágenes actuales son remotas o están embebidas] -> Usarlas solo como material inicial y mantener la carga de contenido desacoplada para sustituirlas después.
- [El prototipo puede crecer accidentalmente hacia todas las páginas] -> Mantener una sola ruta, fixtures mínimos y una lista explícita de no-goals.

## Migration Plan

1. Inspeccionar la referencia con Playwright y registrar los estados visuales relevantes.
2. Crear la home Astro con fixtures locales y los assets de Putnam.
3. Implementar el layout estático y ajustar la comparación visual.
4. Integrar las animaciones de scroll y repetir la verificación desktop/mobile.
5. Aprobar o corregir la dirección visual antes de abrir una spec para Sanity o las páginas restantes.

Para rollback, la versión actual de `index.html` se conserva hasta que la home Astro pase la revisión visual y funcional.

## Open Questions

- Ninguna que bloquee esta fase. La tipografía exacta podrá cerrarse durante la inspección visual, siempre que respete la prioridad de fidelidad definida en la spec.
