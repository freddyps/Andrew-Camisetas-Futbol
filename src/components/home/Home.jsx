import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Award, Flame, Star, Trophy } from 'lucide-react';
import ProductCard from '../features/ProductCard';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Colección Premier League',
    description: 'La cuna del fútbol rápido y físico. Camisetas de los clubes más grandes de Inglaterra con calidad premium garantizada.',
    bg: 'linear-gradient(135deg, #3d195b 0%, #17002c 100%)',
    team: '⚽ Manchester United & Arsenal',
    accentColor: '#3d195b'
  },
  {
    id: 2,
    title: 'La Liga de España',
    description: 'Toda la magia del fútbol ibérico. Luce la blanquinegra y azulgrana de los monarcas de Europa y del mundo.',
    bg: 'linear-gradient(135deg, #850f24 0%, #300008 100%)',
    team: '⚽ Real Madrid & FC Barcelona',
    accentColor: '#850f24'
  },
  {
    id: 3,
    title: 'La Blanquirroja Premium',
    description: 'Viste los colores de nuestra selección. Textura y costuras especiales con detalles dorados de edición limitada.',
    bg: 'linear-gradient(135deg, #b31919 0%, #4a0000 100%)',
    team: '🇵🇪 Selección Peruana Local',
    accentColor: '#b31919'
  }
];

