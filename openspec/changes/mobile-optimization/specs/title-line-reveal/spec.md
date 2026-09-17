## ADDED Requirements

### Requirement: Renglones de hero sin solaparse en móvil

En viewports de 767 px o menos, los renglones del h1 del hero de las páginas interiores (`/putnam/`, `/eredita/`, `/unete/`, `/contacto/`, `/noticias/`) no SHALL solaparse entre sí: los descendentes de un renglón (g, p, y, j) SHALL quedar por encima de los ascendentes y puntos del renglón siguiente, con cualquier título que el CMS entregue.

#### Scenario: Hero de Noticias en inglés
- **WHEN** `/en/news/` se abre a 390 px y el título contiene "progress" seguido de un renglón que empieza por "business"
- **THEN** la caja de la "g" del primer renglón no intersecta la caja de la "i" del siguiente

#### Scenario: Interlineado mínimo
- **WHEN** se inspeccionan los h1 de hero de las cinco páginas interiores a 390 px
- **THEN** su `line-height` computado es de al menos 0.98 y su altura total sigue cabiendo en el hero sin recortes ni desbordamiento
