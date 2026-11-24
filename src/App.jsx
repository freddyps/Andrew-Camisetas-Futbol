import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/home/HomePage';
import CartDrawer from './components/cart/CartDrawer';
import WhatsAppFloatingWidget from './components/common/WhatsAppFloatingWidget';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { CartProvider, useCart } from './context/CartContext';
import { supabase } from './supabaseClient';
import { isAuthorizedAdminEmail } from './utils/security';
import { limpiarCachePedidosLocales } from './services/orderService';

// Lazy loading para división de código (Code-Splitting) en producción
const CatalogoPage = lazy(() => import('./pages/catalogo/CatalogoPage'));
const ProductDetailsPage = lazy(() => import('./pages/producto/ProductDetailsPage'));
const PedirAMedidaPage = lazy(() => import('./pages/pedir-a-medida/PedirAMedidaPage'));
const NosotrosPage = lazy(() => import('./pages/nosotros/NosotrosPage'));
const AdminPanelPage = lazy(() => import('./pages/admin/AdminPanelPage'));
const CheckoutStepByStepPage = lazy(() => import('./pages/checkout/CheckoutStepByStepPage'));
const MisPedidosPage = lazy(() => import('./pages/pedidos/MisPedidosPage'));
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const InfoPoliciesPage = lazy(() => import('./pages/info/InfoPoliciesPage'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="w-12 h-12 border-4 border-[#22c55e]/20 border-t-[#22c55e] rounded-full animate-spin" />
      <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Cargando Andrew Camisetas...</span>
    </div>
  );
}

