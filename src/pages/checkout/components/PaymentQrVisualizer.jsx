import React from 'react';
import { ZoomIn, QrCode } from 'lucide-react';

export function PaymentQrVisualizer({ metodoPago = 'yape', onOpenModal }) {
  const esPlin = metodoPago === 'plin';
  const qrSrc = esPlin ? '/pagos/qr_plin.webp' : '/pagos/qr_yape.webp';
  const nombreCanal = esPlin ? 'Plin' : 'Yape';

  return (
    <div className="sm:col-span-5 flex flex-col items-center text-center">
      <div
        onClick={onOpenModal}
        className="group relative bg-white p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] cursor-pointer hover:scale-105 transition-all border-2 border-stroke"
        title={`Toca para ampliar el Código QR de ${nombreCanal}`}
      >
        <div className="w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center bg-white rounded-xl overflow-hidden">
          <img
            src={qrSrc}
            alt={`Código QR oficial de ${nombreCanal}`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="absolute inset-0 bg-black/75 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
          <ZoomIn size={22} className="text-andrew-primary mb-1" />
          <span className="text-[11px] font-black uppercase text-center leading-tight">
            Toca para ampliar
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenModal}
        className="mt-2 text-xs font-extrabold text-andrew-primary hover:opacity-80 transition-colors flex items-center gap-1 cursor-pointer bg-surface-card hover:bg-input-bg px-3 py-1 rounded-lg border border-stroke shadow-xs"
      >
        <QrCode size={13} />
        <span>Ampliar QR {nombreCanal}</span>
      </button>
    </div>
  );
}

export function PaymentQrLightboxModal({
  isOpen,
  onClose,
  metodoPago = 'yape',
  titular,
  numero,
  monto
}) {
  if (!isOpen) return null;

  const esPlin = metodoPago === 'plin';
  const qrSrc = esPlin ? '/pagos/qr_plin.webp' : '/pagos/qr_yape.webp';
  const nombreCanal = esPlin ? 'PLIN' : 'YAPE';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-overlay-backdrop backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-card border border-stroke rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative cursor-default transition-colors"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-sub hover:bg-input-bg border border-stroke text-txt-main flex items-center justify-center cursor-pointer transition-colors"
        >
          ✕
        </button>

        <div
          className={`inline-block text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm ${
            esPlin ? 'bg-[#00b59c]' : 'bg-[#742384]'
          }`}
        >
          CÓDIGO QR OFICIAL {nombreCanal}
        </div>

        <div className="bg-white p-3 rounded-2xl shadow-lg mx-auto w-64 h-64 flex items-center justify-center border border-stroke">
          <img
            src={qrSrc}
            alt={`Código QR ${nombreCanal}`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="space-y-1 pt-1">
          <p className="text-txt-main font-['Montserrat',sans-serif] font-black text-base uppercase">
            {titular}
          </p>
          <p className="font-mono text-xl font-black text-andrew-primary">
            {numero}
          </p>
          <p className="text-xs text-txt-muted">
            Monto a escanear: <strong className="text-txt-main font-black">S/ {monto?.toFixed(2)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
