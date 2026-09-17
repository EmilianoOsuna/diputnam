## MODIFIED Requirements

### Requirement: Movimiento editorial y smooth scroll
La página SHALL ofrecer smooth scroll y animaciones ligadas al desplazamiento que refuercen la jerarquía y la continuidad espacial. Los reveals de texto, desplazamientos de medios y evolución del motivo gráfico SHALL permanecer sincronizados con el scroll, no SHALL impedir el acceso al contenido y no SHALL convertir el recorrido en una secuencia obligatoria de pantallas completas. En particular, la sección de proceso SHALL ocupar una sola `100dvh` y avanzar entre sus pasos mediante un track horizontal con scroll/gesto nativo y contador/barra de progreso visibles, en vez de requerir varias alturas de viewport de scroll vertical fijado (una por paso) para revelar el contenido.

#### Scenario: Recorrido con movimiento habilitado
- **WHEN** una persona desplaza la página en un dispositivo capaz y no solicita reducción de movimiento
- **THEN** el desplazamiento se percibe continuo y los elementos entran o se transforman de forma controlada, reversible y relacionada con el contenido

#### Scenario: Navegación por anclas o regreso
- **WHEN** una persona activa un enlace interno o vuelve a la home
- **THEN** la navegación termina en el destino correcto sin quedar bloqueada por una animación o estado intermedio

#### Scenario: Proceso en una sola pantalla
- **WHEN** una persona llega a la sección de proceso en desktop
- **THEN** la sección ocupa una sola `100dvh` (no un múltiplo de alturas de viewport por paso) y avanza entre sus 6 pasos mediante scroll/gesto horizontal nativo, mostrando en todo momento el contador y la barra de progreso del paso activo

#### Scenario: Sin scroll vertical adicional retenido
- **WHEN** se mide la altura total del documento antes y después de este cambio en la sección de proceso
- **THEN** la altura que ocupaba la secuencia de pasos (aprox. 6 × `100dvh`) se reduce a la de una sola sección `100dvh`
