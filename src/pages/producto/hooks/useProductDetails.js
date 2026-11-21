import { useState, useEffect } from 'react';
import { getProductos, getProductosSync } from '../../../services/productService';

export function useProductDetails(productoId) {
  const [listaProductos, setListaProductos] = useState(() => getProductosSync());
  const [modalGuiaTallas, setModalGuiaTallas] = useState(false);

  useEffect(() => {
    const fetchProds = async () => {
      try {
        const data = await getProductos();
        if (Array.isArray(data) && data.length > 0) {
          setListaProductos(data);
        }
      } catch (err) {
        console.error('Error cargando productos:', err);
      }
    };
    fetchProds();

    const handleUpdate = () => setListaProductos(getProductosSync());
    window.addEventListener('andrew_productos_updated', handleUpdate);
    return () => window.removeEventListener('andrew_productos_updated', handleUpdate);
  }, []);

  const producto = (listaProductos && listaProductos.find((p) => p.id === productoId)) 
    || listaProductos?.[0] 
    || null;

  const tallasDisponibles = Array.isArray(producto?.tallas) && producto.tallas.length > 0 
    ? producto.tallas 
    : ['S', 'M', 'L', 'XL'];

  // Tallas con stock disponible > 0
  const tallasConStock = producto?.stockPorTalla
    ? tallasDisponibles.filter((t) => {
        const cant = parseInt(producto.stockPorTalla[t]);
        return !isNaN(cant) && cant > 0;
      })
    : (producto?.stock > 0 ? tallasDisponibles : []);

  const tallasValidas = tallasDisponibles;

  const galeriaValida = Array.isArray(producto?.galeria) && producto.galeria.length > 0 
    ? producto.galeria 
    : [producto?.imagen || '/brand/logo_andrew_v2.webp'];

  const [imagenActiva, setImagenActiva] = useState(galeriaValida[0]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState(tallasConStock[0] || tallasDisponibles[0] || 'S');
  const [cantidad, setCantidad] = useState(1);
  const [tabActiva, setTabActiva] = useState('description');

  const [nombrePersonalizado, setNombrePersonalizado] = useState('');
  const [numeroPersonalizado, setNumeroPersonalizado] = useState('');

  const [incluirShort, setIncluirShort] = useState(false);
  const [tallaShort, setTallaShort] = useState(tallasConStock[0] || 'M');

  const primeraImagen = galeriaValida[0];
  const primeraTalla = tallasConStock[0] || tallasDisponibles[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (primeraImagen) setImagenActiva(primeraImagen);
    if (primeraTalla) setTallaSeleccionada(primeraTalla);
    setIncluirShort(false);
  }, [productoId, primeraImagen, primeraTalla, producto?.inStock]);

  const precioUnitarioFinal = Number(producto?.precio) || 0;

  const productosRelacionados = (listaProductos || [])
    .filter((p) => p.id !== producto?.id)
    .slice(0, 5);

  return {
    producto,
    tallasValidas,
    galeriaValida,
    imagenActiva,
    setImagenActiva,
    tallaSeleccionada,
    setTallaSeleccionada,
    cantidad,
    setCantidad,
    tabActiva,
    setTabActiva,
    nombrePersonalizado,
    setNombrePersonalizado,
    numeroPersonalizado,
    setNumeroPersonalizado,
    incluirShort,
    setIncluirShort,
    tallaShort,
    setTallaShort,
    modalGuiaTallas,
    setModalGuiaTallas,
    precioUnitarioFinal,
    productosRelacionados
  };
}
