## Context

La home ya tiene un stage de escenas de pantalla completa controlado por GSAP, ScrollTrigger y Lenis. Los títulos, copy auxiliar, navegación superior y footer se renderizan desde `src/pages/index.astro`; los títulos se alimentan de `src/data/home.ts`, y el estado del scroll se centraliza en `src/scripts/motion.ts`.

## Goals / Non-Goals

**Goals:**

- Usar el título de cada escena como único copy central y como enlace de navegación.
- Reutilizar los anchors y marcadores existentes para evitar un sistema paralelo de rutas.
- Mantener un único control visual de scroll, con dirección derivada de la posición real del documento.
- Ajustar tamaños tipográficos con CSS existente y conservar responsive, teclado y movimiento reducido.

**Non-Goals:**

- No agregar páginas internas, CMS, nuevas dependencias ni un sistema de navegación distinto.
- No rediseñar las imágenes, el barrido de escenas ni la identidad visual completa.

## Decisions

- **Título enlazable en el markup:** envolver cada `h1`/`h2` en un anchor con destino al `id` del panel. Esto reutiliza el comportamiento actual de anchors de Lenis; una navegación basada en estado adicional duplicaría la fuente de verdad.
- **Copy controlado por datos:** sustituir títulos largos por valores breves en `home.ts` y omitir los campos auxiliares en la vista. Se conserva la estructura de datos mínima necesaria para las imágenes y el stage.
- **Flecha como control semántico:** usar un `button` fijo con `aria-label` dinámico y un elemento visual CSS. Su click baja al siguiente marcador cuando no está al final y vuelve a `#inicio` cuando está al final; así el control funciona sin depender solo del gesto de scroll.
- **Dirección derivada de scroll:** calcular el estado final con la altura visible y el scroll actual, actualizar `aria-label`, dirección y clase CSS, y aplicar una transición de giro. Es más confiable que inferir el final por el índice de escena porque el stage puede tener altura propia.
- **Movimiento reducido por CSS y JS:** desactivar el `animation` y la transición de giro cuando corresponda, pero conservar la flecha, su dirección y su función.

## Risks / Trade-offs

- [La altura del documento puede cambiar tras cargar imágenes] → actualizar el estado del control junto con el refresh de ScrollTrigger y en eventos de resize/scroll.
- [Los títulos largos pueden exceder dos renglones en mobile] → usar copy breve en datos y limitar visualmente el ancho del heading sin truncar texto accesible.
- [Un botón fijo puede interferir con enlaces del footer en pantallas estrechas] → reservar una zona pequeña, mantener contraste y validar el viewport mobile con Playwright.
