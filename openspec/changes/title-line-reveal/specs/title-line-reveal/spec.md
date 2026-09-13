## Purpose

Dar a todos los títulos del sitio (h1 de hero y h2 de sección) la misma entrada por renglón, con máscaras que no recortan glifos y tamaños que no desbordan en pantallas estrechas.

## ADDED Requirements

### Requirement: Entrada por renglón en todos los títulos
Los h1 de hero y los h2 de sección de las seis rutas SHALL entrar renglón a renglón: cada renglón visual sube desde una máscara hasta su posición con un escalonado de 90 ms entre renglones, tanto en móvil como en desktop. Los renglones SHALL corresponder a las líneas reales que el navegador produce a ese ancho, recalculadas al cambiar el viewport. Kicker, párrafos y grupos conservan el fade con subida sutil.

#### Scenario: Hero de cualquier página
- **WHEN** se carga cualquiera de las seis rutas a 390 px o 1440 px sin `prefers-reduced-motion`
- **THEN** cada renglón del h1 aparece deslizándose desde abajo con 90 ms de diferencia respecto al anterior y ningún renglón enmascarado contiene más de una línea visual de texto

#### Scenario: h2 al entrar en viewport
- **WHEN** un h2 de sección cruza el 82% inferior del viewport
- **THEN** sus renglones entran con el mismo patrón y quedan visibles después

#### Scenario: Sin JavaScript o con movimiento reducido
- **WHEN** JavaScript no se ejecuta o `prefers-reduced-motion: reduce` está activo
- **THEN** todos los títulos están visibles en flujo desde el primer render, sin máscaras ni desplazamiento

### Requirement: Las máscaras no recortan glifos
Durante y después de la entrada, ningún renglón SHALL recortar acentos, ascendentes, descendentes ni la sombra del texto; el interlineado del título SHALL ser el mismo con y sin máscara.

#### Scenario: Glifos completos
- **WHEN** termina la entrada de un título con acentos y descendentes (p. ej. "Únete a un equipo", "sobre tu próximo proyecto")
- **THEN** los rectángulos de los glifos de cada renglón están íntegramente dentro del área visible y la altura total del título es igual a la de un título sin máscaras

### Requirement: Sin desborde de títulos en anchos móviles
Entre 320 y 390 px de ancho ninguna palabra de un h1 o h2 SHALL ser más ancha que la caja de su título ni sobresalir del viewport.

#### Scenario: Palabra más larga
- **WHEN** se inspeccionan todos los h1/h2 de las seis rutas a 320 y 390 px
- **THEN** el ancho de cada palabra es menor o igual al ancho de su título y `scrollWidth === clientWidth` en el título; `npm run test:mobile` falla si no se cumple
