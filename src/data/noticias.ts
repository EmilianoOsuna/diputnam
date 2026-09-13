export type Nota = { slug: string; date: string; category: string; tags: string[]; title: string; excerpt: string; readTime: string };

export const notas: Nota[] = [
  { slug: 'nueva-etapa-comunicacion', date: '09 Mar 2026', category: 'Avance de obra', tags: ['Avance de obra', 'Corporativo'], readTime: '4 min', title: 'Putnam inicia una nueva etapa de comunicación sobre hitos y ejecución de proyectos.', excerpt: 'Presentamos una línea editorial enfocada en avances de obra, decisiones de diseño, calidad constructiva y novedades de la empresa. La intención es mostrar progreso real y construir una narrativa de marca más sólida para clientes, socios e inversionistas.' },
  { slug: 'comunicar-avances-constructivos', date: '02 Mar 2026', category: 'Proyectos', tags: ['Proyecto', 'Calidad técnica'], readTime: '3 min', title: 'Buenas prácticas para comunicar avances constructivos con enfoque técnico y comercial.', excerpt: 'Una actualización de obra no solo debe mostrar imágenes; también debe traducir cronograma, control de calidad, cumplimiento y valor patrimonial futuro.' },
  { slug: 'marca-premium-transparente', date: '20 Feb 2026', category: 'Empresa', tags: ['Empresa', 'Equipo'], readTime: '3 min', title: 'Cómo Putnam quiere proyectar una marca constructora más premium y transparente.', excerpt: 'Estética limpia, titulares editoriales, taxonomías simples y llamados a la acción discretos, alineados con una constructora que comunica seriedad y visión de largo plazo.' },
];

export const noticiasPage = {
  hero: { kicker: 'Noticias · Putnam', title: 'Actualidad,\navances de obra\ny visión del negocio.', lead: 'Hitos de proyectos, novedades corporativas y contenidos sobre diseño, ejecución y desarrollo inmobiliario, en orden cronológico.' },
  index: { kicker: 'Todas las notas', title: 'Hitos, decisiones y avances,\nen orden cronológico.', archive: '2026' },
  cta: { kicker: 'Conversemos', title: '¿Quieres comunicar\nun proyecto o avance?', text: 'Escríbenos para coordinar la publicación de un hito, lanzamiento o novedad de Putnam con un enfoque institucional.' },
} as const;
