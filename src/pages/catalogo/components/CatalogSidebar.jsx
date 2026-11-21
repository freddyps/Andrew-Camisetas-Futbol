import React, { useState } from 'react';
import { Search, RotateCcw, SlidersHorizontal, ChevronDown, X, Tag, DollarSign } from 'lucide-react';
import { CATEGORIAS } from '../../../data/catalogoData';

export default function CatalogSidebar({
  searchQuery,
  onSearchChange,
  maxPrecio,
  precioMaximoCatalogo = 250,
  onPriceChange,
  categoriaSeleccionada,
  onSelectCategory,
  productosLista,
  hasActiveFilters,
  onResetFilters
}) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-28 self-start">
      {/* 1. BUSCADOR RÁPIDO + BOTÓN DE FILTROS EN MÓVIL/TABLET */}
      <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-stroke space-y-3 transition-colors shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider text-txt-main flex items-center gap-1.5">
            <Search size={14} className="text-andrew-primary" />
            <span>BUSCAR CAMISETA</span>
          </h3>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center gap-1.5 text-[11px] font-black uppercase bg-surface-sub hover:bg-andrew-primary/15 text-txt-main hover:text-andrew-primary border border-stroke px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={13} className="text-andrew-primary" />
            <span>Filtros</span>
            <ChevronDown size={13} className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Club, país o jugador..."
            className="w-full bg-surface-sub border border-stroke rounded-xl pl-3.5 pr-9 py-2.5 text-xs font-semibold text-txt-main placeholder:text-txt-muted outline-none focus:border-andrew-primary transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 p-1 text-txt-muted hover:text-txt-main rounded-lg cursor-pointer"
              aria-label="Limpiar búsqueda"
            >
              <X size={14} />
            </button>
          ) : (
            <Search size={14} className="absolute right-3 text-txt-muted pointer-events-none" />
          )}
        </div>
      </div>

      {/* CONTENEDOR DE CATEGORÍAS Y PRECIO (Colapsable en <lg, siempre visible en lg+) */}
      <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block space-y-4`}>
        {/* 2. CATEGORÍAS DISPONIBLES */}
        <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-stroke space-y-3 transition-colors shadow-sm">
          <h3 className="font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider text-txt-main flex items-center gap-1.5">
            <Tag size={14} className="text-andrew-primary" />
            <span>CATEGORÍAS</span>
          </h3>
          <ul className="space-y-1">
            {CATEGORIAS.map((cat) => {
              const activa = categoriaSeleccionada === cat.id;
              const countReal = cat.id === 'todas'
                ? productosLista.length
                : productosLista.filter((p) => p.categoriaId === cat.id).length;

              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-xs py-2.5 px-3 rounded-xl font-bold uppercase tracking-wide transition-all text-left cursor-pointer ${
                      activa
                        ? 'bg-andrew-primary text-black shadow-sm'
                        : 'text-txt-muted hover:bg-surface-sub hover:text-txt-main'
                    }`}
                  >
                    <span className="truncate pr-2">{cat.label}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                        activa
                          ? 'bg-black/85 text-andrew-primary'
                          : 'bg-surface-sub border border-stroke text-txt-muted'
                      }`}
                    >
                      {countReal}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 3. FILTRAR POR PRECIO */}
        <div className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-stroke space-y-3.5 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider text-txt-main flex items-center gap-1.5">
              <DollarSign size={14} className="text-andrew-primary" />
              <span>PRECIO MÁXIMO</span>
            </h3>
            <span className="font-['Montserrat',sans-serif] text-xs font-black text-andrew-primary bg-andrew-primary/15 px-2 py-0.5 rounded-md">
              S/ {maxPrecio}.00
            </span>
          </div>
          <input
            type="range"
            min="50"
            max={precioMaximoCatalogo}
            step="5"
            value={maxPrecio}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full accent-andrew-primary cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-bold text-txt-muted">
            <span>S/ 50.00</span>
            <span>S/ {precioMaximoCatalogo}.00</span>
          </div>
        </div>
      </div>

      {/* 4. BOTÓN LIMPIAR FILTROS */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-surface-card hover:bg-andrew-primary/15 border border-andrew-primary/40 rounded-xl text-xs font-black uppercase tracking-wider text-andrew-primary transition-colors cursor-pointer shadow-sm"
        >
          <RotateCcw size={14} />
          <span>LIMPIAR FILTROS</span>
        </button>
      )}
    </aside>
  );
}
