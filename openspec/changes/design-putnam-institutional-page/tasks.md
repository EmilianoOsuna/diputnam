## 1. Contenido y estructura compartida

- [x] 1.1 Crear un módulo de datos institucionales a partir del copy de `page-nosotros`, corregir voseo y repeticiones sin agregar afirmaciones nuevas, e incluir introducción, seis pasos, misión, visión, valores, cuatro diferenciadores y CTA.
- [x] 1.2 Extraer header, navegación mobile y contacto a componentes compartidos conservando markup, ARIA y comportamiento existente de la home.
- [x] 1.3 Actualizar el enlace “Putnam” de la navegación y el acceso contextual de su escena para apuntar a `/putnam/`, conservando los destinos actuales de Ereditá, Contacto y las demás escenas.

## 2. Página y dirección de arte

- [x] 2.1 Crear la ruta Astro `/putnam/` con landmarks, skip link, un solo `h1`, jerarquía de encabezados, las seis partes de la narrativa y contenido disponible sin JavaScript.
- [x] 2.2 Implementar el hero crema asimétrico y el sistema visual “la línea que sostiene” usando los tokens claros/verdes de Putnam, sin replicar el stage de la home, el sidebar ni las cards homogéneas del HTML legado.
- [x] 2.3 Implementar la sección editorial de enfoque, el proceso numerado, la franja de misión/visión/valores y el índice de diferenciadores sin emoji.
- [x] 2.4 Incorporar imágenes locales o autorizadas con dimensiones reservadas y textos alternativos apropiados.
- [x] 2.5 Implementar el CTA final y el contacto compartido con email, teléfono y WhatsApp existentes, incluidos estados hover/focus y áreas táctiles.

## 3. Motion y responsive

- [x] 3.1 Crear un controlador de motion institucional aislado que inicialice Lenis y GSAP/ScrollTrigger como mejora progresiva, con cleanup y sin listeners o instancias duplicadas.
- [x] 3.2 Animar reveals, parallax sutil, progreso de la línea y la sección sticky desktop con `gsap.matchMedia()`, contemplando scroll reversible y cambios de tamaño.
- [x] 3.3 Implementar la variante `prefers-reduced-motion` y la base sin JavaScript, sin smooth scroll, parallax o transforms persistentes que condicionen la visibilidad del contenido.
- [x] 3.4 Recomponer el layout para tablet y mobile desde 320 px, desactivar sticky donde corresponda y adaptar navegación, tipografía, medios y línea estructural sin depender de hover.

## 4. Entrega

- [x] 4.1 Entregar la implementación terminada para que el usuario realice la validación visual y manual.
