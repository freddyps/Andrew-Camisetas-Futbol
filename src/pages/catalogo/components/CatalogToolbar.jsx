import React from 'react';
import { ChevronDown, Check, Grid, List, Sparkles } from 'lucide-react';

export default function CatalogToolbar({
  totalArticulos,
  disponibilidadFiltro = 'todos',
  onSelectDisponibilidad = () => {},
  sortBy,
  onSortChange,
  sortDropdownOpen,
  onToggleDropdown,
  sortDropdownRef,
  viewMode,
  onViewModeChange
}) {
  const SORT_OPTIONS = [
    { id: 'destacados', label: 'MÁS DESTACADOS' },
    { id: 'precio-bajo', label: 'PRECIO: MENOR A MAYOR' },
    { id: 'precio-alto', label: 'PRECIO: MAYOR A MENOR' }
  ];

  const currentLabel = SORT_OPTIONS.find((opt) => opt.id === sortBy)?.label || 'MÁS DESTACADOS';

  return (
    <div className="bg-surface-card border border-stroke rounded-2xl p-4 sm:px-6 sm:py-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Izquierda: Conteo y Pastillas Rápidas de Disponibilidad */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase tracking-wide text-txt-main flex items-center gap-2 pr-2 sm:border-r border-stroke">
          <span className="bg-andrew-primary/15 text-andrew-primary border border-andrew-primary/30 px-2.5 py-0.5 rounded-lg text-sm">
            {totalArticulos}
          </span>
          <span>{totalArticulos === 1 ? 'PRENDA ENCONTRADA' : 'PRENDAS ENCONTRADAS'}</span>
        </div>

        {/* Filtros rápidos de disponibilidad */}
        <div className="flex items-center gap-1.5 bg-surface-sub p-1 rounded-xl border border-stroke">
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'stock', label: 'En Stock' },
            { id: 'pedido', label: 'Agotadas' }
          ].map((tab) => {
            const activo = disponibilidadFiltro === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectDisponibilidad(tab.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase transition-all cursor-pointer ${
                  activo
                    ? 'bg-andrew-primary text-black shadow-sm'
                    : 'text-txt-muted hover:text-txt-main'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Derecha: Selector de Orden y Vista Cuadrícula / Lista */}
      <div className="flex items-center justify-between sm:justify-end gap-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-txt-muted">
          <span className="hidden sm:inline text-txt-muted font-extrabold text-[11px]">ORDENAR POR:</span>

          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              onClick={onToggleDropdown}
              className={`catalog-sort-btn flex items-center gap-2 bg-surface-sub hover:bg-input-bg text-txt-main text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                sortDropdownOpen
                  ? 'border-andrew-primary text-andrew-primary'
                  : 'border-stroke hover:border-stroke-hover'
              }`}
            >
              <Sparkles size={13} className="text-andrew-primary shrink-0" />
              <span>{currentLabel}</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 text-andrew-primary ${sortDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface-card border border-stroke rounded-2xl p-1.5 shadow-2xl z-40 space-y-1">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSortChange(opt.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-andrew-primary text-black shadow-sm'
                          : 'text-txt-muted hover:text-txt-main hover:bg-surface-sub'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={14} strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Alternar Grid / List */}
        <div className="flex items-center gap-1 bg-surface-sub p-1 rounded-xl border border-stroke">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              viewMode === 'grid' ? 'bg-andrew-primary text-black shadow-sm' : 'text-txt-muted hover:text-txt-main'
            }`}
            title="Vista Cuadrícula"
          >
            <Grid size={16} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              viewMode === 'list' ? 'bg-andrew-primary text-black shadow-sm' : 'text-txt-muted hover:text-txt-main'
            }`}
            title="Vista Lista"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
