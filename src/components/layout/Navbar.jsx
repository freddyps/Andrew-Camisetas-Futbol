import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingBag, Menu, X, User, Sun, Moon, Package } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Navbar: Cabecera deportiva reactiva optimizada desde 320px hasta 1920px+,
 * con objetivos táctiles de 44×44px, cierre automático y menú móvil accesible.
 */
export default function Navbar({ 
  currentRoute = 'inicio',
  onNavigate = () => {}, 
  onSearchSubmit = () => {},
  user = null,
  onLogout = () => {},
  onOpenAuth = () => {},
  onOpenCart = () => {},
  onOpenOrders = () => {},
  cartCount = 0 
}) {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const activeItem = currentRoute;
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const searchPanelRef = useRef(null);

  // Escuchar el scroll del navegador
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar dropdown de usuario y buscador al hacer clic fuera o presionar Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  const menuItems = isAdmin
    ? [{ id: 'admin', label: 'PANEL DE ADMINISTRACIÓN' }]
    : [
        { id: 'inicio', label: 'INICIO' },
        { id: 'catalogo', label: 'CATÁLOGO' },
        { id: 'nosotros', label: 'NOSOTROS' },
        { id: 'pedir_a_medida', label: 'PEDIR A MEDIDA' },
        ...(user ? [{ id: 'mis_pedidos', label: 'MIS COMPRAS' }] : []),
      ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchSubmit(searchTerm.trim());
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header 
      className={`fixed inset-x-0 z-50 select-none transition-all duration-300 pointer-events-none ${
        isScrolled 
          ? 'top-0 px-0' 
          : 'top-2 sm:top-4 lg:top-6 px-2 sm:px-6'
      }`}
    >
      <div 
        className={`navbar-container mx-auto flex items-center justify-between gap-2 transition-all duration-300 pointer-events-auto relative ${
          isScrolled
            ? 'w-full max-w-full px-3 sm:px-8 lg:px-10 h-[68px] sm:h-[78px] rounded-none'
            : 'max-w-[1440px] rounded-2xl px-3 sm:px-7 lg:px-9 h-[72px] sm:h-[88px]'
        }`}
      >
        
        {/* 1. IZQUIERDA: LOGO OFICIAL ANDREW CAMISETAS DE FÚTBOL */}
        <button
          type="button"
          onClick={() => {
            onNavigate(isAdmin ? 'admin' : 'inicio');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer text-left min-w-0 shrink"
        >
          <div 
            className={`rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.9)] flex items-center justify-center p-1 sm:p-1.5 overflow-hidden group-hover:scale-105 transition-all shrink-0 ${
              isScrolled ? 'w-10 h-10 sm:w-13 sm:h-13' : 'w-11 h-11 sm:w-15 sm:h-15'
            }`}
          >
            <img
              src="/brand/logo_andrew_v2.webp"
              alt="Andrew Camisetas de Fútbol"
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <span 
              style={{ color: '#ffffff' }}
              className={`brand-title keep-white font-['Montserrat',sans-serif] font-black uppercase leading-none tracking-normal !text-white group-hover:!text-[#22c55e] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] truncate ${
                isScrolled ? 'text-base sm:text-xl lg:text-2xl' : 'text-lg sm:text-2xl lg:text-3xl'
              }`}
            >
              ANDREW
            </span>
            <span 
              className="brand-subtitle hidden min-[370px]:block font-['Montserrat',sans-serif] font-black text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-wider mt-0.5 sm:mt-1 leading-none text-[#22c55e] drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] truncate"
            >
              CAMISETAS DE FÚTBOL
            </span>
          </div>
        </button>

        {/* 2. CENTRO: ENLACES DEL MENÚ (ESCRITORIO) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-['Montserrat',sans-serif] text-xs xl:text-[13px] font-extrabold uppercase tracking-wide shrink-0">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`nav-link transition-colors duration-200 cursor-pointer py-2.5 px-1 border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'text-[#22c55e] border-[#22c55e] font-black drop-shadow-[0_0_10px_rgba(34,197,94,0.35)]'
                    : 'text-white/90 border-transparent hover:text-[#22c55e] font-bold'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* 3. DERECHA: BOTONES DE ACCIÓN (Mínimo 44x44px para accesibilidad táctil) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Botón Circular de Búsqueda de Tienda (Solo para clientes/visitantes) */}
          {!isAdmin && (
            <div className="relative" ref={searchPanelRef}>
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-11 h-11 rounded-full bg-[#22c55e] hover:bg-[#1fa75d] text-black flex items-center justify-center cursor-pointer transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                title="Buscar camiseta"
                aria-label="Buscar camiseta"
              >
                <Search size={18} strokeWidth={2.5} className="text-black" />
              </button>

              {/* Panel emergente de Búsqueda adaptable a 320px */}
              {searchOpen && (
                <div className="navbar-search-panel fixed sm:absolute inset-x-3 sm:inset-x-auto sm:right-0 top-[82px] sm:top-14 sm:w-[380px] bg-surface-card border border-stroke rounded-2xl p-4 shadow-2xl z-50 animate-fade-in space-y-3.5 text-txt-main">
                  <div className="flex items-center justify-between border-b border-stroke pb-2.5">
                    <span className="font-['Montserrat',sans-serif] text-[10px] font-black uppercase tracking-widest text-[#22c55e] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
                      BUSCADOR OFICIAL
                    </span>
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="w-8 h-8 flex items-center justify-center text-txt-muted hover:text-txt-main transition-colors rounded-lg hover:bg-surface-sub cursor-pointer"
                      aria-label="Cerrar buscador"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <Search size={16} className="absolute left-3.5 text-txt-muted pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar club, jugador o país..."
                      autoFocus
                      className="w-full bg-input-bg border border-stroke focus:border-[#22c55e] rounded-xl pl-10 pr-22 py-3 text-xs text-txt-main placeholder:text-txt-muted outline-none transition-all font-['Montserrat',sans-serif] font-semibold"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#22c55e] hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-[11px] uppercase tracking-wider px-3.5 rounded-lg cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center gap-1"
                    >
                      <span>BUSCAR</span>
                    </button>
                  </form>

                  {/* Etiquetas de Búsqueda Rápida */}
                  <div>
                    <span className="block text-[10px] font-bold text-txt-muted uppercase tracking-wider mb-2">
                      BÚSQUEDAS POPULARES:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Real Madrid', 'Barcelona', 'Perú', 'Ronaldo', 'Messi', 'Retro'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSearchTerm(tag);
                            onSearchSubmit(tag);
                            setSearchOpen(false);
                          }}
                          className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-surface-sub hover:bg-[#22c55e]/20 border border-stroke hover:border-[#22c55e]/40 text-txt-main hover:text-[#22c55e] transition-all cursor-pointer font-['Montserrat',sans-serif]"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botón Acceso Rápido a Mis Compras (Visible desde sm solo para clientes) */}
          {user && user.role !== 'ADMIN' && (
            <button
              type="button"
              onClick={onOpenOrders}
              className="hidden sm:flex w-11 h-11 rounded-xl bg-white/10 hover:bg-[#22c55e]/15 border border-white/10 hover:border-[#22c55e]/40 text-gray-300 hover:text-[#22c55e] items-center justify-center cursor-pointer transition-all"
              title="Ver Historial de Mis Compras"
              aria-label="Mis Compras"
            >
              <Package size={18} />
            </button>
          )}

          {/* Botón Modo Claro / Modo Noche (En escritorio/tablet en la barra, en móvil pequeño también dentro del menú) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden min-[380px]:flex w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-[#22c55e] items-center justify-center cursor-pointer transition-all"
            title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-[#22c55e]" />
            )}
          </button>

          {/* Botón Usuario / Sesión Activa */}
          <div className="relative" ref={userDropdownRef}>
            {user ? (
              <div>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="min-h-11 min-w-11 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/40 hover:bg-[#22c55e]/25 text-[#22c55e] flex items-center justify-center gap-2 px-2.5 sm:px-3 cursor-pointer transition-all"
                  title={user.email}
                  aria-label="Menú de usuario"
                >
                  <div className="w-6 h-6 rounded-full bg-[#22c55e] text-black font-black text-[11px] flex items-center justify-center shrink-0">
                    {(user.nombre || user.email)[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-['Montserrat',sans-serif] font-black text-xs uppercase tracking-wider keep-white max-w-[100px] truncate">
                    {user.nombre?.split(' ')[0] || user.email.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown de usuario */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-13 w-56 bg-surface-card border border-stroke rounded-2xl p-3 shadow-2xl z-50 space-y-2 text-txt-main">
                    <div className="px-2 py-1.5 border-b border-stroke">
                      <p className="text-txt-main text-xs font-black truncate">{user.nombre}</p>
                      <p className="text-txt-muted text-[10px] font-medium truncate">{user.email}</p>
                      <span className="inline-block mt-1 bg-[#22c55e]/20 text-[#22c55e] text-[9px] font-black px-2 py-0.5 rounded">
                        {user.role || 'CLIENTE'}
                      </span>
                    </div>

                    {user.role === 'ADMIN' ? (
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left text-xs bg-[#22c55e]/15 text-[#22c55e] hover:bg-[#22c55e]/25 p-2.5 rounded-lg font-black uppercase transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>Panel Administrador</span>
                        <span>→</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenOrders();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left text-xs text-txt-main hover:text-[#22c55e] hover:bg-surface-sub p-2.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center justify-between"
                      >
                        <span>Mis Compras</span>
                        <span>📦</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left text-xs text-red-500 hover:bg-red-500/10 p-2.5 rounded-lg font-bold transition-colors cursor-pointer"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Iniciar Sesión / Registrarse"
                aria-label="Iniciar Sesión"
              >
                <User size={18} />
              </button>
            )}
          </div>

          {/* Botón Carrito de Compras (Solo para clientes y visitantes) */}
          {!isAdmin && (
            <button
              type="button"
              onClick={onOpenCart}
              className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center relative cursor-pointer transition-colors"
              title="Carrito de compras"
              aria-label="Carrito de compras"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#22c55e] text-black text-[10px] font-black min-w-5 h-5 px-1 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Botón Menú Móvil (Hamburguesa) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {/* 4. MENÚ DESPLEGABLE PARA CELULARES Y TABLETS CON SCROLL INTERNO SEGURO */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-1 sm:mx-2 bg-surface-card border border-stroke rounded-2xl p-3.5 shadow-2xl z-50 space-y-1.5 max-h-[calc(100dvh-96px)] overflow-y-auto animate-fade-in">
            {menuItems.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full min-h-11 text-left font-['Montserrat',sans-serif] text-xs font-black uppercase px-4 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#22c55e] text-black shadow-sm'
                      : 'text-txt-main hover:bg-surface-sub'
                  }`}
                >
                  <span>{item.label}</span>
                  <span>→</span>
                </button>
              );
            })}

            {/* Acciones secundarias agrupadas en móvil */}
            <div className="pt-2 mt-2 border-t border-stroke flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex-1 min-h-11 px-3.5 py-2.5 rounded-xl bg-surface-sub hover:bg-input-bg border border-stroke text-txt-main text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={16} className="text-yellow-400" />
                    <span>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon size={16} className="text-[#22c55e]" />
                    <span>Modo Oscuro</span>
                  </>
                )}
              </button>

              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 min-h-11 px-3.5 py-2.5 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#22c55e] text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User size={15} />
                  <span>Mi Cuenta</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
