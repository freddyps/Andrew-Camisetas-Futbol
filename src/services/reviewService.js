import { supabase } from '../supabaseClient';
import { sanitizeText } from '../utils/security';

const REVIEWS_STORAGE_KEY = 'andrew_reviews_locales_v1';

/**
 * Servicio de Reseñas y Comentarios con Persistencia en Supabase
 * Tabla Supabase: reviews (id, producto_id, nombre_cliente, calificacion, comentario, aprobado, created_at)
 */

const DELETED_REVIEWS_STORAGE_KEY = 'andrew_reviews_deleted_ids_v1';

function getDeletedIds() {
  try {
    const raw = localStorage.getItem(DELETED_REVIEWS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDeletedId(id) {
  try {
    const deleted = getDeletedIds();
    const strId = String(id);
    if (!deleted.includes(strId)) {
      deleted.push(strId);
      localStorage.setItem(DELETED_REVIEWS_STORAGE_KEY, JSON.stringify(deleted));
    }
  } catch {
    // ignore
  }
}

export const SEED_REVIEWS = [
  {
    id: 'seed-1',
    producto_id: 'general',
    nombre_cliente: 'Christian Ramos',
    city: 'Lima (Envío InDrive / Shalom)',
    calificacion: 5,
    badge: 'ENTREGA INMEDIATA',
    comentario: 'Me llegó la camiseta de Perú con mi nombre y número estampados impecables. Calidad 1.1 exacta y atención por WhatsApp súper rápida.',
    product_nombre: 'Perú Oficial 2025/2026',
    image: '/clientes/cliente_peru.webp',
    aprobado: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'seed-2',
    producto_id: 'general',
    nombre_cliente: 'Álvaro Mendoza',
    city: 'Arequipa (Envío Shalom)',
    calificacion: 5,
    badge: 'CALIDAD BRUTAL',
    comentario: 'La camiseta del Real Madrid me llegó en su caja sellada con todas las etiquetas. El bordado del escudo y los detalles dorados están a otro nivel.',
    product_nombre: 'Real Madrid Local 24/25',
    image: '/clientes/cliente_madrid.webp',
    aprobado: true,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'seed-3',
    producto_id: 'general',
    nombre_cliente: 'Mateo & Gonzalo',
    city: 'Lima (Miraflores)',
    calificacion: 5,
    badge: 'PEDIDO DOBLE',
    comentario: 'Pedimos la del Barça y la del Inter para jugar la pichanga del fin de semana. Llegó súper rápido y con el adelanto de S/40 todo fue muy transparente.',
    product_nombre: 'FC Barcelona & Inter de Milán',
    image: '/clientes/cliente_barca_inter.webp',
    aprobado: true,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: 'seed-4',
    producto_id: 'general',
    nombre_cliente: 'Diego Carrillo',
    city: 'Trujillo (Agencia Shalom)',
    calificacion: 5,
    badge: 'ESTAMPADO TOP',
    comentario: 'Personalicé el dorsal oficial y quedó perfecto. Se nota el trabajo artesanal y la calidad de la tipografía oficial. 100% recomendado.',
    product_nombre: 'Taller de Estampados Personalizados',
    image: '/clientes/taller_estampados.webp',
    aprobado: true,
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  }
];

export async function getReviewsAprobadas(productoId = null) {
  const deletedIds = new Set(getDeletedIds().map(String));
  let reviews = [];

  // 1. Intentar consultar desde Supabase
  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('aprobado', true)
      .order('created_at', { ascending: false });

    if (productoId && productoId !== 'general') {
      query = query.eq('producto_id', productoId);
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      reviews = data.filter(r => !deletedIds.has(String(r.id)));
    }
  } catch (err) {
    console.warn('Consulta de reviews a Supabase falló o tabla no creada:', err);
  }

  // 2. Fusionar con LocalStorage para no perder comentarios locales
  const local = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (local !== null) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        const ids = new Set(reviews.map(r => String(r.id)));
        for (const item of parsed) {
          if (item && item.aprobado && !deletedIds.has(String(item.id)) && (!productoId || productoId === 'general' || item.producto_id === productoId)) {
            if (!ids.has(String(item.id))) {
              reviews.unshift(item);
              ids.add(String(item.id));
            }
          }
        }
        return reviews;
      }
    } catch {
      // ignore
    }
  } else {
    // Solo si no existe registro inicial en localStorage
    const initialSeeds = SEED_REVIEWS.filter(s => !deletedIds.has(String(s.id)));
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(initialSeeds));
    return initialSeeds;
  }

  return reviews.filter(r => !deletedIds.has(String(r.id)));
}

