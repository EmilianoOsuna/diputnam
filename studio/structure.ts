import type { StructureResolver } from 'sanity/structure';
import { singletons } from './schemaTypes';

// Site sections first (one fixed document each), then the two collections.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenido')
    .items([
      ...singletons.map((type) => S.listItem().title(type.title ?? type.name).id(type.name).child(S.document().schemaType(type.name).documentId(type.name))),
      S.divider(),
      S.documentTypeListItem('nota').title('Notas'),
      S.documentTypeListItem('documentoLegal').title('Documentos legales'),
    ]);
