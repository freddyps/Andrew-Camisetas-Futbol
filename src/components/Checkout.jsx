import { CheckCircle2, Copy, Smartphone, Banknote } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Checkout({ cartItems, onBack, onClearCart }) {
  const [selectedMethod, setSelectedMethod] = useState('yape');
  const [transferName, setTransferName] = useState('');
  const [transferOperation, setTransferOperation] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId] = useState(() => `AC-${Date.now()}`);

  const handleConfirmAndClear = () => {
    handleConfirm();
    if (onClearCart) {
      setTimeout(() => {
        onClearCart();
      }, 1500);
    }
  };

  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
    [cartItems]
  );

  const paymentMethods = [
    {
      id: 'yape',
      label: 'YAPE',
      description: 'Pago instantáneo',
      note: 'Escanea con Yape',
      icon: Smartphone,
    },
    {
      id: 'plin',
      label: 'PLIN',
      description: 'Pago instantáneo',
      note: 'Escanea con Plin',
      icon: Smartphone,
    },
    {
      id: 'transferencia',
      label: 'TRANSFERENCIA BANCARIA',
      description: 'Realiza una transferencia directa',
      note: 'Incluye número de operación al confirmar',
      icon: Banknote,
    },
  ];

  const handleConfirm = () => {
    setOrderConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#22c55e] selection:text-black px-6 py-8 md:px-10">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.15em] text-[#22c55e] hover:text-[#1fa75d]"
        >
          ← Volver a la tienda
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase tracking-[0.05em] text-black">Finalizar compra</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600">Completa tu pedido de forma segura seleccionando tu método de pago preferido.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr]">
          <section className="rounded-none border border-gray-200 bg-white p-8 text-black shadow-sm">
            <h2 className="mb-6 text-xl font-black uppercase tracking-[0.05em]">Resumen del pedido</h2>
            {cartItems.length === 0 ? (
              <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-6 text-center text-sm text-gray-600">
                Tu carrito está vacío. Agrega productos para continuar.
              </div>
            ) : (
              <div className="space-y-5">
                {cartItems.map((item) => (
                  <div key={item.id} className="rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-none object-cover" />
                      <div className="flex-1">
                        <p className="font-black uppercase tracking-[0.05em]">{item.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">{item.version.toUpperCase()} · Talla {item.size}</p>
                        <p className="mt-3 text-sm font-black uppercase tracking-[0.08em] text-black">Cant: {item.quantity}</p>
                      </div>
                      <p className="whitespace-nowrap text-sm font-black uppercase tracking-[0.08em] text-black">€ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}

                <div className="rounded-none border-t border-gray-200 pt-5">
                  <div className="mb-3 flex items-center justify-between text-sm uppercase tracking-[0.08em] text-gray-600 font-black">
                    <span>Subtotal</span>
                    <span>€ {totalPrice}</span>
                  </div>
                  <div className="mb-3 flex items-center justify-between text-sm uppercase tracking-[0.08em] text-gray-600 font-black">
                    <span>Envío</span>
                    <span>GRATIS</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-2xl font-black uppercase tracking-[0.08em] text-black">
                    <span>Total</span>
                    <span>€ {totalPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="rounded-none border border-gray-200 bg-white p-8 text-black shadow-sm">
              <h2 className="mb-4 text-xl font-black uppercase tracking-[0.05em]">Método de pago</h2>
              <p className="text-sm text-gray-500">Selecciona tu método de pago preferido. Todos los pagos son seguros.</p>

              <div className="mt-6 space-y-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full rounded-none border px-5 py-5 text-left transition ${isSelected ? 'border-[#22c55e] bg-[#ecfdf5]' : 'border-gray-200 bg-white hover:border-[#22c55e]'}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-none bg-[#d6f9dc] text-[#047857]">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.08em] text-black">{method.label}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                        <div className={`h-5 w-5 rounded-full border ${isSelected ? 'bg-[#22c55e] border-[#22c55e]' : 'border-gray-300'}`}>
                          {isSelected && <CheckCircle2 className="h-5 w-5 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-none border border-gray-200 bg-white p-8 text-black shadow-sm">
              {selectedMethod === 'yape' && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
                    <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                      <div className="h-56 overflow-hidden rounded-none bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521790945508-bf2a36314e85?auto=format&fit=crop&w=800&q=80)' }} />
                      <p className="mt-4 text-sm text-gray-500">Escanea con Yape</p>
                    </div>
                    <div className="space-y-4 rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Número Yape</p>
                        <p className="mt-2 text-xl font-black">+51 987 654 321</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Nombre</p>
                        <p className="mt-2 text-sm font-black">Andrew Camisetas SAC</p>
                      </div>
                      <div className="rounded-none border border-gray-200 bg-white p-4">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Monto a Yapear</p>
                        <p className="mt-3 text-2xl font-black text-[#22c55e]">€ {totalPrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'plin' && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
                    <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                      <div className="h-56 overflow-hidden rounded-none bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521790945508-bf2a36314e85?auto=format&fit=crop&w=800&q=80)' }} />
                      <p className="mt-4 text-sm text-gray-500">Escanea con Plin</p>
                    </div>
                    <div className="space-y-4 rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Número Plin</p>
                        <p className="mt-2 text-xl font-black">+51 987 654 321</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Nombre</p>
                        <p className="mt-2 text-sm font-black">Andrew Camisetas SAC</p>
                      </div>
                      <div className="rounded-none border border-gray-200 bg-white p-4">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Monto a Enviar</p>
                        <p className="mt-3 text-2xl font-black text-[#22c55e]">€ {totalPrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'transferencia' && (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Banco</p>
                      <p className="mt-2 text-lg font-black">Banco de Crédito BCP</p>
                    </div>
                    <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Tipo de cuenta</p>
                      <p className="mt-2 text-lg font-black">Cuenta Corriente</p>
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">Número de cuenta</p>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <p className="text-lg font-black">194-2345678-0-99</p>
                        <button type="button" className="inline-flex items-center gap-2 text-sm font-black text-[#22c55e]">
                          <Copy size={16} /> Copiar
                        </button>
                      </div>
                    </div>
                    <div className="rounded-none border border-gray-200 bg-[#f8fafc] p-4">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">CCI</p>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <p className="text-lg font-black">002-194-002345678099-15</p>
                        <button type="button" className="inline-flex items-center gap-2 text-sm font-black text-[#22c55e]">
                          <Copy size={16} /> Copiar
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-none border border-[#22c55e]/20 bg-[#ecfdf5] p-5">
                    <p className="text-sm uppercase tracking-[0.08em] text-gray-500">Monto a transferir</p>
                    <p className="mt-3 text-2xl font-black text-[#22c55e]">€ {totalPrice}</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-[11px] uppercase tracking-[0.15em] text-gray-500">Nombre del titular *</label>
                      <input
                        type="text"
                        value={transferName}
                        onChange={(e) => setTransferName(e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[11px] uppercase tracking-[0.15em] text-gray-500">Número de operación *</label>
                      <input
                        type="text"
                        value={transferOperation}
                        onChange={(e) => setTransferOperation(e.target.value)}
                        placeholder="Ej: 123456789"
                        className="w-full rounded-none border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmAndClear}
                disabled={!selectedMethod || cartItems.length === 0 || (selectedMethod === 'transferencia' && (!transferName || !transferOperation))}
                className="mt-6 w-full rounded-none bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#111] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {orderConfirmed ? 'Pedido confirmado' : 'Confirmar pedido'}
              </button>

              {orderConfirmed && (
                <div className="mt-5 rounded-none border border-green-200 bg-[#ecfdf5] p-4 space-y-2">
                  <p className="text-sm font-black text-[#047857]">✓ Pedido confirmado exitosamente</p>
                  <p className="text-xs text-[#047857]">ID: {orderId}</p>
                  <p className="text-xs text-[#047857]">Revisa tu correo para más detalles. Tu carrito se vaciará en unos segundos.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
