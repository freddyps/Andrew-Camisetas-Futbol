/**
 * Utility de Ciberseguridad, Validación & Sanitización para Andrew Camisetas
 * Previene ataques XSS (Cross-Site Scripting), Parameter Pollution,
 * subida de archivos maliciosos, códigos de operación fraudulentos/duplicados
 * y ataques de fuerza bruta en autenticación.
 */

// 1. Sanitizador de texto contra XSS (elimina etiquetas HTML, scripts o atributos peligrosos)
export function sanitizeText(input = '') {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Elimina < y >
    .replace(/javascript:/gi, '') // Elimina esquemas maliciosos
    .replace(/data:text\/html/gi, '') // Bloquea data URLs HTML ejecutables
    .replace(/on\w+=/gi, '') // Elimina event handlers (onclick, onerror, onload)
    .trim();
}

// 2. Sanitizador de números telefónicos peruanos (previene inyecciones en links de WhatsApp y BD)
export function sanitizePhone(phone = '') {
  if (typeof phone !== 'string') return '';
  const cleaned = phone.replace(/[^0-9+]/g, '');
  return cleaned.slice(0, 15);
}

// 3. Sanitizador estricto para Código de Operación Bancario
export function sanitizeCodigoOperacion(code = '') {
  if (typeof code !== 'string') return '';
  return code.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30);
}

// 4. Validador Antifraude de Código de Operación (Yape / Plin)
const CODIGOS_FALSOS_COMUNES = new Set([
  '0000', '00000', '000000', '0000000', '00000000',
  '1111', '11111', '111111', '1111111', '11111111',
  '1234', '12345', '123456', '1234567', '12345678',
  '654321', '999999', '99999999', '121212', '101010'
]);

export function validateOperationCode(rawCode = '', existingOrders = []) {
  const code = sanitizeCodigoOperacion(rawCode).trim();
  if (!code) {
    return { valid: false, reason: 'empty', errorMsg: 'Ingresa el código o número de operación.' };
  }
  if (code.length < 6) {
    return {
      valid: false,
      reason: 'too_short',
      errorMsg: 'El número de operación de Yape o Plin debe tener al menos 6 dígitos.'
    };
  }
  // Verificar secuencias repetidas como 222222 o 5555555
  if (/^(\d)\1{4,}$/.test(code) || CODIGOS_FALSOS_COMUNES.has(code)) {
    return {
      valid: false,
      reason: 'fake_pattern',
      errorMsg: 'El código de operación ingresado no es válido. Verifica el número real en tu comprobante de Yape o Plin.'
    };
  }

  // Verificar que no haya sido registrado previamente en otro pedido activo
  if (Array.isArray(existingOrders) && existingOrders.length > 0) {
    const codeUpper = code.toUpperCase();
    const duplicado = existingOrders.some((ord) => {
      if (!ord || ord.estado === 'CANCELADO') return false;
      const opExistente = (ord.pagoVerificacion?.codigoOperacion || '').trim().toUpperCase();
      return opExistente && opExistente !== 'VOUCHER_ADJUNTO' && opExistente === codeUpper;
    });

    if (duplicado) {
      return {
        valid: false,
        reason: 'duplicate',
        errorMsg: 'Este número de operación ya fue utilizado en un pedido anterior. Por favor ingresa el código de tu pago actual.'
      };
    }
  }

  return { valid: true, sanitized: code };
}

// 5. Validador de Seguridad de Archivos de Imagen (MIME estricto, extensión y límite de tamaño)
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
]);

const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

export function validateImageFile(file, maxSizeMB = 5) {
  if (!file) {
    return { valid: false, errorMsg: 'No se seleccionó ningún archivo.' };
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type) || !ALLOWED_IMAGE_EXTENSIONS.test(file.name || '')) {
    return {
      valid: false,
      errorMsg: 'Formato de archivo no permitido por seguridad. Sube únicamente imágenes JPG, PNG o WEBP.'
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      errorMsg: `La imagen es demasiado pesada (${(file.size / (1024 * 1024)).toFixed(1)} MB). El tamaño máximo permitido es ${maxSizeMB} MB.`
    };
  }

  return { valid: true };
}

// 6. Rate Limiter Persistente (SessionStorage + Memoria) contra Fuerza Bruta y Spam
const RATE_LIMIT_STORAGE_KEY = 'andrew_security_ratelimit_v1';
const memoryAttempts = new Map();

function getStoredAttempts() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredAttempts(data) {
  try {
    sessionStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function checkLoginRateLimit(identifier, maxAttempts = 5, windowMs = 60000) {
  const key = String(identifier || 'default').toLowerCase();
  const now = Date.now();
  const stored = getStoredAttempts();
  const record = stored[key] || memoryAttempts.get(key);

  if (!record || now - record.firstAttempt > windowMs) {
    const fresh = { count: 1, firstAttempt: now };
    stored[key] = fresh;
    memoryAttempts.set(key, fresh);
    saveStoredAttempts(stored);
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSec = Math.max(1, Math.ceil((record.firstAttempt + windowMs - now) / 1000));
    return {
      allowed: false,
      retryAfterSec,
      errorMsg: `Demasiados intentos seguidos. Por seguridad, espera ${retryAfterSec} segundos antes de reintentar.`
    };
  }

  const updated = { count: record.count + 1, firstAttempt: record.firstAttempt };
  stored[key] = updated;
  memoryAttempts.set(key, updated);
  saveStoredAttempts(stored);
  return { allowed: true, remaining: maxAttempts - updated.count };
}

export function resetLoginAttempts(identifier) {
  const key = String(identifier || 'default').toLowerCase();
  memoryAttempts.delete(key);
  const stored = getStoredAttempts();
  if (stored[key]) {
    delete stored[key];
    saveStoredAttempts(stored);
  }
}

// 7. Verificación criptográfica SHA-256 para credenciales de Administrador
// El hash corresponde a la credencial segura del Administrador (sin exponer la contraseña en texto plano en el código)
export const ADMIN_EMAILS_AUTORIZADOS = new Set([
  'freddy.control@andrewcamisetas.pe',
  'brice.control@andrewcamisetas.pe'
]);

const ADMIN_PASS_HASH_SHA256 = 'fe9e208bcdbb1ff5a1b337431ad553ed5eb0ecbd810249f04e9ee533fb213225';

export function isAuthorizedAdminEmail(email = '') {
  return ADMIN_EMAILS_AUTORIZADOS.has(String(email || '').trim().toLowerCase());
}

export async function verifyAdminPasswordHash(email = '', plainPassword = '') {
  const cleanPass = String(plainPassword || '').trim();
  if (!isAuthorizedAdminEmail(email) || !cleanPass) return false;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`andrew_salt_2026::${cleanPass}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex === ADMIN_PASS_HASH_SHA256;
  } catch {
    return false;
  }
}
