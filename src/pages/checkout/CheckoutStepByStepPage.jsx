import React from 'react';
import { 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  ShoppingBag,
  CreditCard,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useCheckout } from './hooks/useCheckout';
import StepCartReview from './components/StepCartReview';
import StepShippingAddress from './components/StepShippingAddress';
import StepPaymentTabs from './components/StepPaymentTabs';
import StepOrderSuccess from './components/StepOrderSuccess';

/**
 * CheckoutStepByStepPage:
 * Contenedor orquestador modularizado (Fase 2 de Arquitectura).
 * Permite comprar libremente solicitando Nombre, Correo, Celular y Dirección en el Paso 2,
 * y método de pago en el Paso 3.
 */
export default function CheckoutStepByStepPage({
  cart = [],
  user = null,
  onOpenAuth = () => {},
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onBackToCart = () => {},
  onGoToCatalog = () => {},
  onOrderSuccess = () => {}
}) {
  const {
    // Estados principales
    pasoActual,
    metodoEntrega,
    setMetodoEntrega,
    modalidadPago,
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
    montoAPagarHoy,
    saldoRestante,
    DATOS_PAGO,

    // Acciones de navegación
    irAlPaso1,
    irAlPaso2,
    irAlPaso3,
    handleFinalizarPedido,
    handleEnviarMensajeWhatsApp
  } = useCheckout({ cart, user, onOrderSuccess });

  // Vista en caso de que el carrito esté vacío y no se haya generado un pedido
  if (cart.length === 0 && pasoActual !== 4) {
    return (
      <div className="min-h-screen bg-bg-base text-txt-main pt-36 pb-20 px-4 flex items-center justify-center select-none transition-colors">
        <div className="max-w-md w-full bg-surface-card border border-stroke rounded-3xl p-8 text-center space-y-4 shadow-xl">
          <ShoppingBag size={52} className="mx-auto text-txt-muted opacity-70" />
          <h2 className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl uppercase text-txt-main">
            TU CARRITO ESTÁ VACÍO
          </h2>
          <p className="text-txt-muted text-sm font-medium">
            Selecciona tus camisetas oficiales en el catálogo para iniciar tu pedido con adelanto o pago total.
          </p>
          <button
            onClick={onGoToCatalog}
            className="w-full bg-andrew-primary hover:bg-[#1fa75d] text-black font-black text-xs sm:text-sm uppercase py-4 rounded-xl cursor-pointer transition-all shadow-md shadow-[#22c55e]/20"
          >
            EXPLORAR CATÁLOGO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-txt-main pt-28 sm:pt-36 lg:pt-44 pb-14 px-3 sm:px-6 lg:px-10 xl:px-12 select-none transition-colors">
      <div className="w-full max-w-[1720px] mx-auto space-y-5">

        {/* 1. CABECERA COMPACTA + STEPPER INTEGRADO EN LÍNEA */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stroke">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <div className="min-w-0">
              <div className="inline-flex flex-wrap items-center gap-1.5 bg-andrew-primary/15 border border-andrew-primary/35 px-2.5 py-0.5 rounded-full text-andrew-primary text-[10px] font-black uppercase tracking-wider mb-1">
                <ShieldCheck size={12} className="shrink-0" />
                <span>CHECKOUT & PAGO SEGURO ANTIFRAUDE</span>
              </div>
              <h1 className="font-['Montserrat',sans-serif] font-black text-[clamp(1.35rem,3.5vw,1.875rem)] uppercase tracking-tight text-txt-main leading-none">
                CONFIRMAR <span className="text-andrew-primary">MI PEDIDO</span>
              </h1>
            </div>
          </div>

          {/* Stepper Horizontal Compacto */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 max-w-3xl">
            {[
              { num: 1, title: 'MODALIDAD', icon: ShoppingBag },
              { num: 2, title: 'DATOS & ENVÍO', icon: MapPin },
              { num: 3, title: 'PAGO YAPE / PLIN', icon: CreditCard },
              { num: 4, title: 'LISTO', icon: CheckCircle2 },
            ].map((st) => {
              const activo = pasoActual === st.num;
              const completado = pasoActual > st.num;
              const Icon = st.icon;

              return (
                <div 
                  key={st.num}
                  className={`px-2.5 sm:px-3 py-2 rounded-xl border text-left flex items-center gap-2 sm:gap-2.5 min-w-0 transition-all ${
                    activo 
                      ? 'bg-andrew-primary/15 border-andrew-primary text-andrew-primary shadow-sm' 
                      : completado
                      ? 'bg-surface-sub border-emerald-500/50 text-emerald-500'
                      : 'bg-surface-card border-stroke text-txt-muted'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-black ${
                    activo
                      ? 'bg-andrew-primary text-black'
                      : completado
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-surface-sub text-txt-muted'
                  }`}>
                    {completado ? <Check size={13} strokeWidth={3} /> : st.num}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider block opacity-75 leading-none">
                      PASO {st.num}
                    </span>
                    <span className="font-['Montserrat',sans-serif] font-black text-[10px] sm:text-[11px] uppercase tracking-wide block text-txt-main truncate mt-0.5">
                      {st.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onBackToCart}
            className="min-h-11 self-start lg:self-auto bg-surface-card hover:bg-surface-sub border border-stroke hover:border-stroke-hover text-txt-main font-['Montserrat',sans-serif] text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
          >
            <ArrowLeft size={14} />
            <span>MODIFICAR CARRITO</span>
          </button>
        </div>

        {/* 3. PASO 1: RESUMEN DEL CARRITO */}
        {pasoActual === 1 && (
          <StepCartReview
            cart={cart}
            user={user}
            onOpenAuth={onOpenAuth}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            totalConEnvio={totalConEnvio}
            subtotal={subtotal}
            costoEnvio={costoEnvio}
            onContinuarPaso2={irAlPaso2}
          />
        )}

        {/* 4. PASO 2: DATOS DEL CLIENTE (NOMBRE, CORREO, CELULAR) Y ENVÍO */}
        {pasoActual === 2 && (
          <StepShippingAddress
            cart={cart}
            user={user}
            onOpenAuth={onOpenAuth}
            metodoEntrega={metodoEntrega}
            setMetodoEntrega={setMetodoEntrega}
            nombreCliente={nombreCliente}
            setNombreCliente={setNombreCliente}
            correoCliente={correoCliente}
            setCorreoCliente={setCorreoCliente}
            dniCliente={dniCliente}
            setDniCliente={setDniCliente}
            emailConfirmadoInvitado={emailConfirmadoInvitado}
            setEmailConfirmadoInvitado={setEmailConfirmadoInvitado}
            telefonoCliente={telefonoCliente}
            setTelefonoCliente={setTelefonoCliente}
            ciudadDireccion={ciudadDireccion}
            setCiudadDireccion={setCiudadDireccion}
            referenciaDestino={referenciaDestino}
            setReferenciaDestino={setReferenciaDestino}
            subtotal={subtotal}
            costoEnvio={costoEnvio}
            totalConEnvio={totalConEnvio}
            modalidadPago={modalidadPago}
            montoAPagarHoy={montoAPagarHoy}
            errorValidacion={errorValidacion}
            onRegresarPaso1={irAlPaso1}
            onContinuarPaso3={irAlPaso3}
          />
        )}

        {/* 5. PASO 3: PAGO ANTIFRAUDE Y VOUCHER */}
        {pasoActual === 3 && (
          <StepPaymentTabs
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            modalQrOpen={modalQrOpen}
            setModalQrOpen={setModalQrOpen}
            DATOS_PAGO={DATOS_PAGO}
            copiado={copiado}
            onCopiar={handleCopiar}
            modalidadPago={modalidadPago}
            montoAPagarHoy={montoAPagarHoy}
            saldoRestante={saldoRestante}
            comprobanteFile={comprobanteFile}
            comprobantePreview={comprobantePreview}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            codigoOperacion={codigoOperacion}
            setCodigoOperacion={setCodigoOperacion}
            titularCuentaPago={titularCuentaPago}
            setTitularCuentaPago={setTitularCuentaPago}
            errorValidacion={errorValidacion}
            enviando={enviando}
            onRegresarPaso2={irAlPaso2}
            onFinalizarPedido={handleFinalizarPedido}
          />
        )}

        {/* 6. PASO 4: CONFIRMACIÓN Y WHATSAPP */}
        {pasoActual === 4 && pedidoGenerado && (
          <StepOrderSuccess
            pedidoGenerado={pedidoGenerado}
            nombreCliente={nombreCliente}
            modalidadPago={modalidadPago}
            montoAPagarHoy={montoAPagarHoy}
            saldoRestante={saldoRestante}
            codigoOperacion={codigoOperacion}
            onEnviarMensajeWhatsApp={handleEnviarMensajeWhatsApp}
            onGoToCatalog={onGoToCatalog}
          />
        )}

      </div>
    </div>
  );
}
