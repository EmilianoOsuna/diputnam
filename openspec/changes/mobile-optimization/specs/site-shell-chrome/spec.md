## MODIFIED Requirements

### Requirement: Pie de página compartido delgado con redes y crédito

El pie de página compartido (`.site-footer` fijo y su variante en flujo `.site-footer--flow`) SHALL reducir su grosor (altura mínima y padding vertical) respecto a los valores actuales en las seis páginas en desktop, sin recortar ni superponer el contenido de contacto existente (correo, teléfono, ciudad, WhatsApp). SHALL incorporar una fila de iconos de redes sociales —WhatsApp (desde `contact.whatsapp`), y Facebook/Instagram cuando existan URLs equivalentes en `contact.organization.sameAs`— y una línea de crédito de autoría ("Código y diseño · Emiliano Osuna" o su equivalente en inglés) alineada al extremo derecho del pie de página. Ningún ícono SHALL renderizarse para una red sin URL configurada en `sameAs`.

En viewports de 767 px o menos, el pie fijo del home no SHALL mostrarse: sólo permanece la flecha de scroll, y sus datos quedan disponibles en el menú móvil. En esos mismos viewports, el pie en flujo de las páginas interiores SHALL organizarse en filas claramente separadas —marca y redes; navegación; datos de contacto; crédito— con un padding vertical y una separación entre filas visiblemente mayores que en desktop, sin que ningún elemento quede pegado a otro.

#### Scenario: Pie de página con redes configuradas
- **WHEN** `organization.sameAs` incluye una URL de Facebook y una de Instagram
- **THEN** el pie de página muestra tres iconos operables (WhatsApp, Facebook, Instagram), cada uno enlazando a su URL correspondiente con `target="_blank" rel="noreferrer"`

#### Scenario: Pie de página sin redes adicionales configuradas
- **WHEN** `organization.sameAs` está vacío
- **THEN** el pie de página muestra únicamente el icono de WhatsApp (siempre disponible vía `contact.whatsapp`) sin huecos ni iconos rotos

#### Scenario: Crédito de autoría visible
- **WHEN** se inspecciona el pie de página fijo de cualquier página en desktop o el pie en flujo de Contacto
- **THEN** la línea de crédito de autoría está presente, alineada a la derecha, y no interfiere con los datos de contacto ni con los iconos de redes

#### Scenario: Grosor reducido sin overflow
- **WHEN** el pie de página se inspecciona en desktop
- **THEN** su altura mínima y padding son visiblemente menores que en la versión anterior, todo el contenido permanece legible y no hay desbordamiento horizontal

#### Scenario: Home en móvil sin pie fijo
- **WHEN** `/` se abre a 390 px
- **THEN** no se muestra ningún pie fijo sobre las escenas, la flecha de scroll sigue visible y operable, y `document.documentElement.scrollWidth` es igual al ancho del viewport

#### Scenario: Pie en flujo con aire en móvil
- **WHEN** el pie en flujo de `/putnam/` o `/contacto/` se inspecciona a 390 px
- **THEN** marca y redes comparten una fila, la navegación ocupa su propia fila, los datos de contacto y el crédito van al final, la separación vertical entre filas es de al menos 1.5 rem y el padding vertical del pie es de al menos 2.5 rem, sin desbordamiento horizontal

## ADDED Requirements

### Requirement: Menú móvil con contacto, redes y crédito

El menú móvil (panel del botón hamburguesa) SHALL mostrar, además de la navegación y el cambio de idioma, el correo, el teléfono, la ciudad, los iconos de redes derivados de `contact.whatsapp` y `contact.organization.sameAs` (mismas reglas de derivación que el pie de página) y el crédito de autoría, en todas las páginas y en ambos idiomas. Los iconos SHALL enlazar a su URL con `target="_blank" rel="noreferrer"` y una etiqueta accesible con el nombre de la red.

#### Scenario: Menú abierto en el home
- **WHEN** la persona abre el menú en `/` a 390 px
- **THEN** ve los enlaces de navegación, el cambio de idioma, el correo, el teléfono, la ciudad, los iconos de redes configuradas y el crédito, todos operables por toque y teclado

#### Scenario: Red no configurada
- **WHEN** `organization.sameAs` no contiene Instagram
- **THEN** el menú no muestra un icono de Instagram ni deja un hueco en la fila de redes
