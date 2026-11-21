import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useToast } from './ToastContext';

const CART_STORAGE_KEY = 'andrew_cart_v2';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { addToast } = useToast();

  // 1. Estado inicial persistido en LocalStorage
  const [cart, setCart] = useState(() => {
    try {
      const guardado = localStorage.getItem(CART_STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ref para leer el carrito actual de forma síncrona sin disparar efectos secundarios dentro de setCart(prev => ...)
  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Error al guardar carrito en localStorage:', e);
    }
  }, [cart]);

  // Agregar producto al carrito (validando stock y disparando Toast FUERA del actualizador de estado)
  const addToCart = useCallback((producto) => {
    if (!producto) return;
    if (!producto.inStock || (parseInt(producto.stock) || 0) <= 0) {
      if (addToast) {
        addToast('Esta prenda está agotada en stock físico. Puedes encargarla en Pedir a Medida.', 'info');
      }
      return;
    }

    const tallasConStock = producto.inStock && producto.stockPorTalla
      ? (producto.tallas || ['S', 'M', 'L', 'XL']).filter((t) => (parseInt(producto.stockPorTalla[t]) || 0) > 0)
      : (producto.tallas || ['S', 'M', 'L', 'XL']);

    const tallaNormalizada = producto.tallaSeleccionada || tallasConStock[0] || producto.tallas?.[0] || 'M';
    const cantidadNormalizada = Math.max(1, parseInt(producto.cantidad) || 1);

    const productoNormalizado = {
      ...producto,
      tallaSeleccionada: tallaNormalizada,
      cantidad: cantidadNormalizada
    };

    const clavePersonalizacion = (item) => {
      const p = item.personalizacion ? `${item.personalizacion.nombre || ''}-${item.personalizacion.numero || ''}` : '';
      const s = item.incluirShort ? `short-${item.tallaShort || item.tallaSeleccionada}` : 'no-short';
      return `${p}|${s}`;
    };

    const prev = cartRef.current;
    const existingIndex = prev.findIndex(
      (item) =>
        item.id === productoNormalizado.id &&
        item.tallaSeleccionada === productoNormalizado.tallaSeleccionada &&
        Boolean(item.inStock) === Boolean(productoNormalizado.inStock) &&
        clavePersonalizacion(item) === clavePersonalizacion(productoNormalizado)
    );

    const stockTalla = productoNormalizado.stockPorTalla?.[tallaNormalizada] !== undefined
      ? parseInt(productoNormalizado.stockPorTalla[tallaNormalizada])
      : (parseInt(productoNormalizado.stock) || 1);

    if (existingIndex > -1) {
      const currentCant = prev[existingIndex].cantidad || 1;
      if (currentCant >= stockTalla) {
        if (addToast) {
          addToast(`Solo disponemos de ${stockTalla} unidad(es) en talla ${tallaNormalizada}`, 'info');
        }
        setIsCartOpen(true);
        return;
      }

      const nextCart = [...prev];
      nextCart[existingIndex] = {
        ...nextCart[existingIndex],
        cantidad: Math.min(stockTalla, currentCant + cantidadNormalizada)
      };
      cartRef.current = nextCart;
      setCart(nextCart);
      if (addToast) {
        addToast(`¡"${productoNormalizado.nombre}" actualizada en el carrito!`, 'success');
      }
      setIsCartOpen(true);
      return;
    }

    const nextCart = [...prev, productoNormalizado];
    cartRef.current = nextCart;
    setCart(nextCart);
    if (addToast) {
      addToast(`¡"${productoNormalizado.nombre || 'Camiseta'}" (Talla ${tallaNormalizada}) agregada al carrito!`, 'success');
    }
    setIsCartOpen(true);
  }, [addToast]);

  // Actualizar cantidad de un ítem (Toast fuera de setCart)
  const updateQuantity = useCallback((index, nuevaCantidad) => {
    const prev = cartRef.current;
    const item = prev[index];
    if (!item) return;

    if (nuevaCantidad <= 0) {
      const nextCart = prev.filter((_, i) => i !== index);
      cartRef.current = nextCart;
      setCart(nextCart);
      return;
    }

    if (item.inStock) {
      const stockTalla = item.stockPorTalla?.[item.tallaSeleccionada] !== undefined
        ? parseInt(item.stockPorTalla[item.tallaSeleccionada])
        : (parseInt(item.stock) || 1);

      if (nuevaCantidad > stockTalla) {
        const nextCart = [...prev];
        nextCart[index] = { ...item, cantidad: stockTalla };
        cartRef.current = nextCart;
        setCart(nextCart);
        if (addToast) {
          addToast(`Límite de stock alcanzado (${stockTalla} un. en talla ${item.tallaSeleccionada})`, 'info');
        }
        return;
      }
    }

    const nextCart = [...prev];
    nextCart[index] = { ...item, cantidad: nuevaCantidad };
    cartRef.current = nextCart;
    setCart(nextCart);
  }, [addToast]);

  // Remover ítem individual (Toast fuera de setCart)
  const removeItem = useCallback((index) => {
    const prev = cartRef.current;
    const itemEliminado = prev[index];
    const nextCart = prev.filter((_, i) => i !== index);
    cartRef.current = nextCart;
    setCart(nextCart);
    if (itemEliminado && addToast) {
      addToast(`"${itemEliminado.nombre}" eliminada del carrito`, 'info');
    }
  }, [addToast]);

  // Vaciar carrito
  const clearCart = useCallback((notify = true) => {
    cartRef.current = [];
    setCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
    if (notify && addToast) {
      addToast('Carrito vaciado', 'info');
    }
  }, [addToast]);

  // Métricas calculadas
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.cantidad || 1), 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const precioUnit = Number(item.precio) || 0;
      const cant = Number(item.cantidad) || 1;
      return acc + (precioUnit * cant);
    }, 0);
  }, [cart]);

  const value = useMemo(() => ({
    cart,
    setCart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    cartCount,
    cartTotal
  }), [cart, isCartOpen, addToCart, updateQuantity, removeItem, clearCart, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
