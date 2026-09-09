## Why

La home actual presenta a Putnam como una escena breve, pero todavía no existe una página institucional en Astro capaz de explicar con claridad quién es la firma, cómo trabaja y por qué es distinta. El `index.html` legado ya contiene los copys y una paleta crema/verde útiles como materia prima, aunque su composición es convencional, incluye voseo y no comparte la experiencia editorial animada de la home vigente.

## What Changes

- Crear una página institucional de Putnam accesible desde la navegación de la home.
- Reorganizar y editar los copys existentes de quiénes somos, proceso, misión, visión, valores, diferenciadores y contacto en español neutro, sin inventar cifras ni afirmaciones nuevas.
- Definir una dirección de arte propia basada en crema, verdes y tinta, con composición editorial asimétrica, elementos gráficos con movimiento y fotografía, sin copiar literalmente la secuencia de slides de la home ni el layout del HTML legado.
- Compartir con la home el lenguaje de marca, header, navegación, contacto y calidad de movimiento.
- Mantener Lenis y GSAP para smooth scroll, reveals y transiciones ligadas al scroll, con una experiencia estable cuando JavaScript no esté disponible o el usuario prefiera movimiento reducido.
- Garantizar una lectura cómoda y una navegación completa en desktop, tablet y mobile, incluyendo contenido largo, menú, CTA, foco y contraste.

## Capabilities

### New Capabilities

- `putnam-institutional-page`: Define el contenido, la dirección visual, la navegación, el movimiento y el comportamiento responsive/accesible de la página institucional de Putnam.

### Modified Capabilities

- `home-ui`: La navegación de la home dejará de tratar “Putnam” únicamente como un ancla de escena y ofrecerá acceso real a la nueva página institucional sin romper el recorrido actual.

## Impact

- Afecta la navegación y estructura de `src/pages/index.astro`, los estilos compartidos de `src/styles/global.css` y posiblemente la organización del contenido actualmente concentrado en `src/data/home.ts`.
- Añade una ruta/página Astro, datos o componentes reutilizables, estilos específicos y lógica GSAP/Lenis aislada para la experiencia institucional.
- No requiere nuevas dependencias ni cambios de backend o API.
