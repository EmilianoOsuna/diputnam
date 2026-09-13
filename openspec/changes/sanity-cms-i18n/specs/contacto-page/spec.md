## MODIFIED Requirements

### Requirement: Rutas reales en la navegación compartida

La marca y cada entrada del navbar SHALL producir los mismos destinos reales desde cualquier página del mismo idioma: en español `/`, `/eredita/`, `/putnam/`, `/noticias/`, `/unete/` y `/contacto/`; en inglés `/en/`, `/en/eredita/`, `/en/putnam/`, `/en/news/`, `/en/join/` y `/en/contact/`. El enlace activo no SHALL depender de que la persona haya llegado desde una ruta específica, el menú mobile SHALL conservar esos mismos destinos y el selector de idioma SHALL estar presente en ambos. Los textos visibles de la página SHALL provenir del diccionario de interfaz y del CMS, no de literales en la plantilla.

#### Scenario: Navegación cruzada
- **WHEN** una persona abre cualquier página en español y selecciona cada entrada del navbar
- **THEN** cada entrada abre su ruta dedicada en español y la marca vuelve a `/`

#### Scenario: Navegación en inglés
- **WHEN** una persona abre cualquier página bajo `/en/` y selecciona cada entrada del navbar
- **THEN** cada entrada abre su ruta `/en/…` y la marca vuelve a `/en/`
