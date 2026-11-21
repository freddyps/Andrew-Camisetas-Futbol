import React from 'react';
import { useCatalogo } from './hooks/useCatalogo';
import CatalogSidebar from './components/CatalogSidebar';
import CatalogToolbar from './components/CatalogToolbar';
import CatalogProductsList from './components/CatalogProductsList';

/**
 * CatalogoPage: Página Oficial de Tienda y Catálogo
 * Arquitectura modular y limpia desacoplada en useCatalogo y subcomponentes.
 */
export default function CatalogoPage({ 
  initialSearchQuery = '',
  onSelectProduct = () => {},
  onAddToCart = () => {} 
}) {
  const {
    productosLista,
    searchQuery,
    setSearchQuery,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    disponibilidadFiltro,
    setDisponibilidadFiltro,
    maxPrecio,
    setMaxPrecio,
    precioMaximoCatalogo,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortDropdownOpen,
    setSortDropdownOpen,
    sortDropdownRef,
    tagSeleccionado,
    setTagSeleccionado,
    camisetasFiltradas,
    resetFilters,
    hasActiveFilters
  } = useCatalogo(initialSearchQuery);

  return (
    <div className="w-full bg-bg-base text-txt-main min-h-screen select-none transition-colors">
      {/* CONTENIDO PRINCIPAL: SIDEBAR + PRODUCTOS (EXPANDIDO PARA APROVECHAR ESPACIO LATERAL) */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-36 sm:pt-40 lg:pt-44 pb-12 sm:pb-16">
        {/* Barra superior de herramientas y orden */}
        <CatalogToolbar 
          totalArticulos={camisetasFiltradas.length}
          disponibilidadFiltro={disponibilidadFiltro}
          onSelectDisponibilidad={setDisponibilidadFiltro}
          sortBy={sortBy}
          onSortChange={(id) => {
            setSortBy(id);
            setSortDropdownOpen(false);
          }}
          sortDropdownOpen={sortDropdownOpen}
          onToggleDropdown={() => setSortDropdownOpen(!sortDropdownOpen)}
          sortDropdownRef={sortDropdownRef}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Layout en 2 columnas con óptimo aprovechamiento horizontal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10">
          <CatalogSidebar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            maxPrecio={maxPrecio}
            precioMaximoCatalogo={precioMaximoCatalogo}
            onPriceChange={setMaxPrecio}
            categoriaSeleccionada={categoriaSeleccionada}
            onSelectCategory={setCategoriaSeleccionada}
            disponibilidadFiltro={disponibilidadFiltro}
            onSelectDisponibilidad={setDisponibilidadFiltro}
            tagSeleccionado={tagSeleccionado}
            onSelectTag={setTagSeleccionado}
            productosLista={productosLista}
            onSelectProduct={onSelectProduct}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
          />

          <main className="lg:col-span-8 xl:col-span-9">
            <CatalogProductsList 
              productos={camisetasFiltradas}
              viewMode={viewMode}
              onSelectProduct={onSelectProduct}
              onAddToCart={onAddToCart}
              onResetFilters={resetFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
