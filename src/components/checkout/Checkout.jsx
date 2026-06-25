import React, { useMemo, useState } from 'react';
import { CheckCircle2, Copy, Smartphone, Banknote, Tag, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Checkout({ cartItems, onBack, onClearCart }) {
  const { user } = useAppContext();

  const [selectedMethod, setSelectedMethod] = useState('yape');
  const [transferName, setTransferName] = useState('');
  const [transferOperation, setTransferOperation] = useState('');
  
  // Teléfono y dirección de entrega (pre-llenados con la info del usuario)
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // SISTEMA DE CUPONES INTERACTIVO
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setLoadingCoupon(true);
    setCouponMessage('');

    const djangoApiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://127.0.0.1:8000';
    const validateUrl = `${djangoApiBaseUrl.replace(/\/$/, '')}/api/cupones/validar/`;

    try {
      const response = await fetch(validateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ codigo: code })
      });
      const data = await response.json();
      if (response.ok && data.valido) {
        setDiscountPercent(data.descuento_porcentaje);
        setCouponMessage(`✓ ¡Cupón ${data.codigo} aplicado! ${data.descuento_porcentaje}% de descuento.`);
      } else {
        setDiscountPercent(0);
        setCouponMessage(`✗ ${data.error || 'Código de cupón inválido.'}`);
      }
    } catch (err) {
      if (code === 'ANDREW10') {
        setDiscountPercent(10);
        setCouponMessage('✓ ¡Cupón ANDREW10 aplicado! 10% de descuento.');
      } else if (code === 'GOAL20') {
        setDiscountPercent(20);
        setCouponMessage('✓ ¡Cupón GOAL20 aplicado! 20% de descuento.');
      } else {
        setDiscountPercent(0);
        setCouponMessage('✗ Código de cupón inválido.');
      }
    } finally {
      setLoadingCoupon(false);
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const discountAmount = useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const totalPrice = useMemo(() => {
    return (subtotal - discountAmount).toFixed(2);
  }, [subtotal, discountAmount]);

  const handleConfirmAndClear = async () => {
    if (!transferName || !transferOperation) {
      setErrorMessage('Por favor ingresa el nombre del titular y el número de operación.');
      return;
    }
    if (!contactPhone) {
      setErrorMessage('Por favor ingresa un número de teléfono/WhatsApp de contacto.');
      return;
    }
    if (!shippingAddress) {
      setErrorMessage('Por favor ingresa una dirección de envío o indica si es Recojo.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const djangoApiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://127.0.0.1:8000';
    const djangoApiUrl = `${djangoApiBaseUrl.replace(/\/$/, '')}/api`;

    // Armar el payload para Django
    const payload = {
      cliente_nombre: user?.name || transferName,
      cliente_email: user?.email || 'cliente@correo.com',
      cliente_telefono: contactPhone,
      cliente_direccion: shippingAddress,
      metodo_pago: selectedMethod,
      titular_pago: transferName,
      operacion_pago: transferOperation,
      monto_total: Number(totalPrice),
      detalles: cartItems.map(item => ({
        camiseta_id: item.productId,
        camiseta_nombre: item.name,
        talla: item.size,
        version: item.version,
        nombre_personalizado: item.personalizationName || '',
        numero_personalizado: item.personalizationNumber || '',
        con_short: item.addShort || false,
        cantidad: item.quantity,
        precio_unitario: Number(item.price)
      }))
    };

    try {
      const response = await fetch(`${djangoApiUrl}/pedidos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocurrió un error al procesar tu pedido.');
      }

      const orderData = await response.json();
      setOrderId(orderData.codigo_pedido);
      setOrderConfirmed(true);

      if (onClearCart) {
        setTimeout(() => {
          onClearCart();
        }, 5000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error de comunicación con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const adminPhone = import.meta.env.VITE_WHATSAPP_NUMERO || '+51934353097';
    
    const itemsText = cartItems.map(item => {
      const personalizado = (item.personalizationName || item.personalizationNumber) 
        ? ` (Nom: ${item.personalizationName || ''}, Num: ${item.personalizationNumber || ''})` 
        : '';
      const short = item.addShort ? ' + Short' : '';
      return `- ${item.quantity}x Camiseta ${item.name} Talla ${item.size} (${item.version}${short})${personalizado}`;
    }).join('\n');

    const text = `¡Hola Andrew Camisetas! \uD83D\uDC4B He realizado un pedido en la web.\n\n` +
                 `\uD83D\uDCCC *Código de Pedido:* ${orderId}\n` +
                 `\uD83D\uDC64 *Cliente:* ${user?.name || transferName}\n` +
                 `\uD83D\uDCDE *WhatsApp:* ${contactPhone}\n` +
                 `\uD83C\uDFE0 *Dirección:* ${shippingAddress}\n\n` +
                 `\uD83D\uDCB5 *Monto Total:* S/ ${totalPrice}\n` +
                 `\uD83D\uDCB3 *Medio de Pago:* ${selectedMethod.toUpperCase()}\n` +
                 `\uD83D\uDC64 *Titular:* ${transferName}\n` +
                 `\uD83D\uDD22 *Nº Operación:* ${transferOperation}\n\n` +
                 `\uD83D\uDC55 *Detalle del Pedido:*\n${itemsText}\n\n` +
                 `Adjunto captura de pantalla de mi pago por Yape/Plin/Transferencia. ¡Quedo atento!`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${adminPhone.replace(/\+/g, '').replace(/\s/g, '')}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };


  const paymentMethods = [
    {
      id: 'yape',
      label: 'YAPE',
      description: 'Pago inmediato sin comisiones',
      icon: Smartphone,
    },
    {
      id: 'plin',
      label: 'PLIN',
      description: 'Pago inmediato sin comisiones',
      icon: Smartphone,
    },
    {
      id: 'transferencia',
      label: 'TRANSFERENCIA DIRECTA',
      description: 'BCP / BBVA / Interbank',
      icon: Banknote,
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs font-display font-black uppercase tracking-[0.08em] text-[#22c55e] hover:text-[#1fa75d] transition-colors animate-fade-in-up"
        >
          <ArrowLeft size={16} /> Volver a Productos
        </button>

        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-white">Finalizar Compra</h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-2">
            Completa tu pedido de forma segura. Elige tu método preferido y carga los datos de tu transacción.
          </p>
        </div>

        {/* CONTENEDOR 2 COLUMNAS */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.4fr] items-start animate-fade-in-up">
          
          {/* COLUMNA IZQUIERDA: RESUMEN DE LA COMPRA (GLASS PANEL) */}
          <section className="glass-panel border border-white/10 p-6 space-y-6 shadow-2xl">
            <h2 className="text-lg font-display font-black uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Resumen de Bolsa
            </h2>

            {cartItems.length === 0 ? (
              <div className="p-8 border border-dashed border-white/10 text-center text-xs text-gray-500 uppercase tracking-widest">
                Tu carrito de compras está vacío.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Listado de items */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border border-white/5 bg-white/[0.01] p-3 flex gap-3">
                      <img src={item.image} alt={item.name} className="h-14 w-14 object-cover" />
                      <div className="flex-1 flex flex-col justify-between text-xs">
                        <div>
                          <h4 className="font-display font-black uppercase text-white truncate max-w-[150px]">{item.name}</h4>
                          <p className="text-[9px] uppercase text-gray-500 font-bold mt-0.5">{item.version.toUpperCase()} · Talla {item.size}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">CANT: {item.quantity}</span>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <span className="font-display font-black text-sm text-white">S/ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ===== CUPÓN DE DESCUENTO INTERACTIVO ===== */}
                <div className="border-y border-white/5 py-4 space-y-3">
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                    <Tag size={12} className="text-[#22c55e]" /> ¿Tienes un código promocional?
                  </p>
                  
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Ej: ANDREW10, GOAL20"
                      disabled={loadingCoupon}
                      className="bg-black border border-white/10 px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none w-full focus:border-[#22c55e] transition-colors uppercase font-bold"
                    />
                    <button
                      type="submit"
                      disabled={loadingCoupon}
                      className="bg-[#22c55e] hover:bg-[#1fa75d] disabled:opacity-50 text-black font-display font-black text-2xs uppercase px-4 py-2 transition-all glow-green-sm cursor-pointer shrink-0"
                    >
                      {loadingCoupon ? 'Validando...' : 'Aplicar'}
                    </button>
                  </form>

                  {couponMessage && (
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${couponMessage.includes('✓') ? 'text-[#22c55e] glow-text-green' : 'text-red-400'}`}>
                      {couponMessage}
                    </p>
                  )}
                </div>

                {/* Subtotales y Totales */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-400 font-semibold uppercase tracking-wider">
                    <span>Subtotal</span>
                    <span>S/ {subtotal.toFixed(2)}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex items-center justify-between text-[#22c55e] font-bold uppercase tracking-wider glow-text-green">
                      <span>Descuento ({discountPercent}%)</span>
                      <span>- S/ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-400 font-semibold uppercase tracking-wider">
                    <span>Costo de Envío</span>
                    <span className="text-[#22c55e] glow-text-green">GRATIS</span>
                  </div>

                  <div className="flex items-center justify-between text-lg font-display font-black uppercase tracking-wide text-white border-t border-white/5 pt-3 mt-2">
                    <span>Monto Final</span>
                    <span className="text-[#22c55e] glow-text-green">S/ {totalPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* COLUMNA DERECHA: CONFIGURACIÓN MÉTODOS DE PAGO */}
          <section className="space-y-6">
            
            {/* Selección del método */}
            <div className="glass-panel border border-white/10 p-6 shadow-2xl space-y-4">
              <h2 className="text-lg font-display font-black uppercase tracking-wider text-white border-b border-white/5 pb-3">
                Método de Pago
              </h2>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider leading-relaxed">
                Selecciona tu medio de transferencia preferido en el Perú. Todos los datos están seguros.
              </p>

              <div className="space-y-3 pt-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full text-left p-4 border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer ${
                        isSelected 
                          ? 'border-[#22c55e] bg-[#22c55e]/5' 
                          : 'border-white/5 bg-white/[0.01] hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-none flex items-center justify-center ${isSelected ? 'bg-[#22c55e] text-black glow-green-sm' : 'bg-white/5 text-gray-400'}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-display font-black uppercase tracking-wider text-white">{method.label}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{method.description}</p>
                        </div>
                      </div>
                      
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#22c55e] bg-[#22c55e]' : 'border-gray-600'}`}>
                        {isSelected && <CheckCircle2 className="h-3 w-3 text-black font-black" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DETALLES ESPECÍFICOS DE TRANSFERENCIA (YAPE / PLIN / TRANSFERENCIA BCN) */}
            <div className="glass-panel border border-white/10 p-6 shadow-2xl space-y-6">
              
              {/* YAPE Y PLIN */}
              {(selectedMethod === 'yape' || selectedMethod === 'plin') && (
                <div className="space-y-4">
                  <div className="grid gap-5 sm:grid-cols-[1fr_1.3fr] items-center">
                    
                    {/* Código QR estético */}
                    <div className="border border-white/10 bg-white/[0.02] p-3 text-center">
                      <div 
                        className="h-36 bg-cover bg-center border border-white/5 relative"
                        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80)' }}
                      >
                        <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-[10px] font-black tracking-widest text-[#22c55e] glow-text-green">QR {selectedMethod.toUpperCase()}</div>
                      </div>
                      <p className="text-[9px] text-gray-500 mt-2 font-bold uppercase tracking-wider">Escanear para pagar</p>
                    </div>

                    {/* Datos de transferencia */}
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">NÚMERO CELULAR DE CONTACTO</p>
                        <p className="font-display font-black text-lg text-white mt-0.5">+51 934 353 097</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">TITULAR DE LA CUENTA</p>
                        <p className="text-white mt-0.5 font-bold">Andrew Camisetas SAC</p>
                      </div>
                      <div className="bg-[#22c55e]/5 border border-[#22c55e]/15 p-3">
                        <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">MONTO EXACTO A ENVIAR</p>
                        <p className="font-display font-black text-xl text-[#22c55e] glow-text-green mt-0.5">S/ {totalPrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TRANSFERENCIA BANCARIA */}
              {selectedMethod === 'transferencia' && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="border border-white/5 bg-white/[0.01] p-3">
                      <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">BANCO</p>
                      <p className="text-white font-bold mt-0.5">Banco de Crédito BCP</p>
                    </div>
                    <div className="border border-white/5 bg-white/[0.01] p-3">
                      <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">TIPO DE CUENTA</p>
                      <p className="text-white font-bold mt-0.5">Cuenta Corriente Soles</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="border border-white/5 bg-white/[0.01] p-3 flex justify-between items-center gap-3">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">NÚMERO DE CUENTA</p>
                        <p className="text-white font-display font-black mt-0.5">194-2345678-0-99</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { navigator.clipboard.writeText("1942345678099"); alert("Número de cuenta copiado"); }}
                        className="text-[#22c55e] hover:text-[#1fa75d] text-[9px] font-display font-black uppercase tracking-wider"
                      >
                        Copiar
                      </button>
                    </div>

                    <div className="border border-white/5 bg-white/[0.01] p-3 flex justify-between items-center gap-3">
                      <div>
                        <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">NÚMERO INTERBANCARIO (CCI)</p>
                        <p className="text-white font-display font-black mt-0.5">002-194-002345678099-15</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => { navigator.clipboard.writeText("00219400234567809915"); alert("CCI copiado"); }}
                        className="text-[#22c55e] hover:text-[#1fa75d] text-[9px] font-display font-black uppercase tracking-wider"
                      >
                        Copiar
                      </button>
                    </div>

                    <div className="bg-[#22c55e]/5 border border-[#22c55e]/15 p-3">
                      <p className="text-[8px] uppercase tracking-widest text-gray-500 font-extrabold">MONTO EXACTO A TRANSFERIR</p>
                      <p className="font-display font-black text-xl text-[#22c55e] glow-text-green mt-0.5">S/ {totalPrice}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulario de confirmación */}
              <div className="border-t border-white/5 pt-4 space-y-4">
                <p className="text-2xs text-[#22c55e] font-display font-black uppercase tracking-wider">Ingresar Datos del Pago para Validar</p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[8px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Teléfono / WhatsApp de Contacto *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Ej: +51 934 353 097"
                      className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Dirección de Envío (o 'Recojo en Tienda') *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Ej: Av. Larco 123, Lima"
                      className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[8px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Nombre del Titular de Pago *</label>
                    <input
                      type="text"
                      required
                      value={transferName}
                      onChange={(e) => setTransferName(e.target.value)}
                      placeholder="Ej: Paolo Guerrero"
                      className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-extrabold uppercase tracking-widest text-gray-500 mb-1.5">Número de Operación *</label>
                    <input
                      type="text"
                      required
                      value={transferOperation}
                      onChange={(e) => setTransferOperation(e.target.value)}
                      placeholder="Ej: 39485"
                      className="w-full bg-[#050505] border border-white/10 px-3 py-2 text-xs text-white placeholder:text-gray-600 outline-none focus:border-[#22c55e]"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-red-400 text-xs font-semibold">{errorMessage}</p>
                )}

                <button
                  type="button"
                  onClick={handleConfirmAndClear}
                  disabled={!transferName || !transferOperation || !contactPhone || !shippingAddress || cartItems.length === 0 || orderConfirmed || isSubmitting}
                  className="w-full bg-[#22c55e] hover:bg-[#1fa75d] text-black py-4 text-xs font-display font-black uppercase tracking-[0.1em] transition-all glow-green cursor-pointer disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center mt-2"
                >
                  {isSubmitting ? 'REGISTRANDO PEDIDO...' : orderConfirmed ? 'PEDIDO REGISTRADO ✓' : 'CONFIRMAR Y REGISTRAR PAGO'}
                </button>
              </div>

              {/* Mensaje de Confirmación del Pedido */}
              {orderConfirmed && (
                <div className="rounded-none border border-[#22c55e]/30 bg-[#22c55e]/10 p-5 space-y-4 animate-fade-in-up">
                  <div>
                    <p className="text-xs font-display font-black text-[#22c55e] uppercase tracking-wider glow-text-green">✓ ¡Pedido Confirmado con Éxito!</p>
                    <p className="text-[10px] text-gray-300 font-semibold uppercase mt-1">CÓDIGO DE PEDIDO: <span className="text-white font-bold">{orderId}</span></p>
                  </div>
                  
                  <p className="text-[10px] text-gray-400 leading-relaxed font-semibold">
                    Validaremos tu transferencia con el código de operación ingresado. Para agilizar la entrega de tu pedido, te recomendamos enviarnos el comprobante por WhatsApp.
                  </p>

                  <button
                    type="button"
                    onClick={handleWhatsAppRedirect}
                    className="w-full bg-[#22c55e] hover:bg-[#1fa75d] text-black py-3 text-xs font-display font-black uppercase tracking-[0.15em] transition-all glow-green flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ENVIAR COMPROBANTE AL WHATSAPP</span>
                  </button>
                  
                  <p className="text-[9px] text-gray-500 font-semibold text-center uppercase tracking-wider">
                    Tu bolsa de compra se vaciará en unos segundos.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
