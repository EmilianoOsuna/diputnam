## Context

Ver `proposal.md` - Why. El sitio (Astro + GSAP/ScrollTrigger/Lenis en desktop, CSS/IntersectionObserver nativo en móvil) ya tiene dos patrones para "avanzar por pasos dentro de una sección":

1. **Track horizontal nativo** (`src/scripts/horizontal-track.ts`, `mountHorizontalTrack`): usado hoy solo en móvil para Tipologías (Ereditá) y para el 01/04 de "Cultura" en Únete cuando el pin está desactivado por `prefers-reduced-motion`. Usa `scroll-snap-type: x mandatory` + `IntersectionObserver`, sin JS de scroll-jacking; ya expone contador y `--progress` para una barra.
2. **Pin/scrub de ScrollTrigger** (`src/scripts/desktop/*.ts`): tres variantes distintas hoy:
   - Eredita Tipologías (`desktop/eredita.ts`): `pin:true` + captura dura de `wheel` con `preventDefault()` y `lenis.stop()` — esto es lo que el usuario llama "robar el scroll".
   - Putnam Proceso (`desktop/putnam.ts` + `.process-markers` de 6 × `100dvh`): sin captura de wheel ni `lenis.stop()`, pero requiere ~600dvh de scroll real para siempre mostrar contenido dentro de un `.process-stage` `position: sticky`. No secuestra el scroll técnicamente, pero produce la misma sensación por la cantidad de scroll vacío.
   - Únete Cultura (`desktop/unete.ts`): `pin: '.pin-stage', pinSpacing: false` con scrub continuo (sin `lenis.stop()`, sin discretización por wheel). Es el patrón que el usuario señaló como el que sí le gusta.

## Goals / Non-Goals

**Goals:**
- Unificar Tipologías (Ereditá) y Proceso (Putnam) sobre el patrón de track horizontal nativo ya usado en móvil, eliminando el scroll-jacking duro y el scroll vertical vacío respectivamente.
- Mantener sin cambios de mecánica la interacción de Cultura en Únete (scrub de ScrollTrigger); solo se le añade imagen de fondo.
- Resolver el resto de los defectos (header, footer, alineaciones, formulario) con CSS/HTML, sin nuevas dependencias.
- Reutilizar datos de CMS ya existentes (`organization.sameAs`) para los iconos de redes del footer.

**Non-Goals:**
- No se rediseña el contenido editorial de ninguna página, ni se agregan campos de CMS nuevos más allá de leer los ya existentes.
- No se toca la arquitectura Lenis/GSAP de las páginas que no están mencionadas en el proposal (home, noticias, hero/principios/diferenciadores de Putnam, etc.).
- No se resuelve aquí el pixel-fidelity histórico de `/contacto/` más allá de las filas de la tabla explícitamente modificadas (footer, campos) y el fix de recorte del correo.

## Decisions

### 1. Tipologías (Ereditá) y Proceso (Putnam) migran al track horizontal nativo, no a una nueva librería

**Decisión**: en desktop, ambas secciones dejan de usar ScrollTrigger para pin/scrub y en su lugar usan `mountHorizontalTrack` (el mismo módulo ya cargado en todos los anchos, sin gate `min-width`) dentro de un contenedor con `overflow-x: auto; scroll-snap-type: x mandatory;` a `100dvh`.

**Por qué**: es la opción más perezosa (rung 2 de la escalera: ya existe en el código, ya resuelve contador+rail+teclado+a11y) y es exactamente el comportamiento que el usuario pide ("como un carrusel con scroll horizontal, que se siga viendo en 100dvh y que tenga un progress bar"). Elimina código (todo `desktop/eredita.ts` más allá del reveal de títulos, y el bloque `.process-markers`/`processMarkers` de `desktop/putnam.ts`) en vez de añadirlo.

**Alternativas consideradas**:
- Mantener ScrollTrigger pero quitar solo `event.preventDefault()`/`lenis.stop()` de Eredita: no resuelve la queja de Putnam (scroll vertical vacío) ni añade el carrusel horizontal pedido.
- Un carrusel de terceros (Swiper/Embla): rechazado — ya existe una solución propia equivalente en el repo (rung 5 de la escalera: no se añade una dependencia para lo que unas líneas ya resuelven).

