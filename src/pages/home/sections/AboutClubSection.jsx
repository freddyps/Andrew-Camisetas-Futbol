import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * AboutClubSection: Sección 'Conoce el Club Andrew Store' compatible con Modo Claro y Modo Oscuro.
 */
export default function AboutClubSection({ onExplore = () => {} }) {
  return (
    <section className="relative w-full bg-bg-base text-txt-main py-20 lg:py-28 px-4 sm:px-6 lg:px-10 xl:px-12 overflow-hidden select-none transition-colors duration-200">
      {/* Luces sutiles de fondo para ambientación de estadio */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-[1720px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* FOTOS DE EXHIBICIÓN CON EFECTOS */}
          <div className="lg:col-span-6 grid grid-cols-1 min-[480px]:grid-cols-2 items-center justify-items-center gap-4 sm:gap-7">
            <div className="w-full max-w-[320px] min-[480px]:max-w-none min-[480px]:w-full sm:w-[260px] md:w-[280px] h-72 min-[480px]:h-[380px] sm:h-[520px] rounded-3xl overflow-hidden shadow-2xl relative group border border-stroke">
              <img 
                src="/banners/showcase_barcelona.webp" 
                alt="Pasión Andrew" 
                className="w-full h-full object-cover filter contrast-110 brightness-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-block px-3 py-1 rounded-full bg-andrew-primary text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  VERSIÓN JUGADOR
                </span>
                <p className="keep-white text-white !text-white text-xs sm:text-sm font-medium mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  Detalles y parches de competición
                </p>
              </div>
            </div>

            <div className="w-full max-w-[320px] min-[480px]:max-w-none min-[480px]:w-full sm:w-[280px] md:w-[300px] h-72 min-[480px]:h-[410px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl relative group min-[480px]:-mt-6 sm:-mt-10 border border-andrew-primary/40">
              <img 
                src="/banners/showcase_psg.webp" 
                alt="Fútbol en vivo" 
                className="w-full h-full object-cover filter contrast-110 brightness-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="inline-block px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
                  EDICIONES EXCLUSIVAS
                </span>
                <p className="keep-white text-white !text-white text-xs sm:text-sm font-medium mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  Importación oficial con número y dorsal
                </p>
              </div>
            </div>
          </div>

          {/* CONTENIDO Y PROPUESTA DE VALOR */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6 min-w-0">
            <div>
              <div className="inline-flex items-center gap-2 bg-andrew-primary/15 border border-andrew-primary/40 px-3.5 py-1 rounded-full mb-3">
                <span className="w-2 h-2 rounded-full bg-andrew-primary animate-pulse"></span>
                <span className="font-['Montserrat',sans-serif] font-bold text-[11px] uppercase tracking-wider text-andrew-primary">
                  HISTORIA & TRADICIÓN DEPORTIVA
                </span>
              </div>
              <h2 className="font-['Montserrat',sans-serif] font-black text-[clamp(1.75rem,4.8vw,3.75rem)] uppercase tracking-tight text-txt-main leading-none">
                CONOCE EL CLUB <br />
                <span className="text-andrew-primary">ANDREW STORE</span>
              </h2>
            </div>

            <p className="text-txt-muted text-sm sm:text-base leading-relaxed font-medium">
              Nuestra pasión es llevarte la indumentaria más exclusiva de los clubes y selecciones más laureados del planeta. Camisetas con tejidos técnicos de alta transpirabilidad, versiones jugador auténticas y estampados oficiales con garantía de coleccionista.
            </p>

            {/* Métricas y garantías reales con alto contraste en modo claro y oscuro */}
            <div className="grid grid-cols-1 min-[390px]:grid-cols-3 gap-3.5 py-3.5 border-y border-stroke">
              <div className="text-center sm:text-left">
                <span className="block font-['Montserrat',sans-serif] font-black text-lg sm:text-2xl text-andrew-primary">CALIDAD A1</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-txt-muted uppercase tracking-wider">Acabado Profesional</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block font-['Montserrat',sans-serif] font-black text-lg sm:text-2xl text-txt-main">S/ 40</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-txt-muted uppercase tracking-wider">Reserva Tu Pedido</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block font-['Montserrat',sans-serif] font-black text-lg sm:text-2xl text-andrew-primary">TODO EL PERÚ</span>
                <span className="text-[10px] sm:text-xs font-extrabold text-txt-muted uppercase tracking-wider">Lima & Provincias</span>
              </div>
            </div>

            {/* Micro tarjetas de pilares de calidad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-card border border-stroke shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-andrew-primary/15 text-andrew-primary flex items-center justify-center font-black text-lg shrink-0">
                  ⚡
                </div>
                <div>
                  <h4 className="font-['Montserrat',sans-serif] text-xs font-black uppercase text-txt-main tracking-wider">
                    Tejidos Técnicos PRO
                  </h4>
                  <p className="text-xs text-txt-muted mt-0.5 font-medium">
                    Ajuste anatómico y frescura continua
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-card border border-stroke shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-andrew-primary/15 text-andrew-primary flex items-center justify-center font-black text-lg shrink-0">
                  🛡️
                </div>
                <div>
                  <h4 className="font-['Montserrat',sans-serif] text-xs font-black uppercase text-txt-main tracking-wider">
                    Escudos & Detalles HD
                  </h4>
                  <p className="text-xs text-txt-muted mt-0.5 font-medium">
                    Termosellados y bordados de alta densidad
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onExplore}
                className="bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase tracking-wider px-8 py-4 rounded-xl inline-flex items-center gap-3 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_4px_24px_rgba(34,197,94,0.35)]"
              >
                <span>EXPLORAR TIENDA</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
