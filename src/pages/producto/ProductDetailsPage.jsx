import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useProductDetails } from './hooks/useProductDetails';
import ProductGalleryZoom from './components/ProductGalleryZoom';
import CustomizationOptions from './components/CustomizationOptions';
import SizeGuideModal from './components/SizeGuideModal';
import ProductTechnicalTabs from './components/ProductTechnicalTabs';
import RelatedProductsGrid from './components/RelatedProductsGrid';

/**
 * ProductDetailsPage:
 * Contenedor orquestador modularizado según Clean Architecture.
 * Separa lógica y sincronización en useProductDetails y delega UI a subcomponentes atómicos.
 */
export default function ProductDetailsPage({ 
  productoId = 'real-madrid-lisboa',
  onBackToCatalog = () => {},
  onCustomOrder = () => {},
  onSelectProduct = () => {},
  onAddToCart = () => {},
  onBuyNow = () => {}
}) {
  const {
    producto,
    tallasValidas,
    galeriaValida,
    imagenActiva,
    setImagenActiva,
    tallaSeleccionada,
    setTallaSeleccionada,
    cantidad,
    tabActiva,
    setTabActiva,
    modalGuiaTallas,
    setModalGuiaTallas,
    precioUnitarioFinal,
    productosRelacionados
  } = useProductDetails(productoId);

  const construirItemPedido = () => {
    const stockMaxTalla = producto?.stockPorTalla?.[tallaSeleccionada] !== undefined
      ? parseInt(producto.stockPorTalla[tallaSeleccionada])
      : (parseInt(producto?.stock) || 0);
    const cantidadValidada = Math.max(1, Math.min(cantidad, stockMaxTalla || 1));

    return {
      ...producto,
      precioUnitario: precioUnitarioFinal,
      precio: precioUnitarioFinal,
      tallaSeleccionada,
      incluirShort: false,
      tallaShort: null,
      cantidad: cantidadValidada,
      inStock: true,
      personalizacion: null
    };
  };

  const handleAgregarAlPedido = () => {
    if (!producto || !producto.inStock || (producto.stock || 0) <= 0) return;
    onAddToCart(construirItemPedido());
  };

  const handleComprarAhora = () => {
    if (!producto || !producto.inStock || (producto.stock || 0) <= 0) return;
    onBuyNow(construirItemPedido());
  };

  return (
    <div className="w-full bg-bg-base text-txt-main min-h-screen select-none transition-colors">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-36 sm:pt-40 lg:pt-44 pb-12 sm:pb-16">
        {!producto ? (
          <div className="bg-surface-card border border-stroke rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
            <ShoppingBag size={48} className="mx-auto text-txt-muted" />
            <h2 className="font-['Montserrat',sans-serif] font-black text-xl uppercase text-txt-main">
              AÚN NO HAY CAMISETAS DISPONIBLES
            </h2>
            <p className="text-txt-muted text-xs sm:text-sm">
              Actualmente no hay productos registrados en el catálogo. Puedes agregar nuevos modelos desde el Panel de Administración o esperar la carga desde Supabase.
            </p>
            <button
              onClick={onBackToCatalog}
              className="bg-andrew-primary hover:bg-[#16a34a] text-black font-['Montserrat',sans-serif] font-black text-xs uppercase px-6 py-3 rounded-xl cursor-pointer transition-all shadow-md shadow-[#22c55e]/25"
            >
              VOLVER A LA TIENDA
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
              {/* SUB-COMPONENTE 1: Galería y Zoom HD */}
              <ProductGalleryZoom
                galeria={galeriaValida}
                imagenActiva={imagenActiva}
                setImagenActiva={setImagenActiva}
                productoNombre={producto.nombre}
                oferta={producto.oferta}
                tag={producto.tag}
              />

              {/* SUB-COMPONENTE 2: Opciones de compra y tallas en stock */}
              <CustomizationOptions
                producto={producto}
                precioUnitarioFinal={precioUnitarioFinal}
                tallasValidas={tallasValidas}
                tallaSeleccionada={tallaSeleccionada}
                setTallaSeleccionada={setTallaSeleccionada}
                onAgregarAlPedido={handleAgregarAlPedido}
                onComprarAhora={handleComprarAhora}
                onCustomOrder={onCustomOrder}
                onAbrirGuiaTallas={() => setModalGuiaTallas(true)}
              />
            </div>

            {/* SUB-COMPONENTE 3: Pestañas Técnicas y Reviews */}
            <ProductTechnicalTabs 
              tabActiva={tabActiva}
              setTabActiva={setTabActiva}
              producto={producto}
            />

            {/* SUB-COMPONENTE 4: Productos Relacionados */}
            <RelatedProductsGrid 
              productos={productosRelacionados}
              onSelectProduct={onSelectProduct}
              onBackToCatalog={onBackToCatalog}
            />
          </>
        )}
      </div>

      {/* Modal de Guía de Tallas */}
      <SizeGuideModal
        isOpen={modalGuiaTallas}
        onClose={() => setModalGuiaTallas(false)}
        equipoNombre={producto?.equipo || 'fútbol'}
      />
    </div>
  );
}
