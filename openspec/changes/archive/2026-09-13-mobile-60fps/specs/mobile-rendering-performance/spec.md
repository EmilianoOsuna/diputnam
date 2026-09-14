## Purpose

Garantizar que la experiencia móvil del sitio se sienta fluida y pegada al dedo: el scroll y las transiciones de las seis rutas se ejecutan sin trabajo por frame en el hilo principal, sin efectos de pantalla completa costosos y con una prueba automatizada que falla cuando la fluidez se degrada.

## ADDED Requirements

### Requirement: Scroll móvil sin trabajo por frame en el hilo principal
En viewports móviles (`< 768px`), mientras la persona se desplaza por cualquier ruta, el sitio SHALL NOT ejecutar código propio ligado a cada frame o a cada evento de scroll del documento: ni bucles de animación continuos, ni lecturas de geometría por evento de scroll, ni escrituras de estilo por frame. Los estados que dependen de la posición de scroll (tema del header, escena activa de la home, paso activo de Proceso, dirección del scroll cue) SHALL resolverse mediante observación de intersección, de modo que sólo se ejecute código al cruzar una frontera. La única excepción admitida es el rail de las pistas horizontales, que SHALL ejecutarse como máximo una vez por frame y sólo mientras la pista se desplaza.

#### Scenario: Scroll vertical de la home
- **WHEN** se instrumenta `/` a 390×844 y se realiza un gesto de scroll continuo de 1,5 s
- **THEN** el número de callbacks de `requestAnimationFrame` y de manejadores de `scroll` del documento ejecutados por el sitio es 0, y el tema del header cambia igualmente al cruzar la frontera entre secciones

#### Scenario: Scroll vertical de una página interior
- **WHEN** se instrumenta `/putnam/`, `/eredita/`, `/unete/`, `/contacto/` o `/noticias/` a 390×844 y se realiza un gesto de scroll continuo de 1,5 s fuera de las pistas horizontales
- **THEN** el número de callbacks de `requestAnimationFrame` y de manejadores de `scroll` del documento ejecutados por el sitio es 0

#### Scenario: Swipe en una pista horizontal
- **WHEN** se hace swipe en la pista de Tipologías, Nuestra cultura o Motivos durante 1 s
- **THEN** el rail y el contador se actualizan con como máximo un callback por frame y ninguno se ejecuta una vez que la pista se detiene

### Requirement: Movimiento ligado al scroll ejecutado en el compositor
Toda animación móvil cuyo progreso dependa de la posición de scroll (barrido de escenas de la home, título persistente, rail de Proceso, rails de pistas con pin) SHALL estar ligada al scroll de forma declarativa, animando únicamente `transform` y `opacity`, de modo que avance en el mismo frame que el scroll nativo sin pasar por JavaScript.

#### Scenario: Escena de la home sigue al dedo
- **WHEN** se avanza el scroll de `/` en móvil de forma programada a una posición intermedia entre dos escenas y se lee el estado en el mismo frame
- **THEN** el desplazamiento del panel saliente y del entrante ya corresponde a esa posición, sin esperar a un frame posterior

#### Scenario: Rail de Proceso
- **WHEN** se desplaza `/putnam/` en móvil hasta el final de los marcadores de Proceso
- **THEN** la barra de progreso llega a `scaleX(1)` y en posiciones intermedias su escala corresponde a la fracción recorrida, sin código por frame

### Requirement: Sin librerías de movimiento en móvil
En viewports `< 768px` el sitio SHALL NOT descargar ni ejecutar librerías de smooth scroll ni de animación por ticker; el JavaScript propio de cada ruta en móvil SHALL pesar menos de 10 KB comprimido.

#### Scenario: Peso de scripts en móvil
- **WHEN** se carga cualquiera de las seis rutas a 390×844 y se inspeccionan las peticiones de scripts
- **THEN** no se solicita ningún módulo de smooth scroll ni de animación por ticker y la suma de scripts propios transferidos es menor de 10 KB

#### Scenario: Desktop conserva su motor
- **WHEN** se carga cualquier ruta a 1440×900
- **THEN** el motor de movimiento actual (smooth scroll, pins, parallax, barrido de escenas) sigue disponible y `npm run test:sweep` pasa

### Requirement: Sin efectos de pantalla completa costosos
Ninguna capa que ocupe la totalidad del viewport móvil SHALL llevar `filter` ni `backdrop-filter` CSS, ya sea en reposo, durante el scroll o durante la apertura y cierre del menú. El tratamiento tonal de las imágenes (saturación) SHALL venir horneado en el recurso de imagen.

#### Scenario: Imágenes de héroe y paneles
- **WHEN** se inspeccionan los estilos computados de las imágenes de panel de `/` y de los heros de las seis rutas a 390×844
- **THEN** `filter` es `none` en todas y las imágenes Unsplash incluyen el parámetro de saturación en su URL

#### Scenario: Menú móvil
- **WHEN** se abre y cierra el menú en móvil
- **THEN** el overlay no declara `backdrop-filter`, su fondo pertenece a la paleta con opacidad ≥ 0,96 y la transición de apertura/cierre sólo anima `opacity` y `transform`

#### Scenario: Mapa de Contacto
- **WHEN** se inspecciona el `iframe` del mapa en `/contacto/` a 390×844
- **THEN** su `filter` computado es `none`

### Requirement: Presupuesto de frame verificado en cada ruta
El proyecto SHALL incluir una prueba de rendimiento móvil (`npm run test:perf`) que visite las seis rutas a 390×844 con emulación móvil y CPU ralentizada ×4, sintetice un gesto de scroll de al menos 1,5 s tras la carga, y falle si se supera cualquiera de estos umbrales: percentil 95 del intervalo entre frames > 20 ms, más de 1 long task ≥ 50 ms tras el primer segundo de carga, cualquier layout forzado durante el scroll, o cualquier callback de rAF/scroll del documento cuando el requisito de cero trabajo por frame aplica.

#### Scenario: Ruta dentro del presupuesto
- **WHEN** se ejecuta `npm run test:perf` contra `astro preview` con el sitio corregido
- **THEN** las seis rutas pasan y la salida registra por ruta: p50/p95 de intervalo entre frames, frames > 33 ms, long tasks, layouts forzados y callbacks por frame

#### Scenario: Regresión detectada
- **WHEN** se reintroduce un listener de `scroll` que lea `getBoundingClientRect` por evento en cualquier ruta
- **THEN** `npm run test:perf` falla para esa ruta indicando el umbral incumplido

### Requirement: Degradación explícita sin pérdida de contenido
Cuando el navegador móvil no soporte animaciones ligadas al scroll, o cuando `prefers-reduced-motion: reduce` esté activo, el sitio SHALL mostrar todo el contenido en su estado final sin depender de JavaScript por frame, conservando navegación, menú, contadores y ausencia de overflow horizontal.

#### Scenario: Sin soporte de animaciones ligadas al scroll
- **WHEN** se carga `/` en un navegador móvil sin `animation-timeline`
- **THEN** las cuatro escenas se muestran apiladas a pantalla completa con snap vertical, cada título está visible y los enlaces funcionan

#### Scenario: Movimiento reducido
- **WHEN** `prefers-reduced-motion: reduce` está activo en cualquier ruta móvil
- **THEN** no se ejecuta ninguna animación de entrada, reveal o barrido; el contenido está visible desde el primer render y `scrollWidth === clientWidth`
