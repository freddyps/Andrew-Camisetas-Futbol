import React from 'react';
import { ShoppingBag, RotateCcw, CheckCircle2, Clock } from 'lucide-react';

export default function CatalogProductsList({
  productos,
  viewMode,
  onSelectProduct,
  onAddToCart,
  onResetFilters
}) {
  if (productos.length === 0) {
    return (
      <div className="bg-surface-card rounded-3xl border border-stroke p-12 text-center space-y-4 shadow-sm transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-surface-sub border border-stroke flex items-center justify-center mx-auto text-txt-muted">
          <ShoppingBag size={32} />
        </div>
        <h3 className="font-['Montserrat',sans-serif] font-black text-lg uppercase text-txt-main">
          NO SE ENCONTRARON CAMISETAS
        </h3>
        <p className="text-txt-muted text-xs max-w-md mx-auto">
          No hay prendas que coincidan con los filtros seleccionados. Prueba limpiando los filtros o eligiendo otra categoría.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 bg-andrew-primary text-black font-black text-xs uppercase px-5 py-2.5 rounded-xl hover:bg-[#16a34a] transition-colors cursor-pointer shadow-md"
        >
          <RotateCcw size={14} />
          <span>MOSTRAR TODO EL CATÁLOGO</span>
        </button>
      </div>
    );
  }

  // Obtener tallas con stock real para mostrar en la tarjeta
  const obtenerTallasDisponibles = (prod) => {
    const listaBase = Array.isArray(prod.tallas) && prod.tallas.length > 0 ? prod.tallas : ['S', 'M', 'L', 'XL'];
    if (!prod.inStock) return listaBase;
    if (prod.stockPorTalla && typeof prod.stockPorTalla === 'object') {
      const conStock = listaBase.filter((t) => (parseInt(prod.stockPorTalla[t]) || 0) > 0);
      return conStock.length > 0 ? conStock : listaBase;
    }
    return listaBase;
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-3.5">
        {productos.map((prod) => {
          const tallasActivas = obtenerTallasDisponibles(prod);
          const ahorro =
            prod.precioAntes && Number(prod.precioAntes) > Number(prod.precio)
              ? Math.round(Number(prod.precioAntes) - Number(prod.precio))
              : null;

          return (
            <div
              key={prod.id}
              className="bg-surface-card rounded-2xl border border-stroke p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 group hover:border-andrew-primary/50 transition-all duration-300 shadow-sm"
            >
              <div
                onClick={() => onSelectProduct(prod.id)}
                className="w-full sm:w-44 h-44 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 cursor-pointer overflow-hidden border border-stroke relative"
              >
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="flex-grow space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="inline-block bg-surface-sub text-txt-main text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border border-stroke">
                    {prod.categoria}
                  </span>
                  {prod.inStock && (prod.stock || 0) > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-white bg-emerald-600 px-2.5 py-0.5 rounded-md shadow-xs">
                      <CheckCircle2 size={12} /> En Stock ({prod.stock} u.)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-white bg-red-600 px-2.5 py-0.5 rounded-md shadow-xs">
                      <Clock size={12} /> Agotado
                    </span>
                  )}
                  {prod.tag && (
                    <span className="text-[11px] font-bold uppercase bg-surface-sub border border-stroke text-txt-main px-2.5 py-0.5 rounded-md">
                      {prod.tag}
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => onSelectProduct(prod.id)}
                  className="font-['Montserrat',sans-serif] font-black text-base uppercase text-txt-main hover:text-andrew-primary transition-colors cursor-pointer"
                >
                  {prod.nombre}
                </h3>

                <p className="text-txt-muted text-xs max-w-xl line-clamp-2 font-medium">
                  {prod.descripcion}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase text-txt-muted">Tallas:</span>
                  {tallasActivas.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-surface-sub border border-stroke text-txt-main"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center sm:items-end justify-between gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-stroke">
                <div className="text-center sm:text-right">
                  {ahorro && (
                    <span className="inline-block text-[11px] font-bold uppercase bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-2.5 py-0.5 rounded-md mb-1">
                      Ahorras S/ {ahorro}
                    </span>
                  )}
                  <div className="font-['Montserrat',sans-serif] text-xl font-black text-andrew-primary">
                    S/ {Number(prod.precio || 0).toFixed(2)}
                  </div>
                  {prod.precioAntes && (
                    <div className="text-xs text-txt-muted line-through font-semibold">
                      S/ {Number(prod.precioAntes || 0).toFixed(2)}
                    </div>
                  )}
                </div>
                {prod.inStock && (prod.stock || 0) > 0 ? (
                  <button
                    type="button"
                    onClick={() => onAddToCart(prod)}
                    className="w-full sm:w-auto bg-andrew-primary hover:bg-[#16a34a] text-black font-['Montserrat',sans-serif] font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-[#22c55e]/20"
                  >
                    <ShoppingBag size={15} />
                    <span>COMPRAR</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectProduct(prod.id)}
                    className="w-full sm:w-auto bg-surface-sub text-txt-muted border border-stroke font-['Montserrat',sans-serif] font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>AGOTADO</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vista Cuadrícula Profesional (Grid)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
      {productos.map((prod) => {
        const tallasActivas = obtenerTallasDisponibles(prod);
        const ahorro =
          prod.precioAntes && Number(prod.precioAntes) > Number(prod.precio)
            ? Math.round(Number(prod.precioAntes) - Number(prod.precio))
            : null;
        const fotosExtra = Array.isArray(prod.galeria) && prod.galeria.length > 1 ? prod.galeria.length : 0;

        return (
          <div
            key={prod.id}
            className="catalog-product-card bg-surface-card rounded-2xl border border-stroke overflow-hidden flex flex-col justify-between group hover:border-andrew-primary/60 transition-all duration-300 hover:shadow-xl relative"
          >
            {/* 1. Contenedor de Imagen amplio y unificado (sin cuadro plomo alrededor de la camiseta) */}
            <div
              onClick={() => onSelectProduct(prod.id)}
              className="h-72 sm:h-80 bg-white p-2 flex items-center justify-center cursor-pointer overflow-hidden relative border-b border-stroke/60"
            >
              {/* Insignia Superior Izquierda: Legible y nítida */}
              <div className="absolute top-3 left-3 z-20">
                {prod.inStock && (prod.stock || 0) > 0 ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>En Stock ({prod.stock})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg shadow-sm">
                    <span>Agotado</span>
                  </span>
                )}
              </div>

              {/* Insignia Superior Derecha: Descuento o Tag con alto contraste */}
              <div className="absolute top-3 right-3 z-20">
                {ahorro ? (
                  <span className="inline-block bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg shadow-sm">
                    -S/ {ahorro}
                  </span>
                ) : prod.tag ? (
                  <span className="inline-block bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg shadow-sm">
                    {prod.tag}
                  </span>
                ) : null}
              </div>

              {/* Indicador si tiene varias fotos en galería */}
              {fotosExtra > 1 && (
                <span className="absolute bottom-2.5 right-2.5 z-20 bg-slate-900/85 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                  {fotosExtra} fotos
                </span>
              )}

              <img
                src={prod.imagen}
                alt={prod.nombre}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 relative z-10"
                loading="lazy"
              />
            </div>

            {/* 2. Cuerpo de Información de la Camiseta (sin estrellas, tipografía nítida) */}
            <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow space-y-3">
              <div className="space-y-1.5">
                {/* Categoría limpia */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-txt-muted truncate">
                    {prod.categoria || 'CATÁLOGO OFICIAL'}
                  </span>
                </div>

                {/* Nombre del Modelo */}
                <h3
                  onClick={() => onSelectProduct(prod.id)}
                  className="font-['Montserrat',sans-serif] font-black text-base uppercase text-txt-main group-hover:text-andrew-primary transition-colors cursor-pointer line-clamp-1 leading-snug"
                  title={prod.nombre}
                >
                  {prod.nombre}
                </h3>

                {/* Tallas disponibles rápidas */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-txt-muted">
                    {prod.inStock && (prod.stock || 0) > 0 ? 'Tallas en stock:' : 'Estado:'}
                  </span>
                  <div className="flex items-center gap-1">
                    {prod.inStock && (prod.stock || 0) > 0 ? (
                      tallasActivas.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-surface-sub border border-stroke text-txt-main"
                        >
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-red-500/15 text-red-500">
                        Sin stock físico
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Pie de Tarjeta: Precio en una sola línea + Botón directo COMPRAR */}
              <div className="pt-3 border-t border-stroke flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5 flex-nowrap">
                    <span className="font-['Montserrat',sans-serif] text-base sm:text-lg font-black text-andrew-primary leading-none whitespace-nowrap">
                      S/ {Number(prod.precio || 0).toFixed(2)}
                    </span>
                    {prod.precioAntes && (
                      <span className="text-[11px] text-txt-muted font-bold line-through whitespace-nowrap">
                        S/ {Number(prod.precioAntes || 0).toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="block text-[10px] font-semibold text-txt-muted mt-1 truncate">
                    {prod.inStock && (prod.stock || 0) > 0 ? 'Envío inmediato' : 'Agotado en almacén'}
                  </span>
                </div>

                {prod.inStock && (prod.stock || 0) > 0 ? (
                  <button
                    type="button"
                    onClick={() => onAddToCart(prod)}
                    className="inline-flex items-center gap-1.5 bg-andrew-primary hover:bg-[#16a34a] text-black font-['Montserrat',sans-serif] font-extrabold text-[11px] uppercase px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
                    title="Comprar Camiseta"
                  >
                    <ShoppingBag size={13} strokeWidth={2.5} />
                    <span>COMPRAR</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectProduct(prod.id)}
                    className="inline-flex items-center gap-1 bg-surface-sub text-txt-muted border border-stroke font-['Montserrat',sans-serif] font-extrabold text-[11px] uppercase px-3 py-2 rounded-xl cursor-pointer shrink-0 whitespace-nowrap"
                    title="Ver producto agotado"
                  >
                    <span>AGOTADO</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
