## Purpose

Definir el color base del documento y la señal de tema hacia el navegador para que ningún color ajeno a la paleta de Putnam se vea ni en el sitio ni en las barras del navegador móvil.

## ADDED Requirements

### Requirement: Color base del documento dentro de la paleta

El fondo de `html`/`body` en todas las páginas SHALL ser un color de la paleta de Putnam (crema, verde profundo o azul) y no SHALL ser el café `#594037` ni ningún otro tono fuera de la paleta. Ese fondo SHALL coincidir con el tono de la primera sección de cada página para que el overscroll y los huecos de carga no revelen un color distinto.

#### Scenario: Overscroll en móvil
- **WHEN** la persona arrastra más allá del inicio o del final de cualquier página en un navegador móvil
- **THEN** el área revelada es del mismo tono que la sección adyacente y nunca café

#### Scenario: Imágenes aún no cargadas
- **WHEN** una imagen de fondo de la home o de un hero todavía no ha cargado
- **THEN** el hueco muestra un color de la paleta, no café

### Requirement: Señal de tema para el chrome del navegador

Cada página SHALL declarar `theme-color` con un color de la paleta, con una variante para `prefers-color-scheme: dark` si el color claro no funciona en ese modo, de forma que la barra de direcciones y la barra de sistema del navegador móvil no se tiñan de café.

#### Scenario: Chrome Android
- **WHEN** cualquier ruta del sitio se abre en Chrome para Android
- **THEN** la barra de direcciones y la barra de sistema adoptan el color declarado de la paleta

#### Scenario: Safari iOS
- **WHEN** cualquier ruta del sitio se abre en Safari para iOS
- **THEN** las barras superior e inferior se tiñen con un color de la paleta y no con café
