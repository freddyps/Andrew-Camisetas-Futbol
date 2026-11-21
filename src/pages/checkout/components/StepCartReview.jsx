import React from 'react';
import {
  CheckCircle2,
  Trash2,
  Clock,
  ShieldCheck,
  Truck,
  UserCheck,
  LogIn
} from 'lucide-react';

/**
 * StepCartReview:
 * Paso 1 del checkout diseñado con el flujo limpio de Nike Perú:
 * - Izquierda (lg:col-span-7): Banner informativo + "Carrito de compras" con fotos amplias,
 *   talla, selector de cantidad, botón de eliminar y nota de disponibilidad.
 * - Derecha (lg:col-span-5): "Resumen" con selector de modalidad (Adelanto S/ 40 vs Pago Total 100%),
 *   desglose económico (Subtotal, Envío, Personalización Gratis, Total) y los dos botones:
 *   "Compra como miembro" y "Compra como invitado".
 */
export default function StepCartReview({
  cart = [],
  user = null,
  onOpenAuth = () => {},
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  totalConEnvio,
  subtotal,
  costoEnvio,
  onContinuarPaso2
}) {
  return (
    <div className="bg-surface-card border border-stroke rounded-2xl p-5 sm:p-7 shadow-lg transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* =========================================================================
            COLUMNA IZQUIERDA (lg:col-span-7): CARRITO DE COMPRAS ESTILO NIKE PERÚ
           ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Banner superior informativo estilo Nike */}
          <div className="bg-surface-sub border border-stroke rounded-xl px-4 py-3 flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-bold text-txt-main flex items-center gap-2">
              <Truck size={16} className="text-andrew-primary shrink-0" />
              <span>Prendas en stock listas para despacho inmediato a Lima y Provincias</span>
            </span>
            <span className="text-[11px] font-black uppercase text-andrew-primary hidden sm:inline">
              Calidad A1
            </span>
          </div>

          {/* Título Carrito de Compras */}
          <div>
            <h2 className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl text-txt-main tracking-tight">
              Carrito de compras
            </h2>
          </div>

          {/* Lista de Productos en el Carrito */}
          <div className="divide-y divide-stroke border-t border-b border-stroke">
            {cart.map((it, idx) => {
              const cantidadActual = it.cantidad || 1;
              const stockTalla = it.inStock
                ? (it.stockPorTalla?.[it.tallaSeleccionada] !== undefined
                    ? parseInt(it.stockPorTalla[it.tallaSeleccionada])
                    : (parseInt(it.stock) || 5))
                : 10;
              const maxOpciones = Math.max(cantidadActual, Math.min(10, stockTalla || 5));

              return (
                <div key={`${it.id}-${idx}`} className="py-5 space-y-3">
                  <div className="flex items-start gap-4 sm:gap-5">
                    
                    {/* Imagen grande y limpia del producto */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-surface-sub border border-stroke p-2 flex items-center justify-center shrink-0">
                      <img
                        src={it.imagen}
                        alt={it.nombre}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Detalles centrales + Precio a la derecha */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-['Montserrat',sans-serif] font-extrabold text-sm sm:text-base text-txt-main leading-snug">
                            {it.nombre}
                          </h3>
                          <p className="text-xs sm:text-sm text-txt-muted font-medium mt-0.5">
                            {it.inStock ? 'Camiseta oficial en stock inmediato' : 'Camiseta oficial importada a pedido'}
                          </p>
                        </div>

                        <span className="font-['Montserrat',sans-serif] font-black text-sm sm:text-base text-txt-main shrink-0">
                          S/ {(it.precio * cantidadActual).toFixed(2)}
                        </span>
                      </div>

                      {/* Personalización y Short Oficial si existen */}
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        {it.incluirShort && (
                          <span className="text-xs text-andrew-primary font-bold bg-andrew-primary/10 border border-andrew-primary/30 px-2 py-0.5 rounded-md">
                            + Short Oficial (Talla {it.tallaShort || it.tallaSeleccionada || 'M'})
                          </span>
                        )}
                        {it.personalizacion && (
                          <p className="text-xs text-andrew-primary font-bold">
                            Dorsal oficial: {it.personalizacion.nombre} #{it.personalizacion.numero}
                          </p>
                        )}
                      </div>

                      {/* Fila de Talla y Cantidad estilo Nike */}
                      <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs sm:text-sm text-txt-muted font-medium">
                        <span>
                          Talla <strong className="text-txt-main font-extrabold ml-1">{it.tallaSeleccionada || 'M'}</strong>
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span>Cantidad</span>
                          <select
                            value={cantidadActual}
                            onChange={(e) => onUpdateQuantity(idx, Number(e.target.value))}
                            className="bg-input-bg border border-stroke rounded-lg px-2 py-1 text-xs sm:text-sm font-extrabold text-txt-main outline-none focus:border-andrew-primary cursor-pointer"
                          >
                            {Array.from({ length: maxOpciones }, (_, i) => i + 1).map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Acciones inferiores (Eliminar) */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          className="text-txt-muted hover:text-red-500 transition-colors p-1 cursor-pointer flex items-center gap-1 text-xs font-semibold"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nota de escasez / reserva rápida estilo Nike */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 pt-1">
                    <Clock size={14} className="shrink-0" />
                    <span>
                      {it.inStock
                        ? 'Solo quedan algunas unidades disponibles. Asegura tu pedido pronto.'
                        : 'Separa tu prenda hoy con S/ 40 y págalo contraentrega al llegar.'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie izquierdo: Cuenta / Historial de Pedidos */}
          {!user && (
            <div className="pt-2">
              <h4 className="font-['Montserrat',sans-serif] font-extrabold text-base text-txt-main">
                ¿Tienes cuenta en Andrew Camisetas?
              </h4>
              <p className="text-xs sm:text-sm text-txt-muted font-medium mt-0.5">
                ¿Quieres guardar tu pedido en tu historial de compras?{' '}
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="text-txt-main font-extrabold underline hover:text-andrew-primary cursor-pointer"
                >
                  Únete o Inicia Sesión
                </button>
              </p>
            </div>
          )}
        </div>

        {/* =========================================================================
            COLUMNA DERECHA (lg:col-span-5): RESUMEN + BOTONES DE COMPRA DIRECTA 100%
           ========================================================================= */}
        <div className="lg:col-span-5 bg-surface-sub border border-stroke rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl text-txt-main tracking-tight">
              Resumen de Compra
            </h2>
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg">
              <CheckCircle2 size={12} /> Pago 100%
            </span>
          </div>

          {/* Desglose de precios */}
          <div className="space-y-2.5 text-xs sm:text-sm pt-2 border-t border-stroke">
            <div className="flex justify-between text-txt-main font-medium">
              <span>Subtotal prendas</span>
              <span className="font-bold">S/ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-txt-main font-medium">
              <span>Envío estimado</span>
              <span className="font-bold">S/ {costoEnvio.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-stroke text-sm sm:text-base font-['Montserrat',sans-serif] font-black text-txt-main">
              <span>Total a pagar</span>
              <span className="text-andrew-primary text-lg sm:text-xl">S/ {totalConEnvio.toFixed(2)}</span>
            </div>

            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-txt-main">
                <span>Pago completo listo para despacho inmediato</span>
                <span className="text-andrew-primary font-black">
                  S/ {totalConEnvio.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stroke overflow-hidden">
                <div className="h-full bg-andrew-primary rounded-full w-full" />
              </div>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN ESTILO NIKE: "Compra como miembro" y "Compra como invitado" */}
          <div className="space-y-2.5 pt-2">
            {user ? (
              <button
                type="button"
                onClick={onContinuarPaso2}
                className="w-full bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm py-4 px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
              >
                <UserCheck size={17} />
                <span>Continuar compra como {user.nombre.split(' ')[0]}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="w-full bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_20px_rgba(34,197,94,0.35)] hover:scale-[1.01]"
                >
                  <LogIn size={16} strokeWidth={2.5} />
                  <span>Compra como miembro</span>
                </button>

                <button
                  type="button"
                  onClick={onContinuarPaso2}
                  className="w-full bg-surface-card hover:bg-input-bg border-2 border-stroke hover:border-txt-main text-txt-main font-['Montserrat',sans-serif] font-bold text-sm py-3.5 px-6 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Compra como invitado</span>
                </button>
              </>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-txt-muted font-semibold pt-1">
              <ShieldCheck size={14} className="text-andrew-primary shrink-0" />
              <span>Pago 100% seguro vía Yape o Plin</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
