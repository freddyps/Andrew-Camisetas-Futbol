import React from 'react';
import { Search, User, ShoppingCart, ArrowRight } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#22c55e] selection:text-black">
      
      {/* 1. NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-[#22c55e] text-black font-black p-2 rounded-sm text-xl">AC</div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tighter">ANDREW</h1>
            <p className="text-[10px] text-[#22c55e] font-bold tracking-widest uppercase">Camisetas de Fútbol</p>
          </div>
        </div>

        <div className="hidden md:flex gap-10 text-[12px] font-bold uppercase tracking-[0.2em]">
          <a href="#" className="text-[#22c55e]">Inicio</a>
          <a href="#" className="hover:text-[#22c55e] transition-colors">Productos</a>
          <a href="#" className="hover:text-[#22c55e] transition-colors">Nosotros</a>
        </div>

        <div className="flex gap-6 items-center">
          <Search size={18} className="cursor-pointer hover:text-[#22c55e] transition-colors" />
          <User size={18} className="cursor-pointer hover:text-[#22c55e] transition-colors" />
          <div className="relative cursor-pointer group">
            <ShoppingCart size={18} className="group-hover:text-[#22c55e] transition-colors" />
            <span className="absolute -top-2 -right-2 bg-[#22c55e] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </div>
        </div>
      </nav>

      {/* 2. SECCIÓN HERO */}
      <header className="relative h-[90vh] flex items-center px-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://unsplash.com" 
            className="w-full h-full object-cover brightness-[0.4]" 
            alt="Fondo futbolistas"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#22c55e]/20 border border-[#22c55e]/30 px-4 py-1.5 rounded-full text-[#22c55e] text-[10px] font-black mb-8 tracking-widest uppercase">
            <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></span>
            TEMPORADA 2024/25
          </div>
          
          <h2 className="text-[100px] font-black leading-[0.85] uppercase mb-8 tracking-tighter">
            LA PASIÓN <br /> 
            <span className="text-[#22c55e]">EN TU PIEL</span>
          </h2>
          
          <p className="text-gray-200 text-lg mb-12 max-w-md leading-tight opacity-90">
            Las mejores camisetas de los equipos más grandes del mundo. Calidad premium, diseños auténticos.
          </p>

          <button className="bg-[#22c55e] text-black font-black px-10 py-4 rounded-sm hover:bg-white transition-all flex items-center gap-3 uppercase text-sm tracking-tighter">
            Reservar Ahora <ArrowRight size={18} />
          </button>

            {/* ESTADÍSTICAS CON LÍNEAS SEPARADORAS GRUESAS */}
        <div className="mt-16 flex items-center gap-12">
  
              {/* Bloque 1 */}
        <div className="flex items-center gap-4">
          <div className="bg-[#22c55e] w-[4px] h-12"></div> {/* Línea Verde */}
          <div>
            <p className="text-4xl font-black leading-none">500+</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Productos</p>
          </div>
        </div>

        {/* Bloque 2 */}
        <div className="flex items-center gap-4">
          <div className="bg-[#22c55e] w-[4px] h-12"></div> {/* Línea Verde */}
          <div>
            <p className="text-4xl font-black leading-none">100%</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Auténticas</p>
          </div>
        </div>

        {/* Bloque 3 */}
        <div className="flex items-center gap-4">
          <div className="bg-[#22c55e] w-[4px] h-12"></div> {/* Línea Verde */}
          <div>
            <p className="text-4xl font-black leading-none">24/7</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Envío Rápido</p>
          </div>
         </div>
          </div>
          </div>
        </header>

            {/* SECCIÓN DE PRODUCTOS CON AJUSTES DE GROSOR Y LÍNEAS */}
      <section className="bg-white text-black py-20 px-10">
        {/* Encabezado con letras más notables */}
        <div className="text-center mb-16">
          <p className="text-[#22c55e] font-black text-[12px] uppercase tracking-[0.4em] mb-4">
            Colección 2024/25
          </p>
          <h3 className="text-6xl font-black uppercase tracking-tighter mb-4 leading-none">
            Camisetas más populares
          </h3>
          <p className="text-gray-500 max-w-xl mx-auto text-[13px] font-medium leading-relaxed">
            Descubre nuestra selección de las camisetas más buscadas de la temporada. <br />
            Autenticidad garantizada.
          </p>
        </div>

        {/* Contenedor de Filtros con Línea Verde Gruesa */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-[#22c55e] w-[4px] h-6"></div> {/* Línea verde más notable */}
            <h4 className="font-black uppercase text-sm tracking-[0.2em]">Categorías</h4>
          </div>
          
          <div className="flex gap-4">
            <button className="px-10 py-3 border-2 border-black text-[11px] font-black uppercase bg-black text-white transition-all shadow-lg shadow-black/10">
              Local
            </button>
            <button className="px-10 py-3 border-2 border-gray-100 text-[11px] font-black uppercase text-gray-400 hover:border-black hover:text-black transition-all">
              Visitante
            </button>
            <button className="px-10 py-3 border-2 border-gray-100 text-[11px] font-black uppercase text-gray-400 hover:border-black hover:text-black transition-all">
              Tercera
            </button>
          </div>
        </div>

    {/* Grid de Camisetas */}
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div className="group cursor-pointer">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 shadow-sm group-hover:shadow-xl transition-all">
          <img 
            src="TU_IMAGEN_AQUI" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt="Camiseta"
          />
          {/* Badge más notable */}
          <div className="absolute top-0 left-0 bg-black text-white text-[9px] font-black px-4 py-2 uppercase tracking-widest">
            Best Seller
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Premier League</p>
          <h5 className="font-black text-xl uppercase tracking-tighter leading-none mb-1">Manchester United</h5>
          <p className="text-gray-400 text-[11px] font-medium mb-5">Camiseta Local 2024/25</p>
          
          <div className="flex justify-between items-center border-t-2 border-gray-50 pt-5 mt-4">
            <span className="font-black text-2xl tracking-tighter text-black">S/ 89.90</span>
            <button className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase flex items-center gap-2 hover:bg-[#22c55e] hover:text-black transition-all transform active:scale-95">
              Añadir <ShoppingCart size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
      {/* Repite para las demás tarjetas */}
    </div>
  </section>

          {/* SECCIÓN SOBRE NOSOTROS */}
  <section className="bg-black text-white py-32 px-10 border-t border-white/5">
    <div className="max-w-4xl mx-auto text-center mb-20">
      <h3 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
        Sobre <span className="text-[#22c55e]">Andrew Camisetas</span> <br /> de Fútbol
      </h3>
      <p className="text-gray-400 text-[13px] font-medium leading-relaxed max-w-2xl mx-auto opacity-80">
        Somos tu tienda de confianza para camisetas de fútbol auténticas. Desde 2020, hemos entregado más de 10,000 
        camisetas a fanáticos apasionados como tú. Trabajamos directamente con proveedores oficiales para garantizar 
        la autenticidad y calidad de cada producto.
      </p>
    </div>

    {/* Cuadros de Beneficios (Métricas con bordes verdes) */}
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="border-2 border-[#22c55e]/30 bg-[#22c55e]/5 p-12 text-center rounded-sm group hover:border-[#22c55e] transition-all duration-500">
        <p className="text-5xl font-black text-[#22c55e] mb-2 tracking-tighter">100%</p>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Auténticas</p>
      </div>

      <div className="border-2 border-[#22c55e]/30 bg-[#22c55e]/5 p-12 text-center rounded-sm group hover:border-[#22c55e] transition-all duration-500">
        <p className="text-5xl font-black text-[#22c55e] mb-2 tracking-tighter">24h</p>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Envío Express</p>
      </div>

      <div className="border-2 border-[#22c55e]/30 bg-[#22c55e]/5 p-12 text-center rounded-sm group hover:border-[#22c55e] transition-all duration-500">
        <p className="text-5xl font-black text-[#22c55e] mb-2 tracking-tighter">10K+</p>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Clientes Felices</p>
      </div>
    </div>
    </section>

      {/* FOOTER INSTITUCIONAL */}
      <footer className="bg-black py-12 px-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#22c55e] text-black px-2 py-1 rounded-sm text-[13px] font-black">AC</div>
          <div className="text-left border-l border-white/10 pl-4">
              <p className="text-white text-[12px] font-black uppercase tracking-tighter">Andrew Camisetas de Fútbol</p>
              <p className="text-[#22c55e] text-[9px] font-black uppercase tracking-widest">La pasión en tu piel</p>
          </div>
        </div>
        
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
          © 2026 Andrew Camisetas de Fútbol. Todos los derechos reservados.
        </p>
        
        <div className="flex gap-8 text-gray-500 text-[10px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
        </div>
      </footer>
            </div>
          );
        }

        export default App;
