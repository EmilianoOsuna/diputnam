import { defineField, defineType } from 'sanity';

// Field-level localization: Spanish is the source of truth and required; English is
// optional and the site falls back to Spanish when it is empty.
const localized = (name: string, title: string, type: 'string' | 'text', description?: string) =>
  defineType({
    name,
    title,
    type: 'object',
    description,
    options: { collapsible: false },
    fields: [
      defineField({ name: 'es', title: 'Español', type, rows: type === 'text' ? 3 : undefined, validation: (rule) => rule.required() }),
      defineField({ name: 'en', title: 'English', type, rows: type === 'text' ? 3 : undefined }),
    ],
    preview: { select: { title: 'es', subtitle: 'en' } },
  });

export const localeString = localized('localeString', 'Texto', 'string');
export const localeText = localized('localeText', 'Texto largo', 'text');
// Titles keep the editor's line breaks: each Enter is rendered as a line break on the site.
export const localeTitle = localized('localeTitle', 'Título', 'text', 'Intro = salto de renglón en el sitio.');

const imageFields = [
  defineField({ name: 'alt', title: 'Texto alternativo', type: 'localeString', hidden: ({ parent }) => Boolean(parent?.decorative), validation: (rule) => rule.custom((value, context) => {
    const parent = context.parent as { decorative?: boolean } | undefined;
    if (parent?.decorative) return true;
    return (value as { es?: string } | undefined)?.es ? true : 'Escribe el texto alternativo en español o marca la imagen como decorativa.';
  }) }),
  defineField({ name: 'decorative', title: 'Imagen decorativa (sin texto alternativo)', type: 'boolean', initialValue: false }),
];

export const localeImage = defineType({
  name: 'localeImage',
  title: 'Imagen',
  type: 'image',
  options: { hotspot: true },
  fields: imageFields,
});

// A typology render or photo: a localeImage plus the caption shown under its thumbnail.
export const captionedImage = defineType({
  name: 'captionedImage',
  title: 'Render o foto',
  type: 'image',
  options: { hotspot: true },
  fields: [defineField({ name: 'caption', title: 'Pie', type: 'localeString', description: 'P. ej. "Parrillero de la terraza".' }), ...imageFields],
  preview: { select: { title: 'caption.es', subtitle: 'alt.es', media: 'asset' } },
});

export const kickerTitle = defineType({
  name: 'sectionHeading',
  title: 'Encabezado de sección',
  type: 'object',
  fields: [
    defineField({ name: 'kicker', title: 'Kicker', type: 'localeString' }),
    defineField({ name: 'title', title: 'Título', type: 'localeTitle', validation: (rule) => rule.required() }),
    defineField({ name: 'text', title: 'Texto', type: 'localeText' }),
  ],
  preview: { select: { title: 'title.es', subtitle: 'kicker.es' } },
});

export const titledItem = defineType({
  name: 'titledItem',
  title: 'Elemento',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString', validation: (rule) => rule.required() }),
    defineField({ name: 'text', title: 'Texto', type: 'localeText', validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'title.es', subtitle: 'text.es' } },
});

export const labelValue = defineType({
  name: 'labelValue',
  title: 'Dato',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Etiqueta', type: 'localeString', validation: (rule) => rule.required() }),
    defineField({ name: 'value', title: 'Valor', type: 'localeString', validation: (rule) => rule.required() }),
  ],
  preview: { select: { title: 'label.es', subtitle: 'value.es' } },
});

// Rich text for note bodies: paragraphs, h2/h3, lists, links and images. No embeds.
export const richText = defineType({
  name: 'richText',
  title: 'Cuerpo',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Párrafo', value: 'normal' }, { title: 'Subtítulo', value: 'h2' }, { title: 'Subtítulo menor', value: 'h3' }],
      lists: [{ title: 'Viñetas', value: 'bullet' }, { title: 'Numerada', value: 'number' }],
      marks: {
        decorators: [{ title: 'Negrita', value: 'strong' }, { title: 'Cursiva', value: 'em' }],
        annotations: [
          { name: 'link', type: 'object', title: 'Enlace', fields: [defineField({ name: 'href', title: 'URL', type: 'url', validation: (rule) => rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }) })] },
        ],
      },
    },
    { type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' })] },
  ],
});

export const objectTypes = [localeString, localeText, localeTitle, localeImage, captionedImage, kickerTitle, titledItem, labelValue, richText];
