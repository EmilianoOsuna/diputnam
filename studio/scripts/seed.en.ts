// English drafts of every editorial string the seed loads, mirroring the shapes in
// ../../src/data/*.ts. Review before running the seed; edit later in the Studio.

export const home = {
  scenes: { inicio: 'We design\nspaces', eredita: 'Ereditá', putnam: 'Vision, design\nand delivery', contacto: "Let's talk" },
  alts: {
    inicio: 'Residential interior with natural light',
    eredita: 'Contemporary architecture of a residential development',
    putnam: 'Technical team reviewing a construction site',
    contacto: 'Structure of a building under construction',
  },
};

export const eredita = {
  hero: { kicker: 'Residential project · La Paz, Bolivia', title: 'Housing typologies designed to suit different ways of living.', sub: 'A focus on function, design and the residential experience.', alt: 'Contemporary façade of the Ereditá project' },
  intro: {
    eyebrow: 'Ereditá',
    title: 'A thoughtful, safe and durable residential proposal.',
    lead: 'Ereditá brings together functional typologies, shared amenities and a documentation structure designed to give buyers greater transparency.',
    bullets: ['Studio, one- and two-bedroom typologies.', 'Shared amenities designed to elevate the residential experience.', 'Planned access to the legal documents that matter to buyers.'],
    facts: [['Location', 'La Paz, Bolivia'], ['Typologies', 'Studio — 2 bedrooms'], ['Amenities', 'Pool, gym, events room'], ['Delivery', 'Phased, Dec 2026 – Jun 2027']],
  },
  gallery: {
    kicker: 'Gallery', title: 'Photographs and renders of the project.',
    tags: { Fotografía: 'Photograph', Render: 'Render' } as Record<string, string>,
    alts: [
      'Façade of the Ereditá building', 'Render of the shared amenities', 'Studio interior with natural light', 'Render of a studio apartment',
      'Living and dining room of a two-bedroom unit', 'Terrace and shared amenities', 'Render of a one-bedroom unit', 'Main bedroom with premium finishes', 'Exterior volumes of the project',
    ],
  },
  typologies: {
    kicker: 'Typologies', title: 'Four ways\nto live Ereditá.', intro: 'Each typology answers a different way of living, from a first apartment to family life.',
    tags: { Tipología: 'Typology', Amenidades: 'Amenities' } as Record<string, string>,
    items: {
      monoambiente: { title: 'Studio', subtitle: 'Compact, efficient spaces for urban living, renting or a first investment.', alt: 'Ereditá studio apartment', description: 'Our studios are designed to make the most of every square metre. Smart layouts, premium finishes and state-of-the-art construction technology deliver units that combine comfort, aesthetics and strong returns for investors.', specs: [['Area', '35 – 48 m²'], ['Rooms', '1 open-plan room'], ['Kitchen', 'Fitted, with island'], ['Balcony', 'Optional'], ['Flooring', '60×60 porcelain tile'], ['Delivery', 'Dec 2026']] },
      dormitorio1: { title: '1 Bedroom', subtitle: 'A functional layout for residents who value comfort and versatility.', alt: 'Ereditá one-bedroom apartment', description: 'One-bedroom apartments for those who want independence with style. Well-distributed rooms, natural light and quality finishes that guarantee daily comfort and long-term value.', specs: [['Area', '52 – 68 m²'], ['Bedrooms', '1 master suite'], ['Living-dining', 'Open-plan'], ['Bathrooms', '1 full + guest toilet'], ['Storage', 'Included'], ['Delivery', 'Mar 2027']] },
      dormitorios2: { title: '2 Bedrooms', subtitle: 'More room for small families or residents who need extra space.', alt: 'Ereditá two-bedroom apartment', description: 'Our two-bedroom units strike the right balance between space and function. Ideal for families seeking quality of life, with generous rooms, two bathrooms and direct access to all of the building’s shared amenities.', specs: [['Area', '75 – 95 m²'], ['Bedrooms', '2 with walk-in closet'], ['Living-dining', 'Spacious, with balcony'], ['Bathrooms', '2 full'], ['Parking', 'Included'], ['Delivery', 'Jun 2027']] },
      'areas-comunes': { title: 'Shared amenities', subtitle: 'Amenities and shared spaces conceived to elevate the project experience.', alt: 'Ereditá shared amenities', description: 'The shared areas of our buildings are designed to foster community life and the well-being of every resident. From the pool and gym to events rooms and terraces with panoramic views, each space reflects our commitment to quality of life.', specs: [['Pool', 'Heated semi-Olympic'], ['Gym', 'Equipped, 24/7'], ['Events room', 'Capacity for 80'], ['Terrace', 'Barbecue and panoramic view'], ['Lobby', 'With reception'], ['Security', 'CCTV + 24h concierge']] },
    } as Record<string, { title: string; subtitle: string; alt: string; description: string; specs: [string, string][] }>,
  },
  legal: {
    eyebrow: 'Documentation for buyers', title: 'Access to the project’s relevant legal documents.',
    lead: 'This space hosts the project’s key files. The legal documentation buyers need to review before making a decision is uploaded and kept up to date here.',
    docs: [
      ['Co-ownership regulations', 'The regulations, annexes and current versions applicable to the project.'],
      ['Standard purchase agreement', 'The contract template and its main terms.'],
      ['Plans and approvals', 'Approved plans, permits and relevant technical documentation.'],
      ['Project sheets and policies', 'Commercial policies, warranties and supplementary documents.'],
    ] as [string, string][],
  },
  cta: { kicker: 'Next step', title: 'Get to know Ereditá up close and clear up your questions.' },
};

