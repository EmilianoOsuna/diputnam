## Purpose

Sustituir en desktop la barra de scroll nativa del documento por un indicador propio del sitio —un punto discreto en el borde derecho, réplica del de tierra-taza— que refleje el progreso de scroll, se oculte cuando nadie se desplaza y degrade a la barra nativa donde el navegador no pueda animarlo sin JavaScript. En móvil se conserva la barra nativa.

## ADDED Requirements

### Requirement: Barra de scroll nativa oculta con fallback
En viewports `≥ 768px`, en todas las rutas del sitio (las seis páginas, las rutas de proyecto y nota, y `/404`), cuando el navegador soporta animaciones ligadas al scroll (`animation-timeline: scroll()`), el documento SHALL NOT mostrar la barra de scroll nativa del sistema y SHALL mostrar en su lugar el riel de scroll propio. Cuando el navegador no soporta esa característica, el documento SHALL conservar la barra nativa sin cambios y SHALL NOT renderizar el riel propio. Ocultar la barra nativa SHALL NOT bloquear el scroll por rueda, teclado, gesto táctil ni anclas.

#### Scenario: Navegador con soporte
- **WHEN** se abre cualquier ruta a 1280×800 en un navegador que soporta `animation-timeline: scroll()`
- **THEN** no hay barra de scroll nativa visible sobre el documento, el riel propio existe en el DOM, y el documento sigue desplazándose con rueda, teclado y gestos

#### Scenario: Navegador sin soporte
- **WHEN** se abre cualquier ruta a 1280×800 en un navegador que no soporta `animation-timeline: scroll()`
- **THEN** la barra de scroll nativa se muestra como antes y el riel propio no es visible

#### Scenario: Móvil sin riel
- **WHEN** se abre cualquier ruta a 390×844
- **THEN** la barra de scroll nativa se conserva, el riel propio no se muestra y el sitio no registra ningún manejador de `scroll` propio

### Requirement: Punto que refleja el progreso de scroll
El riel SHALL ser invisible por sí mismo (sin línea ni canal) y ocupar el borde derecho del viewport a lo largo de casi toda su altura, conteniendo un único punto circular de unos 10 px con una sombra suave. La posición vertical del punto SHALL corresponder linealmente al progreso de scroll del documento: en el tope del documento el punto está en el extremo superior del riel y al final del documento en el extremo inferior. Esa correspondencia SHALL resolverse de forma declarativa, ligada al scroll nativo del documento, sin ejecutar JavaScript por frame ni por evento de scroll, y SHALL seguir siendo correcta cuando el scroll lo conduce el motor de smooth scroll de desktop y cuando la altura del documento cambia (por ejemplo, al abrir un acordeón o cargar imágenes).

#### Scenario: Progreso intermedio
- **WHEN** se lleva el scroll del documento programáticamente al 50 % de su recorrido y se lee la posición del punto en el mismo frame
- **THEN** el centro del punto está a la mitad del riel (±2 px)

#### Scenario: Extremos del documento
- **WHEN** el documento está en `scrollY = 0` o en su scroll máximo
- **THEN** el punto queda alineado con el extremo superior o inferior del riel respectivamente, sin sobresalir del riel

### Requirement: Auto-ocultado del riel
En viewports `≥ 768px` el riel SHALL ser invisible mientras el documento está quieto, SHALL aparecer con un fundido de ~300 ms en cuanto la posición de scroll cambia y SHALL desvanecerse tras aproximadamente 1 s sin cambios de scroll. El fundido SHALL animar únicamente `opacity`.

#### Scenario: Reposo en desktop
- **WHEN** una ruta lleva más de 1,5 s sin cambiar su posición de scroll en un viewport de 1280×800
- **THEN** el riel tiene opacidad 0

#### Scenario: Scroll activo en desktop
- **WHEN** la posición de scroll cambia en un viewport de 1280×800
- **THEN** el riel alcanza opacidad 1 en menos de 300 ms y vuelve a 0 entre 1 s y 1,5 s después del último cambio

### Requirement: Contraste y capas del riel
El punto SHALL ser legible sobre los tres fondos de la paleta (crema `#f4eedf`, verde profundo `#003a36` y azul `#143767`) sin depender del tema activo del header. El riel SHALL dibujarse por encima del header y footer fijos, SHALL NOT interceptar eventos de puntero y SHALL estar excluido del árbol de accesibilidad.

#### Scenario: Sobre fondo crema y sobre fondo oscuro
- **WHEN** el punto se sitúa sobre una sección crema y luego sobre una sección verde profundo o azul
- **THEN** en ambos casos el punto se distingue del fondo a simple vista

#### Scenario: Puntero sobre el riel
- **WHEN** el cursor se coloca sobre la zona del riel y se hace clic
- **THEN** el clic llega al contenido que hay debajo y el riel no figura en la navegación por lector de pantalla
