import React, { useState } from 'react';
import { Search, User, ShoppingCart, Heart, Menu, X, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Navbar({ navigateTo, cartCount, toggleCart, wishlistCount, toggleWishlist, theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user, products } = useAppContext();

  const suggestions = searchTerm.trim() 
    ? (products || []).filter(item => 
        item.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.liga.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  // Clase premium para los links del menú
  const linkClass = (active) =>
    `font-display text-sm font-extrabold uppercase tracking-[0.18em] transition-all duration-300 relative py-1 hover:text-[#22c55e] ${
      active 
        ? 'text-[#22c55e] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#22c55e] after:shadow-[0_0_8px_#22c55e]' 
        : 'text-white after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#22c55e] hover:after:w-full after:transition-all after:duration-300'
    }`;

  const hash = window.location.hash.slice(1);
  const isHome = !hash || hash === 'home';
  const isProducts = hash === 'productos' || hash.startsWith('producto/');
  const isAbout = hash === 'nosotros';

  return (
    <nav className="sticky top-0 z-50 px-6 md:px-12 py-5 bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO DE LUJO */}
        <button 
          onClick={() => navigateTo('home')}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
        >
          <img 
            src="/logo_andrew_v2.jpg" 
            alt="Andrew Logo" 
            className="h-11 w-11 object-cover rounded-lg transition-all duration-300 group-hover:scale-105 border border-white/10 glow-green-sm"
          />
          <div>
            <h1 className="text-xl font-display font-black leading-none tracking-tighter text-white group-hover:text-[#22c55e] transition-colors">
              ANDREW
            </h1>
            <p className="text-xs text-[#22c55e] font-bold tracking-[0.25em] uppercase glow-text-green">
              CAMISETAS DE FÚTBOL
            </p>
          </div>
        </button>


        {/* MENÚ DE NAVEGACIÓN DESKTOP */}
        <div className="hidden md:flex items-center gap-10">
          <button 
            type="button" 
            onClick={() => navigateTo('home')} 
            className={linkClass(isHome)}
          >
            Inicio
          </button>
          <button 
            type="button" 
            onClick={() => navigateTo('productos')} 
            className={linkClass(isProducts)}
          >
            Productos
          </button>
          <button 
            type="button" 
            onClick={() => navigateTo('nosotros')} 
            className={linkClass(isAbout)}
          >
            Nosotros
          </button>
        </div>

        {/* ICONOS DE ACCIÓN */}
        <div className="flex gap-4 sm:gap-5 items-center">
          {/* Autocomplete Search for Desktop */}
          <div className="relative hidden sm:block">
            <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5 focus-within:border-[#22c55e] transition-all">
              <input
                type="text"
                placeholder="Buscar camiseta..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="bg-transparent text-[11px] font-semibold focus:outline-none w-28 focus:w-40 transition-all text-white placeholder-gray-500"
              />
              <Search size={14} className="text-gray-400" />
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
                <div className="p-2 border-b border-white/5 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-display">
                  Sugerencias
                </div>
                <div className="divide-y divide-white/5">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setShowSuggestions(false);
                        window.location.hash = `producto/${item.id}`;
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-[#22c55e]/10 text-left transition-colors"
                    >
                      <img src={item.image} alt={item.equipo} className="w-8 h-8 object-cover rounded bg-white/5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-white block truncate">{item.equipo}</span>
                        <span className="text-[9px] text-gray-400 block truncate">{item.liga}</span>
                      </div>
                      <span className="text-[10px] font-black text-[#22c55e] shrink-0">S/ {parseFloat(item.precio).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simple Search Button for Mobile */}
          <button
            type="button"
            onClick={() => navigateTo('buscar')}
            className="sm:hidden text-gray-300 hover:text-[#22c55e] transition-all hover:scale-110"
            title="Buscar productos"
          >
            <Search size={20} />
          </button>

          {/* Botón Favoritos (Wishlist) */}
          <button
            type="button"
            onClick={toggleWishlist}
            className="relative text-gray-300 hover:text-red-500 transition-all hover:scale-110"
            title="Ver favoritos"
          >
            <Heart size={20} className={wishlistCount > 0 ? "fill-red-500 text-red-500 animate-pulse-glow" : ""} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-black w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Botón Carrito */}
          <button 
            type="button" 
            onClick={toggleCart} 
            className="relative text-gray-300 hover:text-[#22c55e] transition-all hover:scale-110"
            title="Ver carrito"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#22c55e] text-black text-xs font-black w-4 h-4 flex items-center justify-center rounded-full shadow-md glow-green-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Botón Cambiar Tema */}
          <button
            type="button"
            onClick={toggleTheme}
            className="text-gray-300 hover:text-[#22c55e] transition-all hover:scale-110"
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
            aria-label="Cambiar tema de color"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Línea divisoria elegante */}
          <span className="h-5 w-[1px] bg-white/10 hidden sm:inline-block"></span>

          {/* Botón Perfil de Usuario */}
          <button 
            type="button" 
            onClick={() => navigateTo('perfil')} 
            className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-[#22c55e] transition-all"
            title={user ? `Ver perfil de ${user.name}` : 'Iniciar sesión / Registrarse'}
          >
            <User size={20} />
            <span className="text-[10px] font-display font-extrabold uppercase tracking-[0.15em]">
              {user ? `Hola, ${user.name.split(' ')[0]}` : 'Ingresar'}
            </span>
          </button>

          {/* Menú de Hamburguesa para Móvil */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white hover:text-[#22c55e] transition-all"
            aria-label="Abrir menú de navegación"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-white/5 bg-black/95 px-6 py-6 md:hidden animate-fade-in-up">
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigateTo('home');
              }}
              className={`w-full text-left font-display font-black uppercase tracking-[0.15em] text-sm py-2 ${isHome ? 'text-[#22c55e]' : 'text-white'}`}
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigateTo('productos');
              }}
              className={`w-full text-left font-display font-black uppercase tracking-[0.15em] text-sm py-2 ${isProducts ? 'text-[#22c55e]' : 'text-white'}`}
            >
              Productos
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigateTo('nosotros');
              }}
              className={`w-full text-left font-display font-black uppercase tracking-[0.15em] text-sm py-2 ${isAbout ? 'text-[#22c55e]' : 'text-white'}`}
            >
              Nosotros
            </button>
            <hr className="border-white/5 my-2" />
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigateTo('perfil');
              }}
              className="w-full text-left font-display font-black uppercase tracking-[0.15em] text-sm py-2 text-gray-300 hover:text-[#22c55e]"
            >
              {user ? `Mi Perfil (${user.name})` : 'Iniciar Sesión'}
            </button>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
              }}
              className="w-full text-left font-display font-black uppercase tracking-[0.15em] text-sm py-2 text-gray-300 hover:text-[#22c55e] flex items-center gap-2"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>Tema: {theme === 'light' ? 'Oscuro' : 'Claro'}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
