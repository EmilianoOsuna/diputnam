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
  ],
  preview: { prepare: () => ({ title: 'Datos de contacto' }) },
});
