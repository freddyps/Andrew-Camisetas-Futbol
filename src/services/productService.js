import { CATALOGO_DATA } from '../data/catalogoData';
import { supabase } from '../supabaseClient';
import { validateImageFile } from '../utils/security';

const STORAGE_KEY = 'andrew_admin_productos';

// Cache en memoria y control de sincronización remota (evita peticiones duplicadas o bucles de error)
let memoriaProductos = null;
let syncEnCurso = false;
let ultimoIntentoSync = 0;
let supabaseOffline = false;
const SYNC_COOLDOWN_MS = 60000;

export function isSupabaseProductosOffline() {
  return supabaseOffline;
}

export function resetProductosSyncCooldown() {
  ultimoIntentoSync = 0;
  supabaseOffline = false;
}

/**
 * Obtener productos de forma síncrona/inmediata desde memoria o LocalStorage.
 * No bloquea la UI con esperas de red lentas.
 */
export function getProductosSync() {
  if (memoriaProductos && Array.isArray(memoriaProductos) && memoriaProductos.length > 0) {
    return memoriaProductos;
  }
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filtrar productos antiguos que apuntaban a archivos locales inexistentes de /camisetas/
        const productosValidos = parsed.filter(p => !p.imagen?.startsWith('/camisetas/'));
        if (productosValidos.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(productosValidos));
        }
        if (productosValidos.length > 0) {
          memoriaProductos = productosValidos;
          return productosValidos;
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }
  memoriaProductos = CATALOGO_DATA;
  return CATALOGO_DATA;
}

/**
 * Normaliza y formatea un objeto producto para asegurar consistencia en stock por tallas
 */
export function normalizarProducto(item) {
  const tallasDisponibles = Array.isArray(item.tallas) && item.tallas.length > 0 
    ? item.tallas 
    : ['S', 'M', 'L', 'XL'];

  let stockPorTalla = item.stockPorTalla;
  if (!stockPorTalla || typeof stockPorTalla !== 'object') {
    stockPorTalla = {};
    const stockTotal = parseInt(item.stock) || 0;
    // Si viene stock numérico global, repartir equitativamente o asignar a las tallas
    const porTalla = Math.floor(stockTotal / (tallasDisponibles.length || 1));
    tallasDisponibles.forEach((t) => {
      stockPorTalla[t] = porTalla;
    });
  }

  // El stock total es la suma de los stocks por talla si está en stock
  const stockCalculado = Object.values(stockPorTalla).reduce((acc, val) => acc + (parseInt(val) || 0), 0);
  const stockFinal = item.inStock ? (stockCalculado > 0 ? stockCalculado : (parseInt(item.stock) || 0)) : 0;

  return {
    ...item,
    precio: parseFloat(item.precio) || 89,
    precioAntes: item.precioAntes ? parseFloat(item.precioAntes) : null,
    precioShort: item.precioShort ? parseFloat(item.precioShort) : 35,
    stock: stockFinal,
    inStock: Boolean(item.inStock && stockFinal > 0),
    stockPorTalla,
    tallas: tallasDisponibles,
    galeria: Array.isArray(item.galeria) && item.galeria.length > 0 ? item.galeria : [item.imagen]
  };
}

/**
 * Fusiona la lista de productos de Supabase con los cambios locales más recientes
 * para evitar que un fallo de escritura en red sobrescriba el stock o productos recién editados.
 */
function fusionarProductos(remotos = [], locales = []) {
  const mapaRemoto = new Map(remotos.map((p) => [p.id, normalizarProducto(p)]));
  const resultado = [...mapaRemoto.values()];

  locales.forEach((locRaw) => {
    const loc = normalizarProducto(locRaw);
    const rem = mapaRemoto.get(loc.id);
    if (!rem) {
      // Si fue creado localmente y aún no figura en Supabase (y no es del seed estático salvo que el remoto esté vacío)
      const esSeed = CATALOGO_DATA.some((s) => s.id === loc.id);
      if (!esSeed || remotos.length === 0) {
        resultado.unshift(loc);
      }
    } else if (loc.local_updated_at) {
      const fechaLocal = new Date(loc.local_updated_at).getTime();
      const fechaRemota = rem.updated_at ? new Date(rem.updated_at).getTime() : 0;
      if (fechaLocal > fechaRemota) {
        const idx = resultado.findIndex((r) => r.id === loc.id);
        if (idx !== -1) resultado[idx] = loc;
      }
    }
  });

  return resultado;
}

