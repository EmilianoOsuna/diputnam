## Context

Consulta `proposal.md` para la motivación y `specs/dual-scene-sweep/spec.md` para el contrato visual. La home actual separa media y copy, usa una sola capa de barrido para la imagen entrante y cambia la imagen base al 50 por ciento. El copy se cruza por opacidad únicamente en el último 16 por ciento; por eso no comparte el recorte de la imagen y el fondo café puede quedar expuesto.

## Goals / Non-Goals

**Goals:**

- Representar cada slide como una escena visual completa: imagen, sombreado y copy.
- Dividir las escenas saliente y entrante con máscaras complementarias derivadas de un solo progreso.
- Mantener continuidad exacta al avanzar, retroceder y volver al inicio.
- Reusar los datos, Lenis, GSAP y el recorrido de marcadores existentes.

**Non-Goals:**

- Modificar textos, imágenes, tipografía, navegación, colores o intensidad del sombreado.
- Añadir timelines secundarios, dependencias, rutas o integración con Sanity.
- Recrear otras secciones o interacciones de la referencia.

## Decisions

### 1. Una capa completa por escena

Cada elemento generado desde `homePanels` contendrá su imagen, sombreado y copy dentro de un único wrapper a pantalla completa. En modo mejorado las escenas se superponen; sin JavaScript permanecen en flujo normal. Así, una máscara aplicada al wrapper corta todos sus elementos en la misma coordenada.

Alternativa descartada: conservar stages independientes para media y copy. Exigiría sincronizar cuatro máscaras por transición y mantendría abierta la posibilidad de que texto e imagen diverjan.

### 2. Dos máscaras complementarias y ningún crossfade

Para un progreso `p` entre cero y uno, la escena entrante se revela desde abajo con una máscara equivalente a `inset((1 - p) * 100% 0 0 0)`. La saliente conserva la parte superior con una máscara equivalente a `inset(0 0 p * 100% 0)`. Ambas usan el mismo `p`; a la mitad ocupan exactamente media pantalla cada una.

Alternativa descartada: mantener la imagen saliente completa debajo de una sola capa entrante. Aunque evita el fondo café, no permite recortar el título saliente con el mismo borde sin volver a separar y duplicar capas.

### 3. El progreso maestro solo selecciona el par y sus máscaras

El `ScrollTrigger` existente seguirá calculando el intervalo actual y su progreso. En cada actualización ocultará las escenas ajenas al par, aplicará las dos máscaras complementarias y actualizará el estado semántico en un único umbral. Se eliminarán el cambio prematuro de imagen base, la imagen proxy del sweep y el `copyProgress` tardío.

Alternativa descartada: añadir triggers por escena. El progreso maestro ya cubre reversa, saltos y reset con menos estados competidores.

### 4. Ligero solapamiento técnico en el borde

Las máscaras compartirán coordenada y podrán solaparse como máximo un píxel para evitar una línea del fondo causada por antialiasing o redondeo subpíxel. El solapamiento no añadirá blur, fade ni una franja decorativa visible.

### 5. Un solo árbol editorial

El copy no se duplicará en stages paralelos. Durante la transición, solo una escena tendrá interacción y semántica activa; el resto se marcará como no interactivo y oculto para tecnologías asistivas. El fallback conservará todos los contenidos en el orden original.

## Risks / Trade-offs

- [Una diferencia subpíxel puede revelar una línea del fondo] -> Usar la misma variable de progreso y un solapamiento máximo de un píxel.
- [Todas las escenas superpuestas pueden aumentar el costo de pintura] -> Mantener visibles solo las dos escenas del intervalo y animar únicamente `clip-path` y el scale existente de imagen.
- [Cambiar `aria-hidden` a mitad del barrido puede afectar un foco activo] -> Mantener acciones inactivas sin pointer events y no cambiar de escena semántica mientras un control tenga foco.
- [El fallback podría heredar máscaras inline tras cambiar preferencias] -> Limpiar estilos inline al desmontar o al entrar en movimiento reducido.

## Migration Plan

1. Reagrupar cada panel como escena visual completa y retirar los stages proxy.
2. Sustituir el crossfade y el cambio de base por las máscaras complementarias.
3. Conservar el reset, los anchors y el fallback existentes con la nueva estructura.
4. Validar los puntos 0, 25, 50, 75 y 100 por ciento, reversa, regreso al inicio, mobile y movimiento reducido.
5. Ante una regresión, revertir únicamente `index.astro`, `motion.ts` y `global.css` al estado anterior a este cambio.
