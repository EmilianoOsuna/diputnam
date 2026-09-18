## MODIFIED Requirements

### Requirement: Contenido accesible durante la transición

La home SHALL conservar un estado estable para movimiento reducido, JavaScript no disponible y viewports mobile. El contenido completo SHALL seguir disponible y el barrido SHALL poder omitirse sin ocultar títulos, acciones o imágenes. En móvil, mientras el slider está activo, el gesto vertical SHALL pertenecer exclusivamente al slider: el documento no SHALL desplazarse ni rebotar (rubber-band) bajo el dedo y el navegador no SHALL tratar el gesto como scroll de página; el cierre del menú y el pinch-zoom no forman parte de este gesto. Un cambio de altura del viewport (barra de direcciones que se colapsa o despliega, rotación) no SHALL dejar visible ninguna franja de una escena vecina: la escena activa SHALL volver a cubrir el viewport completo en cuanto el navegador notifique el cambio (`resize` de `window` o de `visualViewport`), sin transición visible. Las capas del slider SHALL animarse siempre en la misma unidad (px): Safari reconstruye la capa al cambiar entre px y porcentaje y las fotos parpadean.

#### Scenario: Movimiento reducido o fallback

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce` o la mejora de scroll no se inicializa
- **THEN** las escenas se muestran en flujo normal, con todos sus textos y acciones accesibles, sin depender del barrido

#### Scenario: Pantalla mobile

- **WHEN** la transición se inspecciona en un viewport mobile
- **THEN** el borde de la imagen sigue siendo visible, el copy no queda cortado por el barrido y la navegación permanece utilizable

#### Scenario: Swipe en Safari iOS

- **WHEN** la persona arrastra verticalmente sobre una escena en Safari iOS
- **THEN** la escena sigue al dedo y al soltar aterriza en la escena siguiente o anterior según la regla del slider, el documento no se desplaza (`scrollY` permanece en 0) y el gesto no cancela el arrastre a mitad de camino

#### Scenario: Cambio de altura del viewport a mitad del recorrido

- **WHEN** el slider está en una escena distinta de la primera y la altura del viewport cambia (por ejemplo de 754 a 844 px o al revés)
- **THEN** tras el evento de `resize` la escena activa ocupa exactamente el viewport (borde superior en 0 y borde inferior en la altura del viewport, ±1 px) y ninguna parte de la escena anterior o siguiente queda visible

#### Scenario: Swipe sin parpadeo en Safari iOS

- **WHEN** la persona arrastra y suelta varias veces seguidas entre escenas en Safari iOS
- **THEN** ninguna foto se queda en blanco ni parpadea al iniciar o terminar un gesto: las posiciones de stage, fotos, textos y títulos se escriben siempre en px y las fotos del slider se decodifican de forma síncrona
