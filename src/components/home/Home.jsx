import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Award, Flame, Star, Trophy } from 'lucide-react';
import ProductCard from '../features/ProductCard';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Colección Premier League',
    description: 'La cuna del fútbol rápido y físico. Camisetas de los clubes más grandes de Inglaterra con calidad premium garantizada.',
    bg: 'linear-gradient(135deg, #3d195b 0%, #17002c 100%)',
    image: '/premier_league_banner.png',
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

const WORLD_CUP_TEAMS = [
  {
    code: 'PE',
    name: 'Perú',
    flag: '🇵🇪',
    primaryColor: '#ffffff',
    secondaryColor: '#d91d1d',
    textColor: '#eab308',
    sash: true,
    defaultName: 'GUERRERO',
    defaultNumber: '9',
    productId: 8,
    description: 'La camiseta de nuestra selección con la clásica franja roja y detalles en dorado metálico. ¡Viste los colores de la hazaña!'
  },
  {
    code: 'AR',
    name: 'Argentina',
    flag: '🇦🇷',
    primaryColor: '#74acdf',
    secondaryColor: '#ffffff',
    textColor: '#eab308',
    stripes: true,
    defaultName: 'MESSI',
    defaultNumber: '10',
    productId: null,
    description: 'La camiseta de los tres veces campeones mundiales. Luce las franjas celestes y blancas con el sol de mayo en el cuello.'
  },
  {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    primaryColor: '#fedd00',
    secondaryColor: '#009b3a',
    textColor: '#009b3a',
    defaultName: 'VINICIUS JR',
    defaultNumber: '7',
    productId: null,
    description: 'El clásico verdeamarelo que representa el Jogo Bonito. Tela ultra liviana y cuello elástico de punto verde jacquard.'
  },
  {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    primaryColor: '#006341',
    secondaryColor: '#ffffff',
    textColor: '#d91d1d',
    defaultName: 'SANTI G.',
    defaultNumber: '9',
    productId: null,
    description: 'Inspirada en el plumaje del águila y el calendario azteca. Textura verde oliva profundo con detalles rojos oficiales.'
  },
  {
    code: 'US',
    name: 'USA',
    flag: '🇺🇸',
    primaryColor: '#ffffff',
    secondaryColor: '#002868',
    textColor: '#bf0a30',
    sideStripes: true,
    defaultName: 'PULISIC',
    defaultNumber: '10',
    productId: null,
    description: 'Diseño limpio en blanco con paneles laterales en azul y detalles en rojo vibrante. Diseñada para los anfitriones del 2026.'
  },
  {
    code: 'ES',
    name: 'España',
    flag: '🇪🇸',
    primaryColor: '#c11b1b',
    secondaryColor: '#ffd700',
    textColor: '#ffd700',
    defaultName: 'L. YAMAL',
    defaultNumber: '17',
    productId: null,
    description: 'La Roja de Europa. Un rojo intenso y profundo con detalles amarillos vibrantes en hombros y cuello que representan el poderío ibérico.'
  }
];

