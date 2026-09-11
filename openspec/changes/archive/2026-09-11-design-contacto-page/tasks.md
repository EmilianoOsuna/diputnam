## 1. Datos, assets y navegación compartida

- [x] 1.1 Copiar el JPEG aprobado del scratchpad a `public/assets/contacto-hero.jpg` sin procesarlo y verificar que existe, mide `1280 × 850` y abre correctamente.
- [x] 1.2 Ampliar `contact` en `src/data/home.ts` con dirección, horario, plazo de respuesta, URL de Maps y coordenadas exactas del spec, y verificar que email, teléfono, ciudad y WhatsApp existentes no cambian.
- [x] 1.3 Actualizar `SiteHeader` y los callers para que marca, Ereditá, Putnam y Contacto usen `/`, `/eredita/`, `/putnam/` y `/contacto/` desde las cuatro páginas, y verificar navegación cruzada.

## 2. Página Astro y contenido aprobado

- [x] 2.1 Crear `src/pages/contacto.astro` con metadata, skip link, `SiteHeader`, `<main id="contenido" data-contacto>`, `ContactFooter` e imports de estilo/motion, y verificar un solo `h1` y seis secciones en el orden del spec.
- [x] 2.2 Implementar hero, canales y motivos con copy, clases, ids, `aria-labelledby`, enlaces, `.line > span` y data hooks exactos, y verificar el DOM renderizado contra las secciones 01–03 del mockup.
- [x] 2.3 Implementar ubicación con iframe y CTA de Maps, y verificar title, coordenadas, lazy loading y destino `https://maps.app.goo.gl/uLKQ1rPhj3DSpW1U8` sin conservar el placeholder SVG.
- [x] 2.4 Implementar formulario, CTA y footer con campos, labels, options, placeholders y assets exactos, manteniendo el botón no transmisor, y verificar que no se emite ningún request ni se anuncia éxito falso.
- [x] 2.5 Conectar todo dato repetido al objeto `contact` y verificar que la salida no contiene email, teléfono, ciudad, dirección u horario duplicados como literales inconsistentes.

## 3. Fidelidad CSS y responsive

- [x] 3.1 Crear `src/styles/contacto.css` portando tokens, retícula, tipografía, espaciado, colores, bordes, filtros, gradientes, hover/focus y geometría desktop exactos, y verificar visualmente a `1440px` contra `Main.dc.html`.
- [x] 3.2 Reemplazar cada altura full-screen por `100dvh` directo y verificar por búsqueda que no existen `--vh`, clamps `1000px`/`844px` ni `100svh` en las secciones de contacto.
- [x] 3.3 Implementar los media queries `max-width: 899px` y `max-width: 767px` exactos sin ocultar el menú compartido, y verificar a `390px` contra `Mobile.dc.html` y a `320px` sin overflow horizontal.
- [x] 3.4 Añadir los overrides scoped de reduced motion, foco visible y targets táctiles requeridos, y verificar que el contenido queda visible y en flujo con motion reducido y JavaScript desactivado.

## 4. Lenis y GSAP/ScrollTrigger

- [x] 4.1 Crear `src/scripts/contacto-motion.ts` con el mismo guard, instancia Lenis, bridge al ticker, `gsap.context` y cleanup de Ereditá/Putnam, y verificar que existe una sola instancia y que `pagehide` retira ticker y recursos.
- [x] 4.2 Implementar entrada del hero, reveals por línea y grupos con los valores exactos del spec, y verificar triggers `top 80%`, reversa, stagger y contenido visible antes de inicializar motion.
- [x] 4.3 Implementar en `min-width: 900px` el pin de `.pin-stage`, triggers de motivos, contador y rail scrub, y verificar `01 → 02 → 03`, `33.333% → 100%`, reversa y ausencia de pin/spacer al bajar de `900px`.
- [x] 4.4 Implementar en `min-width: 768px` parallax del hero y marca CTA con los rangos/scrub aprobados, y verificar que el callback de `matchMedia` limpia transforms al cambiar de breakpoint.
- [x] 4.5 Integrar `data-header-theme` con `menu.ts` sin controlador nuevo y verificar color/logo correctos al cruzar cada sección y al abrir/cerrar el menú mobile.

## 5. Verificación de aceptación

- [x] 5.1 Ejecutar `npm run build` y verificar que termina sin errores, genera `/contacto/` y no reporta assets o imports faltantes.
- [x] 5.2 Capturar con Playwright la página completa a `1440px` y `390px`, compararla sección por sección con ambos mockups y corregir cualquier diferencia de layout, copy, fuente, color, espacio o asset antes de aprobar.
- [x] 5.3 Probar viewport de más de `1000px` de alto, resize entre breakpoints, scroll hacia abajo/arriba, reduced motion y JavaScript desactivado, y verificar `100dvh` real, cleanup de triggers y ausencia de contenido oculto.
- [x] 5.4 Recorrer con teclado skip link, navegación, menú, canales, Maps y formulario; verificar foco, labels, alt/title, targets táctiles y destinos `mailto:`, `tel:`, WhatsApp y Maps.

## 6. Navegación e interacciones compartidas

- [x] 6.1 Eliminar del header global la línea superior, sombra, gradiente, backdrop y pseudo-elementos oscurecedores, y verificar que el hero inicia en `y=0` sin artefactos.
- [x] 6.2 Implementar dropdown custom accesible con fallback nativo, estados ARIA, mouse, teclado, Escape y cierre fuera del control, y verificarlo en Contacto con JavaScript activo y desactivado.
- [x] 6.3 Añadir hover y focus-visible sutiles para enlaces, botones, campos, selects y controles compartidos en home, Ereditá, Putnam y Contacto, y verificar que no hay efecto magnético ni overflow.
- [x] 6.4 Ejecutar un sweep de las cuatro rutas y verificar destinos del navbar, estados de menú mobile, focus visible y reduced motion consistente.
