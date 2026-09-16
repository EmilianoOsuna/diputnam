import { documentoLegal } from './documentoLegal';
import { nota } from './nota';
import { objectTypes } from './objects';
import { contacto, eredita, home, noticias, putnam, unete } from './pages';
import { proyecto } from './proyecto';
import { siteSettings } from './siteSettings';

export const singletons = [home, eredita, putnam, unete, contacto, noticias, siteSettings];
export const singletonTypes = new Set<string>(singletons.map((type) => type.name));
export const schemaTypes = [...objectTypes, ...singletons, proyecto, nota, documentoLegal];
