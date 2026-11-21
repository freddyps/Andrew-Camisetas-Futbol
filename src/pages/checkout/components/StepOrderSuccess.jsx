import React, { useEffect, useState } from 'react';
import { Check, Send, MapPin, Package, ShieldCheck } from 'lucide-react';

/**
 * StepOrderSuccess:
 * Paso 4 del checkout en formato Recibo Digital de 2 columnas.
 * Muestra las prendas compradas, dirección de entrega confirmada, montos y botón directo a WhatsApp.
 */
export default function StepOrderSuccess({
  pedidoGenerado,
  nombreCliente,
  modalidadPago,
  montoAPagarHoy,
  saldoRestante,
  codigoOperacion,
  onEnviarMensajeWhatsApp,
  onGoToCatalog
}) {
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimar(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!pedidoGenerado) return null;

  const cliNombre = pedidoGenerado.cliente?.nombre || nombreCliente;
  const cliDestino = pedidoGenerado.cliente?.destino || 'Lima / Agencia Shalom';
  const cliTelefono = pedidoGenerado.cliente?.telefono || '';
  const itemsPedido = pedidoGenerado.items || [];
  const fMontoAbonado = Number(pedidoGenerado.finanzas?.montoAbonado ?? montoAPagarHoy);
  const fSaldoPendiente = Number(pedidoGenerado.finanzas?.saldoPendiente ?? saldoRestante);
  const codOperacion = pedidoGenerado.pagoVerificacion?.codigoOperacion || codigoOperacion || 'POR COORDINAR';

  return (
    <div className={`bg-surface-card border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-700 space-y-6 ${
      animar ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      {/* Cabecera de Éxito */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-stroke text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <div className="absolute inset-0 rounded-full bg-andrew-primary/30 animate-ping"></div>
            <div className="relative w-16 h-16 rounded-full bg-andrew-primary/20 border-2 border-andrew-primary flex items-center justify-center text-andrew-primary shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Check size={32} strokeWidth={3} />
            </div>
          </div>

          <div>
            <span className="inline-block bg-andrew-primary text-black font-['Montserrat',sans-serif] text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm mb-1">
              ¡PEDIDO REGISTRADO CON ÉXITO!
            </span>
            <h2 className="font-['Montserrat',sans-serif] font-black text-xl sm:text-2xl uppercase text-txt-main">
              ORDEN OFICIAL: <span className="text-andrew-primary">#{pedidoGenerado.id}</span>
            </h2>
            <p className="text-txt-muted text-xs sm:text-sm font-medium">
              Tu pedido con {modalidadPago === 'adelanto' ? 'adelanto de reserva de S/ 40' : 'pago completo (100%)'} ha quedado registrado.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-surface-sub border border-stroke px-3.5 py-2 rounded-xl text-xs font-bold text-txt-main">
          <ShieldCheck size={16} className="text-andrew-primary" />
          <span>Garantía Oficial Andrew A1</span>
        </div>
      </div>

      {/* Cuerpo en 2 columnas: Prendas Compradas (Izquierda) + Resumen de Pago y Entrega (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Columna Izquierda (7 cols): Prendas de la Orden y Dirección */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface-sub border border-stroke rounded-2xl p-4 sm:p-5 space-y-3">
            <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase text-txt-main flex items-center gap-2">
              <Package size={15} className="text-andrew-primary" />
              <span>PRENDAS DE TU ORDEN ({itemsPedido.length})</span>
            </span>

            <div className="divide-y divide-stroke">
              {itemsPedido.map((it, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {it.imagen && (
                      <div className="w-12 h-12 rounded-lg bg-surface-card border border-stroke p-1 flex items-center justify-center shrink-0">
                        <img src={it.imagen} alt={it.nombre} className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main block truncate">
                        {it.nombre}
                      </span>
                      <span className="text-[11px] text-txt-muted font-semibold block">
                        Talla: <strong className="text-txt-main">{it.tallaSeleccionada || 'M'}</strong> • Cant: {it.cantidad || 1}
                        {it.personalizacion ? ` • Dorsal: ${it.personalizacion.nombre} #${it.personalizacion.numero}` : ''}
                      </span>
                    </div>
                  </div>
                  <span className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm text-andrew-primary shrink-0">
                    S/ {(Number(it.precio || 0) * (it.cantidad || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-sub border border-stroke rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <MapPin size={18} className="text-andrew-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-['Montserrat',sans-serif] font-black uppercase text-txt-main block">
                DESTINATARIO Y DIRECCIÓN DE ENVÍO:
              </span>
              <p className="text-txt-main font-bold">
                {cliNombre} {cliTelefono ? `· Tel: ${cliTelefono}` : ''}
              </p>
              <p className="text-txt-muted font-medium">
                {cliDestino}
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha (5 cols): Recibo Financiero y Botones */}
        <div className="lg:col-span-5 bg-surface-sub border border-stroke rounded-2xl p-5 space-y-4">
          <span className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main block border-b border-stroke pb-2.5">
            DETALLE DE TU ABONO
          </span>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-txt-muted font-medium">Monto Abonado Hoy:</span>
              <span className="font-black text-andrew-primary text-base">
                S/ {fMontoAbonado.toFixed(2)}
              </span>
            </div>

            {fSaldoPendiente > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-txt-muted font-medium">Saldo Contraentrega:</span>
                <span className="font-black bg-[#ea580c] keep-white px-2.5 py-0.5 rounded-lg text-xs">
                  S/ {fSaldoPendiente.toFixed(2)}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-2.5 border-t border-stroke">
              <span className="text-txt-muted font-medium">Cód. Operación:</span>
              <span className="font-mono font-black text-txt-main">
                {codOperacion}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={onEnviarMensajeWhatsApp}
              className="w-full bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] shadow-[0_4px_20px_rgba(34,197,94,0.35)]"
            >
              <Send size={17} strokeWidth={2.5} />
              <span>CONFIRMAR ORDEN POR WHATSAPP</span>
            </button>

            <button
              type="button"
              onClick={onGoToCatalog}
              className="w-full bg-surface-card hover:bg-input-bg border border-stroke text-txt-main font-bold text-xs uppercase py-3 rounded-xl cursor-pointer transition-colors"
            >
              VOLVER AL CATÁLOGO DE CAMISETAS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