function AppContent() {
  const { addToast } = useToast();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    updateQuantity, 
    removeItem, 
    clearCart,
    cartCount 
  } = useCart();

  const [currentRoute, setCurrentRoute] = useState(() => {
    try {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash.startsWith('producto-')) return 'producto-detalle';
      const rutasValidas = ['inicio', 'catalogo', 'nosotros', 'pedir_a_medida', 'mis_pedidos', 'checkout', 'auth', 'admin', 'faq', 'terminos'];
      if (rutasValidas.includes(hash)) return hash;
      const saved = sessionStorage.getItem('andrew_current_route');
      return saved || 'inicio';
    } catch {
      return 'inicio';
    }
  });
  const [selectedProductId, setSelectedProductId] = useState(() => {
    try {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash.startsWith('producto-')) return hash.replace('producto-', '');
      return sessionStorage.getItem('andrew_selected_product_id') || 'peru-2025';
    } catch {
      return 'peru-2025';
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modales flotantes y redirección post-login
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register' | 'pedidos'
  const [postLoginRoute, setPostLoginRoute] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem('andrew_session_user');
      if (!savedUser) return null;
      const parsed = JSON.parse(savedUser);
      // Mitigación contra escalación de privilegios en sessionStorage:
      // El rol ADMIN solo se otorga si el correo autenticado pertenece a ADMIN_EMAILS_AUTORIZADOS
      const verifiedRole = isAuthorizedAdminEmail(parsed?.email) ? 'ADMIN' : 'CLIENTE';
      return { ...parsed, role: verifiedRole };
    } catch {
      return null;
    }
  });

  // Sincronizar ruta y producto activo con sessionStorage e historial del navegador
  // Si el usuario tiene rol ADMIN, su entorno exclusivo es el Panel de Administración ('admin')
  useEffect(() => {
    if (user?.role === 'ADMIN' && currentRoute !== 'admin') {
      setCurrentRoute('admin');
      setIsCartOpen(false);
      return;
    }
    try {
      sessionStorage.setItem('andrew_current_route', currentRoute);
      sessionStorage.setItem('andrew_selected_product_id', selectedProductId);
    } catch {
      // ignore storage errors
    }
  }, [user, currentRoute, selectedProductId, setIsCartOpen]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state?.route) {
        setCurrentRoute(e.state.route);
        if (e.state.productId) {
          setSelectedProductId(e.state.productId);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Escuchar sesión activa de Supabase al cargar la app
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const userData = {
          id: u.id,
          email: u.email,
          role: isAuthorizedAdminEmail(u.email) ? 'ADMIN' : 'CLIENTE',
          nombre: u.user_metadata?.full_name || u.user_metadata?.nombre || u.email.split('@')[0],
          supabaseUser: u
        };
        // Si el usuario de esta sesión es distinto al que había en sessionStorage,
        // limpiar la caché de pedidos para evitar mezcla entre cuentas
        try {
          const prevSaved = sessionStorage.getItem('andrew_session_user');
          const prevParsed = prevSaved ? JSON.parse(prevSaved) : null;
          if (prevParsed && prevParsed.id !== userData.id) {
            limpiarCachePedidosLocales();
          }
        } catch {
          // ignore
        }
        setUser(userData);
        try {
          sessionStorage.setItem('andrew_session_user', JSON.stringify(userData));
        } catch {
          // ignore
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const userData = {
          id: u.id,
          email: u.email,
          role: isAuthorizedAdminEmail(u.email) ? 'ADMIN' : 'CLIENTE',
          nombre: u.user_metadata?.full_name || u.user_metadata?.nombre || u.email.split('@')[0],
          supabaseUser: u
        };
        // Al cambiar de cuenta, limpiar la caché de pedidos del usuario anterior
        // para que no se mezclen pedidos de distintas sesiones en el mismo navegador
        setUser((prev) => {
          if (prev && prev.id !== userData.id) {
            limpiarCachePedidosLocales();
          }
          return userData;
        });
        try {
          sessionStorage.setItem('andrew_session_user', JSON.stringify(userData));
        } catch {
          // ignore
        }
      } else {
        setUser((prev) => (isAuthorizedAdminEmail(prev?.email) && !prev?.supabaseUser ? prev : null));
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    limpiarCachePedidosLocales(); // limpiar pedidos del usuario saliente
    setUser(null);
    try {
      sessionStorage.removeItem('andrew_session_user');
    } catch {
      // ignore
    }
    if (currentRoute === 'mis_pedidos' || currentRoute === 'admin' || currentRoute === 'checkout') {
      setCurrentRoute('inicio');
    }
  };

  const handleNavigate = (route, query = '') => {
    if (user?.role === 'ADMIN') {
      setCurrentRoute('admin');
      setIsCartOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentRoute(route);
    try {
      window.history.pushState({ route, productId: selectedProductId }, '', `#${route}`);
    } catch {
      // ignore
    }
    if (query) {
      setSearchQuery(query);
    } else if (route !== 'catalogo') {
      setSearchQuery('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (productId) => {
    setSelectedProductId(productId);
    setCurrentRoute('producto-detalle');
    try {
      window.history.pushState({ route: 'producto-detalle', productId }, '', `#producto-${productId}`);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (termino) => {
    setSearchQuery(termino);
    setCurrentRoute('catalogo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrders = () => {
    setCurrentRoute('mis_pedidos');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col justify-between">
        {/* Floating Header */}
        <Navbar 
          currentRoute={currentRoute}
          onNavigate={handleNavigate} 
          onSearchSubmit={handleSearchSubmit}
          user={user}
          onLogout={handleLogout}
          onOpenAuth={() => {
            setAuthModalMode('login');
            setCurrentRoute('auth');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenCart={() => {
            if (user?.role !== 'ADMIN') setIsCartOpen(true);
          }}
          onOpenOrders={handleOpenOrders}
          cartCount={cartCount}
        />

        {/* Main Content Router con RBAC y Suspense */}
        <main className="flex-grow">
          <Suspense fallback={<RouteLoadingFallback />}>
            {currentRoute === 'admin' ? (
              user?.role === 'ADMIN' ? (
                <AdminPanelPage onBackToHome={() => handleNavigate('inicio')} />
              ) : (
                <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h2 className="font-['Montserrat',sans-serif] font-black text-2xl uppercase text-txt-main">
                    Acceso Restringido
                  </h2>
                  <p className="text-txt-muted text-xs sm:text-sm max-w-md">
                    Esta sección está protegida. Debes iniciar sesión con credenciales de Administrador para gestionar el inventario y pedidos.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setAuthModalMode('login');
                        setCurrentRoute('auth');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-[#22c55e] text-black font-black text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#1fa75d] transition-colors"
                    >
                      Identificarme como Admin
                    </button>
                    <button
                      onClick={() => handleNavigate('inicio')}
                      className="bg-surface-card border border-stroke text-txt-main font-bold text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer hover:bg-surface-sub transition-colors"
                    >
                      Volver al Inicio
                    </button>
                  </div>
                </div>
              )
            ) : currentRoute === 'auth' ? (
              <AuthPage 
                initialMode={authModalMode}
                onLoginSuccess={(userData) => {
                  setUser(userData);
                  try {
                    sessionStorage.setItem('andrew_session_user', JSON.stringify(userData));
                  } catch {
                    // ignore
                  }
                  addToast(`¡Bienvenido, ${userData.nombre || 'Crack'}!`, 'success');
                  if (userData.role === 'ADMIN') {
                    setPostLoginRoute(null);
                    setIsCartOpen(false);
                    setCurrentRoute('admin');
                  } else if (postLoginRoute) {
                    setCurrentRoute(postLoginRoute);
                    setPostLoginRoute(null);
                  } else {
                    setCurrentRoute('inicio');
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToHome={() => handleNavigate('inicio')}
                onGoToOrders={handleOpenOrders}
              />
            ) : currentRoute === 'checkout' ? (
              <CheckoutStepByStepPage 
                cart={cart}
                user={user}
                onOpenAuth={() => {
                  setPostLoginRoute('checkout');
                  setAuthModalMode('login');
                  setCurrentRoute('auth');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onBackToCart={() => {
                  setCurrentRoute('catalogo');
                  setIsCartOpen(true);
                }}
                onGoToCatalog={() => handleNavigate('catalogo')}
                onOrderSuccess={() => {
                  clearCart(false);
                  addToast('¡Pedido registrado con éxito!', 'success', 5000);
                }}
              />
            ) : currentRoute === 'producto-detalle' ? (
              <ProductDetailsPage 
                key={selectedProductId}
                productoId={selectedProductId}
                onBackToCatalog={() => handleNavigate('catalogo')}
                onCustomOrder={() => handleNavigate('pedir_a_medida')}
                onSelectProduct={handleOpenProduct}
                onAddToCart={addToCart}
                onBuyNow={(prod) => {
                  addToCart(prod);
                  setIsCartOpen(false);
                  handleNavigate('checkout');
                }}
              />
            ) : currentRoute === 'catalogo' ? (
              <CatalogoPage 
                key={searchQuery || 'catalogo'}
                initialSearchQuery={searchQuery}
                onSelectProduct={handleOpenProduct}
                onAddToCart={addToCart} 
              />
            ) : currentRoute === 'pedir_a_medida' ? (
              <PedirAMedidaPage onBackToHome={() => handleNavigate('inicio')} />
            ) : currentRoute === 'nosotros' ? (
              <NosotrosPage onExploreCatalog={() => handleNavigate('catalogo')} />
            ) : currentRoute === 'mis_pedidos' ? (
              <MisPedidosPage 
                user={user}
                onOpenAuth={() => {
                  setPostLoginRoute('mis_pedidos');
                  setAuthModalMode('login');
                  setCurrentRoute('auth');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onExploreCatalog={() => handleNavigate('catalogo')}
                onBackToHome={() => handleNavigate('inicio')}
              />
            ) : currentRoute === 'faq' || currentRoute === 'terminos' ? (
              <InfoPoliciesPage
                key={currentRoute}
                initialTab={currentRoute}
                onBackToHome={() => handleNavigate('inicio')}
                onExploreCatalog={() => handleNavigate('catalogo')}
              />
            ) : (
              <HomePage 
                onNavigate={handleNavigate} 
              />
            )}
          </Suspense>
        </main>

        {/* Official Sports Footer (Solo en vistas de cliente) */}
        {user?.role !== 'ADMIN' && <Footer onNavigate={handleNavigate} user={user} />}

        {/* Widget Flotante Oficial de WhatsApp (Solo para clientes) */}
        {user?.role !== 'ADMIN' && <WhatsAppFloatingWidget />}

        {/* Drawer Lateral del Carrito de Compras (Solo para clientes) */}
        {user?.role !== 'ADMIN' && (
          <CartDrawer 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            user={user}
            onProceedToCheckout={() => {
              setIsCartOpen(false);
              setCurrentRoute('checkout');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreCatalog={() => {
              setIsCartOpen(false);
              handleNavigate('catalogo');
            }}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onClearCart={() => clearCart(true)}
            onOpenOrders={handleOpenOrders}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ToastProvider>
  );
}
