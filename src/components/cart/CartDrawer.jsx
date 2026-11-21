import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  Package
} from 'lucide-react';

/**
 * CartDrawer: Drawer lateral deslizante del Carrito de Compras
 * Limpio y directo: muestra los productos añadidos, control de cantidad, subtotal y paso directo al Checkout.
 */
export default function CartDrawer({ 
  isOpen = false, 
  onClose = () => {},
  cart = [],
  user = null,
  onProceedToCheckout = () => {},
  onExploreCatalog = null,
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onClearCart = () => {},
  onOpenOrders = () => {}
}) {
  if (!isOpen) return null;

  const total = cart.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);

  const handleIrAlCheckout = () => {
    if (cart.length === 0) return;
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Fondo oscuro con blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-overlay-backdrop backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="cart-drawer w-full sm:w-screen max-w-md bg-surface-card border-l border-stroke shadow-2xl flex flex-col justify-between transition-colors">
          
          {/* 1. CABECERA DEL CARRITO */}
          <div className="p-4 sm:p-6 border-b border-stroke flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-andrew-primary/15 border border-andrew-primary/30 flex items-center justify-center text-andrew-primary shrink-0">
                <ShoppingBag size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main truncate">
                  MI CARRITO DE COMPRAS
                </h3>
                <span className="text-[11px] text-txt-muted font-bold block truncate">
                  {cart.length} {cart.length === 1 ? 'artículo seleccionado' : 'artículos seleccionados'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {user && user.role !== 'ADMIN' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenOrders();
                  }}
                  className="min-h-11 px-3 py-1.5 rounded-xl bg-surface-sub hover:bg-andrew-primary/15 border border-stroke hover:border-andrew-primary/40 text-txt-muted hover:text-andrew-primary text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Ver mi historial de pedidos"
                >
                  <Package size={14} className="text-andrew-primary shrink-0" />
                  <span className="hidden sm:inline">Mis Compras</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-surface-sub hover:bg-surface-card border border-stroke text-txt-muted hover:text-txt-main flex items-center justify-center transition-colors cursor-pointer"
                title="Cerrar carrito"
                aria-label="Cerrar carrito"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* 2. LISTA DE ARTÍCULOS EN EL CARRITO */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag size={48} className="mx-auto text-txt-muted opacity-60" />
                <h4 className="font-['Montserrat',sans-serif] font-black text-sm uppercase text-txt-main">
                  TU CARRITO ESTÁ VACÍO
                </h4>
                <p className="text-txt-muted text-xs max-w-xs mx-auto">
                  Explora nuestro catálogo oficial y añade tus camisetas favoritas con estampado gratis.
                </p>
                <button
                  onClick={() => {
                    if (onExploreCatalog) {
                      onExploreCatalog();
                    } else {
                      onClose();
                    }
                  }}
                  className="bg-andrew-primary text-black font-black text-xs uppercase px-5 py-2.5 rounded-xl hover:bg-[#16a34a] transition-colors cursor-pointer shadow-md shadow-[#22c55e]/25"
                >
                  IR AL CATÁLOGO
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const stockTalla = item.inStock
                  ? (item.stockPorTalla?.[item.tallaSeleccionada] !== undefined
                      ? parseInt(item.stockPorTalla[item.tallaSeleccionada])
                      : (parseInt(item.stock) || 1))
                  : 999;
                const maxAlcanzado = item.inStock && (item.cantidad || 1) >= stockTalla;

                return (
                  <div 
                    key={`${item.id}-${index}`}
                    className="bg-surface-sub border border-stroke rounded-2xl p-3.5 flex gap-3.5 items-center shadow-sm transition-all hover:border-stroke-hover relative group"
                  >
                    {/* Miniatura de la camiseta */}
                    <div className="w-20 h-20 bg-surface-card rounded-xl p-2 shrink-0 flex items-center justify-center border border-stroke">
                      <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Información central y precio */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main leading-snug truncate">
                            {item.nombre}
                          </h5>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-txt-muted hover:text-red-500 hover:bg-red-500/10 p-1 rounded-lg transition-all cursor-pointer shrink-0"
                            title="Eliminar de la lista"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {item.inStock ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/35 px-2 py-0.5 rounded-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              En Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-[#ea580c] keep-white px-2 py-0.5 rounded-md shadow-sm">
                              Bajo Pedido
                            </span>
                          )}

                          <span className="bg-surface-card border border-stroke px-2 py-0.5 rounded-md text-[11px] font-extrabold uppercase text-txt-main">
                            Talla {item.tallaSeleccionada || 'M'}
                          </span>

                          {item.incluirShort && (
                            <span className="bg-andrew-primary/15 text-andrew-primary border border-andrew-primary/35 px-2 py-0.5 rounded-md text-[11px] font-black uppercase">
                              + Short ({item.tallaShort || item.tallaSeleccionada || 'M'})
                            </span>
                          )}

                          {item.personalizacion && (
                            <span className="bg-andrew-primary/15 text-andrew-primary border border-andrew-primary/35 px-2 py-0.5 rounded-md text-[11px] font-black uppercase truncate">
                              ★ {item.personalizacion.nombre} #{item.personalizacion.numero}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Fila inferior: Precio y Control de Cantidad alineados */}
                      <div className="flex items-center justify-between pt-2 border-t border-stroke mt-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-['Montserrat',sans-serif] font-black text-sm sm:text-base text-andrew-primary">
                            S/ {(item.precio * (item.cantidad || 1)).toFixed(2)}
                          </span>
                          {(item.cantidad || 1) > 1 && (
                            <span className="text-[10px] text-txt-muted font-semibold">
                              (S/ {item.precio.toFixed(2)} c/u)
                            </span>
                          )}
                        </div>

                        {/* Control de cantidad discreto */}
                        {item.inStock && stockTalla <= 1 ? (
                          <span className="text-[10px] font-bold text-txt-muted bg-surface-card border border-stroke px-2.5 py-0.5 rounded-lg">
                            1 unidad
                          </span>
                        ) : (
                          <div className="flex items-center bg-input-bg rounded-xl border border-stroke p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(index, Math.max(1, (item.cantidad || 1) - 1))}
                              className="w-7 h-7 flex items-center justify-center text-txt-muted hover:text-txt-main rounded-lg hover:bg-surface-card transition-colors cursor-pointer"
                              title="Disminuir"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center text-xs font-black text-txt-main">
                              {item.cantidad || 1}
                            </span>
                            <button
                              type="button"
                              disabled={maxAlcanzado}
                              onClick={() => onUpdateQuantity(index, (item.cantidad || 1) + 1)}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                                maxAlcanzado
                                  ? 'text-txt-muted cursor-not-allowed opacity-30'
                                  : 'text-txt-muted hover:text-txt-main hover:bg-surface-card cursor-pointer'
                              }`}
                              title={maxAlcanzado ? 'Límite de stock alcanzado' : 'Aumentar'}
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 3. RESUMEN COMPACTO Y BOTÓN AL CHECKOUT */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-stroke bg-surface-card space-y-3.5">
              
              {/* Subtotal */}
              <div className="space-y-1.5 text-xs text-txt-muted">
                <div className="flex justify-between items-center">
                  <span>Disponibilidad:</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-andrew-primary uppercase">EN STOCK INMEDIATO</span>
                    {cart.length > 1 && (
                      <button
                        type="button"
                        onClick={onClearCart}
                        className="text-[11px] font-bold text-txt-muted hover:text-red-500 underline cursor-pointer"
                      >
                        Vaciar carrito
                      </button>
                    )}
                  </div>
                </div>
                <div className="pt-2 border-t border-stroke flex justify-between items-center text-sm sm:text-base font-['Montserrat',sans-serif] font-black text-txt-main">
                  <span>SUBTOTAL PRENDAS:</span>
                  <span className="text-andrew-primary text-lg">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botón de Proceder al Checkout */}
              <button
                type="button"
                onClick={handleIrAlCheckout}
                className="w-full bg-andrew-primary hover:bg-[#16a34a] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
              >
                <Lock size={15} strokeWidth={2.5} />
                <span>FINALIZAR COMPRA</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-txt-muted text-center font-bold">
                <ShieldCheck size={13} className="text-andrew-primary shrink-0" />
                <span>PAGO 100% SEGURO VÍA YAPE O PLIN</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