/**
 * Servicio centralizado para leer y sincronizar productos entre
 * Supabase, LocalStorage y la base de datos de Andrew Camisetas.
 * Evita peticiones duplicadas o reintentos continuos cuando la red/DNS falla.
 */
export async function getProductos(forzarSync = false) {
  // 1. Si ya tenemos caché local, devolverla al instante
  const localData = getProductosSync().map(normalizarProducto);

  const ahora = Date.now();
  if (!forzarSync && (syncEnCurso || (ahora - ultimoIntentoSync < SYNC_COOLDOWN_MS))) {
    return localData;
  }

  // 2. Intentar actualizar en segundo plano desde Supabase con control de concurrencia y cooldown
  syncEnCurso = true;
  ultimoIntentoSync = ahora;

  supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: false })
    .limit(200)
    .then(({ data, error }) => {
      if (error) {
        supabaseOffline = true;
        window.dispatchEvent(new CustomEvent('andrew_network_status', { detail: { offline: true } }));
        return;
      }
      supabaseOffline = false;
      window.dispatchEvent(new CustomEvent('andrew_network_status', { detail: { offline: false } }));
      if (Array.isArray(data) && data.length > 0) {
        const actualesLocal = getProductosSync();
        const fusionados = fusionarProductos(data, actualesLocal);
        memoriaProductos = fusionados;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fusionados));
        } catch {
          // ignore quota error
        }
        window.dispatchEvent(new Event('andrew_productos_updated'));
      }
    })
    .catch(() => {
      supabaseOffline = true;
      window.dispatchEvent(new CustomEvent('andrew_network_status', { detail: { offline: true } }));
    })
    .finally(() => {
      syncEnCurso = false;
    });

  return localData;
}

export function guardarProductosLocales(lista) {
  const ahora = new Date().toISOString();
  const listaNormalizada = lista.map((item) => ({
    ...normalizarProducto(item),
    local_updated_at: item.local_updated_at || ahora
  }));
  memoriaProductos = listaNormalizada;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listaNormalizada));
  } catch (e) {
    console.warn('No se pudo persistir catálogo en localStorage:', e);
  }
  // Disparar evento para que todos los componentes (Catálogo, Detalles, etc.) se actualicen en 0ms
  window.dispatchEvent(new Event('andrew_productos_updated'));
}

/**
 * Guarda o actualiza un producto tanto en LocalStorage como en Supabase
 */
export async function guardarProductoRemoto(producto) {
  const normalizado = normalizarProducto(producto);
  try {
    await supabase.from('productos').upsert([normalizado]);
  } catch (err) {
    console.warn('No se pudo guardar en Supabase, guardado localmente:', err);
  }
  return normalizado;
}

/**
 * Descuenta el stock en tiempo real cuando un cliente realiza una compra
 * Afecta tanto la cantidad global como la talla específica seleccionada.
 */
export async function descontarStockProductos(itemsComprados = []) {
  if (!Array.isArray(itemsComprados) || itemsComprados.length === 0) return;

  const productosActuales = getProductosSync().map(normalizarProducto);
  let huboCambios = false;
  const ahora = new Date().toISOString();

  const actualizados = productosActuales.map((prod) => {
    // Buscar todas las partidas de este producto compradas en stock (puede haber varias tallas del mismo modelo)
    const partidasProducto = itemsComprados.filter(
      (item) => item.id === prod.id && item.inStock !== false
    );

    if (partidasProducto.length > 0) {
      huboCambios = true;
      const nuevoStockPorTalla = { ...(prod.stockPorTalla || {}) };

      partidasProducto.forEach((itemComprado) => {
        const cantAComprar = parseInt(itemComprado.cantidad) || 1;
        const tallaComprada = itemComprado.tallaSeleccionada || itemComprado.talla || 'M';
        const stockActualTalla = parseInt(nuevoStockPorTalla[tallaComprada]) || 0;
        nuevoStockPorTalla[tallaComprada] = Math.max(0, stockActualTalla - cantAComprar);
      });

      const nuevoStockTotal = Object.values(nuevoStockPorTalla).reduce(
        (acc, val) => acc + (parseInt(val) || 0),
        0
      );

      const productoActualizado = {
        ...prod,
        stockPorTalla: nuevoStockPorTalla,
        stock: nuevoStockTotal,
        inStock: nuevoStockTotal > 0,
        local_updated_at: ahora
      };

      // Sincronizar descuento en Supabase vía RPC atómico (evita sobreventa y errores RLS)
      partidasProducto.forEach((itemComprado) => {
        const cantAComprar = parseInt(itemComprado.cantidad) || 1;
        const tallaComprada = itemComprado.tallaSeleccionada || itemComprado.talla || 'M';
        supabase
          .rpc('descontar_stock_atomico', {
            p_producto_id: String(prod.id),
            p_talla: String(tallaComprada),
            p_cantidad: cantAComprar
          })
          .then(({ error }) => {
            if (error) {
              // Fallback solo si el RPC aún no fue ejecutado en Supabase
              return supabase
                .from('productos')
                .update({
                  stock: nuevoStockTotal,
                  inStock: nuevoStockTotal > 0,
                  stockPorTalla: nuevoStockPorTalla
                })
                .eq('id', prod.id);
            }
          })
          .catch((e) => console.warn('Error descontando stock en Supabase:', e));
      });

      return productoActualizado;
    }

    return prod;
  });

  if (huboCambios) {
    guardarProductosLocales(actualizados);
  }
}

