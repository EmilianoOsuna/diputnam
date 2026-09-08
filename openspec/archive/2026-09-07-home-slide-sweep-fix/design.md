## Context

Consulta `proposal.md` para la motivación y `specs/home-slide-sweep/spec.md` para el comportamiento requerido. La implementación actual coloca cada imagen y su copy dentro del mismo `.panel`, anima la imagen entrante con `clip-path: inset(0 0 0 100%)` y cambia la escena mediante callbacks de triggers individuales. Eso produce un barrido horizontal visualmente débil, porque el copy sigue por encima de la imagen, y deja el estado inicial expuesto a callbacks y estilos inline de transiciones previas.

## Goals / Non-Goals

**Goals:**

- Separar las capas de media y copy dentro del stage sin duplicar el contenido editorial.
- Hacer que el barrido vertical sea la relación espacial principal de la transición.
- Mantener el copy activo fijo en el centro y revelar el nuevo copy solo cuando la imagen entrante haya cruzado la zona central.
- Centralizar el cálculo del estado activo y restablecer explícitamente la escena cero en el inicio.
- Mantener el fallback estático, responsive y de movimiento reducido.

**Non-Goals:**

- Cambiar la dirección visual general, el contenido, las imágenes, el logo o los colores.
- Añadir nuevas dependencias, rutas o integración con Sanity.
- Crear una navegación por slides independiente del scroll.

## Decisions

### 1. Stage con media y copy independientes

El markup de la home tendrá un stage de media a pantalla completa y un stage de copy centrado. Los datos seguirán siendo una sola fuente; la separación será estructural para que una imagen pueda colocarse por encima del copy durante el barrido y el copy nuevo pueda quedar encima al terminar.

Alternativa descartada: conservar el copy dentro de cada panel de imagen. Esa composición impide controlar de forma precisa qué queda debajo del borde entrante y qué reaparece después de cubrirlo.

### 2. Barrido de abajo hacia arriba con `clip-path`

Cada transición iniciará la imagen entrante con una máscara equivalente a `inset(100% 0 0 0)` y la expandirá hasta cubrir el viewport. El media stage tendrá prioridad de apilamiento durante el cruce del copy; el copy entrante cambiará a la capa superior al finalizar el barrido. Se animarán únicamente transform, opacity y clip-path para conservar continuidad y limitar costo de pintura.

Alternativa descartada: crossfade simultáneo. Ya existe y es precisamente el efecto que el usuario identifica como insuficiente.

### 3. Un progreso maestro para escena y copy

El índice activo se derivará de un único `ScrollTrigger` asociado al recorrido total, mientras un timeline reversible usa el progreso de cada intervalo entre marcadores. El callback de progreso actualizará visibilidad, `aria-hidden`, z-index y estado del copy; no habrá callbacks independientes compitiendo por declarar la escena activa.

Alternativa descartada: dejar que cada trigger llame `setActive` en `onEnter`/`onLeaveBack`. Ese patrón fue la fuente probable del bug al volver al tope porque el primer estado no se restablecía de manera explícita.

### 4. Reset explícito del primer estado

Al inicializar y al refrescar ScrollTrigger se aplicará una función de estado base que limpia inline styles de todas las capas, muestra la primera imagen/copy, oculta las restantes y fija el progreso en cero cuando el scroll está en el inicio. El primer estado será visible incluso antes de que la mejora JS termine de inicializarse.

Alternativa descartada: confiar únicamente en las clases renderizadas por Astro. Las animaciones GSAP dejan estilos inline que pueden sobrevivir a un regreso si no se limpian.

### 5. Fallback sin stage mejorado

La clase de mejora se añadirá solo después de validar que existen media, copy y marcadores. Sin esa clase, las escenas permanecen en flujo normal; con reduced motion no se activará Lenis ni el stage pinneado. Esto permite que el barrido sea una mejora visual y no una condición de acceso al contenido.

## Risks / Trade-offs

- [El borde de clip-path puede verse duro en imágenes de bajo contraste] -> Mantener un borde limpio y usar el scrim existente, sin añadir un fade que anule la lectura del barrido.
- [El copy puede parpadear al cambiar de z-index] -> Cambiar la capa en un umbral único del progreso y verificar capturas en 25%, 50%, 75% y 100% de la transición.
- [El refresh de imágenes remotas puede mover los marcadores] -> Esperar carga de medios, restablecer el estado base y ejecutar `ScrollTrigger.refresh()` una sola vez después de medir.
- [Scroll restoration del navegador puede iniciar en una escena intermedia] -> Leer la posición real al inicializar, permitir el hash intencional y forzar el reset solo cuando el scroll sea cero.

## Migration Plan

1. Capturar el estado actual en el inicio, mitad y final de una transición para conservar evidencia del bug.
2. Reestructurar el stage de la home para separar media y copy sin cambiar fixtures ni textos.
3. Reemplazar el clip-path horizontal por el barrido vertical y sincronizar el copy nuevo con el cruce del borde.
4. Sustituir callbacks de estado dispersos por progreso maestro y reset explícito del hero.
5. Verificar desktop/mobile, refresh, navegación, reduced motion, overflow y consola con Playwright.
6. Si la transición falla, revertir únicamente `index.astro`, `motion.ts` y `global.css` al estado de `polish-home-ui-tinkering`.

## Open Questions

Ninguna bloquea el cambio. La dirección del barrido queda fijada de abajo hacia arriba, que es la lectura visual solicitada y la más cercana a la captura de referencia.
