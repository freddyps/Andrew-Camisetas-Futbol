import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabaseClient';
import { 
  getProductos, 
  getProductosSync, 
  guardarProductosLocales, 
  uploadProductoImagen, 
  eliminarProductoRemoto 
} from '../../../services/productService';

/**
 * Custom Hook useAdminProducts:
 * Centraliza la lista de camisetas, filtros, toggles rápidos de stock,
 * subida de fotografías y operaciones CRUD con persistencia local y en Supabase.
 */
export function useAdminProducts({ onNotificar = () => {} }) {
  const [productos, setProductos] = useState(() => getProductosSync());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtroStock, setFiltroStock] = useState('todos'); // 'todos' | 'stock' | 'pedido'

  // Modales y estados de edición/eliminación
  const [modalNuevo, setModalNuevo] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [subiendoImg, setSubiendoImg] = useState(false);

  // Referencias a inputs de archivos
  const fileInputNuevoRef = useRef(null);
  const fileInputEditRef = useRef(null);

  // Formulario nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: 'SELECCIONES',
    categoriaId: 'selecciones',
    precio: 89,
    precioAntes: 120,
    precioShort: 35,
    stock: 12,
    stockPorTalla: { S: 3, M: 3, L: 3, XL: 3 },
    inStock: true,
    oferta: true,
    tag: 'NOVEDAD',
    imagen: '',
    galeria: [],
    descripcion: 'Prenda versión jugador con parches oficiales termo-sellados y tecnología transpirable.',
    tallas: ['S', 'M', 'L', 'XL']
  });

  const cargarProductos = async () => {
    setLoading(true);
    const data = await getProductos();
    setProductos(data);
    setLoading(false);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const actualizarListaYGuardar = (nuevaLista, mensaje) => {
    setProductos(nuevaLista);
    guardarProductosLocales(nuevaLista);
    if (mensaje) onNotificar(mensaje);
  };

  // Alternar En Stock / Bajo Pedido rápido
  const handleToggleStock = (id) => {
    const actualizados = productos.map((p) => {
      if (p.id === id) {
        const nuevoEstado = !p.inStock;
        const tallas = Array.isArray(p.tallas) && p.tallas.length > 0 ? p.tallas : ['S', 'M', 'L', 'XL'];
        const stockBase = nuevoEstado ? (p.stock > 0 ? p.stock : 12) : 0;
        const nuevoStockPorTalla = {};
        if (nuevoEstado) {
          const base = Math.floor(stockBase / tallas.length);
          let resto = stockBase % tallas.length;
          tallas.forEach((t) => {
            nuevoStockPorTalla[t] = base + (resto > 0 ? 1 : 0);
            if (resto > 0) resto--;
          });
        } else {
          tallas.forEach((t) => {
            nuevoStockPorTalla[t] = 0;
          });
        }
        return {
          ...p,
          inStock: nuevoEstado,
          stock: stockBase,
          stockPorTalla: nuevoStockPorTalla
        };
      }
      return p;
    });
    actualizarListaYGuardar(actualizados, 'Disponibilidad de stock actualizada');
  };

  // Modificar cantidad numérica de stock directamente
  const handleCambioStockRapido = (id, nuevoStock) => {
    const cant = Math.max(0, parseInt(nuevoStock) || 0);
    const actualizados = productos.map((p) => {
      if (p.id === id) {
        const tallas = Array.isArray(p.tallas) && p.tallas.length > 0 ? p.tallas : ['S', 'M', 'L', 'XL'];
        const nuevoStockPorTalla = {};
        const base = Math.floor(cant / tallas.length);
        let resto = cant % tallas.length;
        tallas.forEach((t) => {
          nuevoStockPorTalla[t] = base + (resto > 0 ? 1 : 0);
          if (resto > 0) resto--;
        });
        return {
          ...p,
          stock: cant,
          inStock: cant > 0,
          stockPorTalla: nuevoStockPorTalla
        };
      }
      return p;
    });
    actualizarListaYGuardar(actualizados);
  };

  // Modificar stock de una talla individual directamente desde la fila de inventario
  const handleCambioStockPorTalla = (id, talla, nuevaCantidad) => {
    const cant = Math.max(0, parseInt(nuevaCantidad) || 0);
    const actualizados = productos.map((p) => {
      if (p.id === id) {
        const tallas = Array.isArray(p.tallas) && p.tallas.length > 0 ? p.tallas : ['S', 'M', 'L', 'XL'];
        const nuevoStockPorTalla = { ...(p.stockPorTalla || {}) };
        tallas.forEach((t) => {
          if (nuevoStockPorTalla[t] === undefined) {
            nuevoStockPorTalla[t] = Math.floor((p.stock || 0) / tallas.length);
          }
        });
        nuevoStockPorTalla[talla] = cant;
        const nuevoStockTotal = Object.values(nuevoStockPorTalla).reduce(
          (acc, v) => acc + (parseInt(v) || 0),
          0
        );
        const actualizado = {
          ...p,
          stockPorTalla: nuevoStockPorTalla,
          stock: nuevoStockTotal,
          inStock: nuevoStockTotal > 0
        };
        supabase
          .from('productos')
          .update({
            stockPorTalla: nuevoStockPorTalla,
            stock: nuevoStockTotal,
            inStock: nuevoStockTotal > 0
          })
          .eq('id', id)
          .then(() => {})
          .catch(console.warn);
        return actualizado;
      }
      return p;
    });
    actualizarListaYGuardar(actualizados, `Stock de talla ${talla} actualizado`);
  };

  // Eliminar producto con modal personalizado
  const handleConfirmarEliminar = () => {
    if (!productoAEliminar) return;
    const prodId = productoAEliminar.id;
    const prodNombre = productoAEliminar.nombre;
    
    // Eliminación inmediata en memoria y LocalStorage
    const actualizados = productos.filter((p) => p.id !== prodId);
    setProductos(actualizados);
    guardarProductosLocales(actualizados);
    setProductoAEliminar(null);
    onNotificar(`Camiseta "${prodNombre}" eliminada al instante.`);

    // Eliminar de Supabase en segundo plano
    eliminarProductoRemoto(prodId);
  };

  // Subir 1 o N imágenes en modal nuevo
  const handleSubirImagenNuevo = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSubiendoImg(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadProductoImagen(file)));
      const urlsValidas = urls.filter(Boolean);
      if (urlsValidas.length > 0) {
        setNuevoProducto((prev) => {
          const galeriaPrev = Array.isArray(prev.galeria)
            ? prev.galeria.filter((img) => img && img !== '/brand/logo_andrew_v2.webp')
            : (prev.imagen && prev.imagen !== '/brand/logo_andrew_v2.webp' ? [prev.imagen] : []);
          const nuevaGaleria = [...galeriaPrev, ...urlsValidas];
          return {
            ...prev,
            imagen: nuevaGaleria[0],
            galeria: nuevaGaleria
          };
        });
        onNotificar(
          urlsValidas.length === 1
            ? 'Foto cargada con éxito.'
            : `${urlsValidas.length} fotos agregadas a la camiseta.`
        );
      }
    } catch {
      alert('Error al procesar las imágenes.');
    } finally {
      setSubiendoImg(false);
      e.target.value = '';
    }
  };

  // Subir 1 o N imágenes en modal edición
  const handleSubirImagenEdit = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !productoEditando) return;

    setSubiendoImg(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadProductoImagen(file)));
      const urlsValidas = urls.filter(Boolean);
      if (urlsValidas.length > 0) {
        setProductoEditando((prev) => {
          const galeriaPrev = Array.isArray(prev.galeria) && prev.galeria.length > 0
            ? prev.galeria.filter((img) => img && img !== '/brand/logo_andrew_v2.webp')
            : (prev.imagen && prev.imagen !== '/brand/logo_andrew_v2.webp' ? [prev.imagen] : []);
          const nuevaGaleria = [...galeriaPrev, ...urlsValidas];
          return {
            ...prev,
            imagen: nuevaGaleria[0],
            galeria: nuevaGaleria
          };
        });
        onNotificar(
          urlsValidas.length === 1
            ? 'Foto agregada con éxito.'
            : `${urlsValidas.length} fotos agregadas a la galería.`
        );
      }
    } catch {
      alert('Error al procesar las imágenes.');
    } finally {
      setSubiendoImg(false);
      e.target.value = '';
    }
  };

  // Guardar nuevo producto
  const handleCrearProducto = (e, mantenerAbierto = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!nuevoProducto.nombre.trim()) {
      alert('Por favor ingresa el nombre de la camiseta.');
      return;
    }

    const baseId = nuevoProducto.nombre
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `camiseta-${Date.now()}`;

    const existeId = productos.some((p) => p.id === baseId);
    const id = existeId ? `${baseId}-${Date.now().toString().slice(-4)}` : baseId;

    const stockPorTalla = nuevoProducto.stockPorTalla || {
      S: Math.floor((parseInt(nuevoProducto.stock) || 12) / 4),
      M: Math.floor((parseInt(nuevoProducto.stock) || 12) / 4),
      L: Math.floor((parseInt(nuevoProducto.stock) || 12) / 4),
      XL: Math.floor((parseInt(nuevoProducto.stock) || 12) / 4)
    };

    const stockTotalCalculado = nuevoProducto.inStock
      ? Object.values(stockPorTalla).reduce((acc, v) => acc + (parseInt(v) || 0), 0)
      : 0;

    const galeriaLimpiada = Array.isArray(nuevoProducto.galeria) && nuevoProducto.galeria.length > 0
      ? nuevoProducto.galeria.filter(Boolean)
      : (nuevoProducto.imagen ? [nuevoProducto.imagen] : ['/brand/logo_andrew_v2.webp']);

    const imagenPrincipal = galeriaLimpiada[0] || '/brand/logo_andrew_v2.webp';

    const productoCompleto = {
      ...nuevoProducto,
      id,
      imagen: imagenPrincipal,
      precio: parseFloat(nuevoProducto.precio) || 89,
      precioAntes: nuevoProducto.precioAntes ? parseFloat(nuevoProducto.precioAntes) : null,
      precioShort: parseFloat(nuevoProducto.precioShort) || 35,
      stockPorTalla,
      stock: stockTotalCalculado,
      inStock: Boolean(nuevoProducto.inStock && stockTotalCalculado > 0),
      rating: 5,
      reviewsCount: 1,
      galeria: galeriaLimpiada
    };

    const actualizados = [productoCompleto, ...productos];
    actualizarListaYGuardar(
      actualizados,
      mantenerAbierto
        ? `¡Camiseta "${productoCompleto.nombre}" guardada! Listo para subir la siguiente.`
        : `¡Camiseta "${productoCompleto.nombre}" agregada al catálogo!`
    );
    
    // Sincronizar en Supabase
    supabase.from('productos').upsert([productoCompleto]).then(() => {}).catch(console.warn);

    if (!mantenerAbierto) {
      setModalNuevo(false);
    }
    setNuevoProducto({
      nombre: '',
      categoria: nuevoProducto.categoria || 'SELECCIONES',
      categoriaId: nuevoProducto.categoriaId || 'selecciones',
      precio: nuevoProducto.precio || 89,
      precioAntes: nuevoProducto.precioAntes ?? 120,
      precioShort: nuevoProducto.precioShort || 35,
      stock: 12,
      stockPorTalla: { S: 3, M: 3, L: 3, XL: 3 },
      inStock: true,
      oferta: true,
      tag: 'NOVEDAD',
      imagen: '',
      galeria: [],
      descripcion: 'Prenda versión jugador con parches oficiales termo-sellados y tecnología transpirable.',
      tallas: ['S', 'M', 'L', 'XL']
    });
  };

  // Guardar edición de producto
  const handleGuardarEdicion = (e) => {
    e.preventDefault();
    if (!productoEditando) return;

    const stockPorTalla = productoEditando.stockPorTalla || {
      S: Math.floor((parseInt(productoEditando.stock) || 12) / 4),
      M: Math.floor((parseInt(productoEditando.stock) || 12) / 4),
      L: Math.floor((parseInt(productoEditando.stock) || 12) / 4),
      XL: Math.floor((parseInt(productoEditando.stock) || 12) / 4)
    };

    const stockTotalCalculado = productoEditando.inStock
      ? Object.values(stockPorTalla).reduce((acc, v) => acc + (parseInt(v) || 0), 0)
      : 0;

    const galeriaLimpiada = Array.isArray(productoEditando.galeria) && productoEditando.galeria.length > 0
      ? productoEditando.galeria.filter(Boolean)
      : (productoEditando.imagen ? [productoEditando.imagen] : ['/brand/logo_andrew_v2.webp']);

    const imagenPrincipal = galeriaLimpiada[0] || '/brand/logo_andrew_v2.webp';

    const productoActualizado = {
      ...productoEditando,
      imagen: imagenPrincipal,
      precio: parseFloat(productoEditando.precio) || 89,
      precioAntes: productoEditando.precioAntes ? parseFloat(productoEditando.precioAntes) : null,
      precioShort: parseFloat(productoEditando.precioShort) || 35,
      stockPorTalla,
      stock: stockTotalCalculado,
      inStock: Boolean(productoEditando.inStock && stockTotalCalculado > 0),
      galeria: galeriaLimpiada
    };

    const actualizados = productos.map((p) => {
      if (p.id === productoEditando.id) {
        return productoActualizado;
      }
      return p;
    });

    actualizarListaYGuardar(actualizados, `Camiseta "${productoEditando.nombre}" modificada con éxito.`);
    
    // Sincronizar en Supabase
    supabase.from('productos').upsert([productoActualizado]).then(() => {}).catch(console.warn);

    setProductoEditando(null);
  };

  // Filtros de búsqueda
  const productosFiltrados = productos.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          p.categoria?.toLowerCase().includes(search.toLowerCase()) ||
                          p.tag?.toLowerCase().includes(search.toLowerCase());
    if (!coincideTexto) return false;
    if (filtroStock === 'stock') return p.inStock;
    if (filtroStock === 'pedido') return !p.inStock;
    return true;
  });

  const totalProductos = productos.length;
  const enStockCount = productos.filter((p) => p.inStock).length;
  const bajoPedidoCount = productos.filter((p) => !p.inStock).length;
  const totalUnidades = productos.reduce((acc, p) => acc + (p.stock || 0), 0);

  return {
    productos,
    productosFiltrados,
    loading,
    search,
    setSearch,
    filtroStock,
    setFiltroStock,
    totalProductos,
    enStockCount,
    bajoPedidoCount,
    totalUnidades,

    // Modales
    modalNuevo,
    setModalNuevo,
    productoEditando,
    setProductoEditando,
    productoAEliminar,
    setProductoAEliminar,
    subiendoImg,

    // Formulario nuevo
    nuevoProducto,
    setNuevoProducto,

    // Refs
    fileInputNuevoRef,
    fileInputEditRef,

    // Operaciones
    cargarProductos,
    handleToggleStock,
    handleCambioStockRapido,
    handleCambioStockPorTalla,
    handleConfirmarEliminar,
    handleSubirImagenNuevo,
    handleSubirImagenEdit,
    handleCrearProducto,
    handleGuardarEdicion
  };
}