export async function getAllReviewsAdmin() {
  const deletedIds = new Set(getDeletedIds().map(String));
  let reviews = [];

  // 1. Intentar consultar todas desde Supabase (incluyendo pendientes)
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      reviews = data.filter(r => !deletedIds.has(String(r.id)));
    }
  } catch (err) {
    console.warn('No se pudo cargar reviews admin desde Supabase:', err);
  }

  // 2. LocalStorage
  const local = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (local !== null) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        const ids = new Set(reviews.map(r => String(r.id)));
        for (const item of parsed) {
          if (item && !deletedIds.has(String(item.id)) && !ids.has(String(item.id))) {
            reviews.unshift(item);
            ids.add(String(item.id));
          }
        }
        return reviews.filter(r => !deletedIds.has(String(r.id)));
      }
    } catch {
      // ignore
    }
  } else {
    // Primera vez que se carga
    const initialSeeds = SEED_REVIEWS.filter(s => !deletedIds.has(String(s.id)));
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(initialSeeds));
    return initialSeeds;
  }

  return reviews.filter(r => !deletedIds.has(String(r.id)));
}

export async function crearReview({
  producto_id = 'general',
  nombre_cliente,
  city = 'Lima (Envío Shalom / InDrive)',
  calificacion = 5,
  badge = 'COMPRA REAL',
  comentario,
  product_nombre = 'Camiseta Oficial Andrew',
  image = null,
  autoAprobar = true
}) {
  const nuevaReview = {
    id: `rev-${Date.now()}`,
    producto_id: sanitizeText(String(producto_id || 'general')),
    nombre_cliente: nombre_cliente ? sanitizeText(nombre_cliente).slice(0, 60) : 'Aficionado Andrew',
    city: city ? sanitizeText(city).slice(0, 60) : 'Lima',
    calificacion: Math.min(5, Math.max(1, Number(calificacion) || 5)),
    badge: sanitizeText(badge || 'COMPRA REAL').slice(0, 30),
    comentario: comentario ? sanitizeText(comentario).slice(0, 500) : '',
    product_nombre: sanitizeText(product_nombre || 'Camiseta Andrew').slice(0, 80),
    image: image || null,
    aprobado: autoAprobar,
    created_at: new Date().toISOString()
  };

  // 1. Persistir localmente de inmediato
  const actual = await getAllReviewsAdmin();
  const actualizadas = [nuevaReview, ...actual.filter(r => String(r.id) !== String(nuevaReview.id))];
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(actualizadas));
  window.dispatchEvent(new Event('andrew_reviews_updated'));

  // 2. Enviar a Supabase si está disponible
  try {
    const payload = {
      producto_id: nuevaReview.producto_id,
      nombre_cliente: nuevaReview.nombre_cliente,
      calificacion: nuevaReview.calificacion,
      comentario: nuevaReview.comentario,
      aprobado: autoAprobar
    };

    const { data, error } = await supabase.from('reviews').insert([payload]).select();

    if (!error && data && data[0]) {
      nuevaReview.id = data[0].id;
    }
  } catch (err) {
    console.warn('Review guardada localmente, Supabase sync:', err);
  }

  return nuevaReview;
}

export async function aprobarReview(id) {
  // Actualizar en Supabase
  try {
    await supabase.from('reviews').update({ aprobado: true }).eq('id', id);
  } catch (err) {
    console.warn('Error aprobando review en Supabase:', err);
  }

  // Actualizar localmente
  const reviews = await getAllReviewsAdmin();
  const actualizadas = reviews.map(r => String(r.id) === String(id) ? { ...r, aprobado: true } : r);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(actualizadas));
  window.dispatchEvent(new Event('andrew_reviews_updated'));
  return actualizadas;
}

export async function eliminarReview(id) {
  const strId = String(id);
  // Registrar como eliminado permanentemente para que nunca se reinyecte
  saveDeletedId(strId);

  // Eliminar en Supabase
  try {
    await supabase.from('reviews').delete().eq('id', id);
  } catch (err) {
    console.warn('Error eliminando review en Supabase:', err);
  }

  // Eliminar localmente
  const reviews = await getAllReviewsAdmin();
  const actualizadas = reviews.filter(r => String(r.id) !== strId);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(actualizadas));
  window.dispatchEvent(new Event('andrew_reviews_updated'));
  return actualizadas;
}
