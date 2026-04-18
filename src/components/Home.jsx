import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function Home({ products, navigateTo, onViewDetails, addToCart }) {
  return (
    <>
      <header className="relative min-h-screen flex items-start justify-start px-5 md:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.pinimg.com/originals/c6/a8/83/c6a883c8812b4de2c600cd99946623b1.jpg"
            className="w-full h-full object-cover brightness-[0.9] grayscale-[10%]"
            alt="Fondo futbolistas"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-3xl px-4 sm:px-0 pt-16 pb-20 sm:pt-20 sm:pb-24">
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 px-5 py-2 rounded-none text-[#22c55e] text-[13px] font-black mb-8 tracking-[0.08em] uppercase shadow-sm">
            <span className="w-2 h-2 bg-[#22c55e] rounded-none animate-pulse"></span>
            Temporada 2025/26
          </div>

          <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-4">Tienda oficial de camisetas</p>
          <h2 className="text-5xl sm:text-[5.5rem] md:text-[6rem] font-black uppercase mb-7 tracking-tight leading-[0.95]">
            La pasión <br />
            <span className="text-[#22c55e]">en tu piel</span>
          </h2>

          <p className="text-white/85 text-base sm:text-lg md:text-[20px] mb-12 max-w-2xl leading-relaxed font-medium">
            Las mejores camisetas de los equipos más grandes del mundo. Calidad premium, diseños auténticos y entrega segura.
          </p>

          <button onClick={() => navigateTo('productos')} className="bg-[#22c55e] text-black font-black px-14 py-4 rounded-none hover:bg-[#1fa75d] transition-all inline-flex items-center justify-center gap-3 uppercase text-sm tracking-[0.08em] shadow-2xl shadow-[#22c55e]/20">
            Reservar ahora <ArrowRight size={18} />
          </button>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div className="rounded-none border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
              <p className="text-4xl md:text-5xl font-black leading-none text-white">500+</p>
              <p className="text-xs uppercase tracking-[0.25em] text-white/70 mt-2">Productos</p>
            </div>
            <div className="rounded-none border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
              <p className="text-4xl md:text-5xl font-black leading-none text-white">100%</p>
              <p className="text-xs uppercase tracking-[0.25em] text-white/70 mt-2">Auténticas</p>
            </div>
            <div className="rounded-none border border-white/10 bg-white/10 p-8 backdrop-blur-sm">
              <p className="text-4xl md:text-5xl font-black leading-none text-white">24/7</p>
              <p className="text-xs uppercase tracking-[0.25em] text-white/70 mt-2">Envío rápido</p>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white text-black py-20 px-10">
        <div className="text-center mb-12">
          <p className="text-[#22c55e] font-black text-[14px] uppercase tracking-[0.05em] mb-4">
            Colección 2025/26
          </p>
          <h3 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
            Camisetas más populares
          </h3>
          <p className="text-gray-500 max-w-xl mx-auto text-[15px] font-medium leading-relaxed">
            Descubre nuestros polos destacados de la temporada. Calidad premium y diseños auténticos.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((item) => (
            <ProductCard key={item.id} item={item} onViewDetails={onViewDetails} addToCart={addToCart} />
          ))}
        </div>

        <div className="max-w-7xl mx-auto flex justify-center mt-16">
          <button
            onClick={() => navigateTo('productos')}
            className="bg-black text-white px-14 py-5 text-[13px] font-black uppercase tracking-[0.05em] hover:bg-[#22c55e] hover:text-black transition-all duration-300 shadow-xl"
          >
            Ver todos los productos
          </button>
        </div>
      </section>

      <section className="bg-black text-white py-24 px-6 md:px-10 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h3 className="font-black uppercase tracking-tighter text-center leading-[1] mb-8">
            <span className="text-3xl md:text-5xl block">
              <span className="text-white">SOBRE</span>{' '}
              <span className="text-[#22c55e]">ANDREW CAMISETAS DE</span>
            </span>
            <span className="text-3xl md:text-5xl text-[#22c55e] block">FÚTBOL</span>
          </h3>

          <p className="text-gray-300 text-[16px] md:text-[18px] font-medium leading-relaxed max-w-3xl mx-auto opacity-90">
            Somos tu tienda de confianza para camisetas de fútbol auténticas. Desde 2020, hemos entregado más de 10,000 camisetas a fanáticos apasionados como tú. Trabajamos directamente con proveedores oficiales para garantizar la autenticidad y calidad de cada producto.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-2 border-[#22c55e]/30 bg-[#22c55e]/5 p-12 text-center rounded-none group hover:border-[#22c55e] transition-all duration-500">
            <p className="text-5xl font-black text-[#22c55e] mb-2 tracking-tighter">100%</p>
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-500">Auténticas</p>
          </div>

          <div className="border-2 border-[#22c55e]/30 bg-[#22c55e]/5 p-12 text-center rounded-none group hover:border-[#22c55e] transition-all duration-500">
            <p className="text-5xl font-black text-[#22c55e] mb-2 tracking-tighter">24h</p>
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-500">Envío Express</p>
          </div>

          <div className="border-2 border-[#22c55e]/30 bg-[#22c55e]/5 p-12 text-center rounded-none group hover:border-[#22c55e] transition-all duration-500">
            <p className="text-5xl font-black text-[#22c55e] mb-2 tracking-tighter">10K+</p>
            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-500">Clientes Felices</p>
          </div>
        </div>
      </section>
    </>
  );
}