**Impacto en código**: `eredita-motion.ts` deja de hacer `matchMedia('(min-width: 768px)')` para decidir mobile vs desktop en la sección de tipologías: `mountHorizontalTrack` se monta siempre que exista `[data-h-track]`, y el import `./desktop/eredita` se recorta a solo lo que siga siendo necesario para hero/parallax/reveals (si algo lo sigue siendo). `eredita.css` retira el `transform: translateX(...)` vía JS y las reglas `min-width:900px` que ocultaban `.ed-h-head`, y aplica el layout de scroll-snap (hoy solo bajo `max-width:899px`) también en desktop, con paneles a `100vw` o al ancho que decida el layout desktop (puede diferir del ancho móvil, ya que el CSS de panel para ≥900px puede seguir siendo un grid `1.15fr 1fr` en vez de apilado).

`putnam-motion.ts`/`desktop/putnam.ts`: se retira `processMarkers`/`ScrollTrigger.create` por marcador y el div `.process-markers` (600dvh muertos); `.process-stage` deja de ser `position: sticky` y pasa a ser el contenedor `100dvh` con scroll-snap horizontal; cada paso pasa a ser un panel del track. El contador (`data-process-current`) y el rail (`data-line-progress`) se alimentan desde `mountHorizontalTrack`'s `onChange`/progreso en vez de `setProcessStep`/`ScrollTrigger scrub`.

### 2. Cultura de Únete: solo se le agrega imagen, no se toca su mecánica

**Decisión**: se añade una imagen de fondo (con capa de sombra) a `.un-culture`/`.pin-stage`, reutilizando el mismo patrón de `data-parallax` + gradiente que ya usan `.un-hero` e `.institutional-cta`. No se cambia `desktop/unete.ts`.

**Por qué**: el usuario indicó explícitamente que le gusta esta interacción (a diferencia de Tipologías/Proceso); cambiarla sería trabajo no solicitado.

### 3. Redes sociales del footer: se derivan de `organization.sameAs`, no de un campo nuevo

**Decisión**: un helper puro (`src/lib/content.ts` o un módulo nuevo pequeño) mapea cada URL de `organization.sameAs` a un icono conocido por dominio (`facebook.com` → Facebook, `instagram.com` → Instagram); WhatsApp usa siempre `contact.whatsapp`. URLs de dominios no reconocidos se ignoran.

**Por qué**: `sameAs` ya es un campo editable del Studio pensado para "Instagram, LinkedIn, Facebook..." (ver `studio/schemaTypes/siteSettings.ts`); no hay necesidad de un campo nuevo (rung 2 de la escalera).

**Alternativas consideradas**: campo CMS dedicado `facebook`/`instagram` — rechazado, duplicaría datos que ya existen en `sameAs`.

### 4. Crédito de autoría: texto simple, sin icono nuevo hasta que se provea uno

**Decisión**: se implementa la línea "Código y diseño · Emiliano Osuna" como texto/enlace, sin un ícono personalizado (el mockup de referencia usa uno propio del usuario que no existe en este repo).

**Default documentado, sustituible**: si el usuario provee un asset de icono, se puede añadir después sin cambiar el resto del requisito.

### 5. Formulario: barrido de texto en verde vía CSS, sin JS

**Decisión**: usar `background-clip: text` con un gradiente de dos colores y `background-position` animado en `:hover`/`:focus-within` de `.f-row`, en vez de JS. `color: currentColor` como fallback para navegadores sin soporte de `background-clip: text`.

**Por qué**: es un efecto puramente visual, resoluble con CSS (rung 4 de la escalera: la plataforma ya lo cubre).

## Risks / Trade-offs

- [Quitar `lenis.stop()`/`preventDefault()` en Tipologías cambia el "feel" que QA pudiera haber validado antes] → Mitigación: las scenarios del delta de `eredita-project-lines` cubren explícitamente que el scroll no debe quedar bloqueado; validar manualmente en desktop tras el cambio.
- [Retirar `.process-markers`/scrub en Putnam es la migración de mayor superficie de código] → Mitigación: el contador/rail ya existen y solo cambian de fuente de verdad (de `ScrollTrigger` a `mountHorizontalTrack`), reduciendo el riesgo de regresión visual del propio contador.
- [`background-clip: text` no es soportado en absolutamente todos los navegadores/versión mínima] → Mitigación: fallback a `color` sólido sin el barrido; no rompe la legibilidad ni la interacción.
- [El recorte del correo en móvil no tiene una causa raíz 100% confirmada solo por captura] → Mitigación: `tasks.md` incluye reproducirlo en un viewport real de 320–390px antes de aplicar el fix, en vez de asumir a ciegas.

## Migration Plan

Cambio puramente de frontend (CSS/HTML/TS), sin datos ni backend. Se despliega como cualquier otro cambio del sitio estático; no requiere pasos de rollback especiales más allá de revertir el commit si una sección regresiona visualmente. `graphify update .` se corre al final para mantener el grafo del repo al día.
