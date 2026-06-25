import React from 'react';
import { Search, ArrowLeft, Flame, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

export default function SearchPage({
  products,
  searchQuery,
  setSearchQuery,
  onBack,
  onViewDetails,
  addToCart,
  wishlistItems = [],
  onToggleWishlist
}) {
  const filteredProducts = products.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return false;
    return (
      item.equipo.toLowerCase().includes(query) ||
      item.liga.toLowerCase().includes(query) ||
      item.categoria.toLowerCase().includes(query)
    );
  });

  const popularSearches = [
    'Real Madrid',
    'FC Barcelona',
    'Selección Peruana',
    'La Liga',
    'Premier League'
  ];

  return (
    <main className="bg-[#050505] text-white py-12 px-6 md:px-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* ENCABEZADO */}
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs font-display font-black uppercase tracking-[0.08em] text-[#22c55e] hover:text-[#1fa75d] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>

        <div className="mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 text-[#22c55e] text-xs font-black uppercase tracking-[0.1em] mb-2 glow-text-green">
            <Search size={12} /> BÚSQUEDA ELITE
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">Buscar Camisetas</h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-2">
            Encuentra polos de tus equipos favoritos y personalízalos con nombre y número oficial.
          </p>
        </div>

        {/* CUADRO DE BÚSQUEDA ELEGANTE (GLASS PANEL) */}
        <div className="glass-panel border border-white/10 p-6 mb-8 shadow-xl animate-fade-in-up">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ingresa equipo, liga o detalles (Ej: Real Madrid, La Liga, Perú)..."
              className="w-full bg-[#050505] border border-white/10 px-5 pl-12 py-4 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/20 transition-all font-semibold"
              autoFocus
            />
          </div>

          {/* Búsquedas Sugeridas */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider mr-2">Sugerencias:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="text-[10px] bg-white/5 border border-white/5 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 text-gray-300 hover:text-[#22c55e] px-3 py-1.5 transition-all font-bold uppercase tracking-wider cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTADOS DE BÚSQUEDA */}
        <div className="animate-scale-in">
          {searchQuery.trim() === '' ? (
            /* ESTADO VACÍO: MOSTRAR RECOMENDADOS (TE PODRÍA INTERESAR) */
            <div className="space-y-8 mt-12 animate-fade-in-up">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#22c55e] glow-text-green">
                <Flame size={14} className="fill-[#22c55e]" />
                <span>Búsquedas Tendencia</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map((item) => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    onViewDetails={onViewDetails} 
                    addToCart={addToCart} 
                    wishlistItems={wishlistItems}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            /* ESTADO CON RESULTADOS */
            <div>
              <p className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mb-6">
                SE ENCONTRARON {filteredProducts.length} CAMISETAS QUE COINCIDEN
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-12">
                {filteredProducts.map((item) => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    onViewDetails={onViewDetails} 
                    addToCart={addToCart} 
                    wishlistItems={wishlistItems}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* ESTADO SIN RESULTADOS */
            <div className="text-center py-20 border border-dashed border-white/10">
              <Sparkles className="mx-auto text-gray-700 mb-4 animate-pulse" size={40} />
              <p className="text-sm font-semibold text-gray-400">No encontramos resultados para "{searchQuery}".</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Prueba buscando "Madrid", "Barcelona" o "Liga".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 border border-[#22c55e] hover:bg-[#22c55e]/10 text-[#22c55e] text-2xs font-display font-black uppercase tracking-[0.08em] px-6 py-3 transition-colors cursor-pointer"
              >
                Ver Recomendados
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
