import { defineField, defineType } from 'sanity';

type LegalDoc = { _id?: string; file?: { asset?: { _ref?: string } }; version?: string; validFrom?: string };

// Buyer-facing documents for Ereditá. The file is optional (the card reads "Coming soon"
// without it); once there is a file, a version label and a validity date are required, and
// swapping the file without bumping the version is refused. Older revisions stay in
// Sanity's document history.
export const documentoLegal = defineType({
  name: 'documentoLegal',
  title: 'Documento legal',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'localeText', validation: (rule) => rule.required() }),
    defineField({ name: 'order', title: 'Orden', type: 'number', validation: (rule) => rule.required().integer().min(1) }),
    defineField({
      name: 'file', title: 'Archivo PDF', type: 'file', options: { accept: 'application/pdf' },
      validation: (rule) => rule.custom(async (value, context) => {
        const file = value as LegalDoc['file'];
        if (!file?.asset?._ref) return true;
        if (!file.asset._ref.endsWith('-pdf')) return 'Solo se aceptan archivos PDF.';
        const draft = context.document as LegalDoc | undefined;
        const id = (draft?._id ?? '').replace(/^drafts\./, '');
        if (!id) return true;
        try {
          const published = await context.getClient({ apiVersion: '2026-09-01' }).fetch<LegalDoc | null>(`*[_id == $id][0]{file, version}`, { id });
          const fileChanged = published?.file?.asset?._ref && published.file.asset._ref !== file.asset._ref;
          if (fileChanged && published?.version === draft?.version) return 'Has reemplazado el archivo: actualiza la versión antes de publicar.';
        } catch (error) {
          console.warn('documentoLegal: could not compare with the published version', error);
        }
        return true;
      }),
    }),
    defineField({ name: 'version', title: 'Versión', type: 'string', description: 'P. ej. "v2".', validation: (rule) => rule.custom((value, context) => (!(context.document as LegalDoc)?.file?.asset?._ref || value ? true : 'Obligatoria cuando hay archivo.')) }),
    defineField({ name: 'validFrom', title: 'Vigente desde', type: 'date', validation: (rule) => rule.custom((value, context) => (!(context.document as LegalDoc)?.file?.asset?._ref || value ? true : 'Obligatoria cuando hay archivo.')) }),
  ],
  orderings: [{ title: 'Orden', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.es', version: 'version', validFrom: 'validFrom', file: 'file.asset._ref' },
    prepare: ({ title, version, validFrom, file }) => ({ title, subtitle: file ? `${version ?? '—'} · ${validFrom ?? ''}` : 'Sin archivo (Próximamente)' }),
  },
});
