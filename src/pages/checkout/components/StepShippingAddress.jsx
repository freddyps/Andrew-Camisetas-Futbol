import React from 'react';
import { ArrowRight, AlertTriangle, Mail, UserCheck, LogIn, Edit3, Truck, MapPin, ShieldCheck } from 'lucide-react';

/**
 * StepShippingAddress:
 * Paso 2 del checkout inspirado en el flujo oficial de Nike Perú y optimizado en 2 columnas:
 * - Izquierda (lg:col-span-8): Identificación (Invitado / Miembro) + Opciones de Entrega + Datos del Destinatario.
 * - Derecha (lg:col-span-4): Resumen lateral de prendas y totales para aprovechar el ancho sin verse exagerado.
 */
export default function StepShippingAddress({
  cart = [],
  user = null,
  onOpenAuth = () => {},
  metodoEntrega,
  setMetodoEntrega,
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
  subtotal = 0,
  costoEnvio = 10,
  totalConEnvio = 0,
  modalidadPago = 'adelanto',
  montoAPagarHoy = 0,
  errorValidacion,
  onRegresarPaso1,
  onContinuarPaso3
}) {
  const handleConfirmarEmailInvitado = (e) => {
    e.preventDefault();
    if (!correoCliente.trim() || !correoCliente.includes('@')) return;
    setEmailConfirmadoInvitado(true);
  };

  const mostrarFormularioEnvio = Boolean(user || emailConfirmadoInvitado);

  return (
    <div className="bg-surface-card border border-stroke rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg transition-colors">
      
      {/* CABECERA COMPACTA DEL PASO 2 */}
      <div className="border-b border-stroke pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-['Montserrat',sans-serif] font-black text-base sm:text-lg uppercase text-txt-main flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-andrew-primary text-black text-xs flex items-center justify-center font-black shrink-0 shadow-sm">
              2
            </span>
            <span>IDENTIFICACIÓN Y DATOS DE ENTREGA</span>
          </h2>
          <p className="text-xs sm:text-sm text-txt-muted font-medium mt-0.5">
            Continúa tu compra rápidamente como invitado con tu correo o inicia sesión en tu cuenta.
          </p>
        </div>

        <button
          type="button"
          onClick={onRegresarPaso1}
          className="self-start sm:self-auto text-xs font-extrabold text-txt-muted hover:text-txt-main bg-surface-sub border border-stroke px-3.5 py-2 rounded-xl cursor-pointer transition-colors"
        >
          ← Volver a Modalidad (Paso 1)
        </button>
      </div>

      {/* DISTRIBUCIÓN PANORÁMICA EN 12 COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* COLUMNA IZQUIERDA (lg:col-span-8): Invitado/Miembro + Opciones de Entrega + Destinatario */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* SECCIÓN A: CONTINUAR COMO INVITADO O INICIAR SESIÓN */}
          <div className="bg-surface-sub border border-stroke rounded-xl p-4 sm:p-5 space-y-3.5">
            {user ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-andrew-primary/15 border border-andrew-primary/35 flex items-center justify-center text-andrew-primary shrink-0">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase text-andrew-primary tracking-wider block">
                      SESIÓN INICIADA COMO MIEMBRO
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold text-txt-main">
                      {user.nombre} · <span className="text-txt-muted font-semibold">{user.email}</span>
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto bg-andrew-primary/15 text-andrew-primary border border-andrew-primary/35 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  ✓ Vinculado a Mis Compras
                </span>
              </div>
            ) : !emailConfirmadoInvitado ? (
              <div className="space-y-3">
                <div>
                  <h3 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main">
                    CONTINUAR LA COMPRA COMO INVITADO
                  </h3>
                  <p className="text-xs text-txt-muted font-medium mt-0.5">
                    Ingresa tu correo electrónico para enviarte el resumen de tu orden y seguimiento.
                  </p>
                </div>

                <form onSubmit={handleConfirmarEmailInvitado} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail size={15} className="absolute left-3.5 top-3 text-txt-muted" />
                    <input
                      type="email"
                      required
                      value={correoCliente}
                      onChange={(e) => setCorreoCliente(e.target.value)}
                      placeholder="Tu correo electrónico (ej: cliente@gmail.com) *"
                      className="w-full bg-input-bg border border-stroke rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/70 outline-none focus:border-andrew-primary transition-colors font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs uppercase px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-sm shrink-0"
                  >
                    CONTINUAR COMO INVITADO
                  </button>
                </form>

                <div className="pt-2.5 border-t border-stroke flex flex-wrap items-center justify-between gap-2 text-xs text-txt-muted">
                  <span>¿Ya tienes una cuenta en Andrew Camisetas?</span>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="text-andrew-primary hover:underline font-black uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogIn size={13} />
                    <span>INICIAR SESIÓN / REGISTRARSE</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-txt-muted tracking-wider block">
                      CONTINUAR LA COMPRA COMO INVITADO
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-txt-main mt-0.5">
                      Información del cliente: <span className="text-andrew-primary font-extrabold">{correoCliente}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailConfirmadoInvitado(false)}
                    className="text-xs font-extrabold text-txt-muted hover:text-txt-main underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Editar</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-stroke flex flex-wrap items-center justify-between gap-2 text-[11px] text-txt-muted">
                  <span>
                    ¿Quieres guardar este pedido en <strong className="text-txt-main">Mis Compras</strong>?{' '}
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="text-andrew-primary font-black underline cursor-pointer ml-1"
                    >
                      Inicia Sesión
                    </button>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN B: OPCIONES DE ENTREGA Y DESTINATARIO */}
          {mostrarFormularioEnvio && (
            <div className="space-y-4 animate-fade-in">
              {/* Selector de Modalidad de Entrega */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-txt-main tracking-wider">
                  1. OPCIONES DE ENTREGA:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMetodoEntrega('lima')}
                    className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all flex items-center gap-3 ${
                      metodoEntrega === 'lima'
                        ? 'border-andrew-primary bg-andrew-primary/15 text-txt-main shadow-sm'
                        : 'border-stroke bg-surface-sub text-txt-muted hover:text-txt-main hover:border-stroke-hover'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-surface-card border border-stroke flex items-center justify-center text-andrew-primary shrink-0">
                      <Truck size={18} />
                    </div>
                    <div>
                      <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase block text-txt-main">
                        Motorizado a Domicilio — Lima (Ref. S/ 10)
                      </span>
                      <span className="text-[11px] text-txt-muted font-medium block">
                        Envío directo a tu dirección. Pago total previo al despacho.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoEntrega('provincias')}
                    className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all flex items-center gap-3 ${
                      metodoEntrega === 'provincias'
                        ? 'border-andrew-primary bg-andrew-primary/15 text-txt-main shadow-sm'
                        : 'border-stroke bg-surface-sub text-txt-muted hover:text-txt-main hover:border-stroke-hover'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-surface-card border border-stroke flex items-center justify-center text-andrew-primary shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase block text-txt-main">
                        Agencia / Provincias (Ref. S/ 18)
                      </span>
                      <span className="text-[11px] text-txt-muted font-medium block">
                        Shalom u Olva Courier a todo el Perú (costo según destino)
                      </span>
                    </div>
                  </button>
                </div>

                {/* Aviso importante de condiciones de envío */}
                <div className="bg-surface-sub/80 border border-stroke rounded-xl p-3 text-[11px] text-txt-muted space-y-1">
                  <span className="font-['Montserrat',sans-serif] font-black text-[10px] uppercase text-txt-main tracking-wider block">
                    {metodoEntrega === 'lima' ? 'Condiciones de envío por motorizado (Lima):' : 'Condiciones de envío a provincias:'}
                  </span>
                  {metodoEntrega === 'lima' ? (
                    <ul className="list-disc pl-4 space-y-0.5 font-medium">
                      <li>El pago del pedido debe realizarse en su totalidad antes del envío. Una vez confirmado, coordinamos el despacho y te avisamos cuando el motorizado esté en camino.</li>
                      <li>El costo del delivery es asumido por el cliente (no incluido en el precio de la camiseta) y varía según la zona; antes del envío te confirmaremos el costo exacto.</li>
                    </ul>
                  ) : (
                    <ul className="list-disc pl-4 space-y-0.5 font-medium">
                      <li>Realizamos envíos a todo el Perú por agencia (Shalom u Olva Courier).</li>
                      <li>El costo de envío es adicional al precio de la camiseta y varía según destino o agencia elegida.</li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Campos de Destinatario */}
              <div className="bg-surface-sub border border-stroke rounded-xl p-4 space-y-3">
                <label className="block text-xs font-black uppercase text-txt-main tracking-wider">
                  2. DATOS DEL DESTINATARIO:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                      NOMBRE Y APELLIDO *
                    </label>
                    <input
                      type="text"
                      required
                      value={nombreCliente}
                      onChange={(e) => setNombreCliente(e.target.value)}
                      placeholder="Ej: Carlos Mendoza"
                      className="w-full bg-input-bg border border-stroke rounded-xl px-3 py-2 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/70 outline-none focus:border-andrew-primary transition-colors font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                      DNI / DOCUMENTO *
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      required
                      value={dniCliente}
                      onChange={(e) => setDniCliente(e.target.value)}
                      placeholder="Ej: 74859612"
                      className="w-full bg-input-bg border border-stroke rounded-xl px-3 py-2 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/70 outline-none focus:border-andrew-primary transition-colors font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                      CELULAR / WHATSAPP *
                    </label>
                    <input
                      type="tel"
                      required
                      value={telefonoCliente}
                      onChange={(e) => setTelefonoCliente(e.target.value)}
                      placeholder="Ej: 999 123 456"
                      className="w-full bg-input-bg border border-stroke rounded-xl px-3 py-2 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/70 outline-none focus:border-andrew-primary transition-colors font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                      {metodoEntrega === 'lima' ? 'DIRECCIÓN Y DISTRITO (LIMA) *' : 'AGENCIA SHALOM / DIRECCIÓN Y CIUDAD *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={ciudadDireccion}
                      onChange={(e) => setCiudadDireccion(e.target.value)}
                      placeholder={metodoEntrega === 'lima' ? 'Ej: Av. Javier Prado 2450, San Borja' : 'Ej: Agencia Shalom Cusco Centro / Trujillo'}
                      className="w-full bg-input-bg border border-stroke rounded-xl px-3 py-2 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/70 outline-none focus:border-andrew-primary transition-colors font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-txt-muted mb-1">
                      NRO / PISO / REFERENCIA (OPCIONAL)
                    </label>
                    <input
                      type="text"
                      value={referenciaDestino}
                      onChange={(e) => setReferenciaDestino(e.target.value)}
                      placeholder="Ej: Dpto 302, frente al parque"
                      className="w-full bg-input-bg border border-stroke rounded-xl px-3 py-2 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/70 outline-none focus:border-andrew-primary transition-colors font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {errorValidacion && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-xl p-3 flex items-center gap-2 text-xs text-red-500 font-bold">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{errorValidacion}</span>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA (lg:col-span-4): Resumen lateral estilo Nike + Botón Continuar */}
        <div className="lg:col-span-4 bg-surface-sub border border-stroke rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stroke pb-2.5">
            <span className="text-xs sm:text-sm font-black uppercase text-txt-main tracking-wider font-['Montserrat',sans-serif]">
              PRODUCTOS EN TU CARRO ({cart.length})
            </span>
            <ShieldCheck size={16} className="text-andrew-primary" />
          </div>

          {/* Mini lista de prendas */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {cart.map((it, idx) => (
              <div key={idx} className="bg-surface-card border border-stroke rounded-lg p-2 flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded bg-surface-sub border border-stroke p-1 flex items-center justify-center shrink-0">
                    <img src={it.imagen} alt={it.nombre} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main block truncate">
                      {it.nombre}
                    </span>
                    <span className="text-[10px] text-txt-muted font-semibold block truncate">
                      Talla {it.tallaSeleccionada} • Cant: {it.cantidad || 1}
                    </span>
                  </div>
                </div>
                <span className="font-['Montserrat',sans-serif] font-black text-xs text-andrew-primary shrink-0">
                  S/ {(it.precio * (it.cantidad || 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="space-y-2 text-xs pt-2 border-t border-stroke">
            <div className="flex justify-between text-txt-muted font-medium">
              <span>Subtotal prendas:</span>
              <span className="text-txt-main font-extrabold">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-txt-muted font-medium">
              <span>Envío ({metodoEntrega === 'lima' ? 'Delivery Lima' : 'Agencia Provincias'}):</span>
              <span className="text-txt-main font-extrabold">S/ {costoEnvio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-stroke">
              <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main">
                TOTAL DE LA ORDEN:
              </span>
              <span className="font-['Montserrat',sans-serif] font-black text-base sm:text-lg text-txt-main">
                S/ {totalConEnvio.toFixed(2)}
              </span>
            </div>

            <div className="bg-surface-card border border-andrew-primary/40 rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-andrew-primary">
                {modalidadPago === 'adelanto' ? 'A pagar hoy (Reserva):' : 'A pagar hoy (100%):'}
              </span>
              <span className="font-['Montserrat',sans-serif] font-black text-base text-andrew-primary">
                S/ {montoAPagarHoy.toFixed(2)}
              </span>
            </div>
          </div>

          {mostrarFormularioEnvio && (
            <button
              type="button"
              onClick={onContinuarPaso3}
              className="w-full bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:scale-[1.01]"
            >
              <span>GUARDAR Y CONTINUAR AL PAGO</span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
