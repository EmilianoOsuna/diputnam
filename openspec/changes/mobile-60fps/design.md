## Context

El sitio usa Astro, scripts TypeScript con Lenis/GSAP/ScrollTrigger y CSS con parallax, transforms, transiciones y menú móvil. El foco de diagnóstico es `src/pages/putnam.astro`, `src/scripts/putnam-motion.ts` y `src/styles/putnam.css`: el hero carga una imagen editorial a pantalla completa y arranca Lenis/GSAP al cargar. Las piezas compartidas se tocarán solo cuando la medición de Putnam o las regresiones lo justifiquen, sin añadir una dependencia obligatoria.

## Goals / Non-Goals

**Goals:**

- Establecer medición reproducible de frame pacing, long tasks, layout y paint en móvil, con `/putnam` como caso de aceptación principal.
- Identificar por separado el coste de carga/decodificación del hero y el coste de las actualizaciones de scroll.
- Mantener las actualizaciones de scroll en un único ciclo de `requestAnimationFrame` cuando corresponda.
- Limitar `will-change` a capas activas o próximas a animarse y favorecer `transform`/`opacity`.
- Reducir invalidaciones de estilo, lecturas geométricas repetidas y áreas de pintura.
- Conservar accesibilidad, reduced motion, navegación y ausencia de overflow.

**Non-Goals:**

- Rediseñar la interfaz o eliminar la identidad visual de las animaciones.
- Optimizar la barra de gestos del sistema operativo; el indicador “café” mencionado no pertenece al sitio.
- Cambiar el contenido, las rutas públicas o el comportamiento desktop salvo correcciones regresivas.

## Decisions

- **Instrumentar antes de ajustar:** usar Performance panel y una prueba automatizada de `/putnam` para obtener una línea base tras refresco y durante scroll; evita aplicar `will-change` indiscriminadamente o atribuir el problema a Lenis sin evidencia.
- **Hero primero:** reservar la primera iteración a la imagen y al arranque de `putnam-motion.ts`; no cambiar el comportamiento de proceso, principios o CTA salvo que el profiling demuestre que participan en el coste.
- **Una cola visual por frame:** centralizar/sincronizar callbacks derivados de scroll y reservar lecturas de geometría para fases de lectura, seguidas de escrituras compositoras. En Putnam, Lenis y el ticker de GSAP no deben provocar una segunda actualización redundante de ScrollTrigger dentro del mismo frame. La alternativa de actualizar directamente en cada evento es más simple, pero escala peor con Lenis y ScrollTrigger.
- **Compositing selectivo:** aplicar `will-change: transform` solo a tracks, paneles o marcas mientras están activos; retirar la hint cuando termina la interacción. Promover toda la página aumentaría memoria y presión de capas.
- **Degradación explícita:** conservar los fallbacks existentes de móvil y reduced motion, ampliándolos solo donde la medición demuestre coste. Desactivar toda animación por defecto reduciría rendimiento, pero también cambiaría la experiencia prevista.
- **Verificación funcional:** combinar métricas de rendimiento con pruebas de overflow, estados del menú, cue de scroll y reduced motion.

## Risks / Trade-offs

- [Demasiadas capas compositoras] → aplicar `will-change` de forma temporal y revisar memoria/capas en dispositivos reales.
- [Cambios de timing en scroll] → preservar Lenis/ScrollTrigger como fuentes de estado y validar navegación por escenas.
- [Resultados variables entre móviles] → comparar al menos un móvil de gama media y uno de gama baja, además de CPU throttling.
- [Lecturas geométricas inevitables] → cachear dimensiones por ciclo y recalcularlas solo en resize/orientación o cuando cambie el viewport.

## Migration Plan

1. Capturar baseline específico de `/putnam` después de un hard refresh y durante un scroll controlado del hero.
2. Aplicar el ajuste mínimo al origen medido: multimedia, scheduler o composición CSS.
3. Repetir la medición de Putnam y ejecutar regresiones en home/Eredita, reduced motion y desktop.
4. Si aparecen regresiones, revertir por área manteniendo el baseline y las métricas comparables.
