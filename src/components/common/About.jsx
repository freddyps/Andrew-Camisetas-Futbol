import React from 'react';
import { ArrowLeft, Check, Award, Zap, Package, MapPin } from 'lucide-react';

export default function About({ onBack }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs font-display font-black uppercase tracking-[0.08em] text-[#22c55e] hover:text-[#1fa75d] transition-colors"
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>

        {/* CABECERA */}
        <div className="mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 text-[#22c55e] text-xs font-black uppercase tracking-[0.1em] mb-2 glow-text-green">
            <Award size={12} /> NUESTRA FILOSOFÍA
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-white">Quiénes Somos</h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-2 max-w-2xl leading-relaxed">
            Somos la tienda online de referencia en camisetas de fútbol importadas premium en Lima y todo el Perú.
          </p>
        </div>

        {/* DETALLE: HISTORIA (GLASS PANEL) */}
        <div className="grid gap-12 mb-16 animate-fade-in-up">
          <div className="glass-panel border border-white/10 p-8 sm:p-10 shadow-2xl">
            <h2 className="text-lg font-display font-black uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-6">
              Nuestra Historia
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold mb-4">
              Fundada en 2020 en Lima, **Andrew Camisetas** nace del amor incondicional por la Blanquirroja y los grandes clubes internacionales. Lo que comenzó como un pequeño emprendimiento de hinchas apasionados, se ha convertido hoy en una plataforma e-commerce referente a nivel nacional, despachando miles de camisetas a apasionados de todo el Perú.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold mb-4">
              Trabajamos incansablemente con proveedores selectos para importar hilados de la más alta resistencia con los patrones de tejido exactos de los jugadores profesionales.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-semibold">
              Para nosotros, una camiseta no es solo una prenda de vestir; es un escudo sagrado, es orgullo, es emoción. Por eso cuidamos cada detalle: desde las costuras termo-selladas hasta el empaque de lujo.
            </p>
          </div>

          {/* BENEFICIOS: GRILLA 4 COLUMNAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-white/5 bg-white/[0.01] p-6 hover:border-[#22c55e]/25 transition-all">
              <div className="h-10 w-10 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 flex items-center justify-center mb-4 glow-green-sm">
                <Award size={18} />
              </div>
              <h3 className="font-display font-black text-xs uppercase text-white tracking-wider mb-2">Calidad Suprema</h3>
              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                Todas las camisetas pasan por un riguroso control de calidad antes del envío oficial.
              </p>
            </div>

            <div className="border border-white/5 bg-white/[0.01] p-6 hover:border-[#22c55e]/25 transition-all">
              <div className="h-10 w-10 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 flex items-center justify-center mb-4 glow-green-sm">
                <Zap size={18} />
              </div>
              <h3 className="font-display font-black text-xs uppercase text-white tracking-wider mb-2">Envío Veloz</h3>
              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                Despachamos tu pedido en menos de 24 horas. Envío gratis en compras superiores a S/ 150.
              </p>
            </div>

            <div className="border border-white/5 bg-white/[0.01] p-6 hover:border-[#22c55e]/25 transition-all">
              <div className="h-10 w-10 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 flex items-center justify-center mb-4 glow-green-sm">
                <Package size={18} />
              </div>
              <h3 className="font-display font-black text-xs uppercase text-white tracking-wider mb-2">Empaque Premium</h3>
              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                Tu polo favorito se entrega en empaques protectores biodegradables de alta gama.
              </p>
            </div>

            <div className="border border-white/5 bg-white/[0.01] p-6 hover:border-[#22c55e]/25 transition-all">
              <div className="h-10 w-10 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 flex items-center justify-center mb-4 glow-green-sm">
                <MapPin size={18} />
              </div>
              <h3 className="font-display font-black text-xs uppercase text-white tracking-wider mb-2">Envíos Seguros</h3>
              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                Llegamos a todo Lima y provincias con agencias confiables y código de rastreo en vivo.
              </p>
            </div>
          </div>
        </div>

        {/* ¿POR QUÉ ELEGIRNOS? LISTADO */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-xl font-display font-black uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-6">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              'Importaciones exclusivas de las mejores fábricas textiles.',
              'Personalización en vivo: nombres y números oficiales.',
              'Precios competitivos para camisetas de alta gama.',
              'Canales de soporte 24/7 vía WhatsApp.',
              'Garantía total de cambios fáciles de talla.',
              'Programa exclusivo de descuentos para socios VIP.'
            ].map((text, idx) => (
              <div key={idx} className="border border-white/5 bg-white/[0.01] p-5 flex items-start gap-3">
                <div className="h-5 w-5 shrink-0 bg-[#22c55e] text-black font-black flex items-center justify-center rounded-none text-2xs glow-green-sm">
                  ✓
                </div>
                <p className="text-xs font-semibold text-gray-300 leading-normal">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COUNTERS */}
        <div className="grid grid-cols-3 gap-6 mb-16 text-center animate-fade-in-up">
          <div className="border border-white/5 bg-white/[0.01] py-8">
            <p className="text-3xl md:text-5xl font-display font-black text-[#22c55e] glow-text-green">15K+</p>
            <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-gray-500">Socios Felices</p>
          </div>
          <div className="border border-white/5 bg-white/[0.01] py-8">
            <p className="text-3xl md:text-5xl font-display font-black text-[#22c55e] glow-text-green">800+</p>
            <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-gray-500">Modelos Lanzados</p>
          </div>
          <div className="border border-white/5 bg-white/[0.01] py-8">
            <p className="text-3xl md:text-5xl font-display font-black text-[#22c55e] glow-text-green">24/7</p>
            <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-gray-500">Soporte Online</p>
          </div>
        </div>

        {/* DATOS DE CONTACTO (GLASS PANEL) */}
        <div className="glass-panel border border-white/10 p-8 sm:p-10 shadow-2xl animate-fade-in-up">
          <h2 className="text-lg font-display font-black uppercase tracking-wider text-white border-b border-white/5 pb-3 mb-6">
            Datos de la Empresa
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-xs font-semibold">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold">CORREO DE VENTAS</p>
              <p className="mt-2 text-sm font-bold text-white">ventas@andrewcamisetas.com</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold">NÚMERO WHATSAPP</p>
              <p className="mt-2 text-sm font-bold text-white">+51 934 353 097</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest font-extrabold">OFICINA CENTRAL</p>
              <p className="mt-2 text-sm font-bold text-white">San Isidro, Lima, Perú</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
