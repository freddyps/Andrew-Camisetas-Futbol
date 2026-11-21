import React from 'react';

/**
 * ProductGalleryZoom:
 * Galería de fotos del producto con tira de miniaturas verticales/horizontales
 * y visor limpio donde la imagen de la prenda es protagonista sin marco ni recuadro envolvente.
 */
export default function ProductGalleryZoom({
  galeria = [],
  imagenActiva,
  setImagenActiva,
  productoNombre = 'Camiseta'
}) {
  const fotos = Array.isArray(galeria) && galeria.length > 0
    ? galeria
    : ['/brand/logo_andrew_v2.webp'];

  const imagenSeleccionada = imagenActiva || fotos[0];

  return (
    <div className="lg:col-span-5 xl:col-span-5 flex flex-col-reverse sm:flex-row gap-4 items-center justify-center lg:sticky lg:top-32">
      
      {/* Tira de Miniaturas */}
      {fotos.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 max-w-full shrink-0">
          {fotos.map((img, idx) => {
            const esActiva = imagenSeleccionada === img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setImagenActiva(img)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface-card p-1.5 border-2 transition-all cursor-pointer overflow-hidden shrink-0 flex items-center justify-center ${
                  esActiva 
                    ? 'border-andrew-primary shadow-[0_0_15px_rgba(34,197,94,0.35)] scale-105' 
                    : 'border-stroke hover:border-stroke-hover opacity-80 hover:opacity-100'
                }`}
              >
                <img 
                  src={img} 
                  alt={`Miniatura ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Visor Principal Limpio: Sin cuadro ni borde alrededor, protagonismo 100% en la imagen */}
      <div className="relative w-full h-[290px] min-[400px]:h-[350px] sm:h-[450px] lg:h-[510px] flex items-center justify-center group">
        <img
          src={imagenSeleccionada}
          alt={productoNombre}
          className="max-h-full max-w-full w-auto h-full object-contain rounded-2xl drop-shadow-[0_12px_32px_rgba(0,0,0,0.18)] group-hover:scale-[1.03] transition-transform duration-500 relative z-10"
        />
      </div>

    </div>
  );
}
