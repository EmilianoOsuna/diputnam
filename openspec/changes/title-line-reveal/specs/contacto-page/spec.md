## MODIFIED Requirements

### Requirement: Reveals de texto y grupos

El hero SHALL animar cada renglón visual del `h1` (segmentado en runtime por el helper compartido de renglones) de `yPercent: 110` a `0`, `duration: 0.9`, `stagger: 0.09`, `ease: 'expo.out'`. `.section-kicker.fade-up`, `.hero-details.fade-up` y sus lead/meta SHALL entrar con `autoAlpha: 0 → 1`, `y: 24 → 0`, `duration: 0.8`, `delay: 0.4` y ease de salida.

Todos los `h2` de las secciones 02, 04, 05 y 06 SHALL segmentarse en renglones reales con el mismo helper (sin spans `.line > span` escritos en Astro) y animarse con el patrón del hero cuando el título llegue al 80% del viewport: `scrollTrigger: { trigger: heading, start: 'top 80%', toggleActions: 'play none none reverse' }`. Las máscaras de renglón no SHALL recortar acentos, descendentes ni sombra del texto.

Los párrafos, las cuatro `.index-row` y los seis `.f-row` SHALL agruparse mediante `data-reveal-group`; cada grupo SHALL animar sus hijos de `autoAlpha: 0, y: 24` a su estado natural, `duration: 0.9`, `stagger: 0.08`, `ease: 'power3.out'`, con trigger `start: 'top 80%'` y `toggleActions: 'play none none reverse'`. El hero SHALL excluirse del loop genérico, igual que en los scripts de referencia.

El contenido SHALL estar visible y en flujo antes de inicializar JS. CSS no SHALL ocultar los renglones, `.fade-up` ni `[data-reveal-group]` por defecto; cualquier estado inicial SHALL pertenecer a `gsap.from` después de `is-motion-ready` (o a la clase de reveal móvil tras la segmentación).

#### Scenario: Reveal reversible

- **WHEN** un título o grupo cruza el 80% del viewport hacia abajo y después hacia arriba
- **THEN** entra con los tiempos/stagger aprobados y revierte sin alterar el orden DOM ni dejar contenido inaccesible

#### Scenario: Renglones reales a cada ancho

- **WHEN** el hero o un h2 se muestra a 390 px y a 1440 px
- **THEN** cada máscara contiene exactamente una línea visual de texto y ningún glifo queda recortado
