import React, { useState } from 'react';
import { Search, User, ShoppingCart, ArrowRight } from 'lucide-react';

function App() {
  const [pagina, setPagina] = useState('home');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#22c55e] selection:text-black">
      
      {/* 1. NAVBAR */}
      <nav className="flex flex-wrap justify-between items-center px-6 md:px-10 py-5 bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-[#22c55e] text-black font-black px-3 py-2 rounded-sm text-xl">AC</div>
          <div>
            <h1 className="text-xl font-bold leading-none tracking-tighter">ANDREW</h1>
            <p className="text-[10px] text-[#22c55e] font-bold tracking-widest uppercase">CAMISETAS DE FÚTBOL</p>
          </div>
        </div>

        <div className="flex-1 hidden md:flex justify-center gap-12 text-[12px] font-black uppercase tracking-[0.2em]">
          <a href="#" className="text-[#22c55e]">Inicio</a>
          <a href="#" className="text-white hover:text-[#22c55e] transition-colors">Productos</a>
          <a href="#" className="text-white hover:text-[#22c55e] transition-colors">Nosotros</a>
        </div>

        <div className="flex gap-6 items-center">
          <Search size={20} className="cursor-pointer text-white hover:text-[#22c55e] transition-colors" />
          <User size={20} className="cursor-pointer text-white hover:text-[#22c55e] transition-colors" />
          <div className="relative cursor-pointer group">
            <ShoppingCart size={20} className="text-white group-hover:text-[#22c55e] transition-colors" />
            <span className="absolute -top-2 -right-2 bg-[#22c55e] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </div>
        </div>
      </nav>

      {/* 2. SECCIÓN HERO */}
      <header className="relative min-h-screen flex items-start justify-start px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1500&q=80" 
            className="w-full h-full object-cover brightness-[0.35]"
            alt="Fondo futbolistas"
          />
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/10 to-transparent"></div>
        </div>

        {/* CONTENIDO HERO CON AJUSTES DE COLOR Y ESPACIO */}
        <div className="relative z-10 max-w-3xl px-4 sm:px-0 pt-24 pb-24 sm:pt-32 sm:pb-32"> {/* espaciado adaptativo */}
          <div className="inline-flex items-center gap-2 bg-[#22c55e]/15 border border-[#22c55e]/50 px-5 py-2 rounded-full text-[#22c55e] text-[11px] font-black mb-8 tracking-[0.35em] uppercase">
            <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></span>
            TEMPORADA 2024/25
          </div>
          
          <h2 className="text-4x0 sm:text-[5.5rem] md:text-[6rem] font-black uppercase mb-7 tracking-tight leading-[0.95]">
            LA PASIÓN <br />
            <span className="text-[#22c55e]">EN TU PIEL</span>
          </h2>
          
          <p className="text-white/90 text-base sm:text-lg md:text-[20px] mb-12 max-w-xl leading-relaxed font-medium">
            Las mejores camisetas de los equipos más grandes del mundo. Calidad premium, diseños auténticos.
          </p>

          {/* Botón con texto BLANCO */}
          <button onClick={() => setPagina('productos')} className="bg-[#22c55e] text-white font-black px-12 py-4 rounded-[1rem] hover:bg-[#1fa75d] transition-all inline-flex items-center justify-center gap-3 uppercase text-sm tracking-[0.2em] shadow-2xl shadow-[#22c55e]/30">
            Reservar Ahora <ArrowRight size={18} />
          </button>

            {/* ESTADÍSTICAS CON LÍNEAS SEPARADORAS GRUESAS */}
        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-10">
              {/* Bloque 1 */}
        <div className="flex items-start gap-4">
          <div className="bg-[#22c55e] w-[3px] h-16 rounded-full mt-1"></div>
          <div>
            <p className="text-4xl md:text-5xl font-black leading-none text-white">500+</p>
            <p className="text-[11px] md:text-sm text-gray-300 font-bold uppercase tracking-[0.3em] mt-2">Productos</p>
          </div>
        </div>

        {/* Bloque 2 */}
        <div className="flex items-start gap-4">
          <div className="bg-[#22c55e] w-[3px] h-16 rounded-full mt-1"></div>
          <div>
            <p className="text-4xl md:text-5xl font-black leading-none text-white">100%</p>
            <p className="text-[11px] md:text-sm text-gray-300 font-bold uppercase tracking-[0.3em] mt-2">Auténticas</p>
          </div>
        </div>

        {/* Bloque 3 */}
        <div className="flex items-start gap-4">
          <div className="bg-[#22c55e] w-[3px] h-16 rounded-full mt-1"></div>
          <div>
            <p className="text-4xl md:text-5xl font-black leading-none text-white">24/7</p>
            <p className="text-[11px] md:text-sm text-gray-300 font-bold uppercase tracking-[0.3em] mt-2">Envío Rápido</p>
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
          
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <button className="w-full sm:w-auto px-6 md:px-10 py-3 border-2 border-black text-[11px] font-black uppercase bg-black text-white transition-all shadow-lg shadow-black/10">
              Local
            </button>
            <button className="w-full sm:w-auto px-6 md:px-10 py-3 border-2 border-gray-100 text-[11px] font-black uppercase text-gray-400 hover:border-black hover:text-black transition-all">
              Visitante
            </button>
            <button className="w-full sm:w-auto px-6 md:px-10 py-3 border-2 border-gray-100 text-[11px] font-black uppercase text-gray-400 hover:border-black hover:text-black transition-all">
              Tercera
            </button>
          </div>
        </div>

    {/* Grid de Camisetas */}
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* INICIO DEL GENERADOR DINÁMICO */}
        {[
          { id: 1, equipo: "Manchester United", precio: "89.90", liga: "Premier League" },
          { id: 2, equipo: "Real Madrid", precio: "94.99", liga: "La Liga" },
          { id: 3, equipo: "FC Barcelona", precio: "94.99", liga: "La Liga" },
          { id: 4, equipo: "Chelsea FC", precio: "89.99", liga: "Premier League" }
        ].map((item) => (
          <div key={item.id} className="group border border-gray-100 p-2 hover:shadow-xl transition-all duration-500">
            <div className="relative aspect-[3/4] bg-gray-100 mb-6 overflow-hidden">
              <div className="absolute top-0 left-0 bg-black text-white text-[9px] font-black px-4 py-2 uppercase z-10">Best Seller</div>
              <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase text-[10px]">FOTO PRODUCTO</div>
            </div>
            
            <div className="space-y-1 text-left px-2">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{item.liga}</p>
              <h5 className="font-black text-xl uppercase tracking-tighter leading-none mb-1 text-black">{item.equipo}</h5>
              <p className="text-gray-400 text-[11px] font-medium mb-5">Camiseta Local 2024/25</p>
              
              <div className="flex justify-between items-center border-t-2 border-gray-50 pt-5 mt-4">
                <span className="font-black text-2xl tracking-tighter text-black">S/ {item.precio}</span>
                <button className="bg-black text-white px-5 py-3 text-[10px] font-black uppercase flex items-center gap-2 hover:bg-[#22c55e] hover:text-black transition-all">
                  Añadir <ShoppingCart size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* BOTÓN VER TODOS LOS PRODUCTOS CENTRADO */}
        <div className="col-span-full w-full flex justify-center mt-16 mb-10">
          <button 
            onClick={() => setPagina('productos')}
            className="bg-black text-white px-16 py-5 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#22c55e] hover:text-black transition-all duration-300 shadow-xl"
          >
            Ver todos los productos
          </button>
        </div>
    </div>
  </section>

              {/* SECCIÓN SOBRE NOSOTROS */}
      <section className="bg-black text-white py-24 px-6 md:px-10 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h3 className="font-black uppercase tracking-tighter text-center leading-[1] mb-8">
      {/* Primera línea: Tamaño reducido y elegante */}
      <span className="text-3xl md:text-5xl block">
        <span className="text-white">SOBRE</span>{' '}
        <span className="text-[#22c55e]">ANDREW CAMISETAS DE</span>
      </span>
      
      {/* Segunda línea: Mismo tamaño pequeño para mantener la armonía */}
      <span className="text-3xl md:text-5xl text-[#22c55e] block">
        FÚTBOL
      </span>
    </h3>


      <p className="text-gray-300 text-[16px] md:text-[18px] font-medium leading-relaxed max-w-3xl mx-auto opacity-90">
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
          <div className="bg-[#22c55e] text-black px-3 py-2 rounded-sm text-[16px] font-black">AC</div>
          <div className="text-left border-l border-white/10 pl-4">
              <p className="text-white text-[16px] md:text-[18px] font-black uppercase tracking-tighter">Andrew Camisetas de Fútbol</p>
              <p className="text-[#22c55e] text-[12px] md:text-[13px] font-black uppercase tracking-widest">La pasión en tu piel</p>
          </div>
        </div>
        
        <p className="text-gray-400 text-[12px] md:text-[13px] font-bold uppercase tracking-widest">
          © 2026 Andrew Camisetas de Fútbol. Todos los derechos reservados.
        </p>
        
        <div className="flex gap-8 text-gray-400 text-[12px] md:text-[13px] font-black uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
        </div>
      </footer>
            </div>
          );
        }

        export default App;
