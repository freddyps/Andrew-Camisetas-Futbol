import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import ProductsPage from './components/ProductsPage';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import { products as allProducts } from './data/products';

function App() {
  const [pagina, setPagina] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
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

  const updateCartQuantity = (itemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleCart = () => setCartOpen((open) => !open);

  const parseHash = () => {
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
    } else {
      window.location.hash = 'home';
    }
  };

  useEffect(() => {
    parseHash();
    const onHashChange = () => parseHash();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

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
        <Checkout cartItems={cartItems} onBack={() => navigateTo('productos')} />
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
      />
      <Footer />
    </div>
  );
}

export default App;
