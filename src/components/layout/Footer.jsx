import React from 'react';
import { Phone, MapPin, ChevronUp, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

/**
 * Footer: Pie de página oficial deportivo de alta gama
 * Estructura de 4 bloques equilibrados:
 * 1. Marca ANDREW + Garantías oficiales (Badge calidad 1.1 y envíos)
 * 2. Enlaces Rápidos con hover verde institucional
 * 3. Categorías de Camisetas (Clubes, Selecciones, Retro)
 * 4. Tarjeta interactiva de Contacto y Atención inmediata por WhatsApp
 */
export default function Footer({ onNavigate = () => {}, user = null }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root relative bg-[#080808] text-white select-none pt-16 lg:pt-20 border-t border-white/10 overflow-hidden">
      
      {/* Fondo decorativo sutil deportivo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#22c55e]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Contenedor principal expandido para aprovechar los laterales */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pb-14 relative z-10">
        
        {/* Barra superior de Beneficios / Confianza */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8 pb-12 mb-12 border-b border-white/10">
          <div className="footer-feature-card flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                CALIDAD A1 GARANTIZADA
              </h4>
              <p className="text-gray-400 text-xs font-medium mt-0.5">
                Telas técnicas, parches oficiales y escudos bordados
              </p>
            </div>
          </div>

          <div className="footer-feature-card flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                ENVÍOS A TODO EL PERÚ
              </h4>
              <p className="text-gray-400 text-xs font-medium mt-0.5">
                Lima por InDrive/Yango y provincias por Shalom
              </p>
            </div>
          </div>

          <div className="footer-feature-card flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                RESERVA CON S/ 40
              </h4>
              <p className="text-gray-400 text-xs font-medium mt-0.5">
                Importación a pedido en 19 a 25 días calendario
              </p>
            </div>
          </div>
        </div>

        {/* 4 Columnas principales expandidas y balanceadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
          
          {/* COLUMNA 1 (lg:col-span-4 xl:col-span-5): MARCA, RESEÑA Y REDES SOCIALES */}
          <div className="lg:col-span-4 xl:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow-xl flex items-center justify-center p-2 overflow-hidden shrink-0">
                <img
                  src="/brand/logo_andrew_v2.webp"
                  alt="Andrew Camisetas de Fútbol"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="brand-footer-title font-['Montserrat',sans-serif] font-black text-2xl tracking-tight uppercase leading-none text-white">
                  ANDREW
                </span>
                <span className="brand-footer-subtitle font-['Montserrat',sans-serif] font-black text-[10px] uppercase tracking-widest mt-1 text-[#22c55e]">
                  CAMISETAS DE FÚTBOL
                </span>
              </div>
            </div>

            <p className="footer-brand-desc font-['Montserrat',sans-serif] text-gray-300 text-xs sm:text-sm leading-relaxed font-normal">
              Especialistas en indumentarias oficiales de clubes, selecciones mundiales y joyas retro de colección. Estampados profesionales y atención directa para todo el Perú.
            </p>

            {/* Redes sociales */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={SITE_CONFIG.whatsapp.link}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn w-10 h-10 rounded-xl bg-white/5 hover:bg-[#22c55e] border border-white/10 hover:border-[#22c55e] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                title="WhatsApp Oficial"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a
                href={SITE_CONFIG.redes.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn w-10 h-10 rounded-xl bg-white/5 hover:bg-[#22c55e] border border-white/10 hover:border-[#22c55e] text-white hover:text-black flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                title="Instagram Oficial"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* COLUMNA 2 (lg:col-span-2 xl:col-span-2): ENLACES DEL SITIO */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 bg-[#22c55e] rounded-full"></span>
              <h3 className="font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider text-white">
                NAVEGACIÓN
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-gray-400 font-semibold">
              {[
                ['inicio', 'Inicio'],
                ['catalogo', 'Catálogo Oficial'],
                ['nosotros', 'Sobre Nosotros'],
                ['pedir_a_medida', 'Pedir a Medida'],
                ...(user && user.role !== 'ADMIN' ? [['mis_pedidos', 'Mis Compras']] : []),
              ].map(([route, label]) => (
                <li key={label}>
                  <button 
                    type="button"
                    onClick={() => onNavigate(route)} 
                    className="footer-nav-link text-left hover:text-[#22c55e] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#22c55e]"></span>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 3 (lg:col-span-2 xl:col-span-2): CATEGORÍAS POPULARES */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-1 bg-[#22c55e] rounded-full"></span>
              <h3 className="font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider text-white">
                COLECCIONES
              </h3>
            </div>

            <ul className="space-y-2.5 text-xs text-gray-400 font-semibold">
              {[
                { label: 'Clubes de Europa', query: 'Real Madrid' },
                { label: 'Selecciones del Mundo', query: 'Selección' },
                { label: 'Joyas Retro & Vintage', query: 'Retro' },
                { label: 'Versión Jugador Pro', query: 'Jugador' },
                { label: 'Shorts & Conjuntos', query: 'Short' },
              ].map((cat) => (
                <li key={cat.label}>
                  <button 
                    type="button"
                    onClick={() => onNavigate('catalogo', cat.query)} 
                    className="footer-nav-link text-left hover:text-[#22c55e] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                    <span>{cat.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 4 (lg:col-span-4 xl:col-span-3): TARJETA DE ATENCIÓN DIRECTA */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="footer-contact-box bg-[#111111] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse"></span>
                  <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider text-white">
                    ATENCIÓN EN LÍNEA
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-md border border-[#22c55e]/20">
                  LIMA - PERÚ
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* WhatsApp */}
                <a 
                  href={SITE_CONFIG.whatsapp.link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-[#22c55e]/15 border border-white/5 hover:border-[#22c55e]/40 transition-all text-gray-300 hover:text-white group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#22c55e] text-black flex items-center justify-center shrink-0 shadow-sm">
                    <Phone size={15} strokeWidth={2.5} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">PEDIDOS WHATSAPP</span>
                    <span className="font-bold text-white text-xs group-hover:text-[#22c55e] transition-colors">
                      {SITE_CONFIG.whatsapp.numero} · {SITE_CONFIG.whatsapp.titular}
                    </span>
                  </div>
                </a>

                {/* Instagram */}
                <a 
                  href={SITE_CONFIG.redes.instagram.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all text-gray-300 hover:text-white group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 text-[#22c55e] flex items-center justify-center shrink-0">
                    <Sparkles size={15} />
                  </div>
                  <div className="truncate">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">CATÁLOGO EN VIVO</span>
                    <span className="font-bold text-white text-xs truncate group-hover:text-[#22c55e] transition-colors">
                      {SITE_CONFIG.redes.instagram.usuario}
                    </span>
                  </div>
                </a>

                {/* Envíos */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-white/10 text-[#22c55e] flex items-center justify-center shrink-0">
                    <MapPin size={15} />
                  </div>
                  <div className="text-[11px] leading-tight text-gray-400">
                    <strong className="text-white block font-bold mb-0.5">Envíos a todo el país</strong>
                    Agencia Shalom o motorizado (InDrive / Yango).
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BARRA INFERIOR DE COPYRIGHT EXPANDIDA */}
      <div className="footer-bottom-bar border-t border-white/10 bg-[#060606] py-5 px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="w-full max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 font-medium">
          
          <div>
            © 2026 <strong className="text-white font-extrabold tracking-wide">ANDREW CAMISETAS DE FÚTBOL</strong> · Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-6 uppercase text-[11px] font-bold tracking-wider">
            <button 
              type="button"
              onClick={() => onNavigate('terminos')} 
              className="hover:text-[#22c55e] transition-colors cursor-pointer"
            >
              Términos y Garantías
            </button>
            <span className="text-white/20">•</span>
            <button 
              type="button"
              onClick={() => onNavigate('faq')} 
              className="hover:text-[#22c55e] transition-colors cursor-pointer"
            >
              Preguntas Frecuentes
            </button>
            <span className="text-white/20">•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-[#22c55e] hover:underline cursor-pointer"
            >
              <span>Subir</span>
              <ChevronUp size={14} strokeWidth={2.5} />
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
}
