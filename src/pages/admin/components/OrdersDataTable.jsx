import React, { useState } from 'react';
import { 
  CreditCard, 
  RefreshCw, 
  PhoneCall, 
  Eye, 
  Trash2, 
  X, 
  Clock, 
  ShieldCheck, 
  ShoppingBag,
  FileText,
  ExternalLink,
  Search,
  MapPin,
  CheckCircle2,
  Truck,
  XCircle,
  MessageCircle
} from 'lucide-react';

const ESTADOS_PEDIDO = [
  {
    id: 'PENDIENTE_VERIFICACION',
    label: 'Por Verificar',
    shortLabel: 'Pendiente',
    icon: Clock,
    activeClass: 'bg-amber-500 text-black border-amber-500 shadow-sm',
    badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-300'
  },
  {
    id: 'ADELANTO_VERIFICADO',
    label: 'Adelanto S/ 40 OK',
    shortLabel: 'Adelanto OK',
    icon: ShieldCheck,
    activeClass: 'bg-andrew-primary text-black border-andrew-primary shadow-sm',
    badgeClass: 'bg-andrew-primary/15 border-andrew-primary/40 text-andrew-primary'
  },
  {
    id: 'PAGO_COMPLETO_CONFIRMADO',
    label: 'Pago 100% OK',
    shortLabel: 'Pagado 100%',
    icon: CheckCircle2,
    activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-sm',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
  },
  {
    id: 'ENTREGADO',
    label: 'Entregado',
    shortLabel: 'Entregado',
    icon: Truck,
    activeClass: 'bg-blue-600 text-white border-blue-600 shadow-sm',
    badgeClass: 'bg-blue-500/15 border-blue-500/40 text-blue-600 dark:text-blue-300'
  },
  {
    id: 'CANCELADO',
    label: 'Cancelado',
    shortLabel: 'Cancelado',
    icon: XCircle,
    activeClass: 'bg-red-600 text-white border-red-600 shadow-sm',
    badgeClass: 'bg-red-500/15 border-red-500/40 text-red-500'
  }
];

/**
 * OrdersDataTable:
 * Gestor visual de pedidos con tarjetas organizadas, cambio de estado con un clic
 * (sin menús nativos confusos), acceso directo a WhatsApp del cliente y visor de comprobantes.
 */
