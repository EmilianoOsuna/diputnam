## 1. Header y footer compartidos (`site-shell-chrome`)

- [x] 1.1 Agrandar `.brand--mark`/`.brand-copy` en `global.css` (desktop y el media query móvil ~767px) y verificar en el navegador a 1440px y 390px que el isotipo se ve más grande sin desbordar el header ni tapar la navegación.
- [x] 1.2 Añadir un helper puro (p. ej. en `src/lib/content.ts`) que, a partir de `organization.sameAs`, devuelva las URLs de Facebook/Instagram reconocidas por dominio, e incluir siempre `contact.whatsapp`; verificar con un caso de `sameAs` vacío y otro con Facebook+Instagram (unit check o prueba manual en consola).
- [x] 1.3 Actualizar `ContactFooter.astro` para renderizar la fila de iconos de redes (solo las URLs disponibles) y la línea de crédito "Código y diseño · Emiliano Osuna" alineada a la derecha; verificar que sin redes configuradas solo aparece WhatsApp.
- [x] 1.4 Adelgazar `.site-footer`/`.site-footer--flow` en `global.css` y en los overrides por página (`putnam.css`, `unete.css`, `eredita.css`, `contacto.css`) reduciendo `min-height`/padding respecto a los valores actuales (14rem/18rem); verificar en las seis páginas que el pie de página se ve más delgado, sin overlap ni overflow horizontal en 390px.
- [x] 1.5 Verificar accesibilidad de los nuevos iconos (nombre accesible, `target="_blank" rel="noreferrer"`, foco visible) con teclado en al menos una página.

## 2. Ereditá — galería y tipologías (`eredita-project-lines`)

- [x] 2.1 Cambiar `.ed-masonry` en `eredita.css` a `column-count: 2` por debajo de 640px (en vez de 1) y verificar visualmente en 390px que las imágenes forman un masonry de 2 columnas con alturas alternadas.
- [x] 2.2 Adaptar el CSS de `.ed-h-track`/`.ed-h-panel` para que el layout de scroll-snap horizontal hoy usado solo en móvil (`max-width: 899px`) también aplique en desktop, ajustando anchos/columnas de panel para ese ancho y mostrando `.ed-h-head`/`.ed-h-progress` en todos los anchos; verificar que el contador y la barra de progreso son visibles y se actualizan en ≥900px.
- [x] 2.3 En `eredita-motion.ts`, quitar el gate `min-width:768px`/`min-width:900px` que decide mobile vs desktop para tipologías y montar `mountHorizontalTrack` siempre que exista `[data-h-track]`; verificar con teclado (flechas) y con gesto de trackpad/rueda horizontal en desktop que los paneles avanzan sin que la página quede fijada.
- [x] 2.4 Retirar de `desktop/eredita.ts` el bloque `media.add('(min-width: 900px)', ...)` que pinea `.ed-h-wrapper` e intercepta `wheel`; verificar que el scroll vertical de la página nunca queda bloqueado al pasar por la sección de tipologías.
- [x] 2.5 Ajustar `grid-template-columns` de `.ed-h-panel` en desktop para que el área de medios ocupe ≥55% del ancho del panel; verificar con DevTools que la proporción se cumple en 1440px.
- [x] 2.6 Ejecutar `npm run build` y verificar que `/eredita/eredita-art/` (o el slug de proyecto existente) se genera sin errores.

## 3. Putnam — sección de proceso (`putnam-institutional-page`)

- [x] 3.1 Reproducir el layout de `.process` como una sola `100dvh` con track horizontal (`.process-visual`/pasos como paneles), reutilizando `mountHorizontalTrack` o el mismo patrón aplicado en Ereditá; verificar que la sección ya no ocupa ~6×100dvh de scroll vertical.
- [x] 3.2 Conectar el contador (`data-process-current`) y el rail (`data-line-progress`) a la nueva fuente de progreso del track horizontal; verificar que avanzan `01 → 06` acorde al panel activo.
- [x] 3.3 Retirar de `putnam-motion.ts`/`desktop/putnam.ts` el bloque `processMarkers`/`ScrollTrigger` por marcador y el `.process-markers` de `putnam.css`/`putnam.astro`; verificar que no queda un contenedor de 600dvh de alto muerto en el DOM.
- [x] 3.4 Adaptar el CSS mobile existente de `.process-stage`/`.process-marker` (que ya usa 100dvh por paso) al nuevo layout único, conservando la experiencia de swipe ya validada en el audit móvil previo; verificar en 390px que no hay regresión.
- [x] 3.5 Ejecutar `npm run build` y verificar que `/putnam/` se genera sin errores; revisar manualmente que el scroll de la página nunca se bloquea al llegar a la sección de proceso.

## 4. Únete — cultura, alineación, vacíos y CTA (`unete-careers-page`)

- [x] 4.1 Añadir imagen de fondo (con `data-parallax` y gradiente, siguiendo el patrón de `.un-hero`) a `.un-culture`/`.pin-stage` en `unete.astro`/`unete.css`, sin tocar `desktop/unete.ts`; verificar que el contador y el rail siguen funcionando igual que antes.
- [x] 4.2 Quitar/realinear el `margin-left: 12%` de `.values`/`.kpis` en `unete.css` para que coincida con el borde izquierdo de `.section-head`; verificar en 1440px con una guía vertical que ambos bordes coinciden.
- [x] 4.3 Reducir el padding/espaciado entre el título y `.empty-panel` en `.un-openings`; verificar visualmente que el bloque se percibe compacto sin quitar contenido.
- [x] 4.4 Rebalancear `.un-cta` (título, acciones, `.cta-mark`) para que no quede como texto suelto sobre área vacía en ≥1280px; verificar visualmente el resultado en desktop.
- [x] 4.5 Ejecutar `npm run build` y verificar que `/unete/` se genera sin errores.

## 5. Contacto — canales móviles, formulario y footer (`contacto-page`)

- [x] 5.1 Reproducir el recorte del correo en `.ct-channels .index-row` en un viewport real o emulado de 320–390px para confirmar la causa exacta (tamaño de fuente, `overflow-wrap`, o solape de columnas).
- [x] 5.2 Aplicar el fix correspondiente en `contacto.css` (tamaño de fuente/wrap) y verificar que la dirección de correo configurada se lee completa en 320px, 375px y 390px sin recortarse.
- [x] 5.3 Implementar el barrido de texto en verde en `.f-row` con `background-clip: text` + `background-position` en hover/`:focus-within`, con fallback de color sólido; verificar visualmente el hover y el foco por teclado (Tab) en desktop.
- [x] 5.4 Aplicar en `contacto.css` el mismo footer delgado de `site-shell-chrome` a `.site-footer--flow` (quitar los `min-height: 14rem`/`18rem` fijos); verificar que el pie de página de `/contacto/` luce igual de delgado que en el resto de páginas, con iconos de redes y crédito.
- [x] 5.5 Ejecutar `npm run build` y verificar que `/contacto/` se genera sin errores; revisar manualmente 320px sin overflow horizontal.

## 6. Cierre

- [x] 6.1 Ejecutar `npm run build` completo del sitio y verificar que termina sin errores.
- [x] 6.2 Revisar manualmente las seis páginas en desktop (1440px) y móvil (390px) contra las capturas originales de la retroalimentación, confirmando que cada punto del proposal quedó resuelto.
- [x] 6.3 Correr `graphify update .` para mantener el grafo del repo al día con los cambios de código.
