import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// COMPONENTE: Navbar (Barra de navegación superior)
// Descripción: Barra de navegación fija en la parte superior con logo, menú,
//              búsqueda, perfil y carrito
// Props:
//   - pagina: página actual activa
//   - navigateTo: función para navegar a diferentes páginas
//   - cartCount: cantidad de items en el carrito
//   - toggleCart: función para abrir/cerrar el carrito
// ============================================================================

export default function Navbar({ navigateTo, cartCount, toggleCart }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Clase reutilizable para los links del menú
  const linkClass = (color) =>
    `text-base font-black uppercase tracking-[0.18em] transition-colors ${color}`;

  return (
    // NAVBAR CONTAINER: Barra fija en la parte superior
    <nav className="flex flex-wrap justify-between items-center px-6 md:px-10 py-5 bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
      
      {/* ===== SECCIÓN 1: LOGO Y NOMBRE ===== */}
      <div className="flex items-center gap-3">
        {/* Logo: Cuadrado verde con "AC" */}
        <div className="bg-[#22c55e] text-black font-black px-3 py-2 rounded-none text-xl">AC</div>
        {/* Nombre de la tienda */}
        <div>
          <h1 className="text-xl font-black leading-none tracking-tighter">ANDREW</h1>
          <p className="text-[10px] text-[#22c55e] font-bold tracking-[0.2em] uppercase">CAMISETAS DE FÚTBOL</p>
        </div>
      </div>

      {/* ===== SECCIÓN 2: MENÚ PRINCIPAL (solo visible en pantallas medianas) ===== */}
      <div className="flex-1 hidden md:flex justify-center gap-12">
        {/* Botón: Inicio */}
        <button type="button" onClick={() => navigateTo('home')} className={linkClass('text-[#22c55e]')}>
          Inicio
        </button>
        {/* Botón: Productos */}
        <button type="button" onClick={() => navigateTo('productos')} className={linkClass('text-white')}>
          Productos
        </button>
        {/* Botón: Nosotros */}
        <button type="button" onClick={() => navigateTo('nosotros')} className={linkClass('text-white')}>
          Nosotros
        </button>
      </div>

      {/* ===== SECCIÓN 3: ICONOS DE ACCIÓN (búsqueda, perfil, carrito) ===== */}
      <div className="flex gap-4 items-center">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden text-white hover:text-[#22c55e] transition-colors"
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <button
          type="button"
          onClick={() => {
            setMenuOpen(false);
            navigateTo('productos');
          }}
          className="cursor-pointer text-white hover:text-[#22c55e] transition-colors"
          title="Buscar productos"
        >
          <Search size={20} />
        </button>
        <button 
          type="button" 
          onClick={() => {
            setMenuOpen(false);
            navigateTo('perfil');
          }} 
          className="cursor-pointer text-white hover:text-[#22c55e] transition-colors"
          title="Iniciar sesión o registrarse"
        >
          <User size={20} />
        </button>

        <button 
          type="button" 
          onClick={toggleCart} 
          className="relative text-white hover:text-[#22c55e] transition-colors"
          title="Ver carrito"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#22c55e] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-none">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-white/10 bg-black/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigateTo('home');
              }}
              className="w-full text-left text-white uppercase tracking-[0.18em] font-black hover:text-[#22c55e]"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigateTo('productos');
              }}
              className="w-full text-left text-white uppercase tracking-[0.18em] font-black hover:text-[#22c55e]"
            >
              Productos
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigateTo('nosotros');
              }}
              className="w-full text-left text-white uppercase tracking-[0.18em] font-black hover:text-[#22c55e]"
            >
              Nosotros
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
