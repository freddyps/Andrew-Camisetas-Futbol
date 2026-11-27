import React from 'react';
import {
  ShieldCheck,
  Check,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Send
} from 'lucide-react';
import { PaymentQrVisualizer, PaymentQrLightboxModal } from './PaymentQrVisualizer';
import VoucherUploadCard from './VoucherUploadCard';

/**
 * StepPaymentTabs:
 * Paso 3 del Checkout exclusivo para pago rápido y seguro vía Yape o Plin.
 */
export default function StepPaymentTabs({
  metodoPago,
  setMetodoPago,
  modalQrOpen,
  setModalQrOpen,
  DATOS_PAGO,
  copiado,
  onCopiar,
  modalidadPago,
  montoAPagarHoy,
  saldoRestante,
  comprobanteFile,
  comprobantePreview,
  onFileChange,
  onRemoveFile,
  codigoOperacion,
  setCodigoOperacion,
  titularCuentaPago,
  setTitularCuentaPago,
  errorValidacion,
  enviando,
  onRegresarPaso2,
  onFinalizarPedido
}) {
  return (
    <div className="bg-surface-card border border-stroke rounded-3xl p-5 sm:p-7 shadow-xl transition-colors">
      {/* Cabecera del Paso 3 */}
      <div className="border-b border-stroke pb-3 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl uppercase text-txt-main flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-andrew-primary text-black text-xs flex items-center justify-center font-black shrink-0">3</span>
            <span>PAGA CON YAPE O PLIN Y VALIDA TU OPERACIÓN</span>
          </h2>
          <p className="text-xs sm:text-sm text-txt-muted font-medium mt-0.5">
            Escanea el código QR o yapea/plinea al número oficial y adjunta tu captura o N° de operación.
          </p>
        </div>
        <span className="self-start md:self-auto text-xs text-andrew-primary font-extrabold flex items-center gap-1.5 bg-andrew-primary/10 border border-andrew-primary/30 px-3 py-1 rounded-full">
          <ShieldCheck size={15} />
          <span>Pago directo Yape / Plin</span>
        </span>
      </div>

      {/* Layout en 2 Columnas Widescreen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* COLUMNA IZQUIERDA (lg:col-span-7): Selector Yape vs Plin y QR Oficial */}
        <div className="lg:col-span-7 space-y-3.5">

          {/* Selector directo Yape vs Plin */}
          <div className="grid grid-cols-2 gap-2.5 bg-surface-sub p-1.5 rounded-2xl border border-stroke">
            <button
              type="button"
              onClick={() => setMetodoPago('yape')}
              className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 ${
                metodoPago === 'yape'
                  ? 'border-[#742384] bg-[#742384] text-white shadow-md'
                  : 'border-transparent bg-surface-card text-txt-muted hover:text-txt-main'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white ring-2 ring-white/30"></span>
              <span>PAGAR CON YAPE</span>
            </button>

            <button
              type="button"
              onClick={() => setMetodoPago('plin')}
              className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 ${
                metodoPago === 'plin'
                  ? 'border-[#00b59c] bg-[#00b59c] text-white shadow-md'
                  : 'border-transparent bg-surface-card text-txt-muted hover:text-txt-main'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white ring-2 ring-white/30"></span>
              <span>PAGAR CON PLIN</span>
            </button>
          </div>

          {/* Caja Corporativa de Yape / Plin con QR y datos */}
          <div className="bg-surface-sub border border-stroke rounded-2xl p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">

              {/* Visualizador de Código QR Oficial */}
              <PaymentQrVisualizer
                metodoPago={metodoPago}
                onOpenModal={() => setModalQrOpen(true)}
              />

              {/* Datos de Yape / Plin (2 Titulares Autorizados) */}
              <div className="sm:col-span-7 space-y-2.5 text-center sm:text-left">
                <div>
                  <span className="text-[11px] font-black uppercase text-txt-muted tracking-wider block">
                    NÚMEROS OFICIALES {metodoPago === 'plin' ? 'PLIN' : 'YAPE'} (ELIGE CUALQUIERA):
                  </span>
                </div>

                {/* Cuenta 1: Brice Andrew (Con QR) */}
                <div
                  onClick={() => onCopiar(DATOS_PAGO.yapePlin.numeroRaw, 'yp1')}
                  className={`bg-surface-card border rounded-xl p-2.5 space-y-1 cursor-pointer transition-all ${
                    copiado === 'yp1' ? 'border-andrew-primary ring-2 ring-andrew-primary/20' : 'border-stroke hover:border-andrew-primary/50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg sm:text-xl font-black text-txt-main">
                        {DATOS_PAGO.yapePlin.numero}
                      </span>
                      <span className="text-[10px] font-black uppercase bg-andrew-primary/15 text-andrew-primary px-2 py-0.5 rounded-md">
                        Con QR
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopiar(DATOS_PAGO.yapePlin.numeroRaw, 'yp1');
                      }}
                      className="text-xs font-bold bg-surface-sub hover:bg-input-bg text-txt-main px-2.5 py-1 rounded-lg border border-stroke flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiado === 'yp1' ? <Check size={12} className="text-andrew-primary" /> : <Copy size={12} />}
                      <span>{copiado === 'yp1' ? 'Elegido y copiado' : 'Elegir / Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-txt-muted font-medium">
                    Titular del QR: <strong className="text-txt-main">{DATOS_PAGO.yapePlin.titular}</strong>
                  </p>
                </div>

                {/* Cuenta 2: Freddy */}
                <div
                  onClick={() => onCopiar(DATOS_PAGO.yapePlinSecundario.numeroRaw, 'yp2')}
                  className={`bg-surface-card border rounded-xl p-2.5 space-y-1 cursor-pointer transition-all ${
                    copiado === 'yp2' ? 'border-andrew-primary ring-2 ring-andrew-primary/20' : 'border-stroke hover:border-andrew-primary/50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                    <span className="font-mono text-lg sm:text-xl font-black text-txt-main">
                      {DATOS_PAGO.yapePlinSecundario.numero}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopiar(DATOS_PAGO.yapePlinSecundario.numeroRaw, 'yp2');
                      }}
                      className="text-xs font-bold bg-surface-sub hover:bg-input-bg text-txt-main px-2.5 py-1 rounded-lg border border-stroke flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiado === 'yp2' ? <Check size={12} className="text-andrew-primary" /> : <Copy size={12} />}
                      <span>{copiado === 'yp2' ? 'Elegido y copiado' : 'Elegir / Copiar'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-txt-muted font-medium">
                    Titular: <strong className="text-txt-main">{DATOS_PAGO.yapePlinSecundario.titular}</strong> (Pago directo por número)
                  </p>
                </div>

                {/* Monto exacto a pagar */}
                <div className="bg-surface-card border border-andrew-primary/50 p-3 sm:p-3.5 rounded-xl flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-xs font-black text-txt-muted uppercase block tracking-wider">MONTO EXACTO A PAGAR:</span>
                    <span className="text-[11px] text-txt-main font-semibold block">
                      {modalidadPago === 'adelanto' ? 'Adelanto de Reserva (S/ 40)' : 'Pago Total (100%)'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-['Montserrat',sans-serif] font-black text-2xl sm:text-3xl text-andrew-primary">
                      S/ {montoAPagarHoy.toFixed(2)}
                    </span>
                    {saldoRestante > 0 && (
                      <span className="text-[11px] text-txt-muted font-bold block">
                        Saldo al recibir: S/ {saldoRestante.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-txt-muted font-medium">
                  <CheckCircle2 size={15} className="text-andrew-primary shrink-0" />
                  <span>Escanea el QR desde tu app de Yape o Plin al instante.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA (lg:col-span-5): Voucher, Código de Operación y Confirmación */}
        <div className="lg:col-span-5 space-y-3">

          <VoucherUploadCard
            comprobantePreview={comprobantePreview}
            comprobanteFile={comprobanteFile}
            onFileChange={onFileChange}
            onRemoveFile={onRemoveFile}
            codigoOperacion={codigoOperacion}
            setCodigoOperacion={setCodigoOperacion}
            titularCuentaPago={titularCuentaPago}
            setTitularCuentaPago={setTitularCuentaPago}
          />

          <div className="bg-andrew-primary/10 border-2 border-andrew-primary/50 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-andrew-primary/20 flex items-center justify-center text-andrew-primary shrink-0 font-bold text-lg">
              📱
            </div>
            <div>
              <span className="font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase text-txt-main block tracking-wide">
                ¿COMPRANDO DESDE EL CELULAR?
              </span>
              <span className="text-xs sm:text-sm text-txt-main font-semibold block leading-snug mt-0.5">
                También puedes enviar la captura directamente por WhatsApp una vez generado tu pedido.
              </span>
            </div>
          </div>

          {errorValidacion && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400">
              <AlertTriangle size={16} className="shrink-0 text-red-400" />
              <span className="font-semibold">{errorValidacion}</span>
            </div>
          )}

          {/* Botones de Navegación Final */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onRegresarPaso2}
              className="bg-surface-sub hover:bg-surface-card border border-stroke text-txt-main font-bold text-xs uppercase py-3.5 px-4 rounded-xl cursor-pointer transition-colors shadow-sm"
            >
              ← PASO 2
            </button>

            <button
              type="button"
              disabled={enviando}
              onClick={onFinalizarPedido}
              className="flex-1 bg-andrew-primary hover:bg-[#1fa75d] disabled:opacity-50 text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_25px_rgba(34,197,94,0.4)] hover:scale-[1.02]"
            >
              <Send size={16} strokeWidth={2.5} />
              <span>{enviando ? 'REGISTRANDO...' : 'CONFIRMAR Y FINALIZAR PEDIDO'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Modal Lightbox para ampliar QR */}
      <PaymentQrLightboxModal
        isOpen={modalQrOpen}
        onClose={() => setModalQrOpen(false)}
        metodoPago={metodoPago}
        titular={DATOS_PAGO.yapePlin.titular}
        numero={DATOS_PAGO.yapePlin.numero}
        monto={montoAPagarHoy}
      />
    </div>
  );
}
