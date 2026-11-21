import React from 'react';
import {
  Ruler,
  Sparkles,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';

/**
 * CustomizationOptions:
 * Panel de compra de tienda profesional:
 * - Si hay stock físico (> 0): permite elegir entre las tallas disponibles y comprar al 100%.
 * - Si el stock llega a 0 (Agotado): muestra el estado AGOTADO con opción limpia de ir a Pedir a Medida.
 */
export default function CustomizationOptions({
  producto,
  precioUnitarioFinal,
  tallasValidas = ['S', 'M', 'L', 'XL'],
  tallaSeleccionada,
  setTallaSeleccionada,
  onAgregarAlPedido,
  onComprarAhora = () => {},
  onCustomOrder = () => {},
  onAbrirGuiaTallas
}) {
  if (!producto) return null;

  const stockGlobal = parseInt(producto.stock) || 0;
  const isInStock = Boolean(producto.inStock && stockGlobal > 0);
  const esProductoShort =
    producto.categoriaId === 'shorts' ||
    (producto.categoria && producto.categoria.toLowerCase().includes('short'));

  const tallasConStock = tallasValidas.filter((t) => {
    const cant = producto?.stockPorTalla?.[t] !== undefined
      ? parseInt(producto.stockPorTalla[t])
      : stockGlobal;
    return cant > 0;
  });

  const stockTallaSel = producto?.stockPorTalla?.[tallaSeleccionada] !== undefined
    ? parseInt(producto.stockPorTalla[tallaSeleccionada])
    : stockGlobal;
  const tallaAgotada = !isInStock || stockTallaSel <= 0;

  return (
    <div className="lg:col-span-7 xl:col-span-7 bg-surface-card border border-stroke rounded-3xl p-5 sm:p-7 shadow-lg flex flex-col justify-between gap-5 transition-colors">

      {/* 1. CABECERA: Insignias nítidas, Título, Precio y Descripción */}
      <div className="space-y-3 border-b border-stroke pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-['Montserrat',sans-serif] text-[11px] font-bold uppercase px-3 py-1 rounded-lg tracking-wider">
            {producto.categoria || 'CATÁLOGO OFICIAL'}
          </span>

          {isInStock ? (
            <span className="bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 size={13} />
              <span>En Stock ({stockGlobal} disp.)</span>
            </span>
          ) : (
            <span className="bg-red-600 text-white text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
              <XCircle size={13} />
              <span>Agotado en Almacén</span>
            </span>
          )}

          {producto.tag && (
            <span className="bg-surface-sub border border-stroke text-txt-main text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg">
              {producto.tag}
            </span>
          )}
        </div>

        <h1 className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-3xl uppercase tracking-tight text-txt-main leading-tight">
          {producto.nombre}
        </h1>

        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-black text-andrew-primary tracking-tight">
            S/ {precioUnitarioFinal.toFixed(2)}
          </span>
          {producto.precioAntes && (
            <span className="text-sm sm:text-base text-txt-muted line-through font-bold">
              S/ {Number(producto.precioAntes).toFixed(2)}
            </span>
          )}
          {producto.precioAntes && Number(producto.precioAntes) > Number(producto.precio) && (
            <span className="bg-emerald-600/15 border border-emerald-600/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md">
              Ahorras S/ {(Number(producto.precioAntes) - Number(producto.precio)).toFixed(2)}
            </span>
          )}
        </div>

        {producto.descripcion && (
          <p className="text-txt-muted text-xs sm:text-sm leading-relaxed font-medium">
            {producto.descripcion}
          </p>
        )}
      </div>

      {/* 2. SELECCIÓN DE TALLA O AVISO DE PRODUCTO AGOTADO */}
      <div className="space-y-4">
        <div className="bg-surface-sub/70 border border-stroke rounded-2xl p-4 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-txt-main font-['Montserrat',sans-serif]">
              {esProductoShort ? 'TALLAS DE SHORT EN STOCK:' : 'ELIGE TU TALLA EN STOCK:'}
            </span>
            <button
              type="button"
              onClick={onAbrirGuiaTallas}
              className="text-[11px] font-bold text-andrew-primary hover:underline flex items-center gap-1 cursor-pointer bg-surface-card px-2.5 py-1 rounded-lg border border-stroke transition-all"
            >
              <Ruler size={12} />
              <span>Guía de Tallas</span>
            </button>
          </div>

          {tallasConStock.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {tallasConStock.map((talla) => {
                  const stockTalla = producto?.stockPorTalla?.[talla] !== undefined
                    ? parseInt(producto.stockPorTalla[talla])
                    : stockGlobal;
                  const seleccionada = tallaSeleccionada === talla;

                  return (
                    <button
                      key={talla}
                      type="button"
                      onClick={() => setTallaSeleccionada(talla)}
                      className={`min-w-14 h-12 px-3.5 rounded-xl font-['Montserrat',sans-serif] font-black uppercase transition-all flex flex-col items-center justify-center border cursor-pointer ${
                        seleccionada
                          ? 'bg-andrew-primary text-black border-andrew-primary shadow-md scale-[1.02]'
                          : 'bg-surface-card text-txt-main border-stroke hover:border-andrew-primary'
                      }`}
                    >
                      <span className="text-sm leading-none">{talla}</span>
                      <span
                        className={`text-[10px] font-bold tracking-tight mt-0.5 ${
                          seleccionada ? 'text-black/85' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {stockTalla} disp.
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="shrink-0" />
                <span>
                  {stockTallaSel} {stockTallaSel === 1 ? 'unidad física lista' : 'unidades físicas listas'} en talla {tallaSeleccionada} para envío inmediato.
                </span>
              </p>
            </>
          ) : (
            <div className="bg-surface-card border border-red-500/30 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-red-500 font-['Montserrat',sans-serif] font-black text-xs uppercase">
                <XCircle size={16} className="shrink-0" />
                <span>STOCK FÍSICO AGOTADO TEMPORALMENTE</span>
              </div>
              <p className="text-xs text-txt-muted font-medium leading-relaxed">
                Todas las unidades en almacén de este modelo se han vendido. Si deseas mandarla a confeccionar en tu talla con tu nombre y número, puedes encargarla en nuestra sección <strong>Pedir a Medida</strong>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. BOTONES DE COMPRA Y BENEFICIOS */}
      <div className="space-y-3.5 pt-3 border-t border-stroke">
        {isInStock && !tallaAgotada ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onAgregarAlPedido}
              className="w-full font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border-2 bg-surface-sub hover:bg-input-bg border-andrew-primary text-txt-main cursor-pointer hover:scale-[1.01] active:scale-95"
            >
              <ShoppingBag size={16} strokeWidth={2.5} className="text-andrew-primary" />
              <span>AÑADIR AL CARRITO</span>
            </button>

            <button
              type="button"
              onClick={onComprarAhora}
              className="w-full bg-andrew-primary hover:bg-[#16a34a] text-black font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#22c55e]/25 cursor-pointer hover:scale-[1.01] active:scale-95"
            >
              <Sparkles size={16} strokeWidth={2.5} />
              <span>COMPRAR AHORA →</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              className="w-full font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-stroke bg-surface-sub text-txt-muted opacity-60 cursor-not-allowed"
            >
              <XCircle size={16} />
              <span>PRODUCTO AGOTADO</span>
            </button>

            <button
              type="button"
              onClick={onCustomOrder}
              className="w-full bg-andrew-primary hover:bg-[#16a34a] text-black font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#22c55e]/25 cursor-pointer hover:scale-[1.01]"
            >
              <span>ENCARGAR EN PEDIR A MEDIDA</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-txt-main text-xs font-bold">
          <div className="flex items-center gap-2 bg-surface-sub/70 border border-stroke py-2.5 px-3 rounded-xl justify-center">
            <Truck size={15} className="text-andrew-primary shrink-0" />
            <span>Envíos a todo el Perú</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-sub/70 border border-stroke py-2.5 px-3 rounded-xl justify-center">
            <ShieldCheck size={15} className="text-andrew-primary shrink-0" />
            <span>Calidad A1 Garantizada</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-sub/70 border border-stroke py-2.5 px-3 rounded-xl justify-center">
            <RotateCcw size={15} className="text-andrew-primary shrink-0" />
            <span>Compra 100% Segura</span>
          </div>
        </div>
      </div>

    </div>
  );
}
