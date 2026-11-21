// Catálogo base y categorías oficiales de Andrew Camisetas
export const CATALOGO_DATA = [
  {
    id: 'real-madrid-local-2025',
    nombre: 'REAL MADRID EQUIPACIÓN OFICIAL 2025/26',
    categoria: 'LA LIGA',
    categoriaId: 'la-liga',
    precio: 89,
    precioAntes: 120,
    precioShort: 35,
    stock: 16,
    inStock: true,
    stockPorTalla: { S: 4, M: 5, L: 4, XL: 3 },
    tallas: ['S', 'M', 'L', 'XL'],
    oferta: true,
    tag: 'CHAMPIONS LEAGUE',
    rating: 5.0,
    reviewsCount: 34,
    imagen: '/banners/showcase_real_madrid.webp',
    galeria: ['/banners/showcase_real_madrid.webp', '/clientes/cliente_madrid.webp'],
    descripcion: 'Camiseta oficial Real Madrid versión jugador con tecnología transpirable Heat.Rdy, escudo termo-sellado en relieve y parches oficiales de Champions League.'
  },
  {
    id: 'fc-barcelona-edicion-2025',
    nombre: 'FC BARCELONA EQUIPACIÓN TITULAR 2025/26',
    categoria: 'LA LIGA',
    categoriaId: 'la-liga',
    precio: 89,
    precioAntes: 115,
    precioShort: 35,
    stock: 14,
    inStock: true,
    stockPorTalla: { S: 3, M: 5, L: 4, XL: 2 },
    tallas: ['S', 'M', 'L', 'XL'],
    oferta: true,
    tag: 'VERSIÓN JUGADOR',
    rating: 4.9,
    reviewsCount: 29,
    imagen: '/banners/showcase_barcelona.webp',
    galeria: ['/banners/showcase_barcelona.webp', '/clientes/cliente_barca_inter.webp'],
    descripcion: 'Equipación blaugrana con corte atlético profesional Dri-FIT ADV, detalles dorados conmemorativos y opción de dorsal oficial personalizado.'
  },
  {
    id: 'seleccion-peruana-2025',
    nombre: 'SELECCIÓN PERUANA BLANQUIRROJA OFICIAL',
    categoria: 'SELECCIONES',
    categoriaId: 'selecciones',
    precio: 85,
    precioAntes: 110,
    precioShort: 35,
    stock: 20,
    inStock: true,
    stockPorTalla: { S: 5, M: 6, L: 5, XL: 4 },
    tallas: ['S', 'M', 'L', 'XL'],
    oferta: true,
    tag: 'MUNDIAL 2026',
    rating: 5.0,
    reviewsCount: 42,
    imagen: '/clientes/cliente_peru.webp',
    galeria: ['/clientes/cliente_peru.webp'],
    descripcion: 'La gloriosa franja roja con tejido técnico ultraligero, escudo bordado de alta definición y acabados de primera calidad para alentar a la Bicolor.'
  },
  {
    id: 'psg-edicion-especial',
    nombre: 'PARIS SAINT-GERMAIN EDICIÓN CHAMPIONS',
    categoria: 'PREMIER LEAGUE',
    categoriaId: 'premier-league',
    precio: 89,
    precioAntes: 120,
    precioShort: 35,
    stock: 12,
    inStock: true,
    stockPorTalla: { S: 3, M: 4, L: 3, XL: 2 },
    tallas: ['S', 'M', 'L', 'XL'],
    oferta: true,
    tag: 'CHAMPIONS LEAGUE',
    rating: 4.9,
    reviewsCount: 19,
    imagen: '/banners/showcase_psg.webp',
    galeria: ['/banners/showcase_psg.webp'],
    descripcion: 'Diseño parisino de gala con franja central clásica, tela microperforada de secado rápido y parches oficiales europeos.'
  },
  {
    id: 'coleccion-retro-leyendas',
    nombre: 'EDICIÓN RETRO LEYENDAS CLÁSICAS',
    categoria: 'RETRO / CLÁSICOS',
    categoriaId: 'retro',
    precio: 95,
    precioAntes: 130,
    precioShort: 35,
    stock: 0,
    inStock: false,
    stockPorTalla: { S: 0, M: 0, L: 0, XL: 0 },
    tallas: ['S', 'M', 'L', 'XL'],
    oferta: true,
    tag: 'RETRO',
    rating: 5.0,
    reviewsCount: 51,
    imagen: '/banners/showcase_legend.webp',
    galeria: ['/banners/showcase_legend.webp'],
    descripcion: 'Joyas históricas de colección confeccionadas bajo pedido con tipografías de época, parches de finales europeas y personalización incluida gratis.'
  }
];

export const CATEGORIAS = [
  { id: 'todas', label: 'TODO EL CATÁLOGO', count: 0 },
  { id: 'selecciones', label: 'SELECCIONES NACIONALES', count: 0 },
  { id: 'retro', label: 'RETRO & COLECCIÓN', count: 0 },
  { id: 'la-liga', label: 'LA LIGA ESPAÑOLA', count: 0 },
  { id: 'premier-league', label: 'PREMIER LEAGUE', count: 0 },
  { id: 'shorts', label: 'SHORTS & BERMUDAS', count: 0 },
];

export const BEST_SELLERS = [];

export const POPULAR_TAGS = [
  'MUNDIAL 2026', 'CHAMPIONS LEAGUE', 'VINTAGE', 'RETRO', 'SELECCIONES', 'PREMIER', 'LA LIGA', 'VERSIÓN JUGADOR'
];
