import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ item, addToCart }) {
  const detailHash = `#producto/${item.id}`;

  return (
    <div className="group overflow-hidden rounded-none border border-gray-100 bg-white p-4 shadow-sm transition-all duration-500 hover:shadow-2xl">
      <div className="relative aspect-[3/4] overflow-hidden rounded-none bg-gray-100 mb-6">
        <img src={item.image} alt={item.equipo} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 bg-black text-white text-[9px] font-black px-4 py-2 uppercase z-10">LA LIGA</div>
      </div>
      <div className="space-y-1 text-left px-2">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.05em]">{item.liga}</p>
        <h5 className="font-black text-2xl uppercase tracking-[0.02em] leading-none mb-1 text-black">{item.equipo}</h5>
        <p className="text-gray-500 text-[11px] font-medium mb-5">Camiseta {item.categoria} 2024/25</p>
        <div className="flex flex-col gap-3 border-t-2 border-gray-100 pt-4 mt-4">
          <span className="font-black text-2xl tracking-tighter text-black">S/ {item.precio.toFixed(2)}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.location.hash = detailHash}
              className="rounded-none border border-[#22c55e] bg-transparent px-3 py-2 text-[9px] font-black uppercase tracking-[0.05em] text-[#22c55e] transition hover:bg-[#22c55e]/10 flex-1"
            >
              VER DETALLES
            </button>
            <button
              type="button"
              onClick={() => addToCart?.(item)}
              className="rounded-none bg-black px-3 py-2 text-[9px] font-black uppercase flex items-center gap-1 text-white hover:bg-[#111] transition flex-1"
            >
              AÑADIR <ShoppingCart size={12} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
