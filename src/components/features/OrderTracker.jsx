import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Phone, Mail, FileText, CheckCircle, Package, Truck, ShieldAlert } from 'lucide-react';

export default function OrderTracker({ onBack }) {
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const code = orderCode.trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setError('');
    setOrder(null);

    const djangoApiBaseUrl = import.meta.env.VITE_DJANGO_API_BASE_URL || 'http://127.0.0.1:8000';
    const trackingUrl = `${djangoApiBaseUrl.replace(/\/$/, '')}/api/pedidos/tracking/${code}/`;

    try {
      const response = await fetch(trackingUrl);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || 'No se encontró ningún pedido con ese código. Verifica el código e intenta nuevamente.');
      }
    } catch (err) {
      setError('Hubo un error de conexión al buscar el pedido. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'pendiente': return 1;
      case 'pagado': return 2;
      case 'enviado': return 3;
      default: return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.estado) : 1;

  const timelineSteps = [
    {
      step: 1,
      title: 'Pedido Registrado',
      desc: 'Tu solicitud de compra ha sido ingresada. Esperando verificación del pago por transferencia o Yape/Plin.',
      icon: <FileText size={18} />,
      statusName: 'pendiente'
    },
    {
      step: 2,
      title: 'Pago Verificado & Preparación',
      desc: 'Hemos verificado el pago. Tu camiseta está en proceso de control de calidad y estampado personalizado.',
      icon: <Package size={18} />,
      statusName: 'pagado'
    },
    {
      step: 3,
      title: 'Despachado / Enviado',
      desc: 'El pedido fue entregado al courier (Olva/Shalom/Motorizado). Recibirás el número de seguimiento pronto.',
      icon: <Truck size={18} />,
      statusName: 'enviado'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs font-display font-black uppercase tracking-[0.08em] text-[#22c55e] hover:text-[#1fa75d] transition-colors"
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>

        {/* CABECERA */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-[#22c55e] text-xs font-black uppercase tracking-[0.1em] mb-2 glow-text-green">
            <Search size={14} /> CONSULTA TU PEDIDO
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-white">Seguimiento de Pedido</h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-2">
            Ingresa el código único que recibiste al finalizar tu compra (ej: AC-12345) para conocer su estado.
          </p>
        </div>

        {/* BUSCADOR */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex gap-2 p-1 bg-white/[0.02] border border-white/10 rounded-lg focus-within:border-[#22c55e] transition-colors max-w-lg">
            <input
              type="text"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder="Código de Pedido (Ej. AC-12345)"
              className="bg-transparent flex-1 px-4 py-3 text-xs sm:text-sm font-semibold focus:outline-none placeholder-gray-500 uppercase"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#22c55e] hover:bg-[#1fa75d] disabled:opacity-50 text-black px-6 py-3 font-display font-black text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 rounded-md"
            >
              {loading ? 'Buscando...' : <><Search size={14} /> Buscar</>}
            </button>
          </div>
        </form>

        {/* ERRORES */}
        {error && (
          <div className="border border-red-500/20 bg-red-500/5 p-4 rounded-lg flex gap-3 text-red-400 text-xs sm:text-sm font-semibold mb-10">
            <ShieldAlert className="shrink-0" size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* DETALLE DEL PEDIDO ENCONTRADO */}
        {order && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* ESTADO GENERAL Y RESUMEN */}
            <div className="glass-panel border border-white/10 p-6 bg-white/[0.01]">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-display font-black uppercase text-[#22c55e]">
                    Pedido {order.codigo_pedido}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold mt-1">
                    <Calendar size={12} />
                    <span>{new Date(order.fecha_creacion).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">Monto Total</span>
                  <span className="text-base font-display font-black text-white">S/ {parseFloat(order.monto_total).toFixed(2)}</span>
                </div>
              </div>

              {/* INFORMACIÓN DEL CLIENTE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Cliente</span>
                  <span className="text-white block">{order.cliente_nombre}</span>
                  <span className="text-gray-400 block text-[11px] mt-0.5 inline-flex items-center gap-1">
                    <Mail size={10} /> {order.cliente_email}
                  </span>
                  <span className="text-gray-400 block text-[11px] inline-flex items-center gap-1">
                    <Phone size={10} /> {order.cliente_telefono}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Dirección de Entrega</span>
                  <span className="text-white block">{order.cliente_direccion || 'No especificada (Recojo)'}</span>
                  <span className="text-gray-400 block text-[11px] mt-0.5 uppercase">
                    Método de Pago: {order.metodo_pago.toUpperCase()} ({order.titular_pago})
                  </span>
                </div>
              </div>
            </div>

            {/* SECCIÓN TIMELINE */}
            <div className="glass-panel border border-white/10 p-6 bg-white/[0.01]">
              <h4 className="text-xs font-display font-black uppercase text-white tracking-wider mb-6">
                Estado del Envío
              </h4>

              {order.estado === 'cancelado' ? (
                <div className="border border-red-500/25 bg-red-500/5 p-4 rounded-lg flex items-center gap-3">
                  <ShieldAlert className="text-red-500 shrink-0" size={24} />
                  <div>
                    <h5 className="text-xs font-display font-black uppercase text-red-500">Pedido Cancelado</h5>
                    <p className="text-[11px] text-gray-400 font-semibold mt-1">Este pedido ha sido cancelado por falta de verificación del pago o solicitud de anulación.</p>
                  </div>
                </div>
              ) : (
                <div className="relative border-l-2 border-white/5 pl-6 ml-3 space-y-8">
                  {timelineSteps.map((stepInfo, idx) => {
                    const isCompleted = currentStep >= stepInfo.step;
                    const isActive = currentStep === stepInfo.step;
                    
                    return (
                      <div key={idx} className="relative">
                        {/* Indicador de nodo */}
                        <div
                          className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-[#22c55e] border-[#22c55e] text-black glow-green-sm'
                              : 'bg-[#050505] border-white/10 text-gray-600'
                          }`}
                        >
                          {isCompleted ? <CheckCircle size={14} className="stroke-[3]" /> : stepInfo.icon}
                        </div>

                        <div>
                          <h5
                            className={`text-xs font-display font-black uppercase tracking-wider ${
                              isActive ? 'text-[#22c55e]' : isCompleted ? 'text-white' : 'text-gray-600'
                            }`}
                          >
                            {stepInfo.title}
                          </h5>
                          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed mt-1 max-w-xl">
                            {stepInfo.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ARTÍCULOS EN EL PEDIDO */}
            <div className="glass-panel border border-white/10 p-6 bg-white/[0.01]">
              <h4 className="text-xs font-display font-black uppercase text-white tracking-wider mb-4 border-b border-white/5 pb-3">
                Prendas en este Pedido ({order.detalles.length})
              </h4>
              <div className="divide-y divide-white/5">
                {order.detalles.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-xs font-semibold first:pt-0 last:pb-0">
                    <div>
                      <span className="text-white font-bold block">{item.camiseta_nombre}</span>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block mt-0.5">
                        Talla {item.talla} · {item.version.toUpperCase()} {item.con_short ? '· Con Short' : ''}
                      </span>
                      {item.nombre_personalizado && (
                        <span className="text-[#22c55e] text-[9px] uppercase font-black block tracking-wider mt-0.5">
                          Personalizado: {item.nombre_personalizado} #{item.numero_personalizado}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block">{item.cantidad} x S/ {parseFloat(item.precio_unitario).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
