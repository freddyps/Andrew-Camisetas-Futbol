import React from 'react';
import { SlidersHorizontal, Grid, Search, X } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductsPage({
  products,
  filteredProducts,
  searchQuery,
  setSearchQuery,
  leagueFilter,
  setLeagueFilter,
  priceFilter,
  setPriceFilter,
  categoryFilter,
  setCategoryFilter,
  onBack,
  onViewDetails,
  addToCart,
  wishlistItems = [],
  onToggleWishlist
}) {
  const leagues = [
    { id: 'all', name: 'Todas' },
    { id: 'Premier League', name: 'Premier' },
    { id: 'La Liga', name: 'La Liga' },
    { id: 'Bundesliga', name: 'Bundesliga' },
    { id: 'Ligue 1', name: 'Ligue 1' },
    { id: 'Serie A', name: 'Serie A' }
  ];

  return (
    <main className="bg-[#050505] text-white py-12 px-6 md:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO Y BOTÓN VOLVER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 text-[#22c55e] text-xs font-black uppercase tracking-[0.1em] mb-2 glow-text-green">
              <Grid size={12} /> CATÁLOGO ELITE
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">Camisetas Oficiales</h1>
          </div>
          <button
            onClick={onBack}
            className="border border-white/10 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 px-6 py-3 text-xs font-display font-black uppercase tracking-[0.1em] transition-colors cursor-pointer w-fit"
          >
            ← Volver al Inicio
          </button>
        </div>

        {/* COMPONENTE DE FILTROS AVANZADOS (GLASS PANEL) */}
        <div className="glass-panel border border-white/15 p-6 mb-12 shadow-2xl animate-fade-in-up">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-300 mb-6 pb-3 border-b border-white/5">
            <SlidersHorizontal size={14} className="text-[#22c55e]" />
            <span>Filtros de Búsqueda</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1.2fr_1.2fr_1.2fr] items-center">
            
            {/* Input de Búsqueda */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar equipo, liga o precio..."
                className="w-full bg-white/5 border border-white/10 px-4 pl-12 py-3.5 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/20 transition-all font-semibold"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selector de Liga */}
            <div>
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 px-4 py-3.5 text-xs font-display font-black uppercase tracking-[0.08em] text-white outline-none focus:border-[#22c55e] transition-colors cursor-pointer"
              >
                <option value="all">Todas las Ligas</option>
                <option value="Premier League">Premier League</option>
                <option value="La Liga">La Liga</option>
                <option value="Bundesliga">Bundesliga</option>
                <option value="Ligue 1">Ligue 1</option>
                <option value="Serie A">Serie A</option>
              </select>
            </div>

            {/* Selector de Tipo (Categoría) */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 px-4 py-3.5 text-xs font-display font-black uppercase tracking-[0.08em] text-white outline-none focus:border-[#22c55e] transition-colors cursor-pointer"
              >
                <option value="all">Todos los Modelos</option>
                <option value="Local">Modelo Local</option>
                <option value="Visitante">Modelo Visitante</option>
                <option value="Alternativa">Modelo Alternativa</option>
              </select>
            </div>

            {/* Selector de Rango de Precio */}
            <div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 px-4 py-3.5 text-xs font-display font-black uppercase tracking-[0.08em] text-white outline-none focus:border-[#22c55e] transition-colors cursor-pointer"
              >
                <option value="all">Cualquier precio</option>
                <option value="under-92">Menos de S/ 92.00</option>
                <option value="92-95">S/ 92.00 - S/ 95.00</option>
                <option value="over-95">Más de S/ 95.00</option>
              </select>
            </div>
          </div>

          {/* Estadísticas de filtros y reseteador */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-white/5">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
              MOSTRANDO {filteredProducts.length} DE {products.length} PRODUCTOS EN TOTAL
            </span>
            {(searchQuery || leagueFilter !== 'all' || priceFilter !== 'all' || categoryFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setLeagueFilter('all');
                  setPriceFilter('all');
                  setCategoryFilter('all');
                }}
                className="bg-[#22c55e] hover:bg-[#1fa75d] text-black text-[10px] font-display font-black uppercase tracking-[0.08em] px-5 py-2.5 transition-colors cursor-pointer glow-green-sm"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* GRILLA DE PRODUCTOS */}
        <div className="animate-scale-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-16">
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/10">
              <SlidersHorizontal className="mx-auto text-gray-600 mb-4" size={40} />
              <p className="text-sm font-semibold text-gray-400">No encontramos camisetas con los filtros seleccionados.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setLeagueFilter('all');
                  setPriceFilter('all');
                  setCategoryFilter('all');
                }}
                className="mt-4 border border-[#22c55e] hover:bg-[#22c55e]/10 text-[#22c55e] text-xs font-display font-black uppercase tracking-[0.08em] px-6 py-3 transition-colors cursor-pointer"
              >
                Restablecer Catálogo
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
