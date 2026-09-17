import { defineArrayMember, defineField, defineType } from 'sanity';
import { erediteHeroFields, erediteIntroFields, kicker, section, title } from './pages';

type Typology = { video?: { asset?: { _ref?: string } }; poster?: unknown; images?: unknown[] };

// A typology shows one medium at a time: the video when there is one, otherwise the
// first image; the rest are picked from a thumbnail strip on the site.
const typology = defineArrayMember({
  type: 'object',
  fields: [
    defineField({ name: 'id', title: 'Identificador', type: 'slug', validation: (rule) => rule.required() }),
    defineField({ name: 'tag', title: 'Etiqueta', type: 'localeString' }),
    defineField({ name: 'tone', title: 'Tono', type: 'string', options: { list: ['azul', 'verde'] }, initialValue: 'azul' }),
    defineField({ name: 'title', title: 'Título', type: 'localeString', validation: (rule) => rule.required() }),
    defineField({ name: 'subtitle', title: 'Subtítulo', type: 'localeString' }),
    defineField({
      name: 'video', title: 'Video (opcional, mp4)', type: 'file', options: { accept: 'video/mp4' },
      description: 'Se muestra por defecto, silenciado y en bucle. Súbelo comprimido: H.264, máximo 1280 px de ancho y 5 MB.',
      validation: (rule) => rule.custom((value) => {
        const ref = (value as Typology['video'])?.asset?._ref;
        return !ref || ref.endsWith('-mp4') ? true : 'Solo se aceptan videos mp4.';
      }),
    }),
    defineField({
      name: 'poster', title: 'Póster del video', type: 'localeImage', hidden: ({ parent }) => !(parent as Typology)?.video,
      validation: (rule) => rule.custom((value, context) => (!(context.parent as Typology)?.video?.asset?._ref || value ? true : 'Obligatorio cuando hay video: es la imagen que se ve antes de reproducirlo.')),
    }),
    defineField({
      name: 'images', title: 'Renders y fotos', type: 'array', options: { layout: 'grid' },
      of: [defineArrayMember({ type: 'captionedImage' })],
      validation: (rule) => rule.custom((value, context) => ((context.parent as Typology)?.video?.asset?._ref || (value?.length ?? 0) > 0 ? true : 'Añade un video o al menos una imagen.')),
    }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText' }),
    defineField({ name: 'specs', title: 'Ficha', type: 'array', of: [defineArrayMember({ type: 'labelValue' })] }),
  ],
  preview: { select: { title: 'title.es', subtitle: 'subtitle.es', media: 'images.0' } },
});

export const proyecto = defineType({
  name: 'proyecto',
  title: 'Proyecto Ereditá',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nombre', type: 'string', description: 'P. ej. "Ereditá Art".', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug', title: 'Ruta', type: 'slug', description: 'Se publica en /eredita/<ruta>/ en ambos idiomas.',
      options: { source: 'name', maxLength: 60 },
      validation: (rule) => rule.required().custom((value) => {
        const current = (value as { current?: string } | undefined)?.current ?? '';
        return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(current) ? true : 'Solo minúsculas, números y guiones (p. ej. "eredita-art").';
      }),
    }),
    defineField({ name: 'order', title: 'Orden', type: 'number', validation: (rule) => rule.required().integer().min(1) }),
    defineField({ name: 'status', title: 'Estado', type: 'localeString', description: 'P. ej. "En preventa", "En construcción".' }),
    section('card', 'Tarjeta en la portada de Ereditá', [
      defineField({ name: 'image', title: 'Imagen', type: 'localeImage', validation: (rule) => rule.required() }),
      defineField({ name: 'text', title: 'Texto breve', type: 'localeText', validation: (rule) => rule.required() }),
    ]),
    section('hero', 'Hero', erediteHeroFields),
    section('intro', 'Introducción', erediteIntroFields),
    section('gallery', 'Galería', [
      kicker, title,
      defineField({
        name: 'items', title: 'Imágenes', type: 'array',
        of: [defineArrayMember({ type: 'object', fields: [
          defineField({ name: 'image', title: 'Imagen', type: 'localeImage', validation: (rule) => rule.required() }),
          defineField({ name: 'tag', title: 'Etiqueta', type: 'localeString', description: 'Fotografía, Render…' }),
        ], preview: { select: { title: 'tag.es', media: 'image' } } })],
      }),
    ]),
    section('typologies', 'Tipologías', [
      kicker, title,
      defineField({ name: 'intro', title: 'Introducción', type: 'localeText' }),
      defineField({ name: 'items', title: 'Tipologías', type: 'array', of: [typology] }),
    ]),
    section('legal', 'Documentación para compradores', [kicker, title, defineField({ name: 'lead', title: 'Entrada', type: 'localeText' })]),
    section('cta', 'Cierre', [kicker, title]),
  ],
  orderings: [{ title: 'Orden', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'slug.current', media: 'card.image' } },
});
