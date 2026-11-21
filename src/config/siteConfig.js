/**
 * Configuración Central de Negocio e Identidad Institucional
 * Andrew Camisetas de Fútbol
 * 
 * Cualquier cambio de número de WhatsApp, cuentas bancarias, adelantos
 * o redes sociales se gestiona de manera centralizada en este archivo.
 */

export const SITE_CONFIG = {
  // Identidad
  nombreComercial: 'Andrew Camisetas de Fútbol',
  eslogan: 'Camisetas y Equipaciones de Fútbol Calidad A1 en Perú',
  ciudad: 'Lima, Perú',
  
  // Contacto & Atención al Cliente
  whatsapp: {
    numero: '963 345 510',
    numeroRaw: '963345510',
    codigoPais: '51',
    link: 'https://wa.me/51963345510',
    titular: 'Andrew'
  },

  correoAtencion: 'contacto@andrewcamisetas.com',
  adminEmail: 'brice.control@andrewcamisetas.pe',

  // Redes Sociales Oficiales
  redes: {
    instagram: {
      usuario: '@andrewcamisetasdefutbol_',
      url: 'https://www.instagram.com/andrewcamisetasdefutbol_/'
    },
    tiktok: {
      usuario: 'Andrew Camisetas de Fútbol',
      url: 'https://www.tiktok.com'
    },
    facebook: {
      usuario: 'Andrew Camisetas de Fútbol',
      url: 'https://www.facebook.com'
    }
  },

  // Políticas de Reserva y Cotización
  reserva: {
    montoMinimoAdelanto: 40.00,
    diasConfirmacionFotos: 'Antes de importar (fotos y videos reales)',
    tiempoImportacionEstimado: '19 a 27 días calendario',
    cierrePedidos: 'Cupos limitados — Cerramos pedidos cada domingo'
  },

  // Datos Oficiales de Pago (Exclusivo Yape y Plin)
  datosPago: {
    yapePlin: {
      numero: '934 353 097',
      numeroRaw: '934353097',
      titular: 'Brice Andrew Paypay Salvador',
      qrYape: '/pagos/qr_yape.webp',
      qrPlin: '/pagos/qr_plin.webp'
    }
  }
};
