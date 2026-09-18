## MODIFIED Requirements

### Requirement: Encuadre de la marca de Ereditá en el hero

La marca de Ereditá del hero SHALL ocupar visualmente el área que la composición le asigna: el arte MUST estar recortado a su caja de dibujo (sin márgenes transparentes desproporcionados ni descentrado) y en móvil MUST quedar íntegramente dentro del viewport, sin recortarse por el borde derecho. La marca del hero es el logotipo del proyecto, no una marca de agua: no SHALL solaparse con ningún elemento del bloque de texto del hero (enlace de regreso, kicker, título, subtítulo) en ningún viewport de 320 × 568 px o mayor, móvil o desktop, incluidos los viewports cortos de Safari iOS con la barra de direcciones desplegada; cuando el texto crece (títulos de varios renglones, títulos editados desde el CMS), la marca SHALL ceder espacio en vez de cruzarse con él.

#### Scenario: Hero de Ereditá en móvil
- **WHEN** `/eredita/` se abre en un viewport de 390 px
- **THEN** la marca completa ("E" + palabra EREDITÁ) es visible dentro del viewport, centrada dentro de su propio cajón y con un margen lateral de al menos 1 rem

#### Scenario: Hero de Ereditá en desktop
- **WHEN** `/eredita/` se abre en un viewport ≥ 1280 px
- **THEN** la marca conserva la posición de la composición actual pero sin el desplazamiento provocado por márgenes transparentes del arte

#### Scenario: Hero de proyecto en un viewport corto
- **WHEN** `/eredita/` o una página de proyecto (`/eredita/<slug>/`) se abre a 375 × 635 px o a 360 × 640 px
- **THEN** el rectángulo de la marca no intersecta el rectángulo de ningún elemento del bloque de texto del hero y la marca sigue íntegra dentro del viewport

#### Scenario: Hero en una laptop de 14"
- **WHEN** `/eredita/` o una página de proyecto se abre a 1366 × 768 px o a 1512 × 982 px
- **THEN** la marca ocupa su columna derecha sin intersectar el enlace de regreso, el kicker, el título ni el subtítulo, y el título conserva su ancho actual

### Requirement: Marca de agua legible y contenida en las secciones CTA

La marca de agua Putnam/Ereditá de las secciones CTA SHALL ser perceptible sobre su fondo (contraste suficiente para reconocer el isotipo, sin competir con el texto). Si la composición la hace sangrar por un borde, la sección MUST recortarla: la marca no SHALL provocar desbordamiento horizontal del documento en ningún ancho ≥ 320 px. En móvil (< 768 px) la marca de agua no SHALL cruzarse con los enlaces de acción del CTA: SHALL quedar debajo de ellos, dentro de la misma sección, y la sección SHALL crecer lo necesario para contenerla.

#### Scenario: CTA en móvil
- **WHEN** la sección CTA de Putnam, Únete, Contacto, Noticias o Ereditá se muestra en 390 px
- **THEN** el isotipo se distingue a simple vista sobre el fondo y `document.documentElement.scrollWidth` es igual al ancho del viewport

#### Scenario: Legibilidad del texto del CTA
- **WHEN** el título y las acciones del CTA se superponen a la marca de agua en desktop
- **THEN** el texto conserva su contraste y la marca no interfiere con la lectura

#### Scenario: Marca de agua y enlaces en móvil
- **WHEN** la sección CTA de Putnam, Únete, Contacto o Noticias se muestra a 390, 375 o 360 px de ancho
- **THEN** el borde superior de la marca de agua queda por debajo del borde inferior del último enlace de acción y la marca sigue siendo visible dentro de la sección antes del pie de página
