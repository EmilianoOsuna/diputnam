## 1. Referencia y base

- [x] 1.1 Inspeccionar `https://dsgninterior.se/en` con Playwright en un viewport desktop y uno mobile, registrando hero, navegación, retícula, tipografía, espaciado, estados hover, secuencia de scroll y animaciones observables; verificar que exista evidencia capturada para cada área.
- [x] 1.2 Crear la estructura mínima de Astro para la ruta `/` y verificar que el proyecto inicie y genere la home sin conservar la navegación SPA de `index.html`.
- [x] 1.3 Definir fixtures locales para Putnam y Ereditá con forma intercambiable por Sanity; verificar que la home renderice sin llamadas al CMS.

## 2. Dirección visual de la home

- [x] 2.1 Extraer y reutilizar el logo actual de Putnam sin alterar su apariencia; verificarlo en fondos claros y oscuros.
- [x] 2.2 Trasladar los tokens de color de Putnam y la tipografía aprobada a la nueva home; verificar contraste y consistencia con la referencia.
- [x] 2.3 Construir el hero con la composición, escala, alineación y presencia visual de DSGN Interior, adaptando el mensaje de Putnam; verificarlo mediante captura comparable en desktop.
- [x] 2.4 Construir el flujo restante del MVP con introducción, proyecto destacado Ereditá, preview de portafolio y cierre de contacto; verificar orden de lectura y ausencia de rutas internas requeridas.
- [x] 2.5 Ajustar imágenes, proporciones, márgenes y retícula contra las capturas de referencia; verificar que la diferencia visual principal sea contenido y branding de Putnam.

## 3. Movimiento e interacción

- [x] 3.1 Integrar Lenis para el scroll global y sincronizarlo con el ciclo de actualización de las animaciones; verificar desplazamiento suave sin múltiples scroll containers.
- [x] 3.2 Implementar con GSAP las entradas del hero, reveals de secciones, transformaciones de imágenes y estados interactivos observados en la referencia; verificar la secuencia durante un recorrido completo de la home.
- [x] 3.3 Añadir fallback para `prefers-reduced-motion` y pantallas mobile; verificar que todo el contenido permanezca visible y navegable con movimiento reducido.

## 4. Verificación del MVP

- [x] 4.1 Ejecutar Playwright en desktop y mobile sobre Putnam y la referencia, capturando primera carga, hero, scroll intermedio, proyecto destacado y footer; verificar comparabilidad visual y ausencia de errores de consola.
- [x] 4.2 Revisar enlaces, navegación, carga de imágenes, overflow horizontal y estabilidad del layout; verificar que no haya clipping, saltos de contenido ni controles inutilizables.
- [x] 4.3 Confirmar que la home cumple la spec `home-ui` y documentar cualquier diferencia visual deliberada antes de aprobar la fase.
