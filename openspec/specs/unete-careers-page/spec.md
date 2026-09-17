# unete-careers-page Specification

## Purpose

Definir la composición visual de `/unete/` en los puntos donde hoy se percibe plana, desalineada o con espacio muerto: la sección de cultura, la cuadrícula "Qué valoramos", el estado sin vacantes y el CTA final. No redefine la arquitectura completa de la página (contenido, rutas, i18n, motion Lenis/GSAP existente), que permanece como está implementada.

## Requirements

### Requirement: Imagen en la sección de cultura

La sección "Cómo trabajamos en Putnam" (`.un-culture`) SHALL mostrar imagen o imágenes de fondo en vez de un fondo de color plano, conservando la interacción de scrub fijado ya existente (`.pin-stage` sticky, contador y `.pin-rail`) sin cambiar su mecánica. El texto y el contador SHALL conservar contraste suficiente sobre la nueva imagen mediante una capa de sombra/gradiente equivalente a la ya usada en otros heroes del sitio.

#### Scenario: Cultura con imagen de fondo
- **WHEN** se abre `/unete/` y se llega a la sección de cultura
- **THEN** se percibe una imagen (no un color plano) detrás del contenido, y el texto, el contador y la barra de progreso siguen siendo legibles

#### Scenario: Interacción sin cambios
- **WHEN** la persona hace scroll a través de la sección de cultura
- **THEN** el stage permanece fijado, el contador avanza `01 → 04` y el rail progresa exactamente como antes de añadir la imagen

### Requirement: Alineación de título y tarjetas en "Qué valoramos"

En `.un-profile`, el título de la sección (`.section-head h2`) y la cuadrícula de tarjetas 01/02/03 y sus KPIs (`.values`, `.kpis`) SHALL compartir el mismo margen izquierdo en desktop, sin el desfase que hoy produce `margin-left: 12%` únicamente en las tarjetas.

#### Scenario: Alineación desktop
- **WHEN** `/unete/` se inspecciona en un viewport ≥ 1100 px
- **THEN** el borde izquierdo del título "Buscamos profesionales..." y el borde izquierdo de la primera tarjeta (01) coinciden en la misma línea vertical

### Requirement: Estado sin vacantes compacto

La sección "Actualmente no estamos contratando" (`.un-openings`) SHALL reducir el espacio muerto entre el título y el panel de estado vacío (`.empty-panel`) respecto a la composición actual, sin quitar contenido ni acciones existentes (enviar perfil, ir a contacto).

#### Scenario: Densidad del estado vacío
- **WHEN** `/unete/` se abre en desktop y se llega a la sección de oportunidades
- **THEN** el título, el texto introductorio y el panel de estado vacío se perciben como un bloque compacto, sin un hueco vertical desproporcionado entre ellos

### Requirement: CTA final equilibrado

La sección final `.un-cta` ("¿Quieres formar parte de Putnam Desarrollos Inmobiliarios?") SHALL equilibrar el peso visual entre el título y el resto de la composición (marca gráfica, acciones) para que el título no quede como texto suelto cargado a la izquierda sobre un área vacía a la derecha, en cualquier viewport ≥ 1024 px.

#### Scenario: Balance del CTA final en desktop
- **WHEN** `/unete/` se inspecciona en un viewport ≥ 1280 px
- **THEN** el título, las acciones y la marca gráfica ocupan la composición de forma equilibrada, sin un área vacía predominante junto al título
