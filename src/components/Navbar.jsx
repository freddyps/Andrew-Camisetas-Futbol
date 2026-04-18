import { Search, User, ShoppingCart } from 'lucide-react';

export default function Navbar({ pagina, navigateTo, cartCount, toggleCart }) {
  const linkClass = (color) =>
    `text-base font-black uppercase tracking-[0.18em] transition-colors ${color}`;

  return (
    <nav className="flex flex-wrap justify-between items-center px-6 md:px-10 py-5 bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="bg-[#22c55e] text-black font-black px-3 py-2 rounded-none text-xl">AC</div>
        <div>
          <h1 className="text-xl font-black leading-none tracking-tighter">ANDREW</h1>
          <p className="text-[10px] text-[#22c55e] font-bold tracking-[0.2em] uppercase">CAMISETAS DE FÚTBOL</p>
        </div>
      </div>

      <div className="flex-1 hidden md:flex justify-center gap-12">
        <button type="button" onClick={() => navigateTo('home')} className={linkClass('text-[#22c55e]')}>
          Inicio
        </button>
        <button type="button" onClick={() => navigateTo('productos')} className={linkClass('text-white')}>
          Productos
        </button>
        <button type="button" onClick={() => navigateTo('home')} className={linkClass('text-[#22c55e]')}>
          Nosotros
        </button>
      </div>

      <div className="flex gap-6 items-center">
        <Search size={20} className="cursor-pointer text-white hover:text-[#22c55e] transition-colors" />
        <User size={20} className="cursor-pointer text-white hover:text-[#22c55e] transition-colors" />
        <button type="button" onClick={toggleCart} className="relative text-white hover:text-[#22c55e] transition-colors">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#22c55e] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-none">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
