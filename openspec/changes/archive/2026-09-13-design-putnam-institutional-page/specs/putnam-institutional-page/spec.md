## Purpose

Definir una página institucional editorial y dinámica que explique la identidad, el proceso y los diferenciadores de Putnam con contenido legible, navegación clara y una experiencia adaptable y accesible.

## ADDED Requirements

### Requirement: Ruta institucional y continuidad de marca
El sitio SHALL ofrecer una página institucional de Putnam mediante una URL propia y SHALL conservar señales reconocibles de la home: logo, navegación, tipografía, datos de contacto y lenguaje visual. La composición de la página SHALL ser propia y no SHALL duplicar literalmente el stage de slides de la home ni el layout del `index.html` legado.

#### Scenario: Entrada desde la navegación
- **WHEN** una persona abre la página institucional desde la home
- **THEN** llega a una URL navegable y percibe continuidad de marca sin que la página se comporte como otra escena de la home

#### Scenario: Acceso directo
- **WHEN** una persona carga directamente la URL institucional
- **THEN** obtiene el contenido completo, la navegación principal y una forma clara de volver a la home

### Requirement: Narrativa institucional completa y editable
La página SHALL presentar, en orden editorial comprensible, la introducción de Putnam, su forma de trabajo y proceso, misión, visión, valores, diferenciadores y un cierre de contacto. El copy SHALL derivarse del contenido existente, SHALL usar español neutro y no SHALL añadir métricas, clientes, certificaciones ni promesas no sustentadas.

#### Scenario: Lectura del recorrido completo
- **WHEN** una persona recorre la página de inicio a fin
- **THEN** puede entender quién es Putnam, qué hace, cómo trabaja, qué principios sostiene, por qué elegirla y cómo contactarla

#### Scenario: Contenido en español neutro
- **WHEN** se revisa el copy visible y accesible
- **THEN** no contiene voseo ni instrucciones o llamadas a la acción en formas regionales incompatibles con el tono definido

### Requirement: Dirección de arte clara, verde y con carácter
La página SHALL usar como base la paleta crema, verde oscuro, verde estructural y tinta observada en el material existente. SHALL construir una composición editorial minimalista con jerarquía tipográfica, ritmo asimétrico, espacio negativo, fotografía y un motivo gráfico reconocible inspirado en arquitectura, trazo o estructura; SHALL evitar una sucesión genérica de tarjetas homogéneas, iconos emoji y secciones centradas repetitivas.

#### Scenario: Vista desktop
- **WHEN** la página se inspecciona en un viewport desktop soportado
- **THEN** la narrativa tiene una jerarquía distintiva, variación compositiva y un motivo visual consistente sin sacrificar legibilidad

#### Scenario: Consistencia cromática
- **WHEN** una persona recorre secciones claras y verdes
- **THEN** los cambios de fondo se sienten parte del mismo sistema y texto, enlaces y controles conservan contraste suficiente

### Requirement: Movimiento editorial y smooth scroll
La página SHALL ofrecer smooth scroll y animaciones ligadas al desplazamiento que refuercen la jerarquía y la continuidad espacial. Los reveals de texto, desplazamientos de medios y evolución del motivo gráfico SHALL permanecer sincronizados con el scroll, no SHALL impedir el acceso al contenido y no SHALL convertir el recorrido en una secuencia obligatoria de pantallas completas.

#### Scenario: Recorrido con movimiento habilitado
- **WHEN** una persona desplaza la página en un dispositivo capaz y no solicita reducción de movimiento
- **THEN** el desplazamiento se percibe continuo y los elementos entran o se transforman de forma controlada, reversible y relacionada con el contenido

#### Scenario: Navegación por anclas o regreso
- **WHEN** una persona activa un enlace interno o vuelve a la home
- **THEN** la navegación termina en el destino correcto sin quedar bloqueada por una animación o estado intermedio

### Requirement: Responsive sin pérdida de información
La página SHALL adaptar composición, tipografía, medios, navegación, espaciado y movimiento a desktop, tablet y mobile desde 320 px. Todo el contenido SHALL permanecer en un orden de lectura lógico, sin overflow horizontal, recortes de texto, capas que oculten acciones ni dependencia de hover.

#### Scenario: Pantalla mobile estrecha
- **WHEN** la página se abre a 320 px de ancho
- **THEN** todos los textos y controles son legibles y operables, las composiciones multicolumna pasan a un flujo coherente y no existe desplazamiento horizontal involuntario

#### Scenario: Orientación o cambio de tamaño
- **WHEN** el viewport cambia de tamaño u orientación
- **THEN** el layout y las animaciones se recalculan sin dejar espacios artificiales, contenido superpuesto ni estados de navegación inválidos

### Requirement: Accesibilidad y mejora progresiva
La página SHALL usar estructura semántica, jerarquía de encabezados, textos alternativos útiles, enlaces y controles operables con teclado, foco visible y contraste legible. SHALL respetar `prefers-reduced-motion`; sin JavaScript o con movimiento reducido, todo el contenido SHALL permanecer visible y en flujo normal.

#### Scenario: Movimiento reducido
- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** smooth scroll, parallax y animaciones continuas se desactivan o minimizan sin ocultar ni desordenar contenido

#### Scenario: JavaScript no disponible
- **WHEN** la página se renderiza sin ejecutar JavaScript
- **THEN** la narrativa completa, navegación y enlaces de contacto siguen disponibles en orden lógico

#### Scenario: Recorrido por teclado
- **WHEN** una persona navega usando únicamente teclado
- **THEN** alcanza navegación, contenido enlazado y CTA con un indicador de foco visible y sin trampas de foco

