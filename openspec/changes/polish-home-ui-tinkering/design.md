## Context

Consulta `proposal.md` para la motivación y `specs/home-ui-motion-readability/spec.md` para el contrato observable. La home actual ya usa Astro, Lenis y GSAP, pero sus cuatro paneles son secciones normales de altura completa: el texto se desplaza con cada panel y la imagen solo recibe un parallax aislado. Además, `global.css` importa Montserrat, el header usa `mix-blend-mode: screen` y el scrim actual no garantiza contraste frente a fotografías claras.

La referencia observada con Playwright usa un viewport visual fijo, header y footer persistentes, títulos grandes centrados y una secuencia de escenas donde la imagen siguiente cubre la anterior durante el scroll. El contenido, logo, colores y fotografías de Putnam siguen siendo la fuente de identidad.

## Goals / Non-Goals

**Goals:**

- Convertir la secuencia actual en un stage de escenas con una capa visual persistente y una progresión de scroll medible.
- Mantener el título activo centrado y sincronizar su reemplazo con el barrido de imágenes.
- Hacer visible el carácter de Cera Pro o de su fallback autorizado sin conservar Montserrat.
- Resolver contraste en estados estáticos y durante la transición.
- Mantener un fallback estable para mobile y `prefers-reduced-motion`.

**Non-Goals:**

- Crear nuevas rutas, páginas internas o integración con Sanity.
- Copiar fuentes, código, imágenes o contenido propietario de dsgn.
- Añadir un sistema genérico de animaciones o una librería adicional.
- Cambiar el logo, los colores de Putnam o el contenido editorial del MVP.

## Decisions

### 1. Un stage persistente con escenas controladas por scroll

La página conservará una progresión vertical que produzca suficiente distancia de scroll, pero la escena visible será un contenedor sticky/fijo con capas de imagen y contenido activo. Cada escena tendrá un estado indexable para que el progreso determine qué imagen cubre, qué título entra y qué metadatos están activos.

Alternativa descartada: mantener cada panel como un bloque independiente. Es el origen del comportamiento actual: el texto viaja con el documento y no puede reproducir el barrido centrado de la referencia.

### 2. GSAP/ScrollTrigger como única fuente de sincronía

Lenis continuará proporcionando el scroll suave global y su ciclo se conectará a `ScrollTrigger.update`. GSAP/ScrollTrigger controlará el progreso de la secuencia, las capas de imagen, el título persistente, el parallax y los reveals. Se usará un único timeline por recorrido para evitar listeners duplicados y estados que se desincronicen.

Alternativa descartada: animar cada panel con entradas independientes `once: true`. Es insuficiente para reversibilidad, scroll continuo y transición simétrica hacia arriba.

### 3. Contraste por capas, no por mezcla de modos

Se eliminará la dependencia de `mix-blend-mode: screen` en el chrome fijo. El stage tendrá un scrim base y gradientes más densos en las zonas de header y footer; la capa central conservará la fotografía y permitirá que el título destaque. Los tokens de Putnam se mantendrán y la solución debe funcionar sin detectar manualmente cada color de imagen.

Alternativa descartada: alternar texto claro/oscuro con una heurística por imagen. Añade estados frágiles y deja una ventana de bajo contraste durante el crossfade.

### 4. Tipografía autorizada con fallback explícito

La inspección de la referencia tratará Cera Pro como objetivo visual. La implementación cargará esa fuente únicamente desde un archivo o licencia autorizada para Putnam; si no está disponible, usará una alternativa local o web autorizada calibrada por proporciones. La configuración de Impeccable que toleraba Montserrat deberá dejar de justificarla cuando se implemente este cambio.

Alternativa descartada: descargar o reutilizar directamente una fuente propietaria de la referencia sin autorización.

### 5. Fallback de accesibilidad antes de optimización

Con movimiento reducido se conservará el flujo vertical y se desactivarán los timelines ligados al scroll. En mobile se priorizarán la lectura y el menú; el stage puede usar transiciones más cortas o un fallback de escenas estáticas si el pinning degrada la estabilidad.

Alternativa descartada: forzar pinning y smooth scroll en todos los dispositivos. El efecto visual no justifica perder acceso al contenido o rendimiento básico.

## Risks / Trade-offs

- [El pinning y las capas pueden elevar el costo de pintura en mobile] -> Mantener pocas capas visibles, limitar el parallax a transform/opacity y verificar FPS perceptual, overflow y carga en Playwright.
- [Las imágenes remotas pueden cambiar el cálculo del scroll] -> Esperar carga de medios, ejecutar `ScrollTrigger.refresh()` después de medir y conservar una secuencia funcional durante la carga.
- [Cera Pro puede no estar disponible] -> Resolver antes de la implementación el archivo/licencia o el fallback autorizado; en ambos casos retirar Montserrat como principal.
- [Un scrim global puede oscurecer demasiado la fotografía] -> Ajustar por zonas y validar capturas estáticas y durante crossfade, preservando detalle del asset.

## Migration Plan

1. Capturar con Playwright el hero y al menos dos puntos de transición de la referencia y de la home actual en desktop y mobile.
2. Integrar la tipografía autorizada/fallback y recalibrar la escala del chrome y del título.
3. Reestructurar únicamente la home Astro para separar progreso vertical, stage persistente, capas de imagen y título activo.
4. Ajustar Lenis, ScrollTrigger, parallax, barridos, reveals, hover y scrims.
5. Verificar navegación por teclado, mobile, movimiento reducido, errores de consola y ausencia de overflow.
6. Si el stage falla visualmente, revertir los cambios de `index.astro`, `global.css` y `motion.ts` y conservar el MVP anterior.

## Open Questions

Ninguna bloquea la implementación: la fuente exacta se resolverá con la regla de Cera Pro o fallback autorizado definida en esta spec.
