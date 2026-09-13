export const contactoHero = {
  kicker: 'Contacto',
  title: 'Conversemos\nsobre tu próximo\nproyecto.',
  lead: 'Consultas comerciales, reuniones de evaluación, alianzas estratégicas y requerimientos de inversión en desarrollos residenciales.',
} as const;

export const contactoChannels = {
  kicker: 'Canales principales',
  title: 'Estamos listos para ayudarte\na evaluar, diseñar o ejecutar.',
  text: 'Escríbenos por el canal que te resulte más cómodo: información sobre proyectos, coordinación de reuniones, alcance de servicios u oportunidades de colaboración. Priorizamos respuestas claras, serias y oportunas.',
  kpis: [
    { value: null, label: 'Tiempo objetivo de respuesta' },
    { value: 'Bolivia', label: 'Cobertura operativa principal' },
    { value: '1 : 1', label: 'Atención directa y personalizada' },
  ],
} as const;

export const contactoReasons = {
  kicker: '¿En qué podemos ayudarte?',
  title: 'Tres motivos frecuentes para escribirnos.',
  items: [
    { tag: 'Comercial', title: 'Información comercial', text: 'Disponibilidad, alcance de servicios, presentación institucional y primera orientación sobre el proyecto que te interesa.', cta: 'Solicitar información', href: 'whatsapp' },
    { tag: 'Proyecto', title: 'Reuniones de proyecto', text: 'Coordinación de reuniones para evaluación técnica, diseño, ejecución o seguimiento de una obra en curso.', cta: 'Agendar reunión', href: '#formulario' },
    { tag: 'Alianzas', title: 'Alianzas y oportunidades', text: 'Colaboraciones estratégicas, proveedores, inversionistas y propuestas conjuntas para nuevos desarrollos.', cta: 'Proponer una alianza', href: '#formulario' },
  ],
} as const;

export const contactoLocation = {
  kicker: 'Ubicación',
  title: 'Visítanos o agenda\nuna reunión previa.',
  text: 'Nuestra oficina funciona como punto de contacto para reuniones comerciales y coordinación de proyectos. Para una mejor atención, sugerimos escribirnos antes de visitar.',
} as const;

export const contactoForm = {
  kicker: 'Formulario de contacto',
  title: 'Envíanos tu consulta.',
  text: (responseTime: string) => `Para consultas comerciales, reuniones, seguimiento de proyectos, cotizaciones o propuestas de colaboración. Te respondemos en ${responseTime}.`,
} as const;

export const contactoCta = {
  kicker: 'Siguiente paso',
  title: '¿Prefieres escribirnos\nde inmediato?',
  text: 'Envíanos un mensaje directo por WhatsApp para coordinar una conversación inicial, compartir tu requerimiento y definir el mejor canal de seguimiento.',
} as const;
