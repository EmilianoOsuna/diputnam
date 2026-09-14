import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Datos de contacto',
  type: 'document',
  fields: [
    defineField({ name: 'city', title: 'Ciudad', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'email', title: 'Correo', type: 'string', validation: (rule) => rule.required().email() }),
    defineField({ name: 'phone', title: 'Teléfono', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'whatsappMessage', title: 'Mensaje inicial de WhatsApp', type: 'localeString', description: 'Texto con el que se abre el chat desde los botones de WhatsApp.' }),
    defineField({ name: 'address', title: 'Dirección', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'hours', title: 'Horario', type: 'localeString', validation: (rule) => rule.required() }),
    defineField({ name: 'hoursShort', title: 'Horario abreviado', type: 'localeString', description: 'Versión corta para el hero de Contacto (p. ej. "Lun – Vie · 08:30 – 18:30").' }),
    defineField({ name: 'responseTime', title: 'Tiempo de respuesta', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'mapsUrl', title: 'Enlace a Google Maps', type: 'url' }),
    defineField({ name: 'coordinates', title: 'Coordenadas', type: 'geopoint' }),
    // Feeds the Organization structured data (schema.org) on every page.
    defineField({
      name: 'organization', title: 'Datos de la empresa (SEO)', type: 'object',
      description: 'Se publica como datos estructurados para buscadores y asistentes de IA.',
      fields: [
        defineField({ name: 'description', title: 'Descripción de Putnam', type: 'localeText', description: 'Una o dos frases: qué hace Putnam y dónde.', validation: (rule) => rule.required() }),
        defineField({ name: 'legalName', title: 'Razón social', type: 'string' }),
        defineField({ name: 'foundingYear', title: 'Año de fundación', type: 'number', validation: (rule) => rule.integer().min(1900).max(2100) }),
        defineField({ name: 'sameAs', title: 'Redes y perfiles', type: 'array', of: [{ type: 'url' }], description: 'Instagram, LinkedIn, Facebook, Perfil de Negocio de Google…' }),
        defineField({ name: 'logo', title: 'Logo (cuadrado)', type: 'image', description: 'Opcional; si falta se usa el icono del sitio.' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Datos de contacto' }) },
});