export const putnam = {
  hero: { kicker: 'The firm', title: 'One vision.\nThe whole process.', lead: 'We integrate design, planning and execution to build long-term value.', alt: 'Volumes and lines of a contemporary building' },
  process: {
    kicker: 'The Putnam process',
    steps: {
      '01': ['Due diligence', 'We review the context, risks and viability of each opportunity.', 'Work table with documents for evaluating a project'],
      '02': ['Feasibility', 'We align scope, budget and critical decisions before designing.', ''],
      '03': ['Concept', 'We turn commercial and habitability goals into a clear direction.', 'Architects developing the concept of a project'],
      '04': ['Design', 'We coordinate architecture, disciplines and documentation with BIM.', ''],
      '05': ['Construction', 'We build with technical supervision, control and continuous communication.', 'Technical team during the construction of a building'],
      '06': ['Handover and after-sales', 'We close the process caring for finishes, performance and follow-up.', ''],
    } as Record<string, [string, string, string]>,
  },
  principles: {
    kicker: 'What guides us', title: 'Mission, vision and values',
    mission: ['Mission', 'Build with purpose', 'Design and deliver projects of high technical quality that generate sustainable asset value, integrating collaborative processes and technology.'],
    vision: ['Vision', 'Be a reference for how we do things', 'Establish ourselves in Bolivia through technical excellence, transparent management and the ability to create residential projects that improve everyday life.'],
    valuesLabel: 'Values / 06', valuesTitle: 'Principles that run through every decision.',
    values: ['Technical excellence', 'Transparency and ethics', 'Commitment to the client', 'Constant innovation', 'Responsibility for asset value', 'Teamwork'],
  },
  differences: {
    kicker: 'The Putnam difference', title: 'Rigour in what is unseen.\nClarity in the result.',
    items: {
      '01': ['Scale and precision', 'The agility of a specialised team with rigorous standards for every residential scale.'],
      '02': ['Design and construction, integrated', 'Architecture, budget and execution are coordinated from day one as a single conversation.'],
      '03': ['High-value preconstruction', 'Feasibility considers the full development cost, not only the build.'],
      '04': ['A network that adds up', 'Relationships with specialists and suppliers lead to better decisions and continuity.'],
    } as Record<string, [string, string]>,
  },
  cta: { kicker: 'Next step', title: 'A conversation can be the start of something solid.' },
};

