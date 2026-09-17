## MODIFIED Requirements

### Requirement: Scroll móvil sin trabajo por frame en el hilo principal
En viewports móviles (`< 768px`), mientras la persona se desplaza por cualquier ruta, el sitio SHALL NOT ejecutar código propio ligado a cada frame o a cada evento de scroll del documento: ni bucles de animación continuos, ni lecturas de geometría por evento de scroll, ni escrituras de estilo por frame. Los estados que dependen de la posición de scroll (tema del header, escena activa de la home, paso activo de Proceso, dirección del scroll cue) SHALL resolverse mediante observación de intersección, de modo que sólo se ejecute código al cruzar una frontera. Se admiten dos excepciones acotadas: el rail de las pistas horizontales, que SHALL ejecutarse como máximo una vez por frame y sólo mientras la pista se desplaza; y el aterrizaje del swipe de la home, un tween de 500 ms como máximo que SHALL ejecutarse sólo tras soltar el dedo (una vez por frame) y nunca durante el arrastre ni en reposo.

#### Scenario: Scroll vertical de la home
- **WHEN** se instrumenta `/` a 390×844 y se realiza un gesto de scroll continuo de 1,5 s
- **THEN** el número de manejadores de `scroll` del documento ejecutados por el sitio es 0, los callbacks de `requestAnimationFrame` no superan los del tween de aterrizaje (≤ 36), ninguno se ejecuta en los 500 ms posteriores a que la página se detiene, y el tema del header cambia igualmente al cruzar la frontera entre secciones

#### Scenario: Scroll vertical de una página interior
- **WHEN** se instrumenta `/putnam/`, `/eredita/`, `/unete/`, `/contacto/` o `/noticias/` a 390×844 y se realiza un gesto de scroll continuo de 1,5 s fuera de las pistas horizontales
- **THEN** el número de callbacks de `requestAnimationFrame` y de manejadores de `scroll` del documento ejecutados por el sitio es 0

#### Scenario: Swipe en una pista horizontal
- **WHEN** se hace swipe en la pista de Tipologías, Nuestra cultura o Motivos durante 1 s
- **THEN** el rail y el contador se actualizan con como máximo un callback por frame y ninguno se ejecuta una vez que la pista se detiene
