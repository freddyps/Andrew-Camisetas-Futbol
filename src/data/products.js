// Catálogo predeterminado de camisetas de fútbol premium para Andrew Camisetas
export const products = [
  {
    id: 1,
    equipo: "Real Madrid",
    liga: "La Liga",
    categoria: "Local",
    precio: 99.90,
    image: "/real_madrid_jersey.png",
    gallery: [
      "/real_madrid_jersey.png",
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
    ],
    description: "La camiseta oficial del Real Madrid para la temporada 2025/26 encarna la elegancia de los Reyes de Europa. Fabricada con un sutil patrón de pata de gallo grabado y acabados dorados majestuosos.",
    details: {
      corte: "Slim Fit / Atlético",
      peso: "180g",
      tecnologia: "Heat.RDY / Transpirable",
      origen: "Importado"
    },
    stock: 25,
    descripcion: "La camiseta oficial del Real Madrid para la temporada 2025/26 encarna la elegancia de los Reyes de Europa. Fabricada con un sutil patrón de pata de gallo grabado y acabados dorados majestuosos."
  },
  {
    id: 2,
    equipo: "FC Barcelona",
    liga: "La Liga",
    categoria: "Local",
    precio: 94.90,
    image: "/barcelona_jersey.png",
    gallery: [
      "/barcelona_jersey.png",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Inspirada en el modelo histórico de 1899, esta camiseta celebra los 125 años del club con un elegante diseño de dos bloques de color (azul y grana) divididos a la mitad, con el escudo en el centro.",
    details: {
      corte: "Regular Fit",
      peso: "195g",
      tecnologia: "Dri-FIT ADV",
      origen: "Importado"
    },
    stock: 18,
    descripcion: "Inspirada en el modelo histórico de 1899, esta camiseta celebra los 125 años del club con un elegante diseño de dos bloques de color (azul y grana) divididos a la mitad, con el escudo en el centro."
  },
  {
    id: 3,
    equipo: "Manchester United",
    liga: "Premier League",
    categoria: "Local",
    precio: 92.50,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Los Diablos Rojos lucen un degradado rojo brillante en los costados y detalles blancos elegantes. Fabricada con materiales reciclados para un óptimo rendimiento en el campo.",
    details: {
      corte: "Atlético",
      peso: "190g",
      tecnologia: "AEROREADY",
      origen: "Importado"
    },
    stock: 15,
    descripcion: "Los Diablos Rojos lucen un degradado rojo brillante en los costados y detalles blancos elegantes. Fabricada con materiales reciclados para un óptimo rendimiento en el campo."
  },
  {
    id: 4,
    equipo: "Paris Saint-Germain",
    liga: "Ligue 1",
    categoria: "Local",
    precio: 89.90,
    image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
    ],
    description: "La clásica franja Hechter pintada a pinceladas artísticas representa la unión entre el fútbol moderno y la moda callejera parisina. Desarrollada con tejido ultra-ligero de secado rápido.",
    details: {
      corte: "Slim Fit",
      peso: "175g",
      tecnologia: "Dri-FIT Elite",
      origen: "Francia"
    },
    stock: 12,
    descripcion: "La clásica franja Hechter pintada a pinceladas artísticas representa la unión entre el fútbol moderno y la moda callejera parisina. Desarrollada con tejido ultra-ligero de secado rápido."
  },
  {
    id: 5,
    equipo: "Bayern Munich",
    liga: "Bundesliga",
    categoria: "Local",
    precio: 95.00,
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Una sinfonía de rojos oscuros y destellos carmesí. Esta camiseta rinde homenaje a los campeones alemanes con un escudo termo-sellado premium y un tejido texturizado con microventilación.",
    details: {
      corte: "Slim Fit",
      peso: "185g",
      tecnologia: "Heat.RDY",
      origen: "Alemania"
    },
    stock: 20,
    descripcion: "Una sinfonía de rojos oscuros y destellos carmesí. Esta camiseta rinde homenaje a los campeones alemanes con un escudo termo-sellado premium y un tejido texturizado con microventilación."
  },
  {
    id: 6,
    equipo: "Juventus FC",
    liga: "Serie A",
    categoria: "Local",
    precio: 91.90,
    image: "https://images.unsplash.com/photo-1563820253-27207b06a598?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563820253-27207b06a598?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Las icónicas rayas verticales blancas y negras se presentan en esta edición especial con un acabado rugoso lunar que le da textura y modernidad. El logo bordado de la Juve resalta con elegancia.",
    details: {
      corte: "Regular Fit",
      peso: "190g",
      tecnologia: "AEROREADY Pro",
      origen: "Importado"
    },
    stock: 14,
    descripcion: "Las icónicas rayas verticales blancas y negras se presentan en esta edición especial con un acabado rugoso lunar que le da textura y modernidad. El logo bordado de la Juve resalta con elegancia."
  },
  {
    id: 7,
    equipo: "Arsenal FC",
    liga: "Premier League",
    categoria: "Local",
    precio: 93.00,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
    ],
    description: "El cañón del Arsenal vuelve al frente en esta camiseta de diseño limpio rojo y blanco de corte retro. Paneles laterales transpirables integrados para una máxima frescura.",
    details: {
      corte: "Atlético",
      peso: "182g",
      tecnologia: "Dri-FIT Elite",
      origen: "Inglaterra"
    },
    stock: 22,
    descripcion: "El cañón del Arsenal vuelve al frente en esta camiseta de diseño limpio rojo y blanco de corte retro. Paneles laterales transpirables integrados para una máxima frescura."
  },
  {
    id: 8,
    equipo: "Selección Peruana",
    liga: "Clasificatorias",
    categoria: "Local",
    precio: 99.00,
    image: "/peru_jersey.png",
    gallery: [
      "/peru_jersey.png",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
    ],
    description: "La Blanquirroja tradicional con su franja roja diagonal cruzada en el pecho con textura dorada brillante en los hombros. Lleva la pasión del Perú con este diseño ultra-premium y costuras reforzadas.",
    details: {
      corte: "Atlético / Regular",
      peso: "185g",
      tecnologia: "Hydratec-Dry",
      origen: "Perú"
    },
    stock: 45,
    descripcion: "La Blanquirroja tradicional con su franja roja diagonal cruzada en el pecho con textura dorada brillante en los hombros. Lleva la pasión del Perú con este diseño ultra-premium y costuras reforzadas."
  }
];
