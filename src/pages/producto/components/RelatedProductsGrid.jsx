import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function RelatedProductsGrid({ productos, onSelectProduct, onBackToCatalog }) {
  if (!productos || productos.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl uppercase tracking-tight text-txt-main">
          También te puede <span className="text-andrew-primary">gustar</span>
        </h2>

        <button
          type="button"
          onClick={onBackToCatalog}
          className="text-xs font-bold uppercase text-txt-muted hover:text-andrew-primary flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Ver catálogo</span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {productos.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectProduct(item.id)}
            className="text-left bg-surface-card rounded-2xl border border-stroke overflow-hidden flex flex-col group hover:border-andrew-primary/60 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="relative aspect-square bg-white p-2 flex items-center justify-center overflow-hidden">
              {item.inStock && (item.stock || 0) > 0 ? (
                <span className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                  En stock
                </span>
              ) : (
                <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                  Agotado
                </span>
              )}
              <img
                src={item.imagen}
                alt={item.nombre}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-3 border-t border-stroke space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wide text-txt-muted truncate">
                {item.categoria}
              </span>
              <h4 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main group-hover:text-andrew-primary transition-colors line-clamp-1">
                {item.nombre}
              </h4>
              <div className="flex items-baseline gap-1.5">
                <span className="font-['Montserrat',sans-serif] text-sm font-black text-andrew-primary">
                  S/ {Number(item.precio || 0).toFixed(2)}
                </span>
                {item.precioAntes && Number(item.precioAntes) > Number(item.precio) && (
                  <span className="text-[10px] text-txt-muted line-through font-semibold">
                    S/ {Number(item.precioAntes).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
