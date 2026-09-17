## MODIFIED Requirements

### Requirement: Reveals por scroll en móvil

Los grupos de contenido marcados para revelarse SHALL animarse al entrar en el viewport en móvil, igual que en desktop, y el contenido SHALL quedar totalmente visible una vez revelado, tanto si el grupo contiene hijos como si el propio elemento marcado (por ejemplo un párrafo suelto) es el contenido a revelar. El desplazamiento de la página en móvil SHALL seguir siendo el nativo del navegador (sin smooth scroll por software). Los reveals SHALL dispararse por observación de intersección y transiciones declarativas, sin ejecutar código propio en cada frame ni en cada evento de scroll del documento. La barra de progreso y el contador de Proceso en `/putnam/` SHALL reflejar la etapa activa de la pista horizontal, con el mismo mecanismo de degradación que el resto del movimiento.

#### Scenario: Grupos de Putnam en móvil
- **WHEN** la persona se desplaza por `/putnam/` en móvil hasta Principios, Diferencias y CTA
- **THEN** cada grupo aparece con su reveal al entrar en pantalla

#### Scenario: Párrafo suelto marcado para revelarse
- **WHEN** la persona se desplaza en `/unete/` a 390 px hasta Proceso de selección, Postulación espontánea o el CTA final, o en `/contacto/` hasta Canales, Ubicación, Formulario o el CTA final
- **THEN** el párrafo introductorio de cada sección queda visible (opacidad 1, sin desplazamiento residual) y no queda un hueco vacío entre el título y el contenido siguiente

#### Scenario: Scroll nativo
- **WHEN** la persona se desplaza en móvil por cualquier página interior
- **THEN** el desplazamiento responde con la inercia nativa del dispositivo

#### Scenario: Reveal sin trabajo por frame
- **WHEN** se instrumenta `/putnam/` a 390 px y se realiza un gesto de scroll continuo que revela Principios
- **THEN** el grupo se revela y el sitio no ejecuta ningún callback de `requestAnimationFrame` ni manejador de `scroll` del documento durante el gesto

#### Scenario: Rail de Proceso ligado al scroll
- **WHEN** la persona desliza la pista de Proceso en `/putnam/` a 390 px hasta la última etapa
- **THEN** el contador pasa de `01` a `06` y la barra llega a `scaleX(1)`, sin registrar manejadores de `scroll` en `window` ni en `document`

## ADDED Requirements

### Requirement: Título de CTA cerca del inicio de la sección en móvil

En viewports de 767 px o menos, en las secciones de CTA final de `/putnam/`, `/unete/`, `/contacto/` y `/noticias/`, el kicker SHALL empezar dentro del padding superior de la sección y el título SHALL empezar a menos de 2 rem del kicker; la sección no SHALL reservar altura mínima de viewport completo que empuje el título hacia abajo.

#### Scenario: CTA de Contacto
- **WHEN** `/contacto/` se abre a 390 px y se desplaza hasta el CTA "Siguiente paso"
- **THEN** la distancia entre el borde superior de la sección y el kicker es menor o igual que el padding superior de la sección, y la distancia entre el kicker y el título es menor de 2 rem

#### Scenario: Paridad entre CTAs
- **WHEN** se miden los CTAs finales de `/putnam/`, `/unete/`, `/noticias/` y `/contacto/` a 390 px
- **THEN** en los cuatro el título empieza a menos de 2 rem del kicker
