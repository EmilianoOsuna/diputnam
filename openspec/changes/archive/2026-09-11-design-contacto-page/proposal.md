## Why

El sitio presenta información de contacto en la home y sus páginas internas, pero no tiene una ruta dedicada que reúna canales, motivos de consulta, ubicación y formulario con el diseño aprobado. Además, la navegación compartida conserva anclas que no llevan a las rutas reales y el shell presenta artefactos visuales —línea superior y sombra— que contradicen el acabado aprobado. El mockup y sus anotaciones ya fijan la composición, el movimiento y la interacción esperada.

## What Changes

- Crear `/contacto/` con las seis secciones, copy, clases, assets y valores visuales exactos de los mockups desktop y mobile aprobados.
- Reutilizar `SiteHeader`, `ContactFooter` y los datos de `src/data/home.ts`, ampliando únicamente los datos de contacto que hoy no existen.
- Incorporar el hero local aprobado y reutilizar el logo claro existente.
- Añadir un controlador de página con el mismo ciclo de vida Lenis + GSAP/ScrollTrigger de Ereditá y Putnam para reveals, pin, contador, rail y parallax.
- Aplicar los breakpoints `899px` y `767px`, reduced motion, accesibilidad semántica y `100dvh` real sin los clamps exclusivos del canvas.
- Mantener el formulario sin transmisión hasta que se defina un backend; email y WhatsApp siguen siendo los canales funcionales.
- Enlazar todas las entradas del navbar y la marca a rutas reales (`/`, `/eredita/`, `/putnam/`, `/contacto/`) desde todas las páginas.
- Eliminar la línea superior del hero y cualquier sombra, gradiente o backdrop decorativo del header compartido, sin importar el fondo que tenga detrás.
- Añadir un dropdown custom accesible para selects y estados hover/focus sutiles para campos, enlaces y botones compartidos en todas las páginas, respetando reduced motion y sin interacción magnética.

## Capabilities

### New Capabilities

- `contacto-page`: Define la ruta, contenido, fidelidad visual, comportamiento responsive, assets, accesibilidad, movimiento y la integración de navegación/interacciones compartidas de la página de contacto.

### Modified Capabilities

Ninguna.

## Impact

- Añade `src/pages/contacto.astro`, `src/styles/contacto.css`, `src/scripts/contacto-motion.ts` y `public/assets/contacto-hero.jpg`.
- Amplía `src/data/home.ts`, `SiteHeader`, `global.css`, `menu.ts` y los formularios/selects compartidos para que todas las páginas usen rutas e interacciones coherentes.
- Reutiliza Astro, Lenis, GSAP, ScrollTrigger y los componentes existentes; no añade dependencias, API ni backend.
