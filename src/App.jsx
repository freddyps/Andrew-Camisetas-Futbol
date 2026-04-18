import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductsPage from './components/ProductsPage';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import SearchPage from './components/SearchPage';
import UserProfile from './components/UserProfile';
import Register from './components/Register';
import About from './components/About';
import SupportWidget from './components/SupportWidget';
import { products as allProducts } from './data/products';

function App() {
  const parseHashState = () => {
    const hash = window.location.hash.slice(1);

    if (hash.startsWith('producto/')) {
      const id = Number(hash.split('/')[1]);
      const product = allProducts.find((item) => item.id === id);
      if (product) {
        return { page: 'detalle', product };
      }
    }

    if (hash === 'productos') return { page: 'productos', product: null };
    if (hash === 'checkout') return { page: 'checkout', product: null };
    if (hash === 'buscar') return { page: 'buscar', product: null };
    if (hash === 'perfil') return { page: 'perfil', product: null };
    if (hash === 'nosotros') return { page: 'nosotros', product: null };
    if (hash === 'registro') return { page: 'registro', product: null };

    return { page: 'home', product: null };
  };

  const getStoredCart = () => {
    try {
      const stored = window.localStorage.getItem('andrew_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const getStoredUser = () => {
    try {
      const stored = window.localStorage.getItem('andrew_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const initialRoute = parseHashState();

  const [pagina, setPagina] = useState(initialRoute.page);
  const [selectedProduct, setSelectedProduct] = useState(initialRoute.product);
  const [cartItems, setCartItems] = useState(getStoredCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser);
  const [searchQuery, setSearchQuery] = useState('');
  const [leagueFilter, setLeagueFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product, options = {}) => {
    const {
      size = 'M',
      version = 'fan',
      customName = false,
      personalizationName = '',
      personalizationNumber = '',
      addShort = false,
      price = product.precio,
    } = options;

    const itemKey = `${product.id}-${version}-${size}-${customName ? 'custom' : 'no'}-${personalizationName}-${personalizationNumber}-${addShort ? 'short' : 'noshort'}`;

    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === itemKey);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === itemKey ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }

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
          quantity: 1,
        },
      ];
    });

    setCartOpen(true);
  };

  const removeCartItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => setCartOpen((open) => !open);

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
    navigateTo('perfil');
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('andrew_user');
    navigateTo('home');
  };

  const handleHashChange = () => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith('producto/')) {
      const id = Number(hash.split('/')[1]);
      const product = allProducts.find((item) => item.id === id);
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
    setSelectedProduct(null);
    setPagina('home');
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
    } else {
      window.location.hash = 'home';
    }
  };

  useEffect(() => {
    const onHashChange = () => handleHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('andrew_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('andrew_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pagina]);

  const closeProductDetail = () => {
    setSelectedProduct(null);
    navigateTo('productos');
  };

  const filteredProducts = allProducts.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const searchMatch =
      !query ||
      item.equipo.toLowerCase().includes(query) ||
      item.liga.toLowerCase().includes(query) ||
      item.categoria.toLowerCase().includes(query) ||
      item.precio.toString().includes(query);

    const leagueMatch = leagueFilter === 'all' || item.liga === leagueFilter;

    const priceMatch =
      priceFilter === 'all' ||
      (priceFilter === 'under-92' && item.precio < 92) ||
      (priceFilter === '92-95' && item.precio >= 92 && item.precio <= 95) ||
      (priceFilter === 'over-95' && item.precio > 95);

    return searchMatch && leagueMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#22c55e] selection:text-black">
      <Navbar pagina={pagina} navigateTo={navigateTo} cartCount={cartCount} toggleCart={toggleCart} />

      {pagina === 'detalle' && selectedProduct ? (
        <ProductDetail item={selectedProduct} onBack={closeProductDetail} onAddToCart={addToCart} />
      ) : pagina === 'productos' ? (
        <ProductsPage
          products={allProducts}
          filteredProducts={filteredProducts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          leagueFilter={leagueFilter}
          setLeagueFilter={setLeagueFilter}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          onBack={() => navigateTo('home')}
          onViewDetails={openProductDetail}
          addToCart={addToCart}
        />
      ) : pagina === 'checkout' ? (
        <Checkout cartItems={cartItems} onBack={() => navigateTo('productos')} onClearCart={clearCart} />
      ) : pagina === 'buscar' ? (
        <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} onBack={() => navigateTo('productos')} onViewDetails={openProductDetail} />
      ) : pagina === 'perfil' ? (
        user ? (
          <UserProfile user={user} onBack={() => navigateTo('home')} onLogout={handleLogout} />
        ) : (
          <Register onBack={() => navigateTo('home')} onLogin={handleLogin} />
        )
      ) : pagina === 'registro' ? (
        user ? (
          <UserProfile user={user} onBack={() => navigateTo('home')} onLogout={handleLogout} />
        ) : (
          <Register onBack={() => navigateTo('home')} onLogin={handleLogin} />
        )
      ) : pagina === 'nosotros' ? (
        <About onBack={() => navigateTo('home')} />
      ) : (
        <Home products={allProducts} navigateTo={navigateTo} onViewDetails={openProductDetail} addToCart={addToCart} />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={removeCartItem}
        onIncrement={(id) => updateCartQuantity(id, 1)}
        onDecrement={(id) => updateCartQuantity(id, -1)}
        onCheckout={() => navigateTo('checkout')}
      />
      {/* Widget de soporte flotante - disponible en todas las páginas */}
      <SupportWidget />
      <Footer />
    </div>
  );
}

export default App;
