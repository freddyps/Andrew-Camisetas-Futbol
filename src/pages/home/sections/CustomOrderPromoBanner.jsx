import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

/**
 * CustomOrderPromoBanner: Banner promocional de personalización de camisetas
 * Réplica adaptada a la temática oficial de Andrew Camisetas de Fútbol
 * (Verde institucional #22c55e, textura diagonal deportiva, estética premium oscura)
 */
export default function CustomOrderPromoBanner({ onCustomOrder = () => {} }) {
  return (
    <section className="relative w-full bg-[#0a0a0a] text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-10 xl:px-12 select-none overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto">
        <div id="promo-banner-card" className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0a0a0a] shadow-[0_20px_50px_rgba(0,0,0,0.9)] min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] flex items-center">
          
          {/* Imagen de fondo / Taller de estampado artesanal enfocando la camiseta, dorsal, parches y manos */}
          <div className="absolute inset-0 z-0">
            <img
              src="/banners/personaliza_tu_camiseta.webp"
              alt="Taller de personalización Andrew Camisetas"
              className="w-full h-full object-cover object-[70%_78%] sm:object-[62%_75%] lg:object-[55%_72%] filter contrast-110 brightness-100 transition-transform duration-700"
            />

            {/* Degradado oscuro suave a la izquierda para destacar el texto sin cortar ni tapar la camiseta */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/75 sm:via-[#0a0a0a]/55 md:via-[#0a0a0a]/35 to-transparent"></div>
            
            {/* Textura sutil deportiva de franjas diagonales en el lateral izquierdo */}
            <div 
              className="absolute inset-y-0 left-0 w-full md:w-1/2 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.08) 0, rgba(255, 255, 255, 0.08) 12px, transparent 12px, transparent 24px)'
              }}
            ></div>
          </div>

          {/* Contenido principal a la izquierda */}
          <div className="relative z-10 p-6 sm:p-10 md:p-14 lg:p-16 max-w-2xl space-y-5 sm:space-y-6">
            
            {/* Título de alto impacto con barra de acento verde institucional */}
            <div className="border-l-4 border-[#22c55e] pl-4 sm:pl-5">
              <h2 className="hero-banner-title font-['Montserrat',sans-serif] font-black text-[clamp(1.65rem,4.5vw,3.375rem)] uppercase tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                <span className="text-white keep-white">PERSONALIZA TU</span> <br />
                <span className="text-[#22c55e]">CAMISETA OFICIAL</span>
              </h2>
            </div>

            {/* Descripción clara y directa para el cliente con texto blanco brillante sobre la foto */}
            <p className="keep-white text-white text-xs sm:text-sm md:text-base leading-relaxed max-w-lg font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Nombre, dorsal y parches oficiales de la Copa del Mundo y Champions en cada pedido. Haz que tu camiseta de club o selección sea 100% única, sin coste adicional.
            </p>

            {/* Botón de acción */}
            <div className="pt-2 flex items-center">
              <button
                type="button"
                onClick={onCustomOrder}
                className="w-full min-[420px]:w-auto min-h-11 justify-center bg-[#22c55e] hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(34,197,94,0.45)]"
              >
                <span>PERSONALIZAR AHORA</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
