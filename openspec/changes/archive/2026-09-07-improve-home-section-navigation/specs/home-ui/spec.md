## MODIFIED Requirements

### Requirement: Contenido inicial de la home
La home SHALL mostrar las cuatro escenas representativas del MVP: introducción de Putnam, proyecto destacado Ereditá, la firma Putnam y un cierre de contacto. Cada escena SHALL mostrar únicamente un título breve como copy visible principal; el título SHALL ser un hipervínculo a la sección correspondiente y SHALL ocupar como máximo dos renglones en el viewport objetivo. La home SHALL retirar el eyebrow, la descripción y las acciones textuales secundarias de las escenas.

#### Scenario: Títulos como navegación
- **WHEN** una persona selecciona el título de cualquier escena
- **THEN** la home navega a la sección con el identificador correspondiente y conserva el comportamiento de transición del stage

#### Scenario: Copy breve
- **WHEN** una persona inspecciona una escena en desktop o mobile
- **THEN** solo encuentra el título enlazable de la escena y este no ocupa más de dos renglones

#### Scenario: Contenido disponible
- **WHEN** la home termina de cargar
- **THEN** el contenido principal de Putnam y Ereditá se presenta dentro de la composición visual aprobada, sin depender de páginas internas todavía inexistentes

## ADDED Requirements

### Requirement: Navegación y contacto legibles
La home SHALL presentar los enlaces del navbar y los datos de contacto con un tamaño y contraste legibles en desktop y mobile, sin perder la composición editorial ni permitir desbordamiento horizontal.

#### Scenario: Navbar legible
- **WHEN** una persona inspecciona el navbar en cualquier viewport soportado
- **THEN** los enlaces y el indicador de idioma son distinguibles sin zoom adicional y conservan estados hover y focus visibles

#### Scenario: Contacto legible
- **WHEN** una persona llega al cierre de contacto
- **THEN** email, teléfono, ciudad y enlaces disponibles se distinguen con claridad y siguen siendo activables por teclado o toque
