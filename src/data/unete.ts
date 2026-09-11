import { contact } from './home';

const profileBody = [
  'Hola, equipo Putnam.',
  '',
  'Rol o área de interés:',
  '',
  'Breve presentación (experiencia relevante):',
  '',
  'Enlaces o adjuntos (CV, portafolio, LinkedIn):',
  '',
].join('\n');

export const profileMailto = (subject: string) => `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(profileBody)}`;
export const profileWhatsapp = `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hola, equipo Putnam. Quiero enviarles mi perfil para futuras oportunidades: ')}`;

export const hero = {
  title: 'Únete a un equipo que construye proyectos con criterio, detalle y visión de largo plazo.',
  lead: 'En Putnam buscamos personas con disciplina técnica, sentido estético y compromiso real con la calidad. Valoramos perfiles que entienden que una buena obra no depende solo de ejecutar, sino de coordinar, anticipar y cuidar cada decisión del proceso.',
} as const;

export const culture = {
  title: 'Cómo trabajamos en Putnam',
  text: 'Priorizamos una forma de trabajo sobria, técnica y profesional. Nos interesa más la consistencia en el tiempo que la improvisación de corto plazo.',
  traits: [
    { title: 'Precisión', text: 'Planificamos con claridad, revisamos entregables y cuidamos la ejecución para reducir errores y retrabajos.' },
    { title: 'Responsabilidad', text: 'Cada miembro responde por su frente de trabajo y entiende el impacto de su gestión en todo el proyecto.' },
    { title: 'Buen criterio', text: 'Valoramos la capacidad de priorizar, anticipar problemas y proponer soluciones viables.' },
    { title: 'Mejora continua', text: 'Buscamos personas abiertas a aprender, sistematizar procesos y elevar el estándar de la compañía.' },
  ],
} as const;

export const profile = {
  title: 'Buscamos profesionales que quieran crecer con una constructora enfocada en valor patrimonial y ejecución rigurosa.',
  text: 'Trabajamos en proyectos residenciales y desarrollos boutique donde el detalle importa. Eso exige equipos responsables, ordenados y capaces de colaborar entre diseño, obra, proveedores y cliente final.',
  values: [
    { title: 'Rigor profesional', text: 'Personas que ordenan, documentan y ejecutan con método.' },
    { title: 'Criterio técnico', text: 'Capacidad para tomar decisiones prácticas sin sacrificar calidad.' },
    { title: 'Actitud de equipo', text: 'Comunicación clara, responsabilidad y foco en resolver.' },
  ],
  kpis: [
    { value: '4 áreas', label: 'Arquitectura, obra, coordinación y soporte' },
    { value: 'Perfil', label: 'Orientado a calidad, tiempos y solución' },
    { value: 'Formato', label: 'Posiciones fijas y colaboraciones por proyecto' },
  ],
} as const;

export const openings = {
  title: 'Actualmente no estamos contratando.',
  text: 'Nuestro equipo crece de manera selectiva y en función de necesidades concretas de cada proyecto. Por ahora no contamos con procesos activos de incorporación.',
  emptyTitle: 'No hay vacantes abiertas en este momento',
  emptyText: [
    'En Putnam Desarrollos Inmobiliarios priorizamos incorporaciones puntuales, con criterio técnico, visión de largo plazo y capacidad de ejecución. Cuando abrimos una posición, buscamos perfiles que realmente eleven el estándar de la compañía.',
    'Si consideras que tu perfil puede aportar valor a futuros desarrollos, puedes enviarnos tu información para ser tomado en cuenta en próximas oportunidades.',
  ],
  cta: 'Enviar perfil para futuras oportunidades',
} as const;

export const process = {
  title: 'Qué esperamos del proceso.',
  text: 'Queremos procesos simples, serios y claros, enfocados en compatibilidad profesional y calidad del perfil.',
  steps: [
    { title: 'Postulación', text: 'Envíanos tu CV, portafolio o una breve presentación con experiencia relevante y áreas de interés.' },
    { title: 'Revisión técnica', text: 'Evaluamos trayectoria, criterio, calidad del trabajo y el encaje con las necesidades actuales del equipo.' },
    { title: 'Entrevista', text: 'Conversamos sobre tu perfil, forma de trabajo, responsabilidades previas y expectativa de crecimiento.' },
    { title: 'Integración', text: 'Si existe compatibilidad, definimos alcance, forma de colaboración y próximos pasos de incorporación.' },
  ],
} as const;

export const spontaneous = {
  title: 'Aunque no veas una vacante exacta, puedes escribirnos.',
  text: 'Si tu perfil aporta valor en arquitectura, ingeniería, coordinación, compras, visualización, comercialización o administración de proyectos, estaremos encantados de revisar tu información. En empresas en crecimiento, muchas buenas incorporaciones empiezan antes de que exista una vacante formal.',
  fields: ['Arquitectura', 'Ingeniería', 'Coordinación', 'Compras', 'Visualización', 'Comercialización', 'Administración de proyectos'],
} as const;

export const apply = {
  title: '¿Quieres formar parte de Putnam Desarrollos Inmobiliarios?',
  text: 'Envíanos tu perfil y una breve nota sobre el tipo de rol que te interesa. Revisaremos tu información y te contactaremos si vemos una coincidencia clara con nuestras necesidades.',
} as const;
