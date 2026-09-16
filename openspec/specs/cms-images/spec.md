# cms-images Specification

## Purpose
Servir todas las imágenes de contenido desde el CMS con recorte por punto focal y el mismo tratamiento responsivo y tonal que hoy aplica el sitio a las imágenes mock.

## Requirements

### Requirement: Imágenes de contenido desde el CMS
Toda imagen de contenido (escenas del home, hero/galería/tipologías de Ereditá, imagen editorial de Putnam, heros de Contacto/Únete/Noticias, imágenes de notas) SHALL cargarse en el CMS y servirse desde su CDN. Los logos e isotipos siguen siendo assets locales. Ninguna imagen de contenido SHALL apuntar a Unsplash, Contentful ni a un archivo del repositorio.

#### Scenario: Guard de mocks
- **WHEN** el HTML generado contiene un `src`/`srcset` hacia `images.unsplash.com` o `images.ctfassets.net`
- **THEN** el build termina con error listando la ruta y la URL

### Requirement: Punto focal y recorte editables
El administrador SHALL poder marcar hotspot y crop en cada imagen. Los recortes que el sitio realiza por relación de aspecto (paneles del home, tarjetas de galería, tipologías) SHALL respetar el hotspot.

#### Scenario: Hotspot en móvil
- **WHEN** una imagen de panel del home con hotspot a la derecha se muestra a 390 px
- **THEN** la zona del hotspot permanece visible dentro del recorte vertical

### Requirement: Variantes responsivas y tratamiento tonal preservados
Cada imagen SHALL entregarse con `srcset` de los mismos anchos que hoy (`640–2000` para heros, `480–1200` para tarjetas), formato automático moderno, calidad configurada y el mismo ajuste de saturación por tipo de imagen, generado en la URL del CDN sin filtros CSS a pantalla completa.

#### Scenario: Paridad con el pipeline anterior
- **WHEN** se compara el HTML de `/eredita/` antes y después del cambio
- **THEN** cada `<img>` de contenido conserva el mismo número de candidatos en `srcset`, `sizes`, `width`/`height`, `loading` y `fetchpriority`, cambiando solo el host de la URL

### Requirement: Texto alternativo localizado
Cada imagen de contenido SHALL tener `alt` en español obligatorio e inglés opcional con fallback, editado en el CMS junto a la imagen. Las imágenes decorativas SHALL marcarse como tales y renderizar `alt=""`.

#### Scenario: Alt en inglés
- **WHEN** una imagen de galería tiene `alt.en`
- **THEN** `/en/eredita/` la renderiza con ese `alt`