export default function OrdersDataTable({
  pedidos = [],
  pedidoDetalle,
  setPedidoDetalle,
  pedidosPendientes = 0,
  pedidosConfirmados = 0,
  onRecargarPedidos,
  onCambiarEstado,
  onEliminarPedido
}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtroEstado !== 'TODOS' && p.estado !== filtroEstado) {
      return false;
    }
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    const id = (p.id || '').toLowerCase();
    const cliente = (p.cliente?.nombre || '').toLowerCase();
    const tel = (p.cliente?.telefono || '').toLowerCase();
    const op = (p.pagoVerificacion?.codigoOperacion || '').toLowerCase();
    return id.includes(q) || cliente.includes(q) || tel.includes(q) || op.includes(q);
  });

  const getEstadoInfo = (estadoId) =>
    ESTADOS_PEDIDO.find((e) => e.id === estadoId) || ESTADOS_PEDIDO[0];

  return (
    <div className="space-y-5">
      {/* 1. Métricas de Pedidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-surface-card border border-amber-500/35 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-300 block">
              POR VERIFICAR EN APP
            </span>
            <div className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-300 leading-none">
              {pedidosPendientes}
            </div>
            <p className="text-[11px] text-txt-muted font-medium">Revisar abono en Yape / Plin</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-surface-card border border-emerald-500/35 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              PAGOS CONFIRMADOS
            </span>
            <div className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
              {pedidosConfirmados}
            </div>
            <p className="text-[11px] text-txt-muted font-medium">Listos para preparar o despachar</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
        </div>

        <div className="bg-surface-card border border-stroke rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-txt-muted block">
              TOTAL PEDIDOS RECIBIDOS
            </span>
            <div className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-black text-txt-main leading-none">
              {pedidos.length}
            </div>
            <p className="text-[11px] text-txt-muted font-medium">Histórico de órdenes registradas</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-andrew-primary/15 border border-andrew-primary/30 text-andrew-primary flex items-center justify-center shrink-0">
            <ShoppingBag size={20} />
          </div>
        </div>
      </div>

      {/* 2. Barra de Búsqueda y Filtros por Estado */}
      <div className="bg-surface-card border border-stroke rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-3 text-txt-muted" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código (#AND), cliente, celular o N° operación..."
              className="w-full bg-input-bg border border-stroke rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-txt-main placeholder:text-txt-muted/70 outline-none focus:border-andrew-primary transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFiltroEstado('TODOS')}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase border transition-all cursor-pointer ${
                filtroEstado === 'TODOS'
                  ? 'bg-txt-main text-bg-base border-txt-main'
                  : 'bg-surface-sub text-txt-muted border-stroke hover:text-txt-main'
              }`}
            >
              Todos ({pedidos.length})
            </button>
            {ESTADOS_PEDIDO.map((est) => {
              const count = pedidos.filter((p) => p.estado === est.id).length;
              const activo = filtroEstado === est.id;
              return (
                <button
                  key={est.id}
                  type="button"
                  onClick={() => setFiltroEstado(est.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase border transition-all cursor-pointer ${
                    activo
                      ? est.activeClass
                      : 'bg-surface-sub text-txt-muted border-stroke hover:text-txt-main'
                  }`}
                >
                  {est.shortLabel} ({count})
                </button>
              );
            })}

            <button
              type="button"
              onClick={onRecargarPedidos}
              className="px-3 py-1.5 bg-surface-sub hover:bg-input-bg text-txt-main border border-stroke rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ml-auto lg:ml-1"
              title="Recargar pedidos"
            >
              <RefreshCw size={12} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Lista de Pedidos en Tarjetas Claras y Fáciles de Gestionar */}
      {pedidosFiltrados.length === 0 ? (
        <div className="bg-surface-card border border-stroke rounded-2xl text-center py-14 px-4 space-y-2 shadow-sm">
          <CreditCard size={36} className="mx-auto text-txt-muted opacity-60" />
          <h4 className="font-['Montserrat',sans-serif] font-black text-sm uppercase text-txt-main">
            No hay pedidos en esta vista
          </h4>
          <p className="text-xs text-txt-muted">
            Cuando un cliente registre una compra o cambies el filtro superior, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {pedidosFiltrados.map((order) => {
            const estadoActual = getEstadoInfo(order.estado);
            const EstadoIcon = estadoActual.icon;
            const esAdelanto = order.finanzas?.modalidadPago === 'adelanto';
            const tieneVoucher = Boolean(order.pagoVerificacion?.comprobanteImagen);
            const telefonoLimpio = (order.cliente?.telefono || '').replace(/\D/g, '');
            const urlWhatsAppCliente = telefonoLimpio
              ? `https://wa.me/51${telefonoLimpio}?text=${encodeURIComponent(
                  `Hola ${order.cliente?.nombre || ''}! Te escribimos de ANDREW Camisetas respecto a tu pedido #${order.id}.`
                )}`
              : null;

            return (
              <div
                key={order.id}
                className="bg-surface-card border border-stroke hover:border-stroke-hover rounded-2xl p-4 sm:p-5 shadow-sm transition-all space-y-4"
              >
                {/* Fila Superior: Código, Fecha, Badge de Estado actual y Acciones rápidas */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stroke">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-black text-sm sm:text-base text-txt-main bg-surface-sub border border-stroke px-3 py-1 rounded-xl">
                      #{order.id}
                    </span>
                    <span className="text-xs text-txt-muted font-semibold">
                      {order.fecha || (order.created_at ? new Date(order.created_at).toLocaleDateString('es-PE') : '')}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-1 rounded-xl border ${estadoActual.badgeClass}`}>
                      <EstadoIcon size={13} />
                      <span>{estadoActual.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPedidoDetalle(order)}
                      className="px-3 py-1.5 rounded-xl bg-surface-sub hover:bg-andrew-primary hover:text-black text-txt-main border border-stroke font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>{tieneVoucher ? 'Ver Voucher / Ficha' : 'Ver Ficha'}</span>
                    </button>

                    {urlWhatsAppCliente && (
                      <a
                        href={urlWhatsAppCliente}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-black border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                        title="Escribir al WhatsApp del cliente"
                      >
                        <MessageCircle size={14} />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onEliminarPedido(order.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/25 transition-colors cursor-pointer"
                      title="Eliminar pedido (si no estaba cancelado, devuelve el stock)"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Cuerpo Central en 3 Bloques Claros: Cliente | Prendas | Pago y Operación */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs">
                  {/* Bloque 1: Cliente y Destino (4 cols) */}
                  <div className="md:col-span-4 bg-surface-sub border border-stroke rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-txt-muted tracking-wider block">
                      1. CLIENTE & DESTINO
                    </span>
                    <div className="font-black text-txt-main uppercase text-xs sm:text-sm">
                      {order.cliente?.nombre || 'Cliente'}
                    </div>
                    <div className="flex items-center gap-1.5 text-txt-main font-semibold">
                      <PhoneCall size={12} className="text-andrew-primary shrink-0" />
                      <span>{order.cliente?.telefono || 'Sin teléfono'}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-txt-muted text-[11px]">
                      <MapPin size={12} className="text-andrew-primary shrink-0 mt-0.5" />
                      <span>{order.cliente?.destino || 'Lima'}</span>
                    </div>
                  </div>

                  {/* Bloque 2: Prendas Solicitadas (4 cols) */}
                  <div className="md:col-span-4 bg-surface-sub border border-stroke rounded-xl p-3.5 space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-txt-muted tracking-wider block">
                      2. PRENDAS DEL PEDIDO ({order.items?.length || 0})
                    </span>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {(order.items || []).map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 text-txt-main font-bold text-xs">
                          <span className="truncate">
                            {it.cantidad || 1}x {it.nombre}
                            {it.incluirShort ? ' + Short' : ''}
                          </span>
                          <span className="bg-surface-card border border-stroke px-2 py-0.5 rounded text-[10px] font-black shrink-0">
                            Talla {it.tallaSeleccionada || 'M'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bloque 3: Monto y Validación Antifraude (4 cols) */}
                  <div className="md:col-span-4 bg-surface-sub border border-stroke rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-txt-muted tracking-wider block">
                        3. PAGO ({order.pagoVerificacion?.metodo || 'YAPE'})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-['Montserrat',sans-serif] font-black text-sm sm:text-base text-txt-main">
                          S/ {Number(order.finanzas?.montoAbonado || 0).toFixed(2)}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                          esAdelanto
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-300'
                            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {esAdelanto ? 'Adelanto' : '100%'}
                        </span>
                      </div>
                      {order.finanzas?.saldoPendiente > 0 && (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">
                          Resta cobrar: S/ {Number(order.finanzas.saldoPendiente).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="text-right bg-surface-card border border-stroke rounded-xl px-3 py-2 shrink-0">
                      <span className="text-[9px] font-extrabold uppercase text-txt-muted block">
                        N° OPERACIÓN
                      </span>
                      <span className="font-mono font-black text-xs sm:text-sm text-andrew-primary block">
                        {order.pagoVerificacion?.codigoOperacion || 'Ver captura'}
                      </span>
                      {order.pagoVerificacion?.titularCuenta && (
                        <span className="text-[10px] text-txt-muted block truncate max-w-[120px]">
                          {order.pagoVerificacion.titularCuenta}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barra Inferior: Selector de Estado con Botones Directos (Sin dropdown nativo roto) */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase text-txt-muted">
                    CAMBIAR ESTADO CON 1 CLIC:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ESTADOS_PEDIDO.map((est) => {
                      const activo = order.estado === est.id;
                      const Icon = est.icon;
                      return (
                        <button
                          key={est.id}
                          type="button"
                          onClick={() => !activo && onCambiarEstado(order.id, est.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase border flex items-center gap-1.5 transition-all cursor-pointer ${
                            activo
                              ? est.activeClass
                              : 'bg-surface-sub hover:bg-input-bg text-txt-muted hover:text-txt-main border-stroke'
                          }`}
                        >
                          <Icon size={12} strokeWidth={2.5} />
                          <span>{est.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalle de Pedido */}
      {pedidoDetalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-md">
          <div className="bg-surface-card border border-stroke rounded-3xl max-w-xl w-full p-6 sm:p-7 relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto transition-colors">
            <button
              onClick={() => setPedidoDetalle(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-sub hover:bg-andrew-primary hover:text-black text-txt-main border border-stroke flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="space-y-1">
              <span className="bg-andrew-primary text-black font-['Montserrat',sans-serif] text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
                FICHA OFICIAL DE PEDIDO
              </span>
              <h3 className="font-['Montserrat',sans-serif] font-black text-xl uppercase text-txt-main">
                PEDIDO #{pedidoDetalle.id}
              </h3>
            </div>

            <div className="bg-surface-sub border border-stroke rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-txt-muted">Cliente:</span>
                <span className="font-bold text-txt-main uppercase">{pedidoDetalle.cliente?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-muted">WhatsApp:</span>
                <span className="font-bold text-andrew-primary">{pedidoDetalle.cliente?.telefono}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-muted">Dirección / Destino:</span>
                <span className="font-bold text-txt-main text-right">{pedidoDetalle.cliente?.destino}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stroke">
                <span className="text-txt-muted">Medio de Pago:</span>
                <span className="font-black text-txt-main uppercase">{pedidoDetalle.pagoVerificacion?.metodo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-andrew-primary font-black">Cód. Operación:</span>
                <span className="font-mono font-black text-andrew-primary text-sm">{pedidoDetalle.pagoVerificacion?.codigoOperacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-muted">Monto Abonado:</span>
                <span className="font-black text-txt-main">S/ {Number(pedidoDetalle.finanzas?.montoAbonado || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-txt-muted">Saldo Pendiente:</span>
                <span className="font-black text-amber-600 dark:text-amber-300">S/ {Number(pedidoDetalle.finanzas?.saldoPendiente || 0).toFixed(2)}</span>
              </div>
            </div>

            {pedidoDetalle.pagoVerificacion?.comprobanteImagen ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-txt-muted uppercase block">VOUCHER / CAPTURA ADJUNTA:</span>
                  <a
                    href={pedidoDetalle.pagoVerificacion.comprobanteImagen}
                    download={`voucher-${pedidoDetalle.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-extrabold text-andrew-primary hover:underline flex items-center gap-1"
                  >
                    <span>Abrir / Descargar</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                {pedidoDetalle.pagoVerificacion.comprobanteImagen.startsWith('data:application/pdf') ? (
                  <div className="w-full rounded-2xl border border-stroke bg-surface-sub p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
                        <FileText size={22} />
                      </div>
                      <div className="text-xs">
                        <span className="font-black text-txt-main block uppercase">Comprobante en formato PDF</span>
                        <span className="text-txt-muted">Puedes previsualizarlo aquí o descargarlo con el botón superior.</span>
                      </div>
                    </div>
                    <iframe
                      src={pedidoDetalle.pagoVerificacion.comprobanteImagen}
                      title={`Voucher PDF ${pedidoDetalle.id}`}
                      className="w-full h-64 rounded-xl border border-stroke bg-white"
                    />
                  </div>
                ) : (
                  <div className="w-full max-h-72 rounded-2xl overflow-hidden border border-stroke bg-surface-sub flex items-center justify-center p-2">
                    <img src={pedidoDetalle.pagoVerificacion.comprobanteImagen} alt="Voucher" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-surface-sub border border-stroke rounded-2xl p-4 text-center text-xs text-txt-muted">
                El cliente validó mediante número de operación ({pedidoDetalle.pagoVerificacion?.codigoOperacion || 'Sin adjunto'}).
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPedidoDetalle(null)}
                className="bg-surface-sub hover:bg-surface-sub/80 text-txt-main border border-stroke font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
