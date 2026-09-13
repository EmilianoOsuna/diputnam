## MODIFIED Requirements

### Requirement: Animación de entrada del hero en móvil en todas las páginas interiores

Al cargar `/putnam/`, `/eredita/`, `/unete/`, `/contacto/` y `/noticias/` en un viewport móvil sin `prefers-reduced-motion`, el título del hero SHALL entrar renglón a renglón (cada línea visual sube desde una máscara, escalonada 90 ms) y el kicker y el texto principal SHALL aparecer con desplazamiento sutil, con el mismo lenguaje que en desktop. Ninguna página SHALL mostrar el hero estático de inicio mientras las demás lo animan. En móvil la animación de entrada SHALL ejecutarse sin descargar ninguna librería de animación y SHALL animar únicamente `opacity` y `transform`; el hero SHALL quedar visible aunque el script de la página no llegue a ejecutarse.

#### Scenario: Hero de Putnam en móvil
- **WHEN** `/putnam/` se carga a 390 px
- **THEN** los renglones de "Una visión. Todo el proceso." entran escalonados y el kicker y el lead aparecen con la animación de entrada, terminando completamente visibles en menos de 1.5 s

#### Scenario: Paridad entre páginas
- **WHEN** se comparan las cargas móviles de las cinco páginas interiores
- **THEN** todas ejecutan la misma entrada por renglón en su título

#### Scenario: Entrada sin librería
- **WHEN** se carga cualquiera de las cinco páginas interiores a 390 px y se inspeccionan las peticiones de scripts
- **THEN** no se solicita ningún módulo de animación ni de smooth scroll y el hero completa su entrada igualmente
