## MODIFIED Requirements

### Requirement: Entrada por renglón en todos los títulos
Los h1 de hero y los h2 de sección de todas las rutas en ambos idiomas SHALL entrar renglón a renglón: cada renglón visual sube desde una máscara hasta su posición con un escalonado de 90 ms entre renglones, tanto en móvil como en desktop. Los renglones SHALL corresponder a las líneas reales que el navegador produce a ese ancho, recalculadas al cambiar el viewport. Un salto de línea escrito por el editor en el título (salto de línea en el texto del CMS o `<br>` en el diccionario de interfaz) SHALL cerrar renglón siempre. Kicker, párrafos y grupos conservan el fade con subida sutil.

#### Scenario: Hero de cualquier página
- **WHEN** se carga cualquiera de las doce rutas o páginas de proyecto a 390 px o 1440 px sin `prefers-reduced-motion`
- **THEN** cada renglón del h1 aparece deslizándose desde abajo con 90 ms de diferencia respecto al anterior y ningún renglón enmascarado contiene más de una línea visual de texto

#### Scenario: Salto editorial desde el CMS
- **WHEN** un título de escena del home contiene un salto de línea en el CMS
- **THEN** el texto se parte en ese punto en todos los anchos y cada parte entra como renglón propio

#### Scenario: h2 al entrar en viewport
- **WHEN** un h2 de sección cruza el 82% inferior del viewport
- **THEN** sus renglones entran con el mismo patrón y quedan visibles después

#### Scenario: Sin JavaScript o con movimiento reducido
- **WHEN** JavaScript no se ejecuta o `prefers-reduced-motion: reduce` está activo
- **THEN** todos los títulos están visibles en flujo desde el primer render, sin máscaras ni desplazamiento
