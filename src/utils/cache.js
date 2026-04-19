const CACHE_PREFIX = 'andrew_cache_';

export function getCache(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.ttl && Date.now() > parsed.ttl) {
      window.localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function setCache(key, data, ttlSeconds = 3600) {
  if (typeof window === 'undefined') return;
  const payload = {
    data,
    ttl: Date.now() + ttlSeconds * 1000,
  };
  try {
    window.localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(payload));
  } catch {
    // Si el almacenamiento falla, no bloqueamos la app.
  }
}

export function clearCache(key) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CACHE_PREFIX + key);
}
