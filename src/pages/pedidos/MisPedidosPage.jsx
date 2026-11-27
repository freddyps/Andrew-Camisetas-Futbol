import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  RefreshCw, 
  Calendar, 
  Truck, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  ShoppingBag, 
  ChevronRight,
  ShieldCheck,
  Phone,
  MapPin,
  ExternalLink,
  User,
  Check,
  Lock,
  LogIn
} from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';
import { useMisPedidos } from './hooks/useMisPedidos';

export default function MisPedidosPage({ 
  user = null, 
  onExploreCatalog = () => {},
  onOpenAuth = () => {}
}) {
  const {
    pedidosFiltrados,
    cargando,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    cargarPedidos
  } = useMisPedidos(user);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  // Sincronizar pedido seleccionado únicamente dentro de los pedidos permitidos para el usuario actual
  useEffect(() => {
    if (pedidosFiltrados.length === 0) {
      setPedidoSeleccionado(null);
      return;
    }
    setPedidoSeleccionado((prev) => {
      if (prev && pedidosFiltrados.some((p) => p.id === prev.id)) {
        return pedidosFiltrados.find((p) => p.id === prev.id);
      }
      return pedidosFiltrados[0];
    });
  }, [pedidosFiltrados]);

  // Configuración visual de alta legibilidad para el estado del pedido
  const getStatusBadge = (estadoRaw) => {
    const estado = (estadoRaw || 'PENDIENTE_VERIFICACION').toUpperCase();
    if (estado.includes('CANCELADO') || estado.includes('RECHAZADO')) {
      return {
        label: 'PEDIDO CANCELADO / RECHAZADO',
        step: 0,
        clase: 'bg-red-600 text-white border-red-600 shadow-sm',
        icono: Lock
      };
    }
    if (estado === 'ENTREGADO') {
      return {
        label: 'ENTREGADO AL CLIENTE',
        step: 3,
        clase: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
        icono: CheckCircle2
      };
    }
    if (estado.includes('CONFIRMADO') || estado.includes('ADELANTO')) {
      return {
        label: 'PAGO VERIFICADO · EN PROCESO',
        step: 2,
        clase: 'bg-andrew-primary text-black border-andrew-primary shadow-sm',
        icono: ShieldCheck
      };
    }
    return {
      label: 'PENDIENTE DE VERIFICACIÓN',
      step: 1,
      clase: 'bg-[#ea580c] text-white border-[#ea580c] shadow-sm',
      icono: Clock
    };
  };

  return (
    <div className="min-h-screen bg-bg-base text-txt-main pt-36 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-10 xl:px-12 select-none transition-colors duration-200">
      <div className="w-full max-w-[1720px] mx-auto space-y-8">
        
        {/* 1. CABECERA PRINCIPAL DE LA PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stroke">
          <div>
            <div className="inline-flex items-center gap-2 bg-andrew-primary/15 border border-andrew-primary/40 px-3.5 py-1.5 rounded-full text-andrew-primary text-xs font-black uppercase tracking-wider mb-2.5">
              <Package size={15} />
              <span>SEGUIMIENTO DE ÓRDENES Y COMPRAS</span>
            </div>
            <h1 className="font-['Montserrat',sans-serif] font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-txt-main">
              MIS <span className="text-andrew-primary">COMPRAS</span> & PEDIDOS
            </h1>
            <p className="text-txt-muted text-sm sm:text-base mt-1.5 font-medium">
              Revisa paso a paso el estado de tu pedido, las prendas solicitadas y el detalle de tu pago.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={() => cargarPedidos(true)}
                className="px-4 py-3 rounded-xl bg-surface-card hover:bg-surface-sub text-txt-main border border-stroke hover:border-stroke-hover flex items-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw size={15} className={cargando ? 'animate-spin text-andrew-primary' : ''} />
                <span>Actualizar</span>
              </button>
            )}
            <button
              onClick={onExploreCatalog}
              className="bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:scale-105"
            >
              <ShoppingBag size={16} />
              <span>SEGUIR COMPRANDO</span>
            </button>
          </div>
        </div>

        {/* BLOQUEO DE SEGURIDAD SI NO HAY USUARIO NI PEDIDOS DE INVITADO EN ESTE DISPOSITIVO */}
        {!user && pedidosFiltrados.length === 0 ? (
          <div className="bg-surface-card border border-stroke rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-6 shadow-xl my-8">
            <div className="w-20 h-20 rounded-2xl bg-andrew-primary/15 border border-andrew-primary/35 flex items-center justify-center mx-auto text-andrew-primary shadow-[0_0_25px_rgba(34,197,94,0.15)]">
              <Lock size={36} strokeWidth={2.2} />
            </div>

            <div className="space-y-2.5">
              <h2 className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-3xl uppercase text-txt-main tracking-tight">
                INICIA SESIÓN PARA VER TUS COMPRAS
              </h2>
              <p className="text-txt-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-medium">
                Por privacidad y seguridad, el historial de pedidos, estados de confección y comprobantes solo se muestran cuando ingresas con tu cuenta.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase px-7 py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-[0_6px_24px_rgba(34,197,94,0.3)] hover:scale-[1.02]"
              >
                <LogIn size={18} strokeWidth={2.5} />
                <span>INICIAR SESIÓN / CREAR CUENTA</span>
              </button>

              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto bg-surface-sub hover:bg-bg-base text-txt-main border border-stroke hover:border-stroke-hover font-['Montserrat',sans-serif] font-bold text-xs sm:text-sm uppercase px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBag size={17} />
                <span>EXPLORAR CATÁLOGO</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 2. BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* Input de Búsqueda */}
              <div className="lg:col-span-7 xl:col-span-8 relative">
                <Search size={18} className="absolute left-4 top-3.5 text-txt-muted" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar en tus compras por código (#AND-...), celular o camiseta..."
                  className="w-full bg-input-bg border border-stroke rounded-2xl pl-12 pr-24 py-3.5 text-sm text-txt-main placeholder:text-txt-muted outline-none focus:border-andrew-primary transition-colors shadow-sm"
                />
                {busqueda && (
                  <button
                    type="button"
                    onClick={() => setBusqueda('')}
                    className="absolute right-4 top-3.5 text-xs text-txt-muted hover:text-txt-main font-bold cursor-pointer"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Filtros de Estado */}
              <div className="lg:col-span-5 xl:col-span-4 flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 justify-start lg:justify-end">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'pendientes', label: 'Pendientes' },
                  { id: 'confirmados', label: 'Confirmados' },
                  { id: 'entregados', label: 'Entregados' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFiltroEstado(f.id)}
                    className={`px-4 py-3 rounded-xl text-xs font-black uppercase font-['Montserrat',sans-serif] transition-all cursor-pointer whitespace-nowrap border ${
                      filtroEstado === f.id
                        ? 'bg-andrew-primary text-black border-andrew-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        : 'bg-surface-card border-stroke text-txt-muted hover:text-txt-main hover:border-stroke-hover'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. CONTENIDO PRINCIPAL EN 2 COLUMNAS (CARGA INSTANTÁNEA SIN PANTALLA DE ESPERA) */}
            {pedidosFiltrados.length === 0 ? (
              <div className="bg-surface-card border border-stroke rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xl">
                <Package size={56} className="mx-auto text-txt-muted" />
                <h2 className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl uppercase text-txt-main">
                  {busqueda ? 'NO SE ENCONTRARON PEDIDOS' : 'AÚN NO TIENES COMPRAS EN TU CUENTA'}
                </h2>
                <p className="text-txt-muted text-sm leading-relaxed">
                  {busqueda 
                    ? 'Verifica que el código o nombre ingresado coincida con tus compras registradas.'
                    : `Hola ${user?.nombre || user?.email || 'Crack'}, aún no tienes pedidos registrados con este filtro. Cuando realices una compra aparecerá aquí con su proceso paso a paso.`}
                </p>
                <button
                  onClick={onExploreCatalog}
                  className="bg-andrew-primary hover:bg-[#1fa75d] text-black font-black text-xs sm:text-sm uppercase px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  EXPLORAR CATÁLOGO OFICIAL
                </button>
              </div>
            ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
            
            {/* =====================================================================
                COLUMNA IZQUIERDA (lg:col-span-5): LISTA DE TARJETAS DE ÓRDENES
               ===================================================================== */}
            <div className="lg:col-span-5 space-y-4 max-h-[850px] overflow-y-auto pr-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase text-txt-main tracking-wider font-['Montserrat',sans-serif]">
                  ÓRDENES ENCONTRADAS ({pedidosFiltrados.length})
                </span>
                <span className="text-xs font-semibold text-txt-muted">
                  Selecciona una para ver el proceso
                </span>
              </div>

              {pedidosFiltrados.map((order) => {
                const badge = getStatusBadge(order.estado);
                const BadgeIcon = badge.icono;
                const isSelected = pedidoSeleccionado?.id === order.id;
                const total = order.finanzas?.totalGeneral || order.totalConEnvio || 0;
                const modalidad = order.finanzas?.modalidadPago || 'completo';

                return (
                  <div
                    key={order.id}
                    onClick={() => setPedidoSeleccionado(order)}
                    className={`p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-4 ${
                      isSelected
                        ? 'bg-surface-card border-andrew-primary ring-2 ring-andrew-primary/25 shadow-[0_8px_30px_rgba(34,197,94,0.18)]'
                        : 'bg-surface-card border-stroke hover:border-stroke-hover shadow-md'
                    }`}
                  >
                    {/* Fila 1: Código de orden grande + Fecha */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-['Montserrat',sans-serif] font-black text-base sm:text-lg text-txt-main tracking-tight">
                        #{order.id}
                      </span>
                      <span className="text-xs font-bold text-txt-muted flex items-center gap-1.5 bg-surface-sub px-2.5 py-1 rounded-lg border border-stroke">
                        <Calendar size={13} className="text-andrew-primary" />
                        <span>{order.fecha || (order.created_at ? new Date(order.created_at).toLocaleDateString('es-PE') : 'Reciente')}</span>
                      </span>
                    </div>

                    {/* Fila 2: Badge de estado grande y 100% legible */}
                    <div>
                      <span className={`inline-flex items-center gap-2 text-xs font-black uppercase px-3.5 py-1.5 rounded-xl border tracking-wide ${badge.clase}`}>
                        <BadgeIcon size={14} strokeWidth={2.5} />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Fila 3: Lista de Prendas con letra clara */}
                    <div className="bg-surface-sub border border-stroke rounded-xl p-3.5 space-y-2">
                      {(order.items || []).map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm text-txt-main">
                          <span className="font-extrabold line-clamp-1">
                            {it.cantidad || 1}x {it.nombre}{' '}
                            <span className="text-xs font-black bg-surface-card border border-stroke px-2 py-0.5 rounded ml-1">
                              Talla {it.tallaSeleccionada || 'M'}
                            </span>
                          </span>
                          <span className="font-['Montserrat',sans-serif] font-black text-sm text-txt-main shrink-0 ml-2">
                            S/ {((it.precio || 0) * (it.cantidad || 1)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Fila 4: Total y Botón Ver Detalles */}
                    <div className="flex items-center justify-between pt-2 border-t border-stroke">
                      <div>
                        <span className="text-[11px] font-black text-txt-muted block uppercase tracking-wider">
                          {modalidad === 'adelanto' ? 'RESERVA CON ADELANTO' : 'PAGO COMPLETO (100%)'}
                        </span>
                        <span className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl text-andrew-primary">
                          S/ {Number(total).toFixed(2)}
                        </span>
                      </div>

                      <div className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase px-3.5 py-2 rounded-xl transition-colors ${
                        isSelected 
                          ? 'bg-andrew-primary text-black' 
                          : 'bg-surface-sub text-txt-main hover:bg-andrew-primary hover:text-black'
                      }`}>
                        <span>Ver detalle</span>
                        <ChevronRight size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* =====================================================================
                COLUMNA DERECHA (lg:col-span-7): PROCESO Y DESGLOSE ORDENADO PASO A PASO
               ===================================================================== */}
            <div className="lg:col-span-7">
              {pedidoSeleccionado ? (() => {
                const badgeActual = getStatusBadge(pedidoSeleccionado.estado);
                const BadgeIcon = badgeActual.icono;
                const stepActivo = badgeActual.step;

                return (
                  <div className="bg-surface-card border border-stroke rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
                    
                    {/* CABECERA DE LA ORDEN SELECCIONADA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stroke pb-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl text-txt-main uppercase tracking-tight">
                            PEDIDO #{pedidoSeleccionado.id}
                          </h2>
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-1 rounded-lg border ${badgeActual.clase}`}>
                            <BadgeIcon size={13} strokeWidth={2.5} />
                            <span>{badgeActual.label}</span>
                          </span>
                        </div>
                        <p className="text-xs font-medium text-txt-muted flex items-center gap-1.5">
                          <Calendar size={13} className="text-andrew-primary" />
                          <span>
                            Registrado el {pedidoSeleccionado.fecha || (pedidoSeleccionado.created_at ? new Date(pedidoSeleccionado.created_at).toLocaleString('es-PE') : 'Fecha reciente')}
                          </span>
                        </p>
                      </div>

                      <a
                        href={`https://wa.me/${SITE_CONFIG.whatsapp.codigoPais}${SITE_CONFIG.whatsapp.numeroRaw}?text=${encodeURIComponent(`Hola Andrew Camisetas! Quisiera hacer seguimiento a mi pedido #${pedidoSeleccionado.id}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] text-xs sm:text-sm font-black uppercase flex items-center gap-2 transition-all self-start sm:self-auto cursor-pointer shadow-md hover:scale-105"
                      >
                        <Phone size={15} strokeWidth={2.5} />
                        <span>Consultar por WhatsApp</span>
                        <ExternalLink size={14} strokeWidth={2.5} />
                      </a>
                    </div>

                    {/* PASO 1: LÍNEA DE TIEMPO DEL PROCESO DEL PEDIDO */}
                    <div className="bg-surface-sub border border-stroke rounded-2xl p-4 sm:p-5 space-y-3">
                      <span className="text-xs font-black uppercase text-txt-main tracking-wider block font-['Montserrat',sans-serif]">
                        1. ESTADO Y PROCESO DE TU PEDIDO:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { num: 1, title: '1. Verificación', desc: 'Revisando operación de pago', icon: Clock },
                          { num: 2, title: '2. Confirmado', desc: 'Prenda separada / en preparación', icon: ShieldCheck },
                          { num: 3, title: '3. Entregado', desc: 'Despachado a tu destino', icon: Truck },
                        ].map((etapa) => {
                          const completado = stepActivo > etapa.num;
                          const esActual = stepActivo === etapa.num;
                          const StepIcon = etapa.icon;

                          return (
                            <div
                              key={etapa.num}
                              className={`p-3.5 rounded-xl border-2 flex items-start gap-3 transition-all ${
                                esActual
                                  ? etapa.num === 1
                                    ? 'bg-[#ea580c]/10 border-[#ea580c] text-txt-main'
                                    : 'bg-andrew-primary/15 border-andrew-primary text-txt-main'
                                  : completado
                                  ? 'bg-surface-card border-andrew-primary/50 text-txt-main'
                                  : 'bg-surface-card border-stroke text-txt-muted opacity-60'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-xs ${
                                esActual && etapa.num === 1
                                  ? 'bg-[#ea580c] text-white'
                                  : esActual || completado
                                  ? 'bg-andrew-primary text-black'
                                  : 'bg-surface-sub text-txt-muted border border-stroke'
                              }`}>
                                {completado ? <Check size={16} strokeWidth={3} /> : <StepIcon size={16} />}
                              </div>
                              <div>
                                <h4 className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main">
                                  {etapa.title}
                                </h4>
                                <p className="text-[11px] sm:text-xs text-txt-muted font-medium leading-snug mt-0.5">
                                  {etapa.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* PASO 2: PRENDAS SOLICITADAS */}
                    <div className="space-y-3">
                      <span className="text-xs sm:text-sm font-black uppercase text-txt-main tracking-wider block font-['Montserrat',sans-serif]">
                        2. PRENDAS SOLICITADAS EN TU ORDEN:
                      </span>
                      <div className="divide-y divide-stroke bg-surface-sub rounded-2xl p-4 sm:p-5 border border-stroke">
                        {(pedidoSeleccionado.items || []).map((it, idx) => (
                          <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-surface-card p-1.5 flex items-center justify-center shrink-0 border border-stroke shadow-sm">
                                <img src={it.imagen} alt={it.nombre} className="max-h-full max-w-full object-contain" />
                              </div>
                              <div className="space-y-1">
                                <span className="font-['Montserrat',sans-serif] font-black text-txt-main text-base uppercase block">
                                  {it.nombre}
                                </span>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-txt-muted font-semibold">
                                  <span className="bg-surface-card border border-stroke text-txt-main font-black px-2.5 py-0.5 rounded-md">
                                    Talla: {it.tallaSeleccionada || 'M'}
                                  </span>
                                  <span className="bg-surface-card border border-stroke text-txt-main font-bold px-2.5 py-0.5 rounded-md">
                                    Cantidad: {it.cantidad || 1} un.
                                  </span>
                                  {it.incluirShort && (
                                    <span className="bg-andrew-primary/15 text-andrew-primary border border-andrew-primary/30 font-bold px-2.5 py-0.5 rounded-md">
                                      + Short ({it.tallaShort || it.tallaSeleccionada})
                                    </span>
                                  )}
                                  {it.personalizacion && (
                                    <span className="bg-andrew-primary/15 text-andrew-primary border border-andrew-primary/30 font-black px-2.5 py-0.5 rounded-md uppercase">
                                      ★ Dorsal: {it.personalizacion.nombre} #{it.personalizacion.numero}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-['Montserrat',sans-serif] font-black text-txt-main text-base sm:text-lg block">
                                S/ {((it.precio || 0) * (it.cantidad || 1)).toFixed(2)}
                              </span>
                              <span className="text-xs font-semibold text-txt-muted">
                                S/ {(it.precio || 0).toFixed(2)} c/u
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PASO 3: DATOS DEL DESTINATARIO Y DIRECCIÓN DE ENTREGA */}
                    <div className="space-y-3">
                      <span className="text-xs sm:text-sm font-black uppercase text-txt-main tracking-wider block font-['Montserrat',sans-serif]">
                        3. DATOS DE ENTREGA Y DESTINATARIO:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-sub p-5 rounded-2xl border border-stroke">
                        <div className="bg-surface-card border border-stroke rounded-xl p-4 space-y-2">
                          <span className="text-xs font-black uppercase text-txt-muted tracking-wider flex items-center gap-1.5">
                            <User size={14} className="text-andrew-primary" />
                            <span>CLIENTE / DESTINATARIO</span>
                          </span>
                          <p className="text-txt-main font-black text-base uppercase">
                            {pedidoSeleccionado.cliente?.nombre || 'Cliente'}
                          </p>
                          <p className="text-txt-main font-bold text-sm flex items-center gap-2 pt-0.5">
                            <Phone size={14} className="text-andrew-primary" />
                            <span>{pedidoSeleccionado.cliente?.telefono || 'No registrado'}</span>
                          </p>
                        </div>

                        <div className="bg-surface-card border border-stroke rounded-xl p-4 space-y-2">
                          <span className="text-xs font-black uppercase text-txt-muted tracking-wider flex items-center gap-1.5">
                            <MapPin size={14} className="text-andrew-primary" />
                            <span>DIRECCIÓN / AGENCIA DE ENVÍO</span>
                          </span>
                          <p className="text-txt-main font-black text-sm sm:text-base">
                            {pedidoSeleccionado.cliente?.destino || 'Lima'}
                          </p>
                          {pedidoSeleccionado.cliente?.referencia && (
                            <p className="text-txt-muted text-xs font-semibold">
                              Referencia: <span className="text-txt-main">{pedidoSeleccionado.cliente.referencia}</span>
                            </p>
                          )}
                          <span className="inline-block bg-andrew-primary/15 text-andrew-primary border border-andrew-primary/30 text-xs font-black uppercase px-2.5 py-1 rounded-lg mt-1">
                            {pedidoSeleccionado.cliente?.metodoEntrega === 'provincias' ? 'Envío a Provincias (Olva / Shalom)' : 'Lima Metropolitana'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PASO 4: RESUMEN DE PAGO Y LIQUIDACIÓN */}
                    <div className="space-y-3">
                      <span className="text-xs sm:text-sm font-black uppercase text-txt-main tracking-wider block font-['Montserrat',sans-serif]">
                        4. RESUMEN ECONÓMICO Y VALIDACIÓN DE PAGO:
                      </span>
                      <div className="bg-surface-sub rounded-2xl p-5 border border-stroke space-y-4">
                        
                        {/* Datos de la operación declarada */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-card p-4 rounded-xl border border-stroke">
                          <div>
                            <span className="text-xs font-bold text-txt-muted block">Método de Pago:</span>
                            <span className="font-['Montserrat',sans-serif] font-black text-sm uppercase text-andrew-primary mt-0.5 block">
                              {pedidoSeleccionado.pagoVerificacion?.metodo || 'YAPE / PLIN'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-txt-muted block">Código de Operación:</span>
                            <span className="font-mono font-black text-txt-main text-sm sm:text-base mt-0.5 block">
                              {pedidoSeleccionado.pagoVerificacion?.codigoOperacion || 'POR COORDINAR'}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-txt-muted block">Titular de Cuenta:</span>
                            <span className="font-black text-txt-main text-sm uppercase mt-0.5 block">
                              {pedidoSeleccionado.pagoVerificacion?.titularCuenta || pedidoSeleccionado.cliente?.nombre || 'Cliente'}
                            </span>
                          </div>
                        </div>

                        {/* Desglose de importes con tipografía grande */}
                        <div className="space-y-2.5 text-sm pt-1">
                          <div className="flex justify-between text-txt-muted font-semibold">
                            <span>Subtotal de prendas:</span>
                            <span className="text-txt-main font-bold">
                              S/ {Number(pedidoSeleccionado.finanzas?.subtotal || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-txt-muted font-semibold">
                            <span>Costo de envío:</span>
                            <span className="text-txt-main font-bold">
                              S/ {Number(pedidoSeleccionado.finanzas?.costoEnvio || 0).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-base sm:text-lg pt-3 border-t border-stroke">
                            <span className="font-['Montserrat',sans-serif] font-black uppercase text-txt-main">
                              TOTAL DEL PEDIDO:
                            </span>
                            <span className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl text-andrew-primary">
                              S/ {Number(pedidoSeleccionado.finanzas?.totalGeneral || pedidoSeleccionado.totalConEnvio || 0).toFixed(2)}
                            </span>
                          </div>

                          {pedidoSeleccionado.finanzas?.modalidadPago === 'adelanto' ? (
                            <div className="bg-surface-card border-2 border-[#ea580c] rounded-xl p-4 mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <span className="text-sm text-txt-main font-bold">
                                Adelanto abonado hoy: <strong className="text-andrew-primary text-base font-black">S/ {Number(pedidoSeleccionado.finanzas?.montoAbonado || 40).toFixed(2)}</strong>
                              </span>
                              <span className="text-sm bg-[#ea580c] text-white px-3 py-1 rounded-lg font-black uppercase">
                                Saldo contraentrega: S/ {Number(pedidoSeleccionado.finanzas?.saldoPendiente || 0).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <div className="bg-andrew-primary/15 border border-andrew-primary/40 rounded-xl p-3.5 mt-3 text-center text-xs sm:text-sm text-txt-main font-black uppercase flex items-center justify-center gap-2">
                              <CheckCircle2 size={18} className="text-andrew-primary shrink-0" />
                              <span>PAGO 100% COMPLETO · SIN SALDOS PENDIENTES</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })() : (
                <div className="bg-surface-card border border-stroke rounded-3xl p-12 text-center text-txt-muted text-sm font-semibold">
                  Selecciona una compra en la lista de la izquierda para ver su proceso y desglose completo.
                </div>
              )}
            </div>

          </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
