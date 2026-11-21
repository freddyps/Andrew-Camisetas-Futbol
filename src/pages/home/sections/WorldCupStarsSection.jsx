import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * WorldCupStarsSection: Sección de Estrellas del Mundial 2026
 * Adaptada a la estética oscura de élite de Andrew Camisetas:
 * - Fondo negro deportivo puro con acentos de color institucional (#22c55e).
 * - Encabezado limpio con badge verde y tipografía compacta profesional.
 * - Tarjetas con fotos de dorsales icónicos en perspectiva, número y nombre iluminado,
 *   efecto hover interactivo con brillo neón y botón de acción directa.
 */
export default function WorldCupStarsSection({ onSelectPlayer = () => {} }) {
  const stars = [
    {
      id: 'ronaldo',
      name: 'C. Ronaldo',
      number: '7',
      team: 'Portugal',
      image: '/stars/ronaldo.webp',
      color: '#ef4444',
      badge: 'THE GOAT 7',
    },
    {
      id: 'mbappe',
      name: 'K. Mbappé',
      number: '10',
      team: 'Francia',
      image: '/stars/mbappe.webp',
      color: '#3b82f6',
      badge: 'CAPITÁN 10',
    },
    {
      id: 'messi',
      name: 'L. Messi',
      number: '10',
      team: 'Argentina',
      image: '/stars/messi.webp',
      color: '#06b6d4',
      badge: 'CAMPEÓN 10',
    },
    {
      id: 'vinicius',
      name: 'Vini Jr',
      number: '7',
      team: 'Brasil',
      image: '/stars/vinicius.webp',
      color: '#eab308',
      badge: 'JOGA BONITO',
    },
  ];

  return (
    <section id="world-cup-stars" className="relative w-full bg-[#0a0a0a] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-10 xl:px-12 select-none border-0 overflow-hidden">
      
      {/* Luz ambiental sutil en verde de la marca */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#22c55e]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-[1720px] mx-auto relative z-10">
        
        {/* ========================================================================= */}
        {/* CABECERA DE LA SECCIÓN */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#22c55e]/15 border border-[#22c55e]/40 px-3.5 py-1 rounded-full mb-3">
              <Sparkles size={14} className="text-[#22c55e]" />
              <span className="font-['Montserrat',sans-serif] font-bold text-[11px] uppercase tracking-wider text-[#22c55e]">
                EDICIÓN ESPECIAL MUNDIALISTA
              </span>
            </div>
            <h2 className="font-['Montserrat',sans-serif] font-black text-[clamp(1.75rem,4.5vw,3rem)] uppercase tracking-tight text-white leading-none">
              ESTRELLAS DEL <br />
              <span className="text-[#22c55e]">MUNDIAL 2026</span>
            </h2>
          </div>

          <p className="font-['Montserrat',sans-serif] text-gray-300 text-sm sm:text-base leading-relaxed max-w-md font-normal md:text-right">
            Viste como los cracks que brillarán en la máxima cita del fútbol internacional. Indumentaria oficial con estampado de dorsal y sellos conmemorativos.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* GRILLA DE TARJETAS DE LOS CRACKS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {stars.map((star) => (
            <div
              key={star.id}
              onClick={() => onSelectPlayer(star)}
              className="group relative bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 hover:border-[#22c55e]/60 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-[0_16px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(34,197,94,0.25)] flex flex-col"
            >
              {/* Imagen del dorsal con iluminación de estadio */}
              <div className="relative aspect-square w-full overflow-hidden bg-black">
                <img
                  src={star.image}
                  alt={`${star.name} dorsal ${star.number}`}
                  className="w-full h-full object-cover filter contrast-110 brightness-100 group-hover:scale-110 group-hover:brightness-110 transition-all duration-700"
                />
                
                {/* Degradado inferior para resaltar texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30"></div>

                {/* Badge flotante de dorsal */}
                <div className="player-badge-tag absolute top-4 left-4 bg-black/90 backdrop-blur-md border border-[#22c55e]/60 group-hover:border-[#22c55e] px-3 py-1 rounded-md transition-colors shadow-lg shadow-black/80">
                  <span className="font-['Montserrat',sans-serif] font-black text-[11px] uppercase tracking-wider text-white !text-white keep-white group-hover:text-[#22c55e] group-hover:!text-[#22c55e]">
                    {star.badge}
                  </span>
                </div>

                {/* Número gigante sutil en la esquina */}
                <span className="absolute bottom-3 right-4 font-['Montserrat',sans-serif] font-black text-5xl text-white/15 group-hover:text-white/30 transition-colors pointer-events-none">
                  #{star.number}
                </span>
              </div>

              {/* Información del jugador */}
              <div className="p-5 flex items-center justify-between bg-[#0d0d0d] border-t border-white/5">
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {star.team}
                  </span>
                  <h3 className="font-['Montserrat',sans-serif] font-black text-xl uppercase tracking-normal text-white group-hover:text-[#22c55e] transition-colors mt-0.5">
                    {star.name}
                  </h3>
                </div>

                {/* Botón circular de flecha */}
                <div className="star-arrow-btn w-10 h-10 rounded-full bg-white/5 border border-white/10 group-hover:bg-[#22c55e] group-hover:border-[#22c55e] flex items-center justify-center text-white group-hover:text-black transition-all shadow-md shrink-0">
                  <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
