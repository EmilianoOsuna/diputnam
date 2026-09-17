## Why

Una ronda de retroalimentación visual sobre el sitio en producción (capturas de escritorio y móvil de Ereditá, Putnam, Únete y Contacto) identifica once defectos de percepción premium concretos: el isotipo del header se ve chico, la galería de un proyecto pierde el masonry en móvil, dos secciones (Tipologías de Ereditá y Proceso de Putnam) le "roban" el scroll al usuario con paneles fijados o secuencias de pantalla completa sin suficiente contenido, la sección "Cómo trabajamos" de Únete es un fondo verde plano, varios bloques de Únete quedan mal alineados o con espacio muerto, el correo se corta en el listado de canales de Contacto en móvil, los campos del formulario de Contacto no tienen una interacción de hover definida, y el pie de página fijo es más grueso de lo deseado y no incluye redes sociales ni crédito de autoría. Se agrupan porque comparten causa de negocio (pulido de UI/UX antes de seguir sumando páginas) y varias comparten el mismo patrón técnico subyacente (el track horizontal con contador y barra de progreso ya usado en móvil).

## What Changes

- **Header**: agrandar la caja visual del isotipo Putnam (`.brand--mark`) en desktop y móvil; sin tocar la resolución intrínseca ni el fallback ya cubiertos por `brand-marks`.
- **Pie de página compartido**: adelgazar `.site-footer` / `.site-footer--flow` (reducir `min-height`/padding actuales de 14rem/18rem), añadir una fila de iconos de redes (WhatsApp, Facebook, Instagram, tomados de `contact.whatsapp` y `contact.organization.sameAs`, ya editables desde el Studio) y una línea de crédito "Código y diseño · Emiliano Osuna" alineada a la derecha, replicada en las seis páginas vía `ContactFooter.astro`.
- **Galería de un proyecto Ereditá** (`/eredita/<slug>/`): el masonry (`.ed-masonry`) pasa de 1 a 2 columnas en móvil (como en desktop/tablet), en vez de apilarse en una sola columna.
- **Tipologías de un proyecto Ereditá**: eliminar el secuestro de scroll por rueda (`desktop/eredita.ts`, `event.preventDefault()` + `lenis.stop()`) y usar en desktop el mismo track horizontal nativo con `scroll-snap` que ya corre en móvil (`mountHorizontalTrack`), dentro de una sección de `100dvh`, mostrando el contador y la barra de progreso también en desktop (hoy ocultos) y dando más peso al panel de imagen/video frente al panel de texto.
- **Proceso de Putnam** (`/putnam/`): reemplazar la secuencia de 6 pasos de `100dvh` cada uno con "stage" fijado por scroll (`.process-stage` sticky + `.process-markers` de 600dvh de alto muerto) por el mismo patrón de track horizontal de un solo `100dvh`, reutilizando el contador/rail existentes (`.process-counter`, `.process-rail`).
- **Cultura de Únete** (`/unete/`): incorporar imagen(es) de fondo a `.un-culture` (hoy solo `var(--putnam-deep)` plano), conservando la interacción de scrub fijado ya aprobada por el usuario.
- **Qué valoramos de Únete**: alinear el título (`.section-head`) y la cuadrícula de tarjetas 01/02/03 (`.values`, `.kpis`) al mismo margen izquierdo, quitando el desfase de `margin-left: 12%` que solo aplica a las tarjetas.
- **Sin vacantes de Únete**: reducir el espacio muerto del estado vacío (`.un-openings`, `.empty-panel`) con un padding/composición más compactos.
- **CTA final de Únete**: rebalancear `.un-cta` (título muy cargado a la izquierda con hueco a la derecha) dándole más peso visual a la marca/composición para que no quede como texto suelto sobre fondo vacío.
- **Canales de Contacto en móvil**: asegurar que el valor de correo en `.index-row strong` nunca se recorte/oculte entre 320–390px.
- **Formulario de Contacto**: sustituir la línea inferior de cada fila de campo como única señal por una transición donde, al hacer hover/foco, el texto de la etiqueta y del valor se pinte en verde con un barrido de izquierda a derecha.

Fuera de alcance: copy nuevo, cambios de arquitectura de datos del CMS más allá de leer `organization.sameAs` ya existente, rediseño de secciones no mencionadas arriba (hero, principios, diferenciadores, documentación legal, etc.).

## Capabilities

### New Capabilities

- `site-shell-chrome`: tamaño visual del isotipo del header y diseño del pie de página compartido (grosor, iconos de redes sociales, crédito de autoría) en las seis páginas del sitio.
- `unete-careers-page`: composición visual de `/unete/` — imagen en la sección de cultura, alineación de la cuadrícula "Qué valoramos", densidad del estado sin vacantes y balance del CTA final. Primera spec dedicada a esta página (hoy sin capability propia).

### Modified Capabilities

- `eredita-project-lines`: la galería de un proyecto pasa a masonry de 2 columnas en móvil y las tipologías dejan de fijar/secuestrar el scroll en desktop, migrando al track horizontal nativo con contador y barra de progreso visibles en todos los anchos.
- `putnam-institutional-page`: la sección de proceso deja de requerir ~6 alturas de viewport de scroll vertical fijado y pasa a un track horizontal de una sola `100dvh`, en línea con el requisito ya vigente de no convertir el recorrido en "una secuencia obligatoria de pantallas completas".
- `contacto-page`: el valor de correo de `.ct-channels` no se recorta en móvil; la interacción de los campos del formulario cambia de línea estática a barrido de texto en verde al hover/foco; la geometría del pie de página (`.site-footer--flow`) se realinea con el nuevo estándar delgado de `site-shell-chrome` en vez de los valores fijos anteriores (`min-height: 14rem`/`18rem`).

## Impact

- `src/components/SiteHeader.astro`, `src/components/ContactFooter.astro`, `src/styles/global.css` (marca del header, pie de página compartido, iconos de redes).
- `src/lib/content.ts` (helper para derivar iconos de red desde `organization.sameAs`, sin nuevos campos de CMS).
- `src/styles/eredita.css`, `src/scripts/eredita-motion.ts`, `src/scripts/desktop/eredita.ts` (o su retiro), `src/scripts/horizontal-track.ts` (posible reuso ampliado a desktop).
- `src/styles/putnam.css`, `src/scripts/putnam-motion.ts`, `src/scripts/desktop/putnam.ts`, `src/views/putnam.astro` (marcado del proceso).
- `src/styles/unete.css`, `src/views/unete.astro`, `src/scripts/desktop/unete.ts` (solo estilos; la interacción de cultura no cambia de mecánica).
- `src/styles/contacto.css` (canales móvil, campos de formulario, pie de página).
- Sin dependencias nuevas ni cambios de API; todo el trabajo es CSS/HTML/reutilización de datos ya editables desde el CMS.
