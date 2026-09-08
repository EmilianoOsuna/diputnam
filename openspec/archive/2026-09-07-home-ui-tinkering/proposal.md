## Why

Putnam necesita validar primero una dirección visual concreta antes de invertir en la migración completa del sitio. Esta fase reduce el alcance a la home y permite comprobar si la traducción visual de DSGN Interior funciona con el contenido, colores y logo de Putnam.

## What Changes

- Crear una primera home funcional en Astro.
- Traducir visualmente la referencia `https://dsgninterior.se/en` usando Playwright como benchmark durante la exploración y verificación.
- Priorizar la fidelidad visual del hero, layout, tipografías, jerarquía, ritmo de scroll y animaciones.
- Mantener la paleta de colores y el logo actuales de Putnam.
- Adaptar la composición al contenido actual de Putnam, con Ereditá como proyecto destacado.
- Incorporar Lenis y GSAP únicamente para el comportamiento visual necesario de esta home.
- Validar la experiencia en desktop y mobile, incluyendo una alternativa usable con movimiento reducido.
- Dejar fuera las páginas internas, Sanity CMS, formularios, noticias, servicios, equipo y rutas de detalle.

## Capabilities

### New Capabilities

- `home-ui`: Home editorial de Putnam con dirección visual inspirada fielmente en DSGN Interior, contenido local inicial y animaciones de scroll.

### Modified Capabilities

Ninguna.

## Impact

- Se reemplazará la implementación monolítica de `index.html` por una base Astro mínima cuando se aplique el cambio.
- Se añadirán las dependencias de Astro, Lenis y GSAP solo si son necesarias para la implementación aprobada.
- La futura integración con Sanity deberá conservar la forma de los datos locales usados en esta fase.
- La navegación y las páginas actuales fuera de la home no forman parte de este MVP.
