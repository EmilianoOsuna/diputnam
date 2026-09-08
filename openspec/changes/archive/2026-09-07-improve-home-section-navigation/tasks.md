## 1. Contenido y navegación

- [x] 1.1 Acortar los títulos de `src/data/home.ts` a un máximo de dos renglones por escena y verificar que cada escena conserve un destino único.
- [x] 1.2 Actualizar `src/pages/index.astro` para renderizar únicamente el título enlazable de cada panel y retirar eyebrow, descripción y acciones secundarias visibles; verificar que los enlaces apunten a `#inicio`, `#eredita`, `#putnam` y `#contacto`.
- [x] 1.3 Ajustar `src/styles/global.css` para limitar el copy a dos renglones, aumentar navbar/contacto y mantener estados hover/focus sin overflow; verificar desktop y mobile.

## 2. Control direccional de scroll

- [x] 2.1 Reemplazar la señal textual por un botón de flecha fijo y accesible en `src/pages/index.astro`/`src/styles/global.css`; verificar que no contenga texto visible y permanezca en la esquina inferior derecha.
- [x] 2.2 Actualizar `src/scripts/motion.ts` para sincronizar dirección, `aria-label`, navegación al siguiente marcador y regreso a `#inicio` al llegar al final; verificar con teclado y click.
- [x] 2.3 Añadir animación sutil de flecha y giro de dirección, con fallback estable para `prefers-reduced-motion`; verificar que no haya animación continua cuando el usuario la desactive.

## 3. Verificación

- [ ] 3.1 Actualizar `tests/home-sweep.mjs` con aserciones de títulos enlazables, ausencia de copy auxiliar, flecha y estados de dirección; verificar con `npm run test:sweep`.
- [ ] 3.2 Ejecutar `npm run build` y una revisión Playwright desktop/mobile del recorrido completo, incluyendo inicio, final, regreso al inicio, refresh, focus y ausencia de overflow horizontal.
