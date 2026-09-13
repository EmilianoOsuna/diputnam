import { documentInternationalization } from '@sanity/document-internationalization';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './env';
import { schemaTypes, singletonTypes } from './schemaTypes';
import { structure } from './structure';

export default defineConfig({
  name: 'putnam',
  title: 'Putnam',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    // Notes are translated document by document; everything else localizes per field.
    documentInternationalization({
      supportedLanguages: [{ id: 'es', title: 'Español' }, { id: 'en', title: 'English' }],
      schemaTypes: ['nota'],
      apiVersion,
    }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons are created by the seed with fixed ids and never from "Create new".
    templates: (templates) => templates.filter((template) => !singletonTypes.has(template.schemaType)),
  },
  document: {
    actions: (actions, context) =>
      singletonTypes.has(context.schemaType) ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : actions,
  },
});
