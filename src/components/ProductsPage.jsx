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
  onBack,
  onViewDetails,
  addToCart,
}) {
  return (
    <main className="bg-white text-black py-20 px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-[#22c55e] font-black text-[14px] uppercase tracking-[0.05em] mb-2">Catálogo de camisetas</p>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[0.02em] leading-tight">Todos los productos</h1>
          </div>
          <button
            onClick={onBack}
            className="rounded-none border border-[#22c55e] bg-[#22c55e]/10 px-5 py-3 text-sm font-black uppercase tracking-[0.05em] text-[#22c55e] transition hover:bg-[#22c55e]/20"
          >
            Volver
          </button>
        </div>

        <div className="rounded-none border border-gray-200 bg-white p-6 shadow-sm mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px] items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar equipo, liga o precio"
                className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] text-black placeholder:text-gray-400 outline-none transition focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20"
              />
              <select
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] font-black uppercase tracking-[0.05em] text-black outline-none transition focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20"
              >
                <option value="all">Todas las ligas</option>
                <option value="Premier League">Premier League</option>
                <option value="La Liga">La Liga</option>
                <option value="Bundesliga">Bundesliga</option>
                <option value="Ligue 1">Ligue 1</option>
                <option value="Serie A">Serie A</option>
              </select>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-[13px] font-black uppercase tracking-[0.05em] text-black outline-none transition focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20"
              >
                <option value="all">Todos los precios</option>
                <option value="under-92">Menos de S/ 92</option>
                <option value="92-95">S/ 92 - S/ 95</option>
                <option value="over-95">Más de S/ 95</option>
              </select>
            </div>
            <div className="flex flex-col items-start gap-3 text-right lg:items-end">
              <span className="text-sm uppercase tracking-[0.05em] text-gray-500 font-black">
                MOSTRANDO {filteredProducts.length} DE {products.length} CAMISETAS
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setLeagueFilter('all');
                  setPriceFilter('all');
                }}
                className="rounded-none bg-[#22c55e] px-6 py-3 text-sm font-black uppercase tracking-[0.05em] text-black transition hover:bg-[#1fa75d]"
              >
                MOSTRAR TODO
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} item={item} onViewDetails={onViewDetails} addToCart={addToCart} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="mt-10 text-center text-gray-500">No se encontraron productos con esos filtros.</p>
        )}
      </div>
    </main>
  );
}
