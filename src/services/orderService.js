import { supabase } from '../supabaseClient';
import { descontarStockProductos, restaurarStockProductos } from './productService';

const ORDERS_STORAGE_KEY = 'andrew_pedidos_locales';
const MY_ORDER_IDS_KEY = 'andrew_mis_pedidos_ids';
const DELETED_ORDER_IDS_KEY = 'andrew_pedidos_eliminados_ids';

export function getMisPedidosIds() {
  try {
    const raw = localStorage.getItem(MY_ORDER_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function registrarMiPedidoId(id) {
  if (!id) return;
  const actuales = getMisPedidosIds();
  if (!actuales.includes(id)) {
    const nuevos = [id, ...actuales];
    try {
      localStorage.setItem(MY_ORDER_IDS_KEY, JSON.stringify(nuevos));
    } catch (e) {
      console.warn('No se pudo guardar ID de pedido en localStorage:', e);
    }
  }
}

function getDeletedOrderIds() {
  try {
    const raw = localStorage.getItem(DELETED_ORDER_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function registrarPedidoEliminadoId(id) {
  if (!id) return;
  const actuales = getDeletedOrderIds();
  if (!actuales.includes(id)) {
    try {
      localStorage.setItem(DELETED_ORDER_IDS_KEY, JSON.stringify([id, ...actuales]));
    } catch {
      // ignore
    }
  }
}

// Caché en memoria y control de sincronización remota (evita bucles o peticiones repetidas)
let memoriaPedidos = null;
let pedidosSyncEnCurso = false;
let ultimoSyncPedidos = 0;
const PEDIDOS_SYNC_COOLDOWN_MS = 30000;

/**
 * Obtiene los pedidos de forma síncrona/inmediata desde memoria o LocalStorage.
 * Garantiza carga en 0ms sin pantalla de espera.
 */
export function getPedidosSync() {
  if (memoriaPedidos && Array.isArray(memoriaPedidos)) {
    return memoriaPedidos;
  }
  const local = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        memoriaPedidos = parsed;
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  memoriaPedidos = [];
  return [];
}

/**
 * Fusiona los pedidos obtenidos de Supabase con los pedidos locales para que
 * ninguna orden recién creada o actualizada localmente se pierda si falló la red.
 */
function fusionarPedidos(remotos = [], locales = []) {
  const eliminadosIds = new Set(getDeletedOrderIds());
  const mapaRemoto = new Map(
    remotos
      .filter((p) => p && !eliminadosIds.has(p.id))
      .map((p) => [p.id, p])
  );

  const resultado = [...mapaRemoto.values()];

  locales.forEach((loc) => {
    if (!loc || eliminadosIds.has(loc.id)) return;
    const rem = mapaRemoto.get(loc.id);
    if (!rem) {
      // El pedido existe localmente pero aún no se guardó en Supabase: conservarlo
      resultado.unshift(loc);
    } else {
      const fechaLocal = loc.updated_at ? new Date(loc.updated_at).getTime() : 0;
      const fechaRemota = rem.updated_at ? new Date(rem.updated_at).getTime() : 0;
      if (fechaLocal > fechaRemota || (!rem.pagoVerificacion?.comprobanteImagen && loc.pagoVerificacion?.comprobanteImagen)) {
        const idx = resultado.findIndex((r) => r.id === loc.id);
        if (idx !== -1) {
          resultado[idx] = {
            ...rem,
            ...loc,
            pagoVerificacion: {
              ...(rem.pagoVerificacion || {}),
              ...(loc.pagoVerificacion || {}),
              comprobanteImagen: loc.pagoVerificacion?.comprobanteImagen || rem.pagoVerificacion?.comprobanteImagen || null
            }
          };
        }
      }
    }
  });

  return resultado.sort((a, b) => {
    const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return tB - tA;
  });
}

function persistirPedidosLocales(lista) {
  memoriaPedidos = lista;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(lista));
  } catch (e) {
    console.warn('QuotaExceededError al guardar pedidos en localStorage; aligerando comprobantes antiguos:', e);
    try {
      const listaLigera = lista.map((p, idx) =>
        idx === 0
          ? p
          : {
              ...p,
              pagoVerificacion: p.pagoVerificacion
                ? { ...p.pagoVerificacion, comprobanteImagen: null }
                : undefined
            }
      );
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(listaLigera));
    } catch {
      // ignore if still full
    }
  }
}

/**
 * Servicio de gestión de pedidos y reservas (Adelanto S/ 40 o Pago Completo)
 * Retorna al instante los datos locales (0ms) y sincroniza con Supabase en segundo plano.
 */
export async function getPedidos(forzarSync = false) {
  // 1. Devolver inmediatamente los pedidos en caché/localStorage sin esperar red
  const localData = getPedidosSync();

  const ahora = Date.now();
  if (!forzarSync && (pedidosSyncEnCurso || (ahora - ultimoSyncPedidos < PEDIDOS_SYNC_COOLDOWN_MS))) {
    return localData;
  }

  pedidosSyncEnCurso = true;
  ultimoSyncPedidos = ahora;

  // 2. Sincronizar en segundo plano desde Supabase sin bloquear la interfaz
  supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
    .then(({ data, error }) => {
      if (!error && Array.isArray(data) && data.length > 0) {
        const actualesLocal = getPedidosSync();
        const fusionados = fusionarPedidos(data, actualesLocal);
        persistirPedidosLocales(fusionados);
        window.dispatchEvent(new Event('andrew_pedidos_updated'));
      }
    })
    .catch(() => {
      // Si Supabase tarda o no está disponible, se mantiene la copia local sin demorar
    })
    .finally(() => {
      pedidosSyncEnCurso = false;
    });

  return localData;
}

export async function guardarNuevoPedido(pedido) {
  const ahora = new Date().toISOString();
  const sufijoUnico = Math.random().toString(36).substring(2, 5).toUpperCase();
  const nuevoPedido = {
    id: `AND-${Date.now().toString().slice(-6)}-${sufijoUnico}`,
    created_at: ahora,
    updated_at: ahora,
    fecha: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    estado: 'PENDIENTE_VERIFICACION',
    ...pedido
  };

  // 1. Guardar localmente en 0ms
  const pedidosLocales = getPedidosSync();
  const actualizados = [nuevoPedido, ...pedidosLocales];
  persistirPedidosLocales(actualizados);
  registrarMiPedidoId(nuevoPedido.id);
  window.dispatchEvent(new Event('andrew_pedidos_updated'));

  // 2. Sincronizar con Supabase en segundo plano
  supabase
    .from('pedidos')
    .insert([nuevoPedido])
    .then(() => {})
    .catch((err) => console.warn('No se pudo guardar en Supabase, persistido localmente:', err));

  return nuevoPedido;
}

export async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  const pedidosLocales = getPedidosSync();
  const pedidoAnterior = pedidosLocales.find((p) => p.id === pedidoId);
  const estadoAnterior = pedidoAnterior?.estado;
  const ahora = new Date().toISOString();

  // Si pasa de un estado activo a CANCELADO, devolvemos las unidades al inventario
  if (pedidoAnterior && estadoAnterior !== 'CANCELADO' && nuevoEstado === 'CANCELADO') {
    await restaurarStockProductos(pedidoAnterior.items || []);
  }
  // Si estaba CANCELADO y se reactiva a otro estado, volvemos a descontar el stock
  if (pedidoAnterior && estadoAnterior === 'CANCELADO' && nuevoEstado !== 'CANCELADO') {
    await descontarStockProductos(pedidoAnterior.items || []);
  }

  const actualizados = pedidosLocales.map((p) => {
    if (p.id === pedidoId) {
      return { ...p, estado: nuevoEstado, updated_at: ahora };
    }
    return p;
  });

  persistirPedidosLocales(actualizados);
  window.dispatchEvent(new Event('andrew_pedidos_updated'));

  supabase
    .from('pedidos')
    .update({ estado: nuevoEstado, updated_at: ahora })
    .eq('id', pedidoId)
    .then(() => {})
    .catch((err) => console.warn('No se pudo actualizar estado en Supabase:', err));

  return actualizados;
}

export async function eliminarPedido(pedidoId) {
  const pedidosLocales = getPedidosSync();
  const pedidoAEliminar = pedidosLocales.find((p) => p.id === pedidoId);

  // Si el pedido que se elimina no estaba cancelado ni entregado, restaurar su stock
  if (
    pedidoAEliminar &&
    pedidoAEliminar.estado !== 'CANCELADO' &&
    pedidoAEliminar.estado !== 'ENTREGADO'
  ) {
    await restaurarStockProductos(pedidoAEliminar.items || []);
  }

  registrarPedidoEliminadoId(pedidoId);
  const actualizados = pedidosLocales.filter((p) => p.id !== pedidoId);

  persistirPedidosLocales(actualizados);
  window.dispatchEvent(new Event('andrew_pedidos_updated'));

  supabase
    .from('pedidos')
    .delete()
    .eq('id', pedidoId)
    .then(() => {})
    .catch((err) => console.warn('No se pudo eliminar en Supabase:', err));

  return actualizados;
}
