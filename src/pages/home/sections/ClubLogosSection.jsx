import React from 'react';

/**
 * ClubLogosSection: Sección de equipos oficiales con logos reales en formato .webp
 * Con soporte de alto contraste en Modo Oscuro y Modo Claro.
 */
export default function ClubLogosSection({ onSelectClub = () => {} }) {
  const clubs = [
    {
      id: 'real-madrid',
      name: 'Real Madrid',
      league: 'La Liga',
      logo: '/clubs/real-madrid.webp'
    },
    {
      id: 'barcelona',
      name: 'FC Barcelona',
      league: 'La Liga',
      logo: '/clubs/barcelona.webp'
    },
    {
      id: 'manchester-city',
      name: 'Manchester City',
      league: 'Premier League',
      logo: '/clubs/manchester-city.webp'
    },
    {
      id: 'chelsea',
      name: 'Chelsea FC',
      league: 'Premier League',
      logo: '/clubs/chelsea.webp'
    },
    {
      id: 'psg',
      name: 'Paris Saint-Germain',
      league: 'Ligue 1',
      logo: '/clubs/psg.webp'
    },
    {
      id: 'peru',
      name: 'Selección Peruana',
      league: 'Selecciones',
      logo: '/clubs/peru.webp'
    },
    {
      id: 'arsenal',
      name: 'Arsenal FC',
      league: 'Premier League',
      logo: '/clubs/arsenal.webp'
    },
    {
      id: 'liverpool',
      name: 'Liverpool FC',
      league: 'Premier League',
      logo: '/clubs/liverpool.webp'
    },
    {
      id: 'inter-milan',
      name: 'Inter de Milán',
      league: 'Serie A',
      logo: '/clubs/inter-milan.webp'
    },
    {
      id: 'juventus',
      name: 'Juventus',
      league: 'Serie A',
      logo: '/clubs/juventus.webp'
    }
  ];

  const doubleClubs = [...clubs, ...clubs];

  return (
    <section id="featured-clubs" className="relative w-full bg-surface-card text-txt-main py-14 sm:py-16 overflow-hidden select-none border-t border-b border-stroke transition-colors">

      {/* Cabecera de la sección */}
      <div className="relative z-10 text-center space-y-2.5 mb-8 px-4">
        <div className="inline-flex items-center gap-2 bg-[#22c55e]/15 border border-[#22c55e]/40 px-3.5 py-1 rounded-full text-[#22c55e]">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
          <span className="font-['Montserrat',sans-serif] font-bold text-[11px] uppercase tracking-wider text-[#22c55e]">
            EQUIPACIONES OFICIALES
          </span>
        </div>
        <h2 className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-4xl uppercase tracking-tight text-txt-main">
          CLUBES DESTACADOS
        </h2>
        <p className="text-txt-muted text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed">
          Haz clic en tu equipo favorito para explorar sus camisetas oficiales en el catálogo.
        </p>
      </div>

      {/* Marquesina Infinita */}
      <div className="relative z-10 w-full overflow-hidden">
        <div className="animate-marquee-left flex items-center gap-12 sm:gap-16 py-4">
          {doubleClubs.map((club, index) => (
            <button
              key={`${club.id}-${index}`}
              type="button"
              onClick={() => onSelectClub(club.name)}
              className="flex flex-col items-center justify-center min-w-[130px] sm:min-w-[150px] text-txt-muted hover:text-[#22c55e] transition-all duration-300 group cursor-pointer hover:scale-110 active:scale-95 shrink-0"
              title={`Ver camisetas de ${club.name}`}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-all duration-300">
                <img 
                  src={club.logo} 
                  alt={club.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <span className="font-['Montserrat',sans-serif] font-extrabold text-xs uppercase tracking-wider mt-3 text-txt-main group-hover:text-[#22c55e] transition-colors whitespace-nowrap">
                {club.name}
              </span>
              
              <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted group-hover:text-[#22c55e] transition-colors whitespace-nowrap">
                {club.league}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
