## Context

La implementación vigente es un sitio Astro de una sola página. `src/pages/index.astro` contiene el shell y cuatro escenas full-screen; `src/data/home.ts` concentra su contenido; `src/styles/global.css` define el sistema visual; y `src/scripts/motion.ts` coordina Lenis, GSAP/ScrollTrigger, anclas, flecha y menú mobile. La página institucional solo existe en el `index.html` legado como `page-nosotros`, con copys aprovechables y una paleta crema/verde, pero con layout de sidebar, estilos embebidos, imágenes remotas y redacción inconsistente. Véanse los contratos en `specs/putnam-institutional-page/spec.md` y `specs/home-ui/spec.md`.

## Goals / Non-Goals

**Goals:**

- Construir una ruta institucional que se sienta parte del mismo sitio sin repetir el stage full-screen.
- Traducir el contenido abundante a una secuencia editorial escaneable y cómoda de leer.
- Darle una firma visual memorable mediante composición, tipografía, color, fotografía y un motivo de “trazo estructural”.
- Mantener motion fluido y responsive con una base HTML/CSS completamente utilizable.
- Evitar que la lógica nueva interfiera con ScrollTrigger, Lenis o el menú de la home.

**Non-Goals:**

- Rediseñar las demás escenas o crear las páginas de Ereditá y Contacto.
- Migrar todo el `index.html` legado o preservar su sidebar y tarjetas.
- Introducir CMS, tracking, formulario, nuevas dependencias o afirmaciones comerciales nuevas.
- Convertir el recorrido institucional en scroll-jacking o snaps obligatorios.

## Decisions

### Ruta Astro y shell compartido

Se añadirá `/putnam/` como página estática Astro. El header, el menú mobile y el bloque de contacto se extraerán a componentes compartidos solo en la medida necesaria para impedir divergencias de markup, ARIA y datos. La home conservará su escena `#putnam`; el enlace del navbar apuntará a `/putnam/` y el título de esa escena también podrá funcionar como entrada contextual.

Se descartó insertar todo en un modal o ampliar la escena actual porque el contenido institucional requiere URL directa, historial, lectura larga y semántica propia. También se descartó duplicar el header, porque duplicaría correcciones de accesibilidad y responsive.

### Dirección de arte: “la línea que sostiene”

La página se articulará alrededor de una línea verde continua inspirada en planos, ejes de obra y coordinación: aparece como regla en el hero, acompaña el avance del proceso, conecta misión/visión/valores y desemboca en el CTA. No será una ilustración literal ni un adorno flotante independiente; su posición reforzará la retícula y el orden narrativo.

La secuencia propuesta será:

1. Hero crema con un titular grande alineado a una retícula asimétrica, una breve introducción y una fotografía arquitectónica recortada fuera del centro.
2. Declaración “Diseño + ejecución” con texto editorial y media sticky en desktop; en mobile, ambos vuelven al flujo.
3. Proceso Putnam como seis hitos numerados sobre la línea estructural, evitando tarjetas repetitivas.
4. Franja verde profunda para misión, visión y valores, con cambios de escala y alineación, no tres columnas idénticas.
5. Diferenciadores como índice editorial de cuatro entradas con imagen o detalle reactivo, sin emoji.
6. CTA final amplio que enlaza a email, teléfono o WhatsApp usando los datos locales existentes.

La paleta partirá de crema `#f4eedf`, crema profunda del legado, verde oscuro y verde estructural; el azul actual solo permanecerá si funciona como acento secundario de marca. La tipografía seguirá DM Sans mientras no exista una fuente autorizada adicional. Se descartó replicar el hero verde y la retícula de cards del HTML legado porque produciría una página corporativa genérica y rompería la continuidad editorial con la home.

### Contenido local estructurado

El copy institucional se trasladará a un módulo de datos TypeScript por grupos semánticos: introducción, proceso, principios, diferenciadores y CTA. La edición será conservadora: eliminar voseo, reducir repetición, mejorar escaneabilidad y conservar el sentido de las afirmaciones existentes. Las imágenes tendrán fuentes y alt explícitos; durante implementación se privilegiarán assets locales/licenciados, y cualquier placeholder remoto deberá quedar claramente sustituible.

Se descartó mantener el contenido embebido en el template porque dificultaría revisar consistencia, cambiar medios y migrarlo a Sanity más adelante.

### Motion progresivo y aislado por página

El HTML se mostrará completo por defecto. Un script institucional activará Lenis y ScrollTrigger únicamente cuando no haya preferencia de movimiento reducido y añadirá una clase de mejora después de inicializarse. La animación incluirá reveals por grupos, parallax sutil de medios, progreso de la línea estructural y una sección sticky limitada; no alterará el orden DOM ni ocultará contenido antes de confirmar la inicialización.

La inicialización común de Lenis se podrá extraer a una utilidad pequeña, mientras las timelines de home e institucional permanecerán separadas. Se usará `gsap.matchMedia()` para definir desktop/mobile y revertir estados al cambiar de breakpoint; cada trigger se destruirá al salir de su contexto. Se descartó reutilizar directamente el timeline del stage porque depende de paneles absolutos y marcadores de `100svh`, incompatible con contenido largo.

### Responsive por recomposición

Desktop usará una retícula de 12 columnas, márgenes fluidos y un ancho máximo de lectura. Tablet reducirá offsets y amplitud del sticky. En mobile, todas las piezas críticas regresarán al flujo de una columna, la línea pasará a eje lateral o reglas cortas, los hitos conservarán numeración y las secciones sticky se desactivarán. Se mantendrá el breakpoint actual de 767 px para el menú, pero los ajustes de composición usarán rangos adicionales cuando el contenido lo requiera.

No se reducirá la versión desktop por simple escala: la recomposición evita tipografía minúscula, interacciones dependientes de hover y alturas rígidas.

### Navegación y accesibilidad

La ruta tendrá un único `h1`, landmarks, encabezados jerárquicos, skip link, foco visible y enlaces reales. Los elementos visuales decorativos quedarán fuera del árbol accesible. La preferencia de movimiento reducido eliminará smooth scroll, sticky animado y transforms persistentes.

## Risks / Trade-offs

- [La línea animada puede sentirse ornamental o competir con el copy] → ligarla estrictamente a la retícula y al progreso del contenido, con contraste y grosor discretos.
- [Sticky, imágenes y texto largo pueden fallar en pantallas bajas] → limitar sticky a desktop con altura suficiente y volver al flujo mediante `matchMedia`.
- [Dos instancias de Lenis o triggers globales pueden duplicar listeners] → cargar un controlador por página, aislar selectores bajo un root y limpiar contextos.
- [El copy legado contiene afirmaciones amplias y repetición] → editar solo tono y estructura; no incorporar cifras ni credenciales sin aprobación.
- [Las imágenes remotas pueden cambiar o fallar] → seleccionar assets locales antes de aceptación y reservar dimensiones para evitar layout shift.
- [La ruta nueva puede romper anclas actuales] → cambiar únicamente el enlace “Putnam”, conservar ids de escenas y probar todos los destinos del navbar.

## Migration Plan

1. Incorporar datos, componentes compartidos y ruta institucional sin retirar la home actual.
2. Añadir estilos y motion con mejora progresiva.
3. Cambiar el enlace de navegación de Putnam.
4. Publicar como cambio aditivo. Si aparece una regresión, revertir el enlace y retirar la ruta nueva; la home seguirá operativa porque su escena y sus anclas permanecen intactas.
