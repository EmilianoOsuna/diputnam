## Context

Véanse `proposal.md` para la motivación y `specs/contacto-page/spec.md` para el contrato completo. El sitio ya resuelve páginas internas con Astro, `SiteHeader`, `ContactFooter`, datos en `home.ts`, estilos globales y un script de motion por página. Los mockups de contacto comparten un solo DOM y llevan sus variantes responsive en CSS; `canvas.json` exige trasladar el movimiento CSS de demostración a Lenis + GSAP/ScrollTrigger.

Las restricciones principales son fidelidad exacta, mejora progresiva, cero dependencias nuevas y uso de `100dvh` sin los límites artificiales del canvas.

## Goals / Non-Goals

**Goals:**

- Integrar el mockup como una página Astro aislada sin duplicar el shell ni la arquitectura de motion, y corregir el shell compartido que la nueva ruta expone.
- Mantener datos de contacto y destinos compartidos desde una sola fuente.
- Separar layout CSS, estado accesible HTML y mejora GSAP para que la página funcione sin JavaScript.
- Hacer verificables los valores visuales y de movimiento en los viewports aprobados.

**Non-Goals:**

- Crear un backend de formulario, protección anti-spam, tracking o CMS.
- Añadir interacción magnética, captura de puntero o cambios de layout al pasar el mouse.
- Extraer una abstracción común de motion antes de que exista una tercera necesidad demostrada.
- Añadir snap, wheel interception, SplitText u otra dependencia.

## Decisions

### Página delgada y componentes existentes

`contacto.astro` compondrá directamente las seis secciones del mockup, importará `global.css` y `contacto.css`, y montará los componentes compartidos. Se evitarán componentes por sección porque el contenido es único y el DOM aprobado es corto y estable.

`SiteHeader` conservará una sola implementación y sus callers actuales, pero resolverá un mapa único de rutas reales para todas las páginas: marca `/`, Ereditá `/eredita/`, Putnam `/putnam/` y Contacto `/contacto/`. Se descarta duplicar el header o mantener anclas hermanas como fallback. `ContactFooter` se usará sin cambios.

El header perderá sus pseudo-elementos decorativos, sombra, gradiente y cualquier borde superior. El tema solo controlará color y asset de logo, evitando que el fondo del contenido altere la geometría del shell.

### Datos compartidos y asset local

El objeto `contact` se ampliará con `address`, `hours`, `responseTime`, `mapsUrl` y `coordinates`. El contenido editorial exclusivo de esta página permanecerá en el template; moverlo a otro módulo no aporta reutilización. Email, teléfono, ciudad y WhatsApp conservarán los valores existentes.

El JPEG aprobado se copiará sin procesarlo a `public/assets/contacto-hero.jpg`; Astro lo servirá por su ruta pública y se reservarán `width`/`height` para evitar layout shift. El CTA seguirá usando el PNG existente. Se descartan URLs remotas y pipelines de imágenes nuevos.

### CSS portado y scoped por página

`contacto.css` conservará clases y valores del mockup bajo `.contacto-page`. Las reglas compartidas de interacción vivirán en `global.css` para que home, Ereditá, Putnam y Contacto respondan igual. Los breakpoints se mantendrán en `899px` y `767px`; no habrá un tercer sistema responsive.

Los usos de `var(--vh)` se reemplazarán directamente por `100dvh`. En particular, no se definirá `--vh` ni se copiarán los clamps `1000px`/`844px`. La posición sticky usada para previsualizar `.pin-stage` en el canvas no será la fuente del pin real: ScrollTrigger será dueño de esa fijación en desktop, y la base CSS quedará en flujo para que reduced motion y ausencia de JavaScript no inmovilicen contenido.

### Markup accesible antes de motion

El DOM tendrá un solo `h1`, headings enlazados por `aria-labelledby`, labels reales y data hooks aditivos. Los h2 animados usarán `.line > span` escritos en Astro; esta decisión evita segmentación runtime y conserva el patrón ya aprobado para el hero. Los cortes se validarán en `1440px` y `390px`.

