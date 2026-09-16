import type { StructureResolver } from 'sanity/structure';
import { singletons } from './schemaTypes';

// Site sections first (one fixed document each, with the Ereditá projects right after
// the line), then the two collections.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      ...singletons.flatMap((type) => [
        S.listItem().title(type.title ?? type.name).id(type.name).child(S.document().schemaType(type.name).documentId(type.name)),
        ...(type.name === 'eredita' ? [S.documentTypeListItem('proyecto').title('Proyectos Ereditá').child(S.documentTypeList('proyecto').title('Proyectos Ereditá').defaultOrdering([{ field: 'order', direction: 'asc' }]))] : []),
      ]),
      S.divider(),
      S.documentTypeListItem('nota').title('Notas'),
      S.documentTypeListItem('documentoLegal').title('Documentos legales'),
    ]);
