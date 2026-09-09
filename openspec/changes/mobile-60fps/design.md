## Context

El sitio usa Astro, scripts TypeScript con Lenis/GSAP/ScrollTrigger y CSS con parallax, transforms, transiciones y menú móvil. La optimización debe cubrir `motion.ts`, los controladores de movimiento de Eredita/Putnam, `menu.ts` y las hojas globales/específicas, sin añadir una dependencia obligatoria.

## Goals / Non-Goals

**Goals:**

- Establecer medición reproducible de frame pacing, long tasks, layout y paint en móvil.
- Mantener las actualizaciones de scroll en un único ciclo de `requestAnimationFrame` cuando corresponda.
- Limitar `will-change` a capas activas o próximas a animarse y favorecer `transform`/`opacity`.
- Reducir invalidaciones de estilo, lecturas geométricas repetidas y áreas de pintura.
- Conservar accesibilidad, reduced motion, navegación y ausencia de overflow.

**Non-Goals:**

- Rediseñar la interfaz o eliminar la identidad visual de las animaciones.
- Optimizar la barra de gestos del sistema operativo; el indicador “café” mencionado no pertenece al sitio.
- Cambiar el contenido, las rutas públicas o el comportamiento desktop salvo correcciones regresivas.

## Decisions

- **Instrumentar antes de ajustar:** usar Performance panel y pruebas móviles para obtener una línea base y comparar después; evita aplicar `will-change` indiscriminadamente.
- **Una cola visual por frame:** centralizar/sincronizar callbacks derivados de scroll y reservar lecturas de geometría para fases de lectura, seguidas de escrituras compositoras. La alternativa de actualizar directamente en cada evento es más simple, pero escala peor con Lenis y ScrollTrigger.
- **Compositing selectivo:** aplicar `will-change: transform` solo a tracks, paneles o marcas mientras están activos; retirar la hint cuando termina la interacción. Promover toda la página aumentaría memoria y presión de capas.
- **Degradación explícita:** conservar los fallbacks existentes de móvil y reduced motion, ampliándolos solo donde la medición demuestre coste. Desactivar toda animación por defecto reduciría rendimiento, pero también cambiaría la experiencia prevista.
- **Verificación funcional:** combinar métricas de rendimiento con pruebas de overflow, estados del menú, cue de scroll y reduced motion.

## Risks / Trade-offs

- [Demasiadas capas compositoras] → aplicar `will-change` de forma temporal y revisar memoria/capas en dispositivos reales.
- [Cambios de timing en scroll] → preservar Lenis/ScrollTrigger como fuentes de estado y validar navegación por escenas.
- [Resultados variables entre móviles] → comparar al menos un móvil de gama media y uno de gama baja, además de CPU throttling.
- [Lecturas geométricas inevitables] → cachear dimensiones por ciclo y recalcularlas solo en resize/orientación o cuando cambie el viewport.

## Migration Plan

1. Capturar baseline y localizar los frames con layout/paint costoso.
2. Aplicar ajustes acotados en scripts/CSS y actualizar pruebas.
3. Repetir mediciones en viewport móvil, reduced motion y desktop.
4. Si aparecen regresiones, revertir por área (scheduler, capas o fallback) manteniendo el baseline documentado.
