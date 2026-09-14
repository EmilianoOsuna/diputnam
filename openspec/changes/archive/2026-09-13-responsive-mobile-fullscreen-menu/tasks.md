## 1. Estructura y estilos mobile

- [x] 1.1 Actualizar el marcado del header en `src/pages/index.astro` para que el control use tres líneas decorativas, mantenga etiqueta accesible y aloje la navegación/contacto del overlay sin duplicar enlaces; verificar que el HTML renderizado conserve un solo conjunto de enlaces.
- [x] 1.2 Reemplazar el dropdown de `.site-nav.is-open` en `src/styles/global.css` por una capa mobile fixed de al menos `100svh`, con composición vertical, contacto inferior, contraste consistente, área táctil suficiente y estado visual de X; verificar en viewport mobile que no haya desbordamiento horizontal.
- [x] 1.3 Añadir estados de foco, `z-index`, scroll interno para pantallas bajas y reglas de desktop que oculten completamente el overlay; verificar que la navegación desktop existente permanezca visualmente sin cambios.

## 2. Comportamiento accesible

- [x] 2.1 Actualizar `src/scripts/motion.ts` con una única rutina de apertura/cierre que sincronice clase, `aria-expanded`, `aria-label`, bloqueo de scroll y foco; verificar apertura por toque/click y teclado.
- [x] 2.2 Implementar cierre por `Escape`, selección de enlace y cambio a desktop, restaurando foco al control y liberando el scroll en cada ruta; verificar cada caso con interacción de Playwright o inspección funcional equivalente.
- [x] 2.3 Respetar `prefers-reduced-motion` y evitar que el menú dependa de Lenis/GSAP para operar; verificar apertura y cierre inmediatos con movimiento reducido.
- [x] 2.4 Sincronizar con el progreso del barrido el movimiento opuesto de imagen y texto entre escenas; verificar que al bajar la imagen saliente suba, su texto baje y la siguiente escena entre desde abajo sin dejar el texto estático.
- [x] 2.5 Mover cada panel completo hacia arriba y contracompensar su título hacia abajo dentro del panel; verificar que imagen y texto viajen en sentidos opuestos.
- [x] 2.6 Mantener `overflow: hidden` en cada panel para que el título nunca salga de su imagen y el siguiente continúe desde el mismo borde horizontal; verificar el relevo en el centro del viewport.

## 3. Verificación

- [x] 3.1 Ejecutar `npm run build` y comprobar que el proyecto compile sin errores.
- [x] 3.2 Extender o añadir una verificación mínima en `tests/home-sweep.mjs` para mobile: botón de tres líneas, overlay full-screen, enlaces activables, `aria-expanded`, `Escape`, cierre por enlace y ausencia de scroll subyacente; ejecutar el test y confirmar que pase.
- [x] 3.3 Revisar capturas en un viewport mobile alto y uno bajo, además de desktop, confirmando coincidencia con la referencia proporcionada, legibilidad, foco visible y ausencia de overlay residual.
