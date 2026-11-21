import { useState, useEffect, useMemo, useRef } from 'react';
import { getProductos, getProductosSync } from '../../../services/productService';

/**
 * useCatalogo: Hook desacoplado para gestionar datos, filtros y ordenamiento del catálogo.
 */
export function useCatalogo(initialSearchQuery = '') {
  const [productosLista, setProductosLista] = useState(() => getProductosSync());
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState('todos'); // 'todos' | 'stock' | 'pedido'

  // Tope máximo dinámico basado en los productos reales (mínimo 250 soles)
  const precioMaximoCatalogo = useMemo(() => {
    if (!productosLista || productosLista.length === 0) return 250;
    const mayor = Math.max(...productosLista.map((p) => Number(p.precio) || 0));
    return Math.max(250, Math.ceil(mayor / 10) * 10);
  }, [productosLista]);

  const [maxPrecio, setMaxPrecio] = useState(250);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('destacados'); // 'destacados' | 'precio-bajo' | 'precio-alto'
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [tagSeleccionado, setTagSeleccionado] = useState(null);
  const sortDropdownRef = useRef(null);

  // Actualizar maxPrecio si entra un producto más caro que el tope inicial
  useEffect(() => {
    setMaxPrecio((prev) => (prev === 250 || prev < precioMaximoCatalogo ? precioMaximoCatalogo : prev));
  }, [precioMaximoCatalogo]);

  // Sincronizar catálogo con cambios en tiempo real (sin disparar nuevas peticiones al servidor en cada evento local)
  useEffect(() => {
    const fetchProds = async () => {
      const data = await getProductos();
      setProductosLista(data);
    };
    fetchProds();

    const handleUpdate = () => setProductosLista(getProductosSync());
    window.addEventListener('andrew_productos_updated', handleUpdate);
    return () => window.removeEventListener('andrew_productos_updated', handleUpdate);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrado y ordenamiento computado
  const camisetasFiltradas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return productosLista.filter((item) => {
      const coincideBusqueda = !q || 
        item.nombre.toLowerCase().includes(q) ||
        item.categoria.toLowerCase().includes(q) ||
        (item.tag && item.tag.toLowerCase().includes(q)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(q));

      const coincideCat = categoriaSeleccionada === 'todas' || item.categoriaId === categoriaSeleccionada;
      const coincidePrecio = item.precio <= maxPrecio;
      const coincideDisp =
        disponibilidadFiltro === 'todos' ||
        (disponibilidadFiltro === 'stock' && item.inStock) ||
        (disponibilidadFiltro === 'pedido' && !item.inStock);
      const coincideTag = !tagSeleccionado || 
        (item.tag && item.tag.toLowerCase().includes(tagSeleccionado.toLowerCase())) || 
        item.nombre.toLowerCase().includes(tagSeleccionado.toLowerCase());

      return coincideBusqueda && coincideCat && coincidePrecio && coincideDisp && coincideTag;
    }).sort((a, b) => {
      if (sortBy === 'precio-bajo') return a.precio - b.precio;
      if (sortBy === 'precio-alto') return b.precio - a.precio;
      return 0; // destacados
    });
  }, [productosLista, searchQuery, categoriaSeleccionada, maxPrecio, disponibilidadFiltro, tagSeleccionado, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setCategoriaSeleccionada('todas');
    setDisponibilidadFiltro('todos');
    setMaxPrecio(precioMaximoCatalogo);
    setTagSeleccionado(null);
    setSortBy('destacados');
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
      categoriaSeleccionada !== 'todas' ||
      disponibilidadFiltro !== 'todos' ||
      maxPrecio < precioMaximoCatalogo ||
      tagSeleccionado
  );

  return {
    productosLista,
    searchQuery,
    setSearchQuery,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    disponibilidadFiltro,
    setDisponibilidadFiltro,
    maxPrecio,
    setMaxPrecio,
    precioMaximoCatalogo,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortDropdownOpen,
    setSortDropdownOpen,
    sortDropdownRef,
    tagSeleccionado,
    setTagSeleccionado,
    camisetasFiltradas,
    resetFilters,
    hasActiveFilters
  };
}
