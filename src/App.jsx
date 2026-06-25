import React, { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from './supabaseClient';
import { getCache, setCache } from './utils/cache';
import { AppProvider } from './context/AppContext';

// Importaciones de Componentes Organizados y Separados
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import SupportWidget from './components/common/SupportWidget';
import Toast from './components/common/Toast';
import About from './components/common/About';
import Home from './components/home/Home';
import ProductsPage from './components/features/ProductsPage';
import ProductDetail from './components/features/ProductDetail';
import CartDrawer from './components/features/CartDrawer';
import WishlistDrawer from './components/features/WishlistDrawer';
import Checkout from './components/checkout/Checkout';
import Register from './components/auth/Register';
import UserProfile from './components/auth/UserProfile';
import SearchPage from './components/features/SearchPage';
import FAQ from './components/common/FAQ';
import OrderTracker from './components/features/OrderTracker';

import { products as allProducts } from './data/products';

function App() {
  const parseHashState = () => {
    const hash = window.location.hash.slice(1);

    if (hash.startsWith('producto/')) {
      return { page: 'detalle', product: null };
    }

    if (hash === 'productos') return { page: 'productos', product: null };
    if (hash === 'checkout') return { page: 'checkout', product: null };
    if (hash === 'buscar') return { page: 'buscar', product: null };
    if (hash === 'perfil') return { page: 'perfil', product: null };
    if (hash === 'nosotros') return { page: 'nosotros', product: null };
    if (hash === 'registro') return { page: 'registro', product: null };
    if (hash === 'faq') return { page: 'faq', product: null };
    if (hash === 'rastrear') return { page: 'rastrear', product: null };

    return { page: 'home', product: null };
  };

  const getStoredUser = () => {
    try {
      const stored = window.localStorage.getItem('andrew_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const getCartStorageKey = (currentUser) =>
    currentUser?.email ? `andrew_cart_${currentUser.email}` : 'andrew_cart_guest';

  const getStoredCart = useCallback((currentUser) => {
    try {
      const stored = window.localStorage.getItem(getCartStorageKey(currentUser));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const getStoredWishlist = () => {
    try {
      const stored = window.localStorage.getItem('andrew_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const mergeCartItems = useCallback((baseItems, loadedItems) => {
    const merged = [...baseItems];
    loadedItems.forEach((item) => {
      const existing = merged.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        existing.quantity = Math.max(existing.quantity, item.quantity);
      } else {
        merged.push(item);
      }
    });
    return merged;
  }, []);

  const initialRoute = parseHashState();

  // ESTADOS GLOBALES DE LA APLICACIÓN
  const [pagina, setPagina] = useState(initialRoute.page);
  const [selectedProduct, setSelectedProduct] = useState(initialRoute.product);
  const [products, setProducts] = useState(() => getCache('products') || allProducts);
  const [user, setUser] = useState(getStoredUser);

  // Modo Claro / Oscuro (Tema)
  const [theme, setTheme] = useState(() => {
    try {
      const stored = window.localStorage.getItem('andrew_theme');
      return stored || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    try {
      window.localStorage.setItem('andrew_theme', theme);
    } catch {
      // Silencioso
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  
  // Carrito de compras
  const [cartItems, setCartItems] = useState(() => getStoredCart(getStoredUser()));
  const [cartOpen, setCartOpen] = useState(false);
  
  // Lista de deseos (Wishlist/Favoritos)
  const [wishlistItems, setWishlistItems] = useState(getStoredWishlist);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Notificaciones flotantes (Toasts)
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // GESTOR DE NOTIFICACIONES TOAST
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const toggleCart = () => setCartOpen((open) => !open);
  const toggleWishlist = () => setWishlistOpen((open) => !open);

  // GESTOR DE LISTA DE DESEOS (FAVORITOS)
  const handleToggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const isFav = prev.some((item) => item.id === product.id);
      let updated;
      if (isFav) {
        showToast(`Quitado de favoritos: Camiseta ${product.equipo}`, 'info');
        updated = prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Añadido a favoritos: Camiseta ${product.equipo}`, 'success');
        updated = [...prev, product];
      }
      window.localStorage.setItem('andrew_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  // GESTOR DEL CARRITO
  const addToCart = (product, options = {}) => {
    const {
      size = 'M',
      version = 'fan',
      customName = false,
      personalizationName = '',
      personalizationNumber = '',
      addShort = false,
      price = product.precio,
      quantity = 1,
    } = options;

    const itemKey = `${product.id}-${version}-${size}-${customName ? 'custom' : 'no'}-${personalizationName}-${personalizationNumber}-${addShort ? 'short' : 'noshort'}`;

    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === itemKey);
      if (existing) {
        showToast(`Actualizada cantidad de ${product.equipo} en carrito`, 'success');
        return prev.map((cartItem) =>
          cartItem.id === itemKey ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        );
      }

      showToast(`¡Añadido al carrito: ${product.equipo}!`, 'success');
      return [
        ...prev,
        {
          id: itemKey,
          productId: product.id,
          name: product.equipo,
          image: product.image,
          size,
          version,
          customName,
          personalizationName,
          personalizationNumber,
          addShort,
          price: Number(price),
          quantity,
        },
      ];
    });

    setCartOpen(true);
  };

  const removeCartItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Producto eliminado del carrito', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Bolsa de compra vaciada', 'info');
  };

  const updateCartQuantity = (itemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleLogin = (userData) => {
    setUser(userData);
    window.localStorage.setItem('andrew_user', JSON.stringify(userData));

    const existingUserCart = getStoredCart(userData);
    const guestCart = getStoredCart(null);
    const mergedCart = mergeCartItems(guestCart, existingUserCart);
    setCartItems(mergedCart);
    window.localStorage.removeItem(getCartStorageKey(null));

    showToast(`¡Bienvenido de nuevo, ${userData.name}!`, 'success');
    navigateTo('perfil');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar fallos de cierre de sesión
    }
    setUser(null);
    window.localStorage.removeItem('andrew_user');
    showToast('Sesión cerrada correctamente', 'info');
    navigateTo('home');
  };

  const handleUpdateUser = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      window.localStorage.setItem('andrew_user', JSON.stringify(next));
      showToast('Datos de perfil actualizados', 'success');
      return next;
    });
  };

  const openProductDetail = (product) => {
    window.location.hash = `producto/${product.id}`;
  };

  const navigateTo = (page) => {
    if (page === 'productos') {
      window.location.hash = 'productos';
    } else if (page === 'checkout') {
      window.location.hash = 'checkout';
    } else if (page === 'buscar') {
      window.location.hash = 'buscar';
    } else if (page === 'perfil') {
      window.location.hash = 'perfil';
    } else if (page === 'registro') {
      window.location.hash = 'registro';
    } else if (page === 'nosotros') {
      window.location.hash = 'nosotros';
    } else if (page === 'faq') {
      window.location.hash = 'faq';
    } else if (page === 'rastrear') {
      window.location.hash = 'rastrear';
    } else {
      window.location.hash = 'home';
    }
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash.startsWith('producto/')) {
        const id = Number(hash.split('/')[1]);
        const product = products.find((item) => item.id === id);
        if (product) {
          setSelectedProduct(product);
          setPagina('detalle');
          return;
        }
      }
      if (hash === 'productos') {
        setSelectedProduct(null);
        setPagina('productos');
        return;
      }
      if (hash === 'checkout') {
        setSelectedProduct(null);
        setPagina('checkout');
        return;
      }
      if (hash === 'buscar') {
        setSelectedProduct(null);
        setPagina('buscar');
        return;
      }
      if (hash === 'perfil') {
        setSelectedProduct(null);
        setPagina('perfil');
        return;
      }
      if (hash === 'nosotros') {
        setSelectedProduct(null);
        setPagina('nosotros');
        return;
      }
      if (hash === 'registro') {
        setSelectedProduct(null);
        setPagina('registro');
        return;
      }
      if (hash === 'faq') {
        setSelectedProduct(null);
        setPagina('faq');
        return;
      }
      if (hash === 'rastrear') {
        setSelectedProduct(null);
        setPagina('rastrear');
        return;
      }
      setSelectedProduct(null);
      setPagina('home');
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [products]);

  // CARGAR PRODUCTOS DESDE DJANGO API O SUPABASE CON RETROALIMENTACIÓN DE LOCAL CACHE
  useEffect(() => {
    const normalizeMediaUrl = (value) => {
      if (!value) return 'https://via.placeholder.com/400?text=Camiseta';
      if (typeof value !== 'string') return 'https://via.placeholder.com/400?text=Camiseta';
      if (value.startsWith('http')) return value;
      if (value.startsWith('/')) return `${djangoApiBaseUrl.replace(/\/$/, '')}${value}`;
      return value;
    };

    const normalizeProduct = (raw) => {
      const imageUrl = normalizeMediaUrl(raw.image || raw.imagen || raw.photo || raw.thumbnail);
      const galleryImages = raw.gallery || raw.images || [imageUrl];

      return {
        id: raw.id,
        equipo: raw.equipo || raw.nombre || raw.name || `Camiseta ${raw.id}`,
        liga: raw.liga || raw.league || 'Liga',
        categoria: raw.categoria || raw.category || 'Local',
        precio: Number(raw.precio ?? raw.price ?? 90.00),
        image: imageUrl,
        gallery: Array.isArray(galleryImages)
          ? galleryImages.map(normalizeMediaUrl)
          : [normalizeMediaUrl(galleryImages)],
        description: raw.descripcion || raw.description || 'Camiseta de fútbol premium oficial.',
        details: raw.details || {
          corte: 'Regular Fit',
          peso: '185g',
          tecnologia: 'Dry-Fit Pro',
          origen: 'Importado',
        },
        stock: raw.stock ?? 10,
        descripcion: raw.descripcion || raw.description || '',
      };
    };

    const normalizeProducts = (items) => (Array.isArray(items) ? items.map(normalizeProduct) : []);

    const djangoApiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://127.0.0.1:8000';
    const djangoApiUrl = `${djangoApiBaseUrl.replace(/\/$/, '')}/api`;

    const fetchProducts = async () => {
      const cachedProducts = getCache('products');
      if (cachedProducts && cachedProducts.length) {
        setProducts(cachedProducts);
      }

      let loaded = false;

      try {
        const response = await fetch(`${djangoApiUrl}/camisetas/`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length) {
            const normalized = normalizeProducts(data);
            setProducts(normalized);
            setCache('products', normalized, 60 * 60 * 12);
            loaded = true;
          }
        }
      } catch (error) {
        // Silencioso. Carga local/supabase
      }

      if (!loaded && supabaseUrl && supabaseAnonKey) {
        try {
          const { data, error } = await supabase.from('products').select('*');
          if (!error && data && data.length) {
            const normalized = normalizeProducts(data);
            setProducts(normalized);
            setCache('products', normalized, 60 * 60 * 12);
            loaded = true;
          }
        } catch (error) {
          // Silencioso
        }
      }

      // Si no se cargó nada, nos aseguramos que el fallback esté sincronizado con el hash
      if (!loaded && (!cachedProducts || !cachedProducts.length)) {
        const normalized = normalizeProducts(allProducts);
        setProducts(normalized);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(getCartStorageKey(user), JSON.stringify(cartItems));
    } catch {
      // Silencioso
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('andrew_user', JSON.stringify(user));
    }
  }, [user]);

  // Sesión de Supabase
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) return;

      const session = data?.session;
      if (session?.user) {
        const userData = {
          name: session.user.user_metadata?.name || 'Usuario',
          email: session.user.email,
          phone: session.user.user_metadata?.phone || '',
          address: session.user.user_metadata?.address || '',
        };
        setUser(userData);
        setCartItems(getStoredCart(userData));
      }
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          name: session.user.user_metadata?.name || 'Usuario',
          email: session.user.email,
          phone: session.user.user_metadata?.phone || '',
          address: session.user.user_metadata?.address || '',
        };
        setUser(userData);
        setCartItems((prev) => mergeCartItems(prev, getStoredCart(userData)));
      } else {
        setUser(null);
        setCartItems(getStoredCart(null));
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [getStoredCart, mergeCartItems]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagina]);

  const closeProductDetail = () => {
    setSelectedProduct(null);
    navigateTo('productos');
  };

  const filteredProducts = products.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      item.equipo.toLowerCase().includes(query) ||
      item.liga.toLowerCase().includes(query) ||
      item.categoria.toLowerCase().includes(query);

    const leagueMatch = leagueFilter === 'all' || item.liga === leagueFilter;

    const priceMatch =
      priceFilter === 'all' ||
      (priceFilter === 'under-92' && item.precio < 92) ||
      (priceFilter === '92-95' && item.precio >= 92 && item.precio <= 95) ||
      (priceFilter === 'over-95' && item.precio > 95);

    const categoryMatch = categoryFilter === 'all' || item.categoria.toLowerCase() === categoryFilter.toLowerCase();

    return searchMatch && leagueMatch && priceMatch && categoryMatch;
  });

  return (
    <AppProvider
      value={{
        user,
        cartItems,
        cartCount,
        products,
        addToCart,
        removeCartItem,
        updateCartQuantity,
        clearCart,
        setUser,
      }}
    >
      <div className={`min-h-screen bg-[#050505] text-white font-sans selection:bg-[#22c55e] selection:text-black ${theme === 'light' ? 'light-theme' : ''}`}>
        {/* Barra de Navegación Premium */}
        <Navbar 
          pagina={pagina} 
          navigateTo={navigateTo} 
          cartCount={cartCount} 
          toggleCart={toggleCart} 
          wishlistCount={wishlistCount}
          toggleWishlist={toggleWishlist}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Enrutador de Páginas */}
        {pagina === 'detalle' && selectedProduct ? (
          <ProductDetail 
            item={selectedProduct} 
            onBack={closeProductDetail} 
            onAddToCart={addToCart} 
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : pagina === 'productos' ? (
          <ProductsPage
            products={products}
            filteredProducts={filteredProducts}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            leagueFilter={leagueFilter}
            setLeagueFilter={setLeagueFilter}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onBack={() => navigateTo('home')}
            onViewDetails={openProductDetail}
            addToCart={addToCart}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : pagina === 'checkout' ? (
          !user ? (
            <Register 
              onBack={() => navigateTo('productos')} 
              onLogin={(userData) => {
                handleLogin(userData);
                navigateTo('checkout');
              }} 
              messageOverride="Por seguridad de tu transacción, por favor inicia sesión o regístrate en Andrew Camisetas antes de realizar tu pago por Yape, Plin o Transferencia Bancaria."
            />
          ) : (
            <Checkout 
              cartItems={cartItems} 
              onBack={() => navigateTo('productos')} 
              onClearCart={clearCart} 
            />
          )
        ) : pagina === 'buscar' ? (
          <SearchPage
            products={products}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onBack={() => navigateTo('productos')}
            onViewDetails={openProductDetail}
            addToCart={addToCart}
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : pagina === 'perfil' ? (
          user ? (
            <UserProfile 
              user={user} 
              onBack={() => navigateTo('home')} 
              onLogout={handleLogout} 
              onUpdateUser={handleUpdateUser}
            />
          ) : (
            <Register onBack={() => navigateTo('home')} onLogin={handleLogin} />
          )
        ) : pagina === 'registro' ? (
          user ? (
            <UserProfile 
              user={user} 
              onBack={() => navigateTo('home')} 
              onLogout={handleLogout} 
              onUpdateUser={handleUpdateUser}
            />
          ) : (
            <Register onBack={() => navigateTo('home')} onLogin={handleLogin} />
          )
        ) : pagina === 'nosotros' ? (
          <About onBack={() => navigateTo('home')} />
        ) : pagina === 'faq' ? (
          <FAQ onBack={() => navigateTo('home')} />
        ) : pagina === 'rastrear' ? (
          <OrderTracker onBack={() => navigateTo('home')} />
        ) : (
          <Home 
            products={products} 
            navigateTo={navigateTo} 
            onViewDetails={openProductDetail} 
            addToCart={addToCart} 
            wishlistItems={wishlistItems}
            onToggleWishlist={handleToggleWishlist}
            theme={theme}
          />
        )}

        {/* Bolsa de Compra (Drawer) */}
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          onRemove={removeCartItem}
          onIncrement={(id) => updateCartQuantity(id, 1)}
          onDecrement={(id) => updateCartQuantity(id, -1)}
          onCheckout={() => navigateTo('checkout')}
        />

        {/* Lista de Deseos (Drawer) */}
        <WishlistDrawer
          open={wishlistOpen}
          onClose={() => setWishlistOpen(false)}
          wishlistItems={wishlistItems}
          onRemove={handleToggleWishlist}
          onAddToCart={addToCart}
          onViewDetails={openProductDetail}
        />

        {/* Widget de Soporte Flotante */}
        <SupportWidget />

        {/* Pie de Página */}
        <Footer navigateTo={navigateTo} />

        {/* Notificaciones Flotantes (Toasts) */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
    </AppProvider>
  );
}

export default App;