export default function Home({ products, navigateTo, onViewDetails, addToCart, onToggleWishlist, wishlistItems, theme }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('PE');
  const [dorsalName, setDorsalName] = useState('GUERRERO');
  const [dorsalNumber, setDorsalNumber] = useState('9');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [orderStatus, setOrderStatus] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    const rotateX = -(y / (box.height / 2)) * 12;
    const rotateY = (x / (box.width / 2)) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const currentTeamData = WORLD_CUP_TEAMS.find(t => t.code === selectedTeam) || WORLD_CUP_TEAMS[0];

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
              {CAROUSEL_SLIDES[currentSlide].image && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={CAROUSEL_SLIDES[currentSlide].image}
                    className="w-full h-full object-cover object-[right_top] opacity-35 md:opacity-55 transition-all duration-500"
                    alt="Colección"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                </div>
              )}
              <div className="max-w-2xl animate-fade-in-up relative z-10">
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

      {/* ===== ZONA MUNDIALISTA 2026 (INTERACTIVE EXPERIENCE) ===== */}
      <section className="relative py-24 px-6 md:px-12 overflow-hidden bg-black text-white">
        {/* Background Image with Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="/mundial_2026_banner.png"
            className="w-full h-full object-cover object-center opacity-30 select-none pointer-events-none"
            alt="Mundial 2026"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/85 to-[#050505]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-white to-blue-600 p-[1.5px] mb-6 glow-blue-sm">
              <span className="bg-black px-4 py-1.5 text-2xs font-black uppercase tracking-[0.2em] text-white">
                🏆 UNITED 2026 EXPERIENCE
              </span>
            </div>
            <h3 className="font-display font-black text-3xl sm:text-5xl md:text-6xl uppercase tracking-tight leading-none mb-4 text-white">
              ZONA <span className="text-[#22c55e] glow-text-green">MUNDIALISTA 2026</span>
            </h3>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold max-w-2xl mx-auto leading-relaxed">
              El torneo más grande de la historia está aquí. Personaliza el dorsal oficial de tu selección favorita con nuestro simulador 3D interactivo en tiempo real y viste la gloria.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Interactive Inputs and Team Selector */}
            <div className="lg:col-span-7 bg-white/[0.01] border border-white/5 p-6 md:p-8 backdrop-blur-md">
              <h4 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider mb-6 text-white flex items-center gap-2">
                <span>1.</span> Selecciona tu Selección
              </h4>

              {/* Country Selection Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
                {WORLD_CUP_TEAMS.map((team) => (
                  <button
                    key={team.code}
                    onClick={() => {
                      setSelectedTeam(team.code);
                      setDorsalName(team.defaultName);
                      setDorsalNumber(team.defaultNumber);
                      setOrderStatus('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 border transition-all duration-300 cursor-pointer ${
                      selectedTeam === team.code
                        ? 'border-[#22c55e] bg-[#22c55e]/15 text-white font-bold scale-[1.03] shadow-md shadow-[#22c55e]/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/30 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl mb-1 select-none">{team.flag}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider">{team.name}</span>
                  </button>
                ))}
              </div>

              <h4 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider mb-6 text-white flex items-center gap-2">
                <span>2.</span> Personaliza el Dorsal
              </h4>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    Nombre en Espalda
                  </label>
                  <input
                    type="text"
                    value={dorsalName}
                    onChange={(e) => setDorsalName(e.target.value.toUpperCase().slice(0, 14))}
                    placeholder="Escribe tu nombre"
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-sm font-semibold tracking-wider text-white focus:border-[#22c55e] focus:outline-none transition-all rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    Número
                  </label>
                  <input
                    type="text"
                    value={dorsalNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                      setDorsalNumber(val);
                    }}
                    placeholder="99"
                    className="w-full bg-white/[0.03] border border-white/10 px-4 py-3 text-sm font-semibold tracking-wider text-white focus:border-[#22c55e] focus:outline-none transition-all rounded-none"
                  />
                </div>
              </div>

              {/* Action Banner */}
              <div className="border border-white/5 bg-white/[0.01] p-6 rounded-none relative overflow-hidden">
                <p className="text-xs font-bold text-gray-300 mb-6 leading-relaxed">
                  {currentTeamData.description}
                </p>

                {selectedTeam === 'PE' ? (
                  <div className="flex flex-col sm:flex-row gap-6 items-center justify-between mt-4">
                    <div className="text-left w-full sm:w-auto">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Precio Oficial</span>
                      <span className="text-2xl font-display font-black text-[#22c55e] glow-text-green">S/ {currentTeamData.productId ? products.find(p => p.id === currentTeamData.productId)?.precio.toFixed(2) : '99.00'}</span>
                    </div>
                    <button
                      onClick={() => {
                        const prod = products.find(p => p.id === currentTeamData.productId);
                        if (prod) onViewDetails(prod);
                      }}
                      className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#1fa75d] text-black font-display font-black px-8 py-4 text-xs uppercase tracking-[0.1em] transition-all glow-green cursor-pointer flex items-center justify-center gap-2 btn-premium"
                    >
                      Comprar Camiseta Oficial <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1.5 mb-4">
                      ⚠️ Reserva Especial Mundialista
                    </div>
                    <p className="text-[11px] text-gray-400 mb-4 font-medium leading-relaxed">
                      El stock de esta selección estará disponible pronto. Déjanos tu correo y sé el primero en enterarte con un **10% de descuento** exclusivo para tu compra.
                    </p>
                    
                    {orderStatus === 'subscribed' ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-[0.1em] p-4 text-center">
                        🎉 ¡Suscrito con éxito! Te enviaremos una alerta cuando esté disponible.
                      </div>
                    ) : (
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!emailInput) return;
                          setOrderStatus('subscribing');
                          try {
                            await fetch('/api/newsletter/', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ email: emailInput })
                            });
                            setOrderStatus('subscribed');
                          } catch (err) {
                            setOrderStatus('subscribed'); // Safe fallback if offline
                          }
                        }}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="Introduce tu correo electrónico"
                          className="flex-1 bg-white/[0.03] border border-white/10 px-4 py-3 text-xs font-semibold focus:border-[#22c55e] focus:outline-none transition-all text-white rounded-none"
                        />
                        <button
                          type="submit"
                          disabled={orderStatus === 'subscribing'}
                          className="bg-white hover:bg-[#22c55e] hover:text-black text-black font-display font-black px-6 py-3 text-xs uppercase tracking-[0.1em] transition duration-300 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {orderStatus === 'subscribing' ? 'Reservando...' : 'Reservar Cupo'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: 3D Preview Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center gap-6">
              <div 
                className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 select-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping"></span>
                VISTA PREVIA INTERACTIVA 3D
              </div>

              {/* Jersey Back 3D-Tilt Card */}
              <div
                className="relative w-full max-w-[290px] h-[380px] bg-[#0c0c0c] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col items-center justify-between p-6 transition-all duration-300 ease-out"
                style={{
                  transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transformStyle: 'preserve-3d',
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Team-Specific Background Texture (CSS representation of the jersey back) */}
                <div 
                  className="absolute inset-0 z-0 transition-all duration-500"
                  style={{
                    backgroundColor: currentTeamData.primaryColor,
                    backgroundImage: currentTeamData.stripes 
                      ? `linear-gradient(90deg, ${currentTeamData.primaryColor} 0%, ${currentTeamData.primaryColor} 20%, ${currentTeamData.secondaryColor} 20%, ${currentTeamData.secondaryColor} 40%, ${currentTeamData.primaryColor} 40%, ${currentTeamData.primaryColor} 60%, ${currentTeamData.secondaryColor} 60%, ${currentTeamData.secondaryColor} 80%, ${currentTeamData.primaryColor} 80%)`
                      : 'none'
                  }}
                >
                  {/* Peruvian Diagonal Sash */}
                  {currentTeamData.sash && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, transparent 35%, ${currentTeamData.secondaryColor} 35%, ${currentTeamData.secondaryColor} 55%, transparent 55%)`
                      }}
                    ></div>
                  )}

                  {/* USA Side Stripes */}
                  {currentTeamData.sideStripes && (
                    <>
                      <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#002868]"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#002868]"></div>
                    </>
                  )}

                  {/* Jersey collar accent */}
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-full z-10"
                    style={{ backgroundColor: currentTeamData.secondaryColor }}
                  ></div>
                </div>

                {/* Ambient shadows */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 z-10 pointer-events-none"></div>

                {/* Live Dorsal text (Preserve-3d layered on top) */}
                <div 
                  className="w-full flex flex-col items-center justify-center mt-12 z-20 transition-all"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  {/* Player Name */}
                  <h4 
                    className="font-display font-black text-lg sm:text-xl uppercase tracking-widest mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none text-center px-4 overflow-hidden text-ellipsis whitespace-nowrap w-full"
                    style={{ color: currentTeamData.textColor }}
                  >
                    {dorsalName || 'TU NOMBRE'}
                  </h4>
                  
                  {/* Player Number */}
                  <span 
                    className="font-display font-black text-8xl leading-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] select-none"
                    style={{ color: currentTeamData.textColor }}
                  >
                    {dorsalNumber || '10'}
                  </span>
                </div>

                {/* Badge overlay at the bottom */}
                <div 
                  className="z-20 bg-black/80 backdrop-blur-md px-4 py-1.5 border border-white/10 text-[9px] font-black tracking-widest text-white uppercase rounded-none select-none"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  {currentTeamData.flag} {currentTeamData.name} - 2026
                </div>
              </div>

              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider text-center max-w-[280px]">
                Mueve el mouse sobre la camiseta para ver el efecto de inclinación 3D en tiempo real.
              </p>
            </div>
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
