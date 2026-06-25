import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ open, onClose, cartItems, onRemove, onIncrement, onDecrement, onCheckout }) {
  if (!open) return null;

  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay translúcido */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className="relative ml-auto h-full w-full max-w-md overflow-hidden glass-panel-dark text-white shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#22c55e]" size={22} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">Mi Carrito</p>
              <h2 className="text-xl font-display font-extrabold uppercase">Bolsa de Compra</h2>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Listado de Productos */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 border border-dashed border-white/10 p-8">
              <ShoppingBag className="text-white/20" size={48} />
              <div>
                <p className="text-sm font-semibold text-white/80">Tu bolsa está vacía</p>
                <p className="text-xs text-gray-500 mt-1">¡Sigue explorando y añade tus camisetas preferidas al carrito!</p>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div 
                key={item.id} 
                className="group border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-4 flex gap-4 transition-all duration-300"
              >
                {/* Imagen */}
                <div className="h-20 w-20 shrink-0 overflow-hidden bg-white/5">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>

                {/* Detalles del Item */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-display font-black uppercase text-xs tracking-wide text-white leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-[#22c55e] font-bold mt-0.5">
                          Versión {item.version === 'player' ? 'Jugador' : 'Fan'} · Talla {item.size}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Quitar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Mostrar detalles de la personalización */}
                    {item.customName && (
                      <div className="mt-1.5 bg-[#22c55e]/5 border border-[#22c55e]/15 px-2 py-1 inline-block">
                        <p className="text-[9px] uppercase tracking-wider text-gray-300 font-medium">
                          Estampado: <span className="text-[#22c55e] font-bold">{item.personalizationName} #{item.personalizationNumber}</span>
                        </p>
                      </div>
                    )}
                    {item.addShort && (
                      <p className="text-[9px] text-gray-400 mt-1 font-semibold uppercase tracking-wide">
                        ✓ Incluye Short Oficial
                      </p>
                    )}
                  </div>

                  {/* Cantidades y Precio Individual acumulado */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 border border-white/10 bg-black/40 px-2.5 py-1">
                      <button
                        type="button"
                        onClick={() => onDecrement(item.id)}
                        className="p-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Minus size={12} strokeWidth={2.5} />
                      </button>
                      <span className="min-w-[1.2rem] text-center text-xs font-black font-display">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onIncrement(item.id)}
                        className="p-0.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Plus size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                    <span className="font-display font-black text-sm text-white">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del Drawer */}
        <div className="border-t border-white/10 px-6 py-6 bg-white/[0.01]">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.1em] text-gray-400 font-extrabold mb-5">
            <span>Monto Total</span>
            <span className="font-display font-black text-xl text-white">S/ {totalPrice}</span>
          </div>
          
          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={() => {
              onClose();
              onCheckout();
            }}
            className="w-full bg-[#22c55e] hover:bg-[#1fa75d] text-black py-4 text-xs font-display font-black uppercase tracking-[0.12em] transition-all glow-green cursor-pointer disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
          >
            Proceder al Pago S/ {totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
}