export default function Home({ products, navigateTo, onViewDetails, addToCart, onToggleWishlist, wishlistItems, theme }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);

  return (
    <div className={`${theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#050505] text-white'}`}>
      {/* ===== HERO HEADER (WOW FIRST IMPRESSION) ===== */}
      <div className="relative min-h-[90vh] flex items-center justify-start px-6 md:px-20 overflow-hidden py-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/cr7_chilena.jpg"
            className="w-full h-full object-cover object-[center_25%] brightness-[0.7]"
            alt="Fútbol fondo"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/30 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl pt-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2.5 bg-[#22c55e]/10 border border-[#22c55e]/30 px-4 py-2 mb-8 text-[#22c55e] text-xs font-black uppercase tracking-[0.15em] glow-green-sm">
            <span className="w-2.5 h-2.5 bg-[#22c55e] animate-pulse"></span>
            TEMPORADA 2025/2026
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-black uppercase tracking-tight leading-[0.9] mb-8 [.light-theme_&]:!text-white">
            LA PASIÓN <br />
            <span className="text-[#22c55e] glow-text-green">EN TU PIEL</span>
          </h2>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-10 max-w-2xl leading-relaxed font-semibold [.light-theme_&]:!text-slate-300">
            Equípate con las camisetas de fútbol más deseadas del planeta. Calidad de jugador ultra-premium con termo-sellados perfectos y telas de alta tecnología. Personaliza tu nombre y número favoritos en vivo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigateTo('productos')} 
              className="bg-[#22c55e] hover:bg-[#1fa75d] text-black font-display font-black px-10 py-4.5 text-xs uppercase tracking-[0.1em] transition-all glow-green cursor-pointer flex items-center justify-center gap-2 btn-premium"
            >
              Explorar Catálogo <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('sobre-nosotros');
                element?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="border border-white/10 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 text-white font-display font-black px-10 py-4.5 text-xs uppercase tracking-[0.1em] transition-all cursor-pointer flex items-center justify-center [.light-theme_&]:!text-white"
            >
              Conocer Más
            </button>
          </div>

          {/* Grilla rápida de beneficios */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/5 pt-10">
            <div className="flex items-center gap-3">
              <Award className="text-[#22c55e]" size={20} />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider [.light-theme_&]:!text-white">Premium Elite</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5 [.light-theme_&]:!text-slate-400">Calidad Importada</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Trophy className="text-[#22c55e]" size={20} />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider [.light-theme_&]:!text-white">Simulador 3D</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5 [.light-theme_&]:!text-slate-400">Estampado en vivo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
              <Star className="text-[#22c55e]" size={20} />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider [.light-theme_&]:!text-white">100% Calificados</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5 [.light-theme_&]:!text-slate-400">Garantía de Cliente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BANNER HORIZONTAL ROTATIVO DE LIGAS (EFFECTIVE MARQUEE) ===== */}
      <section className="bg-white text-black py-4 border-y border-white/10 shadow-lg relative z-10">
        <div className="marquee-container">
          <div className="marquee-content font-display font-black text-2xs uppercase tracking-[0.25em] flex gap-20 items-center">
            <span>⚽ PREMIER LEAGUE ENGLAND</span>
            <span>🏆 LA LIGA ESPAÑA</span>
            <span>🔥 SERIE A ITALIA</span>
            <span>⭐ BUNDESLIGA ALEMANIA</span>
            <span>⚽ LIGUE 1 FRANCIA</span>
            <span>🇵🇪 SELECCIÓN PERUANA</span>
            <span>⚽ PREMIER LEAGUE ENGLAND</span>
            <span>🏆 LA LIGA ESPAÑA</span>
            <span>🔥 SERIE A ITALIA</span>
            <span>⭐ BUNDESLIGA ALEMANIA</span>
            <span>⚽ LIGUE 1 FRANCIA</span>
            <span>🇵🇪 SELECCIÓN PERUANA</span>
          </div>
        </div>
      </section>

      {/* ===== CARRUSEL DINÁMICO DE COLECCIONES ===== */}
      <section className={`py-20 px-6 md:px-12 ${theme === 'light' ? 'bg-gradient-to-b from-slate-50 to-slate-100' : 'bg-gradient-to-b from-[#050505] to-[#0c0c0c]'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="relative glass-card overflow-hidden h-[340px] md:h-[420px]">
            {/* Slide */}
            <div
              className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 z-10 transition-all duration-700"
              style={{ background: CAROUSEL_SLIDES[currentSlide].bg }}
            >
              <div className="max-w-2xl animate-fade-in-up">
                <span className="text-[#22c55e] font-display font-black text-xs uppercase tracking-[0.15em] glow-text-green bg-black/30 px-3 py-1.5 rounded-none">
                  {CAROUSEL_SLIDES[currentSlide].team}
                </span>
                <h3 className="font-display font-black text-2xl md:text-5xl uppercase tracking-tight text-white mt-4 mb-4 leading-none [.light-theme_&]:!text-white">
                  {CAROUSEL_SLIDES[currentSlide].title}
                </h3>
                <p className="text-gray-300 text-xs md:text-sm font-semibold mb-8 leading-relaxed max-w-lg [.light-theme_&]:!text-slate-200">
                  {CAROUSEL_SLIDES[currentSlide].description}
                </p>
                <button
                  onClick={() => navigateTo('productos')}
                  className="bg-[#22c55e] hover:bg-[#1fa75d] text-black font-display font-black px-6 py-3.5 text-2xs uppercase tracking-[0.08em] transition-all glow-green cursor-pointer"
                >
                  Explorar Colección
                </button>
              </div>
            </div>

            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-0"></div>

            {/* Controles del Carrusel */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 border border-white/10 p-2.5 transition backdrop-blur-sm cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 border border-white/10 p-2.5 transition backdrop-blur-sm cursor-pointer"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>

          {/* Indicadores */}
          <div className="flex gap-2 justify-center mt-6">
            {CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 h-1.5 rounded-none cursor-pointer ${
                  idx === currentSlide
                    ? 'bg-[#22c55e] w-8'
                    : 'bg-white/10 w-2 hover:bg-white/30'
                }`}
                aria-label={`Ir al banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTOS DESTACADOS / MÁS POPULARES ===== */}
      <section className={`py-20 px-6 md:px-12 border-y ${theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-[#0c0c0c] border-white/5'}`}>
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[#22c55e] text-xs font-black uppercase tracking-[0.1em] mb-3 glow-text-green">
                <Flame size={14} className="fill-[#22c55e]" /> LO MÁS BUSCADO
              </div>
              <h3 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight">
                Camisetas Destacadas
              </h3>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold max-w-md leading-relaxed">
              Descubre las camisetas que lideran las ventas esta semana. Modelos oficiales con los detalles exactos de los jugadores profesionales.
            </p>
          </div>

          {/* Listado de Tarjetas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((item) => (
              <ProductCard 
                key={item.id} 
                item={item} 
                onViewDetails={onViewDetails} 
                addToCart={addToCart} 
                wishlistItems={wishlistItems}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={() => navigateTo('productos')}
              className="bg-white hover:bg-[#22c55e] hover:text-black text-black font-display font-black px-12 py-5 text-xs uppercase tracking-[0.1em] transition-all duration-300 shadow-xl cursor-pointer flex items-center gap-2 glow-green-sm"
            >
              Ver Todo el Catálogo <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* ===== SOBRE ANDREW CAMISETAS ===== */}
      <section id="sobre-nosotros" className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#0c0c0c] to-[#050505]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] text-2xs font-black uppercase tracking-[0.2em] px-4.5 py-2.5 mb-8 glow-green-sm">
            NUESTRA HISTORIA
          </div>
          
          <h3 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight leading-[1.1] mb-8">
            SOBRE <span className="text-[#22c55e] glow-text-green">ANDREW CAMISETAS</span>
          </h3>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-semibold max-w-3xl mx-auto mb-16 [.light-theme_&]:!text-slate-300">
            Somos tu distribuidor de confianza para camisetas de fútbol auténticas premium. Desde hace más de 5 años, equipamos a la hinchada con los estándares internacionales más altos: escudos termo-sellados de silicona 3D, telas con tejido inteligente de secado rápido, y estampados profesionales que no se agrietan. Cada camiseta es una obra de arte.
          </p>

          {/* Grilla de Métricas Premium en Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="border border-white/5 bg-white/[0.01] p-10 text-center hover:border-[#22c55e]/35 transition-all duration-500">
              <p className="text-5xl font-display font-black text-[#22c55e] mb-2 tracking-tight glow-text-green">100%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 [.light-theme_&]:!text-slate-400">Calidad Garantizada</p>
            </div>

            <div className="border border-white/5 bg-white/[0.01] p-10 text-center hover:border-[#22c55e]/35 transition-all duration-500">
              <p className="text-5xl font-display font-black text-[#22c55e] mb-2 tracking-tight glow-text-green">24h</p>
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 [.light-theme_&]:!text-slate-400">Envío Express Lima</p>
            </div>

            <div className="border border-white/5 bg-white/[0.01] p-10 text-center hover:border-[#22c55e]/35 transition-all duration-500">
              <p className="text-5xl font-display font-black text-[#22c55e] mb-2 tracking-tight glow-text-green">15K+</p>
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 [.light-theme_&]:!text-slate-400">Clientes Felices</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