/**
 * Restaura el stock por talla cuando un pedido se cancela o se elimina desde el Panel Admin.
 */
export async function restaurarStockProductos(itemsRestaurar = []) {
  if (!Array.isArray(itemsRestaurar) || itemsRestaurar.length === 0) return;

  const productosActuales = getProductosSync().map(normalizarProducto);
  let huboCambios = false;
  const ahora = new Date().toISOString();

  const actualizados = productosActuales.map((prod) => {
    const partidasProducto = itemsRestaurar.filter(
      (item) => item.id === prod.id && item.inStock !== false
    );

    if (partidasProducto.length > 0) {
      huboCambios = true;
      const nuevoStockPorTalla = { ...(prod.stockPorTalla || {}) };

      partidasProducto.forEach((itemDevuelto) => {
        const cantADevolver = parseInt(itemDevuelto.cantidad) || 1;
        const tallaDevuelta = itemDevuelto.tallaSeleccionada || itemDevuelto.talla || 'M';
        const stockActualTalla = parseInt(nuevoStockPorTalla[tallaDevuelta]) || 0;
        nuevoStockPorTalla[tallaDevuelta] = stockActualTalla + cantADevolver;
      });

      const nuevoStockTotal = Object.values(nuevoStockPorTalla).reduce(
        (acc, val) => acc + (parseInt(val) || 0),
        0
      );

      const productoActualizado = {
        ...prod,
        stockPorTalla: nuevoStockPorTalla,
        stock: nuevoStockTotal,
        inStock: nuevoStockTotal > 0,
        local_updated_at: ahora
      };

      supabase
        .from('productos')
        .update({
          stock: nuevoStockTotal,
          in_stock: nuevoStockTotal > 0,
          inStock: nuevoStockTotal > 0,
          stockPorTalla: nuevoStockPorTalla
        })
        .eq('id', prod.id)
        .then(() => {})
        .catch((e) => console.warn('Error restaurando stock en Supabase:', e));

      return productoActualizado;
    }

    return prod;
  });

  if (huboCambios) {
    guardarProductosLocales(actualizados);
  }
}

/**
 * Elimina un producto de inmediato en local y lanza el borrado a Supabase en background
 */
export async function eliminarProductoRemoto(productoId) {
  try {
    await supabase.from('productos').delete().eq('id', productoId);
  } catch (err) {
    console.warn('No se pudo eliminar en Supabase:', err);
  }
}

/**
 * Subir imagen directamente a Supabase Storage o convertir a Base64 como fallback
 */
export async function uploadProductoImagen(file) {
  if (!file) return null;

  const checkFile = validateImageFile(file, 5);
  if (!checkFile.valid) {
    throw new Error(checkFile.errorMsg);
  }

  try {
    const fileExt = (file.name.split('.').pop() || 'webp').toLowerCase().replace(/[^a-z0-9]/g, '');
    const fileName = `camiseta_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `camisetas/${fileName}`;

    // Intentar subir al bucket 'camisetas' o 'productos'
    const { error: uploadError } = await supabase.storage
      .from('camisetas')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('camisetas')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (e) {
    console.warn('Storage bucket no disponible, guardando como preview DataURL:', e);
  }

  // Fallback: Retornar como Data URL (Base64) para previsualización inmediata sin fallar
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}
