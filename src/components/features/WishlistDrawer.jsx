import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function WishlistDrawer({ open, onClose, wishlistItems, onRemove, onAddToCart, onViewDetails }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay translúcido con desenfoque de fondo */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Contenedor del Drawer */}
      <div className="relative ml-auto h-full w-full max-w-md overflow-hidden glass-panel-dark text-white shadow-2xl flex flex-col animate-slide-in-right rounded-l-2xl">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <Heart className="text-[#22c55e] fill-[#22c55e] animate-pulse animate-pulse-glow" size={22} />
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-bold">Mis Favoritos</p>
              <h2 className="text-xl font-display font-extrabold uppercase">Lista de Deseos</h2>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo / Lista de Favoritos */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 border border-dashed border-white/10 p-8 rounded-2xl">
              <Heart className="text-white/20" size={48} />
              <div>
                <p className="text-sm font-semibold text-white/80">Tu lista está vacía</p>
                <p className="text-xs text-gray-500 mt-1">Explora nuestro catálogo y guarda las camisetas que más te gusten.</p>
              </div>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div 
                key={item.id} 
                className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-4 flex gap-4 transition-all duration-300 relative rounded-2xl"
              >
                {/* Imagen del Producto - Clickable */}
                <div 
                  onClick={() => {
                    onViewDetails?.(item);
                    onClose();
                  }}
                  className="h-20 w-20 shrink-0 overflow-hidden bg-white/5 cursor-pointer rounded-xl"
                >
                  <img 
                    src={item.image} 
                    alt={item.equipo} 
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl" 
                  />
                </div>

                {/* Detalles y Acciones */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {/* Título - Clickable */}
                        <h4 
                          onClick={() => {
                            onViewDetails?.(item);
                            onClose();
                          }}
                          className="font-display font-black uppercase text-sm tracking-wide text-white leading-tight cursor-pointer hover:text-[#22c55e] transition-colors"
                        >
                          {item.equipo}
                        </h4>
                        <p className="text-xs uppercase tracking-[0.1em] text-[#22c55e] font-bold mt-1.5 glow-text-green">
                          {item.liga}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Eliminar de favoritos"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                      Camiseta {item.categoria}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="font-display font-black text-base text-white">
                      S/ {item.precio.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(item);
                        onRemove(item.id);
                      }}
                      className="bg-[#22c55e] hover:bg-[#1fa75d] text-black text-xs font-display font-black uppercase tracking-[0.08em] px-4 py-2.5 transition-colors flex items-center gap-1.5 cursor-pointer glow-green-sm rounded-xl"
                    >
                      Añadir <ShoppingCart size={12} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del Drawer */}
        <div className="border-t border-white/10 px-6 py-6 bg-white/[0.01]">
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-white/15 bg-white/5 hover:bg-white/10 py-4 text-xs font-display font-black uppercase tracking-[0.1em] text-white transition-colors rounded-xl"
          >
            Cerrar y seguir explorando
          </button>
        </div>
      </div>
    </div>
  );
}
