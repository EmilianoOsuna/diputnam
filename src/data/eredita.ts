export const erediteHero = {
  kicker: 'Proyecto residencial · La Paz, Bolivia',
  title: 'Tipologías de vivienda diseñadas para adaptarse a diversos estilos de vida.',
  sub: 'Foco en funcionalidad, diseño y experiencia residencial.',
  video: null as string | null,
  poster: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=85&w=2200&auto=format&fit=crop',
  alt: 'Fachada contemporánea del proyecto Ereditá',
} as const;

export const erediteIntro = {
  eyebrow: 'Ereditá',
  title: 'Una propuesta residencial bien pensada, segura y durable.',
  lead: 'Ereditá reúne tipologías funcionales, áreas comunes y una estructura documental orientada a brindar mayor transparencia al comprador.',
  bullets: [
    'Tipologías de monoambiente, 1 y 2 dormitorios.',
    'Áreas comunes diseñadas para elevar la experiencia residencial.',
    'Acceso previsto a documentos legales relevantes para compradores.',
  ],
  facts: [
    { label: 'Ubicación', value: 'La Paz, Bolivia' },
    { label: 'Tipologías', value: 'Monoambiente — 2 dormitorios' },
    { label: 'Áreas comunes', value: 'Piscina, gimnasio, salón de eventos' },
    { label: 'Entrega', value: 'Escalonada, dic. 2026 – jun. 2027' },
  ],
} as const;

