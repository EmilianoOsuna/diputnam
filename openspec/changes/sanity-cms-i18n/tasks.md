## 1. i18n con datos locales

- [x] 1.1 Configurar `i18n` en `astro.config.mjs` (D1) y crear `src/i18n/routes.ts` con el mapa de rutas por idioma; verificar que `astro build` genera las doce carpetas de ruta esperadas (`dist/en/contact/index.html`, etc.)
- [x] 1.2 Crear `src/i18n/{es,en,index}.ts` (D2) con todas las claves de UI extraídas de `src/pages/*.astro` y `src/components/*.astro` (navegación, CTAs, labels de formulario, `<title>`/`description`, skip link, `aria-label`, "Próximamente", contadores) y la verificación de claves al cargar; verificar que quitar una clave de `en.ts` hace fallar `astro build` con el nombre de la clave
- [x] 1.3 Mover cada página a `src/views/<pagina>.astro` con prop `lang`, sustituir literales por `ui.*`, crear las doce rutas delgadas en `src/pages/` y `src/pages/en/`; verificar con `grep` que ningún literal en español queda en `src/views/*.astro` fuera de contenido importado de `src/data`, y que las seis rutas en español producen el mismo DOM que antes (diff del HTML de `dist/` salvo `hreflang`/selector)
- [x] 1.4 `SiteHead`: `hreflang` recíproco + `x-default` a partir de `routes.ts` y `lang` en `<html>`; `SiteHeader`: links por idioma, selector ES/EN operable por teclado (par de la página o portada de sección si no hay par), presente en el menú móvil; verificar con Playwright que desde cada ruta el selector lleva al par correcto y que `contacto-sweep` pasa con las listas de destinos actualizadas
- [x] 1.5 Crear `src/components/Lines.astro` (D5, `hard`/`cut`) y usarlo en los títulos que hoy llevan `\n` o `<br class="cut">`; verificar con `test:mobile` que la entrada por renglón y los cortes editoriales se conservan a 390 y 1440 px en las seis rutas en español
- [x] 1.6 Ampliar `routes` de `tests/mobile-audit.mjs`, `mobile-perf.mjs` y `home-sweep.mjs` a las doce rutas importando `routes.ts`, y `check-dist.mjs` con la comprobación de `lang` y `hreflang` recíproco; verificar `npm run build`, `test:mobile`, `test:perf`, `test:sweep` en verde con contenido en inglés provisional desde `src/data` (mismos textos en español como placeholder)

## 2. Sanity Studio y modelo de contenido

- [x] 2.1 Crear proyecto Sanity (free tier, dataset `production`) y `studio/` con `package.json` propio (D3), scripts `studio:dev`/`studio:deploy` en la raíz, `.env.example` con `SANITY_PROJECT_ID`/`SANITY_DATASET`; verificar que `npm run studio:dev` abre el Studio vacío y que `npm ci` en la raíz no instala dependencias del Studio
- [x] 2.2 Definir tipos `localeString`, `localeText`, `localeImage` y singletons `home`, `eredita`, `putnam`, `unete`, `siteSettings` (D4) espejando `src/data/*.ts`, con validaciones (español obligatorio, `max` en títulos de escena) y estructura del Studio que oculta "crear nuevo" para singletons; verificar rellenando un documento en el Studio que no se puede publicar sin español y que las imágenes ofrecen hotspot/crop
- [x] 2.3 Definir `nota` con `@sanity/document-internationalization` (es/en, `translation.metadata`), slug único por idioma, categoría, tags, `body` Portable Text con los bloques permitidos (D6) y `localeImage`; verificar creando una nota en español, su traducción vinculada y comprobando que el Studio bloquea slug duplicado y título vacío
- [x] 2.4 Definir `documentoLegal` (D7) con `file` PDF opcional, `version`/`validFrom` obligatorios si hay archivo y validación de cambio de versión al reemplazar archivo vía `context.getClient()`; verificar en el Studio que publicar sin archivo es válido, que con archivo exige versión y fecha, y que reemplazar el PDF sin cambiar la versión bloquea la publicación con mensaje
- [x] 2.5 Escribir `studio/scripts/seed.ts` y `seed.en.ts` (D11): subir las imágenes mock como assets, crear singletons, notas y los cuatro documentos legales (sin archivo) con ids deterministas; verificar ejecutándolo contra `production` y comprobando en el Studio que todo el contenido de `src/data` está presente, con el inglés propuesto marcado para revisión del usuario
- [x] 2.6 `sanity deploy` del Studio e invitar al administrador; verificar que el admin inicia sesión, ve los tipos ordenados por sección y publica un cambio de prueba

