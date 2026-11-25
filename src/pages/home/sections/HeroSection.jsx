import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * HeroSection: Portada principal adaptativa con soporte para dvh/svh,
 * orientación horizontal en móviles, encuadre inteligente y tipografía fluida con clamp().
 */
export default function HeroSection({ onExplore = () => {}, onCustomOrder = () => {} }) {
  const [slideActivo, setSlideActivo] = React.useState(0);

  const slides = [
    {
      fondo: '/banners/cr7_chilena_juventus.webp',
      fondoMobile: '/banners/cr7_chilena_juventus_mobile.webp',
      badge: 'BIENVENIDOS A ANDREW CAMISETAS',
      linea1: 'ANDREW Y LOS',
      linea2: 'CAMPEONES DEL MUNDO',
    }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSlideActivo((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const actual = slides[slideActivo];

  return (
    <section
      id="hero"
      className="relative w-full min-h-[560px] sm:min-h-[600px] h-[100dvh] max-h-[960px] flex items-end justify-center overflow-hidden select-none pt-28 pb-10 sm:pb-14 lg:pb-20"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <picture className="block w-full h-full">
          <source media="(max-width: 767px)" srcSet={actual.fondoMobile} />
          <img 
            src={actual.fondo} 
            alt="Andrew y los Campeones del Mundo" 
            className="w-full h-full object-cover object-center sm:object-[center_28%] filter contrast-115 brightness-105 saturate-110 transition-all duration-700"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center space-y-3.5 sm:space-y-5">
        <div className="inline-block bg-black/85 backdrop-blur-md border border-[#22c55e] px-4 sm:px-5 py-1.5 sm:py-2 rounded-md tracking-wide text-[#22c55e] text-[11px] sm:text-sm font-black uppercase shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(34,197,94,0.35)]">
          {actual.badge}
        </div>

        <h1 className="hero-banner-title font-['Montserrat',sans-serif] font-black text-[clamp(1.75rem,5.5vw,4.5rem)] uppercase tracking-tight text-white leading-[0.98] drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] max-w-[18ch]">
          <span className="block text-white keep-white">{actual.linea1}</span>
          <span className="block mt-1 sm:mt-2 text-white keep-white">{actual.linea2}</span>
        </h1>

        <div className="pt-1 sm:pt-2 w-full sm:w-auto flex flex-col min-[420px]:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onExplore}
            className="w-full min-[420px]:w-auto min-h-11 bg-[#22c55e] hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            <span>VER CATÁLOGO</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={onCustomOrder}
            className="w-full min-[420px]:w-auto min-h-11 bg-black/70 hover:bg-black/85 border border-white/25 hover:border-white/50 keep-white font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all backdrop-blur-sm hover:scale-105 active:scale-95"
          >
            <span className="keep-white">PEDIR A MEDIDA</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setSlideActivo(index)}
              aria-label={`Slide ${index + 1}`}
              className={`w-3.5 h-3.5 rounded-full transition-all cursor-pointer ${
                slideActivo === index 
                  ? 'bg-[#22c55e] scale-125 shadow-[0_0_12px_#22c55e]' 
                  : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