export const unete = {
  hero: { kicker: 'Putnam talent', title: 'Join a team with judgement.', lead: 'At Putnam we look for people with technical discipline, aesthetic sense and a real commitment to quality. We value profiles that understand a good build depends not only on execution, but on coordinating, anticipating and caring for every decision in the process.', meta: ['Permanent positions · Project collaborations', 'Architecture · Site · Coordination · Support'], alt: 'Site crew on the slab of a project under construction' },
  culture: {
    kicker: 'Our culture', title: 'How we work at Putnam', text: 'We favour a sober, technical and professional way of working. Consistency over time matters more to us than short-term improvisation.',
    traits: [['Precision', 'We plan clearly, review deliverables and take care in execution to reduce errors and rework.'], ['Accountability', 'Each team member owns their front of work and understands the impact of their management on the whole project.'], ['Good judgement', 'We value the ability to prioritise, anticipate problems and propose workable solutions.'], ['Continuous improvement', 'We look for people open to learning, systematising processes and raising the company’s standard.']] as [string, string][],
  },
  profile: {
    kicker: 'What we value', title: 'We look for professionals who want to grow\nwith a builder focused on asset value\nand rigorous execution.', text: 'We work on residential projects and boutique developments where detail matters. That demands responsible, organised teams able to collaborate across design, site, suppliers and the end client.',
    values: [['Professional rigour', 'People who organise, document and execute methodically.'], ['Technical judgement', 'The ability to make practical decisions without sacrificing quality.'], ['Team attitude', 'Clear communication, accountability and a focus on solving.']] as [string, string][],
    kpis: [['4 areas', 'Architecture, site, coordination and support'], ['Profile', 'Focused on quality, deadlines and solutions'], ['Format', 'Permanent positions and project collaborations']] as [string, string][],
  },
  openings: {
    kicker: 'Opportunities', title: 'We are not\nhiring at the moment.', text: 'Our team grows selectively and in line with the concrete needs of each project. There are currently no active recruitment processes.',
    emptyKicker: 'No open positions', emptyTitle: 'There are no vacancies right now',
    emptyText: ['At Putnam Desarrollos Inmobiliarios we favour targeted hires with technical judgement, a long-term outlook and the ability to deliver. When we open a position, we look for profiles that genuinely raise the company’s standard.', 'If you believe your profile can add value to future developments, send us your details to be considered for upcoming opportunities.'],
    cta: 'Send your profile for future opportunities',
  },
  process: {
    kicker: 'Selection process', title: 'What to expect from the process.', text: 'We want simple, serious and clear processes, focused on professional fit and the quality of the profile.',
    steps: [['Application', 'Send us your CV, portfolio or a short introduction with relevant experience and areas of interest.'], ['Technical review', 'We assess track record, judgement, quality of work and fit with the team’s current needs.'], ['Interview', 'We talk about your profile, way of working, previous responsibilities and growth expectations.'], ['Onboarding', 'If there is a fit, we define scope, form of collaboration and next steps to join.']] as [string, string][],
  },
  spontaneous: {
    kicker: 'Spontaneous application', title: 'Even if you don’t see an exact vacancy,\nyou can write to us.', text: 'If your profile adds value in architecture, engineering, coordination, procurement, visualisation, sales or project administration, we will be glad to review your details. In growing companies, many good hires begin before a formal vacancy exists.',
    fields: { Arquitectura: 'Architecture', Ingeniería: 'Engineering', Coordinación: 'Coordination', Compras: 'Procurement', Visualización: 'Visualisation', Comercialización: 'Sales', 'Administración de proyectos': 'Project administration' } as Record<string, string>,
  },
  apply: { kicker: 'Apply', title: 'Would you like to be part\nof Putnam Desarrollos\nInmobiliarios?', text: 'Send us your profile and a short note about the kind of role you are interested in. We will review your details and contact you if we see a clear match with our needs.' },
  mail: {
    body: ['Hello, Putnam team.', '', 'Role or area of interest:', '', 'Short introduction (relevant experience):', '', 'Links or attachments (CV, portfolio, LinkedIn):', ''].join('\n'),
    whatsapp: 'Hello, Putnam team. I would like to send you my profile for future opportunities: ',
  },
};