## 3. Sitio leyendo Sanity

- [x] 3.1 Añadir `@sanity/client` y `astro-portabletext`; crear `src/lib/sanity.ts` (D9: `perspective: 'published'`, error explícito si faltan variables) y `src/lib/content.ts` con las consultas GROQ con `coalesce(campo[$lang], campo.es)`; verificar con un script que `getEredita('en')` devuelve el fallback en español para un campo sin traducción y que el build sin variables falla nombrando la variable
- [x] 3.2 Rama `cdn.sanity.io` en `src/lib/images.ts` (D8: `w`, `q`, `auto=format`, `sat`, `rect` por crop) y `object-position` desde hotspot en los `<img>` de contenido; eliminar la rama de Contentful; verificar por diff de HTML que cada `<img>` de `/eredita/` y `/` conserva número de candidatos de srcset, `sizes`, `width`/`height`, `loading` y `fetchpriority`, y con Playwright a 390 px que una imagen con hotspot a la derecha lo mantiene visible
- [x] 3.3 Cambiar `home`, `eredita`, `putnam`, `unete`, `contacto` en `src/views/` a `content.ts` (incluido `siteSettings` en header/footer/CTAs y heros desde Sanity en lugar de `src/assets/*.jpg`), borrar `src/data/*.ts` y los JPG de contenido de `src/assets`; verificar que las doce rutas construyen y que el HTML en español coincide con el previo salvo URLs de imagen
- [x] 3.4 Sección de documentos legales en `eredita.astro` desde Sanity: tarjeta con "Próximamente" sin archivo; con archivo, enlace `type="application/pdf"`, versión, fecha y tamaño en MB; verificar subiendo un PDF de prueba con versión y confirmando que la URL responde `200 application/pdf` y que la tarjeta sin archivo no tiene enlace
- [x] 3.5 `/noticias/` y `/en/news/` desde Sanity: orden por fecha, destacada, filtros con conteo real, imagen destacada, filas enlazando al detalle, estado vacío traducido; verificar con dos notas en español y una traducida que el listado en inglés muestra solo la traducida y que sin notas en inglés la página construye con el estado vacío
- [x] 3.6 Página de detalle `src/views/nota.astro` + rutas `noticias/[slug].astro` y `en/news/[slug].astro` con `getStaticPaths` desde Sanity: hero por renglón, metadatos, imagen, Portable Text, cierre con contacto, `hreflang` a la traducción; estilos en `noticias.css`; verificar con `test:mobile` (añadiendo una ruta de nota al audit) y comprobando que el selector de idioma navega entre traducciones y cae a `/en/news/` cuando no hay par
- [x] 3.7 Ampliar `check-dist.mjs` con el guard de hosts mock (`images.unsplash.com`, `images.ctfassets.net`) y verificar que falla al inyectar una URL mock en una vista y pasa con el sitio migrado; `npm run build`, `test:mobile`, `test:perf`, `test:sweep` en verde

## 4. Publicación automática y cierre

- [x] 4.1 Hosting en Vercel: importar el repo `diputnam/diputnam`, variables `SANITY_PROJECT_ID`/`SANITY_DATASET`; cabeceras en `vercel.json` (sustituye a Cloudflare + workflow)
- [ ] 4.2 Webhook de Sanity (create/update/delete de todos los tipos) hacia el Deploy Hook de Vercel; verificar que publicar una nota produce un deploy con la nota visible en menos de cinco minutos
- [x] 4.3 README: variables de entorno, comandos del Studio, seed, flujo de publicación y pasos para migrar a Vercel (variables, deploy hook, URL del webhook, retirar workflow); verificar que el usuario puede seguirlo en un entorno limpio
- [ ] 4.4 Revisión del usuario del contenido en inglés en el Studio y prueba de humo del admin (subir imagen, reemplazar PDF con nueva versión, publicar nota); commit en `main` sin líneas de atribución y push con confirmación del usuario

## Pendiente con el proyecto real (requiere cuenta Sanity)

El grupo 3 se verificó contra un dataset local generado por `studio/scripts/seed-local.ts`
(mismos documentos del seed, evaluados con groq-js). Con el proyecto creado (2.1) queda por
confirmar: fetch real en build (3.1), respuesta `200 application/pdf` de un PDF subido desde
el Studio (3.4), validaciones en el Studio (2.2–2.4), seed contra `production` (2.5) y el
flujo webhook → deploy (4.2).