export const erediteGallery = [
  { src: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?q=85&w=1600&auto=format&fit=crop', alt: 'Fachada del edificio Ereditá', tag: 'Fotografía' },
  { src: 'https://images.ctfassets.net/d816js9bi8lf/MEHph2NURZ0CDlwyHFk4L/d3ec5da9f9b9cabf317e5704360acfb6/T_H_From_Video.png?w=1200&fl=progressive&q=80', alt: 'Render de áreas comunes', tag: 'Render' },
  { src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=85&w=1600&auto=format&fit=crop', alt: 'Interior de monoambiente con luz natural', tag: 'Fotografía' },
  { src: 'https://images.ctfassets.net/d816js9bi8lf/4epRkOEeBykhWwcCDRiCAp/8ebe182a4aa35acf23fb85ed541ee926/MClayton_2501-2-SPA-MOS_001.jpg?w=1200&fl=progressive&q=80', alt: 'Render de monoambiente', tag: 'Render' },
  { src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=85&w=1600&auto=format&fit=crop', alt: 'Living comedor de 2 dormitorios', tag: 'Fotografía' },
  { src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=85&w=1600&auto=format&fit=crop', alt: 'Terraza y áreas comunes', tag: 'Fotografía' },
  { src: 'https://images.ctfassets.net/d816js9bi8lf/49HQlLegabqAjApQDV4ue9/d216ecb70b31d813d656f131d724b8df/MClayton_2308-3-SL-COV_006.jpg?w=1200&fl=progressive&q=80', alt: 'Render de 1 dormitorio', tag: 'Render' },
  { src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=85&w=1600&auto=format&fit=crop', alt: 'Dormitorio principal con acabados premium', tag: 'Fotografía' },
  { src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=85&w=1600&auto=format&fit=crop', alt: 'Volúmenes exteriores del proyecto', tag: 'Fotografía' },
] as const;

export const erediteTypologies = [
  {
    id: 'monoambiente',
    tag: 'Tipología',
    tone: 'azul',
    title: 'Monoambiente',
    subtitle: 'Espacios compactos y eficientes para vida urbana, renta o primera inversión.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=85&w=1600&auto=format&fit=crop',
    alt: 'Monoambiente Ereditá',
    description: 'Nuestros monoambientes están diseñados para maximizar cada metro cuadrado. Con distribuciones inteligentes, acabados premium y tecnología constructiva de vanguardia, ofrecemos unidades que combinan comodidad, estética y alta rentabilidad para inversores.',
    specs: [
      { key: 'Superficie', val: '35 – 48 m²' },
      { key: 'Ambientes', val: '1 ambiente integrado' },
      { key: 'Cocina', val: 'Equipada con isla' },
      { key: 'Balcón', val: 'Opcional' },
      { key: 'Piso', val: 'Porcelanato 60×60' },
      { key: 'Entrega', val: 'Dic 2026' },
    ],
  },
  {
    id: 'dormitorio1',
    tag: 'Tipología',
    tone: 'verde',
    title: '1 Dormitorio',
    subtitle: 'Distribución funcional para usuarios que priorizan confort y versatilidad.',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=85&w=1600&auto=format&fit=crop',
    alt: '1 dormitorio Ereditá',
    description: 'Departamentos de 1 dormitorio pensados para quienes buscan independencia con estilo. Ambientes bien distribuidos, iluminación natural y acabados de calidad que garantizan confort diario y plusvalía a largo plazo.',
    specs: [
      { key: 'Superficie', val: '52 – 68 m²' },
      { key: 'Dormitorios', val: '1 suite principal' },
      { key: 'Living-comedor', val: 'Integrado' },
      { key: 'Baños', val: '1 completo + toilette' },
      { key: 'Depósito', val: 'Incluido' },
      { key: 'Entrega', val: 'Mar 2027' },
    ],
  },
  {
    id: 'dormitorios2',
    tag: 'Tipología',
    tone: 'verde',
    title: '2 Dormitorios',
    subtitle: 'Mayor amplitud para familias pequeñas o residentes que requieren ambientes adicionales.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=85&w=1600&auto=format&fit=crop',
    alt: '2 dormitorios Ereditá',
    description: 'Nuestras unidades de 2 dormitorios ofrecen el equilibrio perfecto entre espacio y funcionalidad. Ideales para familias que buscan calidad de vida, con ambientes amplios, doble baño y acceso directo a todas las áreas comunes del edificio.',
    specs: [
      { key: 'Superficie', val: '75 – 95 m²' },
      { key: 'Dormitorios', val: '2 con walk-in closet' },
      { key: 'Living-comedor', val: 'Amplio con balcón' },
      { key: 'Baños', val: '2 completos' },
      { key: 'Cochera', val: 'Incluida' },
      { key: 'Entrega', val: 'Jun 2027' },
    ],
  },
  {
    id: 'areas-comunes',
    tag: 'Amenidades',
    tone: 'azul',
    title: 'Áreas comunes',
    subtitle: 'Amenidades y espacios compartidos concebidos para elevar la experiencia del proyecto.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=85&w=1600&auto=format&fit=crop',
    alt: 'Áreas comunes Ereditá',
    description: 'Las áreas comunes de nuestros edificios están diseñadas para fomentar la vida en comunidad y el bienestar de todos los residentes. Desde piscina y gimnasio hasta salones de eventos y terrazas con vistas panorámicas, cada espacio refleja nuestro compromiso con la calidad de vida.',
    specs: [
      { key: 'Piscina', val: 'Semi-olímpica climatizada' },
      { key: 'Gimnasio', val: 'Equipado 24/7' },
      { key: 'Salón de eventos', val: 'Capacidad 80 personas' },
      { key: 'Terraza', val: 'Con parrilla y vista panorámica' },
      { key: 'Lobby', val: 'Con recepción' },
      { key: 'Seguridad', val: 'CCTV + portería 24h' },
    ],
  },
] as const;

export const erediteLegalDocs = {
  eyebrow: 'Documentación para compradores',
  title: 'Acceso a documentos legales relevantes del proyecto.',
  lead: 'Este espacio está preparado para alojar archivos clave del proyecto. Aquí podrás cargar y actualizar la documentación legal que necesiten revisar los compradores antes de tomar una decisión.',
  docs: [
    { title: 'Reglamento de copropiedad', text: 'Sube aquí el reglamento, anexos y versiones vigentes aplicables al proyecto.' },
    { title: 'Minuta tipo de compraventa', text: 'Espacio reservado para el modelo contractual y sus condiciones principales.' },
    { title: 'Planos y aprobaciones', text: 'Aquí podrás publicar planos aprobados, licencias y documentación técnica relevante.' },
    { title: 'Fichas y políticas del proyecto', text: 'Sección prevista para políticas comerciales, garantías y documentos complementarios.' },
  ],
} as const;
