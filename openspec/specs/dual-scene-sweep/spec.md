# dual-scene-sweep Specification

## Purpose

Definir un barrido vertical continuo donde dos escenas completas conviven y sus imágenes y textos se reemplazan mediante el mismo borde móvil, siguiendo la composición visual de la referencia.

## Requirements

### Requirement: Composición continua de dos escenas

Durante cada transición la home SHALL conservar la escena saliente visible por encima del borde de barrido y la escena entrante visible por debajo. La unión SHALL cubrir todo el viewport sin exponer el color de fondo de la página ni una superficie sólida ajena a ambas imágenes.

#### Scenario: Barrido a la mitad

- **WHEN** el progreso entre dos escenas está aproximadamente al 50 por ciento
- **THEN** la mitad superior muestra la imagen saliente y la mitad inferior muestra la imagen entrante, sin un bloque café ni un hueco entre ellas

#### Scenario: Barrido en reversa

- **WHEN** una persona desplaza hacia arriba durante una transición
- **THEN** las mismas dos imágenes deshacen el barrido de forma continua, sin parpadeos ni exposición del fondo

### Requirement: Copy recortado por el mismo borde

Cada título y su copy SHALL ocupar la misma geometría centrada dentro de su escena y SHALL ser recortado junto con la imagen correspondiente. En estados intermedios ambos títulos SHALL existir simultáneamente a cada lado del borde, sin un fade o desplazamiento independiente que retrase el título entrante.

#### Scenario: Cruce por el centro

- **WHEN** el borde vertical cruza la zona central del viewport
- **THEN** la porción superior del título saliente y la porción inferior del título entrante son visibles y coinciden con sus respectivas imágenes

#### Scenario: Alineación del borde

- **WHEN** se inspecciona cualquier progreso intermedio
- **THEN** el límite entre ambos textos coincide visualmente con el límite entre ambas imágenes

### Requirement: Estados terminales deterministas

La primera y última posición de cada intervalo SHALL mostrar una sola escena completa. Al regresar al inicio del documento, la primera imagen y su copy SHALL restaurarse sin máscaras, opacidad residual ni capas de transiciones posteriores.

#### Scenario: Inicio del intervalo

- **WHEN** una transición tiene progreso cero
- **THEN** la escena saliente ocupa todo el viewport y la escena entrante permanece oculta

#### Scenario: Final del intervalo

- **WHEN** una transición alcanza progreso completo
- **THEN** la escena entrante ocupa todo el viewport y se convierte en la escena estable

#### Scenario: Regreso al inicio de la home

- **WHEN** el scroll vuelve a la posición superior después de recorrer otras escenas
- **THEN** la primera escena aparece completa y ningún estilo previo deja visible el fondo de la página

### Requirement: Accesibilidad y fallback

La composición animada SHALL evitar copy duplicado para tecnologías asistivas y SHALL conservar todas las escenas accesibles en flujo normal cuando la mejora de scroll no se inicializa o se solicita movimiento reducido.

#### Scenario: Transición accesible

- **WHEN** dos escenas son visibles durante el barrido
- **THEN** solo la escena activa se expone como contenido interactivo a tecnologías asistivas

#### Scenario: Movimiento reducido

- **WHEN** el sistema reporta `prefers-reduced-motion: reduce`
- **THEN** las escenas se muestran completas en flujo normal sin depender de máscaras animadas

### Requirement: Aceptación visual de estados intermedios

La implementación SHALL verificarse en desktop y mobile en varios puntos de una transición, incluyendo avance, reversa y retorno al inicio.

#### Scenario: Comparación visual

- **WHEN** Playwright captura una transición al 25, 50 y 75 por ciento
- **THEN** cada captura muestra dos imágenes y dos copies recortados por un borde compartido, sin fondo sólido, overflow horizontal ni errores de consola
