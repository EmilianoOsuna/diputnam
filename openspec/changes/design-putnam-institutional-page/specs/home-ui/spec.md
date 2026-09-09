## ADDED Requirements

### Requirement: Acceso a la página institucional de Putnam
La navegación principal de la home SHALL incluir un enlace real a la página institucional de Putnam. El acceso SHALL funcionar desde navegación desktop y mobile sin eliminar la escena resumida de Putnam ni romper los demás enlaces internos de la home.

#### Scenario: Navegación desde desktop
- **WHEN** una persona activa “Putnam” en la navegación desktop de la home
- **THEN** el navegador abre la página institucional de Putnam en la misma pestaña

#### Scenario: Navegación desde el menú mobile
- **WHEN** una persona activa “Putnam” desde el menú mobile abierto
- **THEN** el menú se cierra y el navegador abre la página institucional sin dejar bloqueo de scroll o foco inconsistente

#### Scenario: Escena Putnam preservada
- **WHEN** una persona recorre las escenas de la home mediante scroll
- **THEN** la escena resumida de Putnam sigue apareciendo en su orden actual y el resto de anclas continúa llevando a su destino previsto