export const contacto = {
  hero: { kicker: 'Contact', title: 'Let’s talk\nabout your next\nproject.', lead: 'Commercial enquiries, evaluation meetings, strategic partnerships and investment requirements in residential developments.', alt: 'Residential interior of a Putnam project' },
  channels: {
    kicker: 'Main channels', title: 'We are ready to help you\nevaluate, design or build.', text: 'Write to us through whichever channel suits you best: project information, meeting coordination, scope of services or collaboration opportunities. We prioritise clear, serious and timely replies.',
    kpis: ['Target response time', 'Main operating coverage', 'Direct, personal attention'],
  },
  reasons: {
    kicker: 'How can we help?', title: 'Three common reasons to write to us.',
    items: [['Commercial', 'Commercial information', 'Availability, scope of services, institutional presentation and initial guidance on the project you are interested in.', 'Request information'], ['Project', 'Project meetings', 'Coordinating meetings for technical evaluation, design, execution or follow-up of a project in progress.', 'Book a meeting'], ['Partnerships', 'Partnerships and opportunities', 'Strategic collaborations, suppliers, investors and joint proposals for new developments.', 'Propose a partnership']] as [string, string, string, string][],
  },
  location: { kicker: 'Location', title: 'Visit us or book\na meeting first.', text: 'Our office is the point of contact for commercial meetings and project coordination. For better service, we suggest writing to us before visiting.' },
  form: { kicker: 'Contact form', title: 'Send us your enquiry.', text: 'For commercial enquiries, meetings, project follow-up, quotes or collaboration proposals. We reply within {responseTime}.' },
  cta: { kicker: 'Next step', title: 'Prefer to write to us\nright away?', text: 'Send us a direct message on WhatsApp to arrange an initial conversation, share your requirement and agree on the best channel for follow-up.' },
};

export const noticias = {
  hero: { kicker: 'News · Putnam', title: 'News,\nconstruction progress\nand business vision.', lead: 'Project milestones, corporate updates and content on design, execution and real estate development, in chronological order.', alt: 'Residential interior of a Putnam project' },
  index: { kicker: 'All posts', title: 'Milestones, decisions and progress,\nin chronological order.' },
  empty: { title: 'No posts in English yet.', text: 'We are working on the first English posts. Meanwhile, the Spanish edition has all the news.' },
  cta: { kicker: 'Let’s talk', title: 'Want to announce\na project or milestone?', text: 'Write to us to coordinate the publication of a Putnam milestone, launch or update with an institutional approach.' },
  notas: {
    'nueva-etapa-comunicacion': { slug: 'a-new-stage-in-communication', category: 'Construction progress', tags: ['Construction progress', 'Corporate'], readTime: '4 min', title: 'Putnam begins a new stage of communication on project milestones and delivery.', excerpt: 'We are launching an editorial line focused on construction progress, design decisions, build quality and company news. The aim is to show real progress and build a stronger brand narrative for clients, partners and investors.' },
    'comunicar-avances-constructivos': { slug: 'communicating-construction-progress', category: 'Projects', tags: ['Project', 'Technical quality'], readTime: '3 min', title: 'Good practice for communicating construction progress with a technical and commercial focus.', excerpt: 'A site update should not only show images; it should also translate schedule, quality control, compliance and future asset value.' },
    'marca-premium-transparente': { slug: 'a-premium-transparent-brand', category: 'Company', tags: ['Company', 'Team'], readTime: '3 min', title: 'How Putnam wants to project a more premium and transparent construction brand.', excerpt: 'Clean aesthetics, editorial headlines, simple taxonomies and discreet calls to action, in line with a builder that communicates seriousness and a long-term vision.' },
  } as Record<string, { slug: string; category: string; tags: string[]; readTime: string; title: string; excerpt: string }>,
};

export const settings = {
  whatsappMessage: 'Hello, I would like to arrange a consultation with Putnam Desarrollos Inmobiliarios',
  hours: 'Monday to Friday · 08:30 to 18:30',
  hoursShort: 'Mon – Fri · 08:30 – 18:30',
};
