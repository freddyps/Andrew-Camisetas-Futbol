import { X, Minus, Plus, Trash2 } from 'lucide-react';

export default function CartDrawer({ open, onClose, cartItems, onRemove, onIncrement, onDecrement }) {
  if (!open) return null;

  const totalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-md overflow-hidden bg-white text-black shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500 font-black">Tu carrito</p>
            <h2 className="text-2xl font-black">Resumen de compra</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-260px)] overflow-y-auto px-6 py-5 space-y-5">
          {cartItems.length === 0 ? (
            <div className="rounded-none border-dashed border-gray-300 p-10 text-center text-gray-500">
              No hay productos en el carrito.
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                <div className="flex items-start gap-4">
                  <img src={item.image} alt={item.name} className="h-20 w-20 rounded-none object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black uppercase tracking-[0.05em] text-black">{item.name}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mt-1">{item.version.toUpperCase()} · Talla {item.size}</p>
                        {item.customName && (
                          <p className="mt-2 text-[11px] text-gray-500">Personalizado: {item.personalizationName} #{item.personalizationNumber}</p>
                        )}
                        {item.addShort && <p className="mt-1 text-[11px] text-gray-500">Incluye short del equipo</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 rounded-none border border-gray-300 bg-white px-2 py-1">
                        <button
                          type="button"
                          onClick={() => onDecrement(item.id)}
                          className="rounded-none p-1 text-gray-600 hover:text-black"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-black">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => onIncrement(item.id)}
                          className="rounded-none p-1 text-gray-600 hover:text-black"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.05em] text-black">S/ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between text-base uppercase tracking-[0.08em] text-gray-600 font-black mb-5">
            <span>Total</span>
            <span>S/ {totalPrice}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-none bg-black px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#111]"
          >
            Ir a pagar
          </button>
        </div>
      </div>
    </div>
  );
}
