import { Search } from 'lucide-react';
import { useMemo } from 'react';

// ============================================================================
// COMPONENTE: SearchPage (Página de búsqueda expandida)
// Descripción: Pantalla de búsqueda limpia con resultados en tiempo real
// Props:
//   - products: lista de productos para buscar
//   - searchQuery: query de búsqueda actual
//   - setSearchQuery: función para actualizar el query
//   - onBack: función para volver a la página anterior
//   - onViewDetails: función para ver detalles de un producto
// ============================================================================

export default function SearchPage({ products, searchQuery, setSearchQuery, onBack, onViewDetails }) {
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return [];

    return products.filter(
      (item) =>
        item.equipo.toLowerCase().includes(query) ||
        item.liga.toLowerCase().includes(query) ||
        item.categoria.toLowerCase().includes(query) ||
        item.precio.toString().includes(query)
    );
  }, [searchQuery, products]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectProduct = (product) => {
    onViewDetails(product);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="border-b border-gray-200 bg-white px-6 md:px-10 py-6 shadow-sm">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-[#22c55e] hover:text-[#1fa75d] transition-colors w-fit"
          >
            ← Volver
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por equipo, liga o categoría..."
              value={searchQuery}
              onChange={handleSearch}
              autoFocus
              className="w-full rounded-none border-2 border-gray-300 bg-white px-5 py-3 text-base font-medium text-black placeholder:text-gray-400 outline-none focus:border-[#22c55e] transition-colors shadow-sm"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          </div>
        </div>
      </div>

      <main className="px-6 md:px-10 py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {searchQuery.length === 0 ? (
            <div className="text-center py-32">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-medium">Escribe para buscar productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-gray-600 text-xl font-medium">
                No se encontraron productos para "<span className="font-black text-[#22c55e]">{searchQuery}</span>"
              </p>
              <p className="text-gray-500 text-sm mt-2">Intenta con otra búsqueda</p>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-[0.05em] text-black">
                    Resultados de búsqueda
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="text-[#22c55e] font-black text-lg">{filteredProducts.length}</span> producto{filteredProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="mt-4 h-1 w-20 bg-[#22c55e] rounded-none"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product)}
                    className="group flex flex-col h-full overflow-hidden rounded-none border-2 border-gray-200 bg-white text-black shadow-md transition-all duration-300 hover:shadow-xl hover:border-[#22c55e] hover:-translate-y-1"
                  >
                    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-none bg-gray-100 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.equipo}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-[#22c55e] text-black px-2 py-1 rounded-none text-[10px] font-black uppercase">
                        {product.liga}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <p className="font-black uppercase tracking-[0.05em] text-sm line-clamp-2 text-black flex-grow">
                        {product.equipo}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 uppercase tracking-[0.08em] font-medium">
                        {product.categoria}
                      </p>
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-lg font-black text-[#22c55e]">
                          € {product.precio.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center py-8 border-t border-gray-200 mt-8">
                <p className="text-sm text-gray-500">
                  Mostrando {filteredProducts.length} de {filteredProducts.length} productos
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
