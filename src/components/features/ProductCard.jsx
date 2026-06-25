import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';

export default function ProductCard({ item, onViewDetails, addToCart, wishlistItems = [], onToggleWishlist }) {
  // Comprobar si el producto está en la lista de favoritos
  const isFavorite = wishlistItems.some((fav) => fav.id === item.id);

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(item);
    } else {
      window.location.hash = `producto/${item.id}`;
    }
  };

  return (
    <div className="group glass-card overflow-hidden flex flex-col justify-between h-full bg-[#0d0d0d] border border-white/5 relative rounded-2xl">
      
      {/* Botón Favoritos (Heart Badge - Redondo) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist?.(item);
        }}
        className="absolute top-4 right-4 z-20 h-10 w-10 bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:scale-110 hover:border-red-500/50 cursor-pointer text-white rounded-full shadow-lg"
        title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
      >
        <Heart 
          size={18} 
          className={`transition-colors duration-300 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-white"}`} 
        />
      </button>

      {/* Badge de la Liga - Redondo */}
      <span className="absolute top-4 left-4 z-20 bg-[#22c55e] text-black font-display font-black text-[10px] px-3.5 py-1.5 uppercase tracking-wider glow-green-sm rounded-full shadow-md">
        {item.liga}
      </span>

      {/* Imagen Principal con Zoom */}
      <div 
        onClick={handleCardClick}
        className="relative aspect-[3/4] overflow-hidden bg-white/[0.02] cursor-pointer rounded-t-2xl"
      >
        <img 
          src={item.image} 
          alt={`Camiseta ${item.equipo}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
        />
        {/* Capa oscurecedora sutil al hacer hover */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
      </div>

      {/* Detalles del Producto */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-500 font-extrabold uppercase tracking-widest">{item.liga}</p>
          <h4 
            onClick={handleCardClick}
            className="font-display font-black text-2xl uppercase tracking-wide leading-none mt-1.5 mb-1.5 text-white group-hover:text-[#22c55e] transition-colors cursor-pointer"
          >
            {item.equipo}
          </h4>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Camiseta {item.categoria} 2025/26
          </p>
        </div>

        {/* Precios y Botones */}
        <div className="border-t border-white/5 pt-5 mt-5">
          <div className="flex items-center justify-between gap-2 mb-5">
            <span className="font-display font-black text-2xl tracking-tight text-white">
              S/ {item.precio.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#22c55e] font-bold uppercase tracking-wider bg-[#22c55e]/10 px-3 py-1 border border-[#22c55e]/20 rounded-full">
              ENVÍO FAST
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCardClick}
              className="border border-[#22c55e]/40 hover:border-[#22c55e] bg-transparent text-[#22c55e] text-xs font-display font-black uppercase tracking-[0.05em] py-3 transition-colors cursor-pointer text-center rounded-xl"
            >
              Detalles
            </button>
            <button
              type="button"
              onClick={() => addToCart?.(item)}
              className="bg-[#22c55e] hover:bg-[#1fa75d] text-black text-xs font-display font-black uppercase tracking-[0.05em] py-3 transition-colors flex items-center justify-center gap-1.5 cursor-pointer glow-green-sm rounded-xl"
            >
              Añadir <ShoppingCart size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
