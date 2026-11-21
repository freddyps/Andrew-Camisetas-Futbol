import { useState, useEffect } from 'react';
import { guardarNuevoPedido, getPedidosSync } from '../../../services/orderService';
import { descontarStockProductos } from '../../../services/productService';
import {
  sanitizeText,
  sanitizePhone,
  sanitizeCodigoOperacion,
  validateOperationCode,
  validateImageFile
} from '../../../utils/security';
import { SITE_CONFIG } from '../../../config/siteConfig';

export const DATOS_PAGO = SITE_CONFIG.datosPago;

/**
 * Custom Hook useCheckout:
 * Centraliza el flujo de estados, validaciones, cálculos financieros
 * y llamadas a Supabase/WhatsApp para la pasarela de compra.
 */
export function useCheckout({ cart = [], user = null, onOrderSuccess = () => {} }) {
  const [pasoActual, setPasoActual] = useState(1); // 1 | 2 | 3 | 4
  const [metodoEntrega, setMetodoEntrega] = useState('lima'); // 'lima' | 'provincias'

  // Detectar artículos bajo pedido
  const tieneBajoPedido = cart.some(item => item.inStock === false);

  // Modalidad de pago para compras del Catálogo (100% Pago Completo por prendas en stock)
  const [modalidadPago, setModalidadPago] = useState('completo');
  const [metodoPago, setMetodoPago] = useState('yape'); // 'yape' | 'plin'

  // Datos del cliente (se pre-rellenan si el usuario ya inició sesión)
  const [nombreCliente, setNombreCliente] = useState(user?.nombre || '');
  const [correoCliente, setCorreoCliente] = useState(user?.email || '');
  const [dniCliente, setDniCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [ciudadDireccion, setCiudadDireccion] = useState('');
  const [referenciaDestino, setReferenciaDestino] = useState('');
  const [emailConfirmadoInvitado, setEmailConfirmadoInvitado] = useState(Boolean(user?.email));

  useEffect(() => {
    if (user?.nombre) {
      setNombreCliente((prev) => prev || user.nombre);
    }
    if (user?.email) {
      setCorreoCliente(user.email);
      setEmailConfirmadoInvitado(true);
    }
  }, [user]);

  // Verificación de pago y comprobante
  const [modalQrOpen, setModalQrOpen] = useState(false);
  const [codigoOperacion, setCodigoOperacion] = useState('');
  const [titularCuentaPago, setTitularCuentaPago] = useState('');
  const [comprobanteFile, setComprobanteFile] = useState(null);
  const [comprobantePreview, setComprobantePreview] = useState('');

  const [copiado, setCopiado] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState('');
  const [pedidoGenerado, setPedidoGenerado] = useState(null);

  // Cálculos económicos
  const subtotal = cart.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);
  const costoEnvio = metodoEntrega === 'lima' ? 10.00 : 18.00;

  const totalConEnvio = subtotal + costoEnvio;

  const cantidadPrendasBajoPedido = cart.filter(i => i.inStock === false).reduce((acc, i) => acc + (i.cantidad || 1), 0);
  const montoAdelantoCalculado = cantidadPrendasBajoPedido > 0 
    ? (cantidadPrendasBajoPedido * 40.00) 
    : 40.00;

  const montoAPagarHoy = modalidadPago === 'adelanto'
    ? Math.min(montoAdelantoCalculado, totalConEnvio)
    : totalConEnvio;

  const saldoRestante = Math.max(0, totalConEnvio - montoAPagarHoy);

  // Copiado al portapapeles
  const handleCopiar = (texto, tipo) => {
    navigator.clipboard.writeText(texto);
    setCopiado(tipo);
    setTimeout(() => setCopiado(null), 2500);
  };

  // Carga, validación de seguridad (MIME + Tamaño máx 5MB) y compresión ligera de comprobante
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const checkFile = validateImageFile(file, 5);
    if (!checkFile.valid) {
      setErrorValidacion(checkFile.errorMsg);
      e.target.value = '';
      return;
    }

    setErrorValidacion('');
    setComprobanteFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Raw = reader.result;
      if (typeof base64Raw === 'string' && file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          try {
            const maxDim = 900;
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            setComprobantePreview(canvas.toDataURL('image/jpeg', 0.78));
          } catch {
            setComprobantePreview(base64Raw);
          }
        };
        img.onerror = () => setComprobantePreview(base64Raw);
        img.src = base64Raw;
      } else {
        setComprobantePreview(base64Raw);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setComprobanteFile(null);
    setComprobantePreview('');
  };

  // Navegación entre pasos con validaciones
  const irAlPaso1 = () => {
    setErrorValidacion('');
    setPasoActual(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const irAlPaso2 = () => {
    setErrorValidacion('');
    setPasoActual(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const irAlPaso3 = () => {
    setErrorValidacion('');
    if (!correoCliente.trim() || !correoCliente.includes('@')) {
      setErrorValidacion('Por favor ingresa tu correo electrónico y haz clic en "Continuar como invitado".');
      return;
    }
    if (!nombreCliente.trim()) {
      setErrorValidacion('Por favor ingresa tu nombre y apellido.');
      return;
    }
    if (!dniCliente.trim() || dniCliente.trim().length < 8) {
      setErrorValidacion('Ingresa tu número de DNI o documento válido (mínimo 8 dígitos).');
      return;
    }
    if (!telefonoCliente.trim() || telefonoCliente.length < 8) {
      setErrorValidacion('Ingresa un número de celular / WhatsApp válido para coordinar.');
      return;
    }
    if (!ciudadDireccion.trim()) {
      setErrorValidacion('Ingresa tu dirección o la agencia de destino (Shalom / Olva).');
      return;
    }
    setPasoActual(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Guardar pedido en Supabase
  const handleFinalizarPedido = async () => {
    if (enviando) return;
    setErrorValidacion('');
    
    const nombreLimpio = sanitizeText(nombreCliente);
    const correoLimpio = (user?.email || correoCliente || '').trim().toLowerCase();
    const dniLimpio = sanitizePhone(dniCliente);
    const telefonoLimpio = sanitizePhone(telefonoCliente);
    const destinoLimpio = sanitizeText(ciudadDireccion);
    const referenciaLimpia = sanitizeText(referenciaDestino);
    const codigoLimpio = sanitizeCodigoOperacion(codigoOperacion);
    const titularLimpio = sanitizeText(titularCuentaPago);

    if (!comprobantePreview && codigoLimpio.length < 6) {
      setErrorValidacion('Adjunta la captura de tu voucher o ingresa un N° de operación válido (mínimo 6 dígitos) para verificar tu pago.');
      return;
    }

    // Si ingresó código de operación, validar que no sea un patrón falso ("000000", "123456") ni duplicado
    if (codigoLimpio) {
      const checkOp = validateOperationCode(codigoLimpio, getPedidosSync());
      if (!checkOp.valid) {
        setErrorValidacion(checkOp.errorMsg);
        return;
      }
    }

    const codigoFinal = codigoLimpio || 'VOUCHER_ADJUNTO';
    const titularFinal = titularLimpio || nombreLimpio || 'Cliente';

    setEnviando(true);

    try {
      const pedidoData = {
        user_email: correoLimpio || null,
        user_id: user?.id || null,
        cliente: {
          nombre: nombreLimpio,
          email: correoLimpio || null,
          dni: dniLimpio || null,
          telefono: telefonoLimpio,
          destino: destinoLimpio,
          referencia: referenciaLimpia,
          metodoEntrega
        },
        items: cart,
        finanzas: {
          subtotal,
          costoEnvio,
          totalGeneral: totalConEnvio,
          modalidadPago,
          montoAbonado: montoAPagarHoy,
          saldoPendiente: saldoRestante,
          metodoPagoSeleccionado: metodoPago
        },
        pagoVerificacion: {
          metodo: metodoPago.toUpperCase(),
          codigoOperacion: codigoFinal,
          titularCuenta: titularFinal,
          comprobanteImagen: comprobantePreview || null
        }
      };

      const pedidoCreado = await guardarNuevoPedido(pedidoData);
      
      // Descontar automáticamente el stock de las prendas vendidas en tiempo real
      await descontarStockProductos(pedidoData.items);

      setPedidoGenerado(pedidoCreado);
      setPasoActual(4);
      onOrderSuccess(pedidoCreado);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorValidacion('Hubo un error al registrar el pedido. Intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  // Redirección a WhatsApp con formato detallado
  const handleEnviarMensajeWhatsApp = () => {
    if (!pedidoGenerado) return;

    const itemsPedido = pedidoGenerado.items || cart || [];
    const finanzas = pedidoGenerado.finanzas || {};
    const cliente = pedidoGenerado.cliente || {};
    const pagoVerif = pedidoGenerado.pagoVerificacion || {};

    const cliNombre = cliente.nombre || nombreCliente.trim();
    const cliTelefono = cliente.telefono || telefonoCliente.trim();
    const cliDestino = cliente.destino || ciudadDireccion.trim();
    const cliMetodoEntrega = cliente.metodoEntrega || metodoEntrega;
    const cliReferencia = cliente.referencia || referenciaDestino.trim();

    const fTotalGeneral = finanzas.totalGeneral ?? totalConEnvio;
    const fModalidad = finanzas.modalidadPago || modalidadPago;
    const fMontoAbonado = finanzas.montoAbonado ?? montoAPagarHoy;
    const fSaldoPendiente = finanzas.saldoPendiente ?? saldoRestante;

    let mensaje = `*NUEVO PEDIDO EN ANDREW CAMISETAS*\n`;
    mensaje += `*CODIGO DE PEDIDO:* #${pedidoGenerado.id}\n`;
    mensaje += `------------------------------------\n`;
    mensaje += `*CLIENTE:* ${cliNombre}\n`;
    mensaje += `*CELULAR/WSP:* ${cliTelefono}\n`;
    mensaje += `*DESTINO:* ${cliDestino} (${cliMetodoEntrega === 'lima' ? 'Lima Metropolitana' : 'Provincias'})\n`;
    if (cliReferencia) {
      mensaje += `*REFERENCIA:* ${cliReferencia}\n`;
    }
    mensaje += `\n*PRENDAS SOLICITADAS:*\n`;
    itemsPedido.forEach((item, idx) => {
      const estado = item.inStock === false ? '[BAJO PEDIDO / ENCARGO]' : '[EN STOCK]';
      mensaje += `${idx + 1}. *${item.nombre}* ${estado}\n`;
      mensaje += `   - Talla: ${item.tallaSeleccionada || 'M'}\n`;
      if (item.incluirShort) {
        mensaje += `   - Short Oficial: SI (Talla ${item.tallaShort || item.tallaSeleccionada || 'M'})\n`;
      }
      if (item.personalizacion) {
        mensaje += `   - Estampado: ${item.personalizacion.nombre} #${item.personalizacion.numero}\n`;
      }
      mensaje += `   - Cantidad: ${item.cantidad || 1} | Subtotal: S/ ${(item.precio * (item.cantidad || 1)).toFixed(2)}\n`;
    });

    mensaje += `\n------------------------------------\n`;
    mensaje += `*DETALLE DE PAGO:*\n`;
    mensaje += `- Total Pedido con Envio: S/ ${Number(fTotalGeneral).toFixed(2)}\n`;
    if (fModalidad === 'adelanto') {
      mensaje += `- MODALIDAD: ADELANTO DE RESERVA (S/ 40.00)\n`;
      mensaje += `- MONTO ABONADO: S/ ${Number(fMontoAbonado).toFixed(2)}\n`;
      mensaje += `- SALDO PENDIENTE: S/ ${Number(fSaldoPendiente).toFixed(2)} (contraentrega o al llegar)\n`;
    } else {
      mensaje += `- MODALIDAD: PAGO COMPLETO (100%)\n`;
      mensaje += `- MONTO ABONADO: S/ ${Number(fMontoAbonado).toFixed(2)}\n`;
      mensaje += `- SALDO PENDIENTE: S/ 0.00\n`;
    }

    mensaje += `\n*DATOS DE VALIDACION:*\n`;
    mensaje += `- Medio: ${(pagoVerif.metodo || metodoPago).toUpperCase()}\n`;
    mensaje += `- Nro/Codigo de Operacion: ${pagoVerif.codigoOperacion || codigoOperacion.trim() || 'Coordinar captura por este chat'}\n`;
    mensaje += `- Titular que transfirio: ${pagoVerif.titularCuenta || titularCuentaPago.trim() || cliNombre}\n`;
    mensaje += `\nHola! Acabo de registrar mi pedido en la web. Les adjunto la captura de mi Yape para que confirmen mi orden. Muchas gracias!`;

    const numeroWhatsappOficial = `${SITE_CONFIG.whatsapp.codigoPais}${SITE_CONFIG.whatsapp.numeroRaw}`;
    const urlWA = `https://wa.me/${numeroWhatsappOficial}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWA, '_blank', 'noopener,noreferrer');
  };

  return {
    // Estados principales
    pasoActual,
    tieneBajoPedido,
    metodoEntrega,
    setMetodoEntrega,
    modalidadPago,
    setModalidadPago,
    metodoPago,
    setMetodoPago,

    // Datos del cliente
    nombreCliente,
    setNombreCliente,
    correoCliente,
    setCorreoCliente,
    dniCliente,
    setDniCliente,
    emailConfirmadoInvitado,
    setEmailConfirmadoInvitado,
    telefonoCliente,
    setTelefonoCliente,
    ciudadDireccion,
    setCiudadDireccion,
    referenciaDestino,
    setReferenciaDestino,

    // Pago y verificación
    modalQrOpen,
    setModalQrOpen,
    codigoOperacion,
    setCodigoOperacion,
    titularCuentaPago,
    setTitularCuentaPago,
    comprobanteFile,
    comprobantePreview,
    handleFileChange,
    handleRemoveFile,

    // Feedback
    copiado,
    handleCopiar,
    enviando,
    errorValidacion,
    pedidoGenerado,

    // Cálculos económicos
    subtotal,
    costoEnvio,
    totalConEnvio,
    montoAdelantoCalculado,
    montoAPagarHoy,
    saldoRestante,
    DATOS_PAGO,

    // Navegación y acciones
    irAlPaso1,
    irAlPaso2,
    irAlPaso3,
    handleFinalizarPedido,
    handleEnviarMensajeWhatsApp
  };
}