El mapa usará un iframe sin API key construido con las coordenadas aprobadas y conservará el enlace externo separado. El formulario se renderizará como UI no transmisora con `type="button"`; no interceptará submit ni simulará éxito. Esta limitación será visible para QA, mientras email y WhatsApp permanecen funcionales.

### Interacciones compartidas

Los selects se implementarán como un control custom accesible con un `<select>` nativo de respaldo, sin dependencia nueva. El control visible mantendrá label, valor y estados ARIA; teclado, Escape y click fuera cerrarán la lista. Los estilos de hover/focus de enlaces, botones, campos y controles se añadirán a `global.css` con transiciones cortas y `prefers-reduced-motion` como límite. No se crearán controladores de puntero ni efectos magnéticos.

### Controlador de motion aislado

`contacto-motion.ts` copiará el ciclo de vida probado de los scripts de Ereditá/Putnam: guard de root y reduced motion, una instancia Lenis, bridge al ticker, `gsap.context`, `gsap.matchMedia` y cleanup en `pagehide`. No se extraerá una utilidad común durante este cambio, para evitar modificar controladores estables.

El hero y los grupos usarán tweens `from`; ningún contenido se ocultará desde CSS. El parallax se limitará a `min-width: 768px`. El pin, los triggers de cada motivo y el tween scrub del rail vivirán en `min-width: 900px`; el callback de `matchMedia` restaurará clases, anchos, transforms y pin spacers.

La sección no usará snap ni interceptará wheel/touch. Lenis seguirá activo mientras ScrollTrigger fija el stage. El contador será discreto por motivo y el rail será continuo con scrub, replicando el reparto de responsabilidades de `putnam-motion.ts`.

### Verificación por evidencia mínima

La validación combinará `npm run build`, capturas Playwright en `1440px` y `390px`, una prueba de overflow a `320px`, un viewport de más de `1000px` de alto y recorridos manuales de motion, cambio de breakpoint, reduced motion, JS desactivado, teclado y enlaces. No se añadirá una suite nueva si una prueba Playwright puntual y la checklist del spec cubren el cambio.

## Risks / Trade-offs

- [Los cortes manuales de h2 pueden envolver distinto en anchos intermedios] → validar los dos targets aprobados y 320px; introducir SplitText solo tras una falla comprobada y aprobación.
- [Pin y layout grid pueden dejar spacers o transforms al redimensionar] → encapsular todo el bloque en `gsap.matchMedia`, usar `invalidateOnRefresh` y limpiar en su callback.
- [El iframe puede variar visualmente por contenido de Google] → fijar contenedor/aspect-ratio y comparar la composición, no los tiles externos.
- [El formulario parece accionable sin backend] → no enviar requests ni anunciar éxito; mantener canales funcionales junto al formulario hasta definir el servicio.
- [Modificar enlaces del header puede afectar otras páginas] → usar un mapa de rutas único, probar las cuatro rutas y mantener el overlay mobile existente.
- [El dropdown custom puede perder semántica o foco] → conservar un select nativo de respaldo, usar estados ARIA explícitos y probar mouse, teclado, Escape y JavaScript desactivado.
- [El asset temporal podría desaparecer antes de implementar] → copiarlo como primer paso de implementación y comprobar dimensiones/hash visual antes de continuar.

## Migration Plan

1. Añadir datos y asset sin cambiar rutas existentes.
2. Añadir la ruta, su stylesheet y su controlador aislado.
3. Ajustar el header y navegación compartidos, y añadir el control de select/estados interactivos globales.
4. Ejecutar build y QA visual/funcional de las cuatro rutas antes de publicar.

El cambio es aditivo. Para rollback, retirar la ruta y el asset, revertir el mapa de rutas, el control custom y los estilos globales; las páginas existentes conservarán su contenido.

## Open Questions

- El envío real del formulario queda diferido hasta que exista endpoint, consentimiento, validación acordada, anti-spam y estados de respuesta.
- La URL del iframe podrá sustituirse por una URL oficial de Google Maps si Putnam la entrega; el destino externo aprobado no cambia.
