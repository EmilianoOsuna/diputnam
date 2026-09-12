## Purpose

Garantizar que las marcas de Putnam y Ereditá (isotipo del header, marca del hero de Ereditá y marca de agua de los CTA) se rendericen siempre visibles, nítidas y bien encuadradas en cualquier navegador, densidad de pantalla y viewport.

## ADDED Requirements

### Requirement: Marcas con fallback y sin dependencia de un único derivado

Cada marca SHALL entregarse de forma que se muestre aunque falte o falle un derivado optimizado concreto: como vector (SVG) o como `<picture>`/`srcset` con al menos un formato ampliamente soportado (PNG) además del formato moderno. Si el derivado optimizado no existe o responde con error, el navegador SHALL seguir mostrando la marca.

#### Scenario: Derivado optimizado ausente
- **WHEN** el derivado optimizado de una marca no está disponible en el servidor (build incompleto o pipeline de imágenes degradado)
- **THEN** la marca sigue visible gracias al fallback y la página no presenta un hueco en su lugar

#### Scenario: Navegador sin soporte de formato moderno
- **WHEN** el navegador no acepta el formato moderno declarado
- **THEN** recibe el formato de respaldo y la marca se muestra con la misma composición

### Requirement: Nitidez del isotipo del header en pantallas de alta densidad

El isotipo del header SHALL renderizarse con una resolución intrínseca de al menos 3× el tamaño CSS de su cajón (o como vector), de modo que no se perciba borroso en pantallas móviles de densidad 2× y 3×.

#### Scenario: Header en móvil 3×
- **WHEN** el header se inspecciona en un dispositivo con `devicePixelRatio` 3 y el cajón del isotipo mide ~44×52 px CSS
- **THEN** la imagen entregada tiene al menos ~156 px de ancho intrínseco (o es SVG) y sus bordes se ven definidos

### Requirement: Encuadre de la marca de Ereditá en el hero

La marca de Ereditá del hero SHALL ocupar visualmente el área que la composición le asigna: el arte MUST estar recortado a su caja de dibujo (sin márgenes transparentes desproporcionados ni descentrado) y en móvil MUST quedar íntegramente dentro del viewport, sin recortarse por el borde derecho.

#### Scenario: Hero de Ereditá en móvil
- **WHEN** `/eredita/` se abre en un viewport de 390 px
- **THEN** la marca completa ("E" + palabra EREDITÁ) es visible dentro del viewport, centrada dentro de su propio cajón y con un margen lateral de al menos 1 rem

#### Scenario: Hero de Ereditá en desktop
- **WHEN** `/eredita/` se abre en un viewport ≥ 1280 px
- **THEN** la marca conserva la posición de la composición actual pero sin el desplazamiento provocado por márgenes transparentes del arte

### Requirement: Marca de agua legible y contenida en las secciones CTA

La marca de agua Putnam/Ereditá de las secciones CTA SHALL ser perceptible sobre su fondo (contraste suficiente para reconocer el isotipo, sin competir con el texto). Si la composición la hace sangrar por un borde, la sección MUST recortarla: la marca no SHALL provocar desbordamiento horizontal del documento en ningún ancho ≥ 320 px.

#### Scenario: CTA en móvil
- **WHEN** la sección CTA de Putnam, Únete, Contacto, Noticias o Ereditá se muestra en 390 px
- **THEN** el isotipo se distingue a simple vista sobre el fondo y `document.documentElement.scrollWidth` es igual al ancho del viewport

#### Scenario: Legibilidad del texto del CTA
- **WHEN** el título y las acciones del CTA se superponen a la marca de agua
- **THEN** el texto conserva su contraste y la marca no interfiere con la lectura
