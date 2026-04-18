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
    <main className="bg-white text-black py-12 px-4 md:px-6">
      {/* ===== HEADER CON FILTROS ===== */}
      <div className="border-b border-gray-200 px-4 md:px-6 py-8 bg-white shadow-sm mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-[#22c55e] font-black text-[12px] uppercase tracking-[0.05em] mb-1">Catálogo</p>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.02em]">Productos</h1>
            </div>
            <button
              onClick={onBack}
              className="rounded-none border border-[#22c55e] bg-[#22c55e]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.05em] text-[#22c55e] transition hover:bg-[#22c55e]/20 w-fit"
            >
              Volver
            </button>
          </div>

          <div className="rounded-none border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px] items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar equipo, liga o precio"
                  className="w-full rounded-none border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-black placeholder:text-gray-400 outline-none transition focus:border-[#22c55e]"
                />
                <select
                  value={leagueFilter}
                  onChange={(e) => setLeagueFilter(e.target.value)}
                  className="w-full rounded-none border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black uppercase tracking-[0.05em] text-black outline-none transition focus:border-[#22c55e]"
                >
                  <option value="all">Todas</option>
                  <option value="Premier League">Premier</option>
                  <option value="La Liga">La Liga</option>
                  <option value="Bundesliga">Bundesliga</option>
                  <option value="Ligue 1">Ligue 1</option>
                  <option value="Serie A">Serie A</option>
                </select>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full rounded-none border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black uppercase tracking-[0.05em] text-black outline-none transition focus:border-[#22c55e]"
                >
                  <option value="all">Todos precios</option>
                  <option value="under-92">Menos € 92</option>
                  <option value="92-95">€ 92-95</option>
                  <option value="over-95">Más € 95</option>
                </select>
              </div>
              <div className="flex flex-col items-start gap-2 text-right lg:items-end">
                <span className="text-xs uppercase tracking-[0.05em] text-gray-500 font-black">
                  {filteredProducts.length} DE {products.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setLeagueFilter('all');
                    setPriceFilter('all');
                  }}
                  className="rounded-none bg-[#22c55e] px-4 py-2 text-xs font-black uppercase tracking-[0.05em] text-black transition hover:bg-[#1fa75d]"
                >
                  Mostrar todo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENIDO ===== */}
      <div className="px-4 md:px-6 py-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
            {filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} onViewDetails={onViewDetails} addToCart={addToCart} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="mt-8 text-center text-sm text-gray-500">No hay productos.</p>
          )}
        </div>
      </div>
    </main>
  );
}
