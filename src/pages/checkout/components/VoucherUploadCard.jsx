import React, { useRef } from 'react';
import { Upload, Camera, FileText, Trash2, CheckCircle2 } from 'lucide-react';

export default function VoucherUploadCard({
  comprobantePreview,
  comprobanteFile,
  onFileChange,
  onRemoveFile,
  codigoOperacion,
  setCodigoOperacion,
  titularCuentaPago,
  setTitularCuentaPago
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  return (
    <div className="bg-surface-sub border border-stroke rounded-2xl p-4 sm:p-5 space-y-3.5 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-black uppercase text-txt-main flex items-center gap-1.5 font-['Montserrat',sans-serif]">
          <Upload size={16} className="text-andrew-primary" />
          <span>ADJUNTAR VOUCHER DE PAGO</span>
        </span>
        {comprobantePreview ? (
          <button
            type="button"
            onClick={onRemoveFile}
            className="text-[11px] font-bold text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={12} /> Quitar voucher
          </button>
        ) : (
          <span className="text-[11px] text-andrew-primary font-bold bg-andrew-primary/10 border border-andrew-primary/30 px-2.5 py-0.5 rounded-md">
            Voucher o N° Operación requerido
          </span>
        )}
      </div>

      {/* Inputs ocultos para Galería y Cámara */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp"
        onChange={onFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileChange}
        className="hidden"
      />

      {!comprobantePreview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl border-2 border-dashed border-stroke hover:border-andrew-primary bg-surface-card hover:bg-andrew-primary/10 text-txt-main transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-andrew-primary/15 text-andrew-primary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Upload size={18} />
            </div>
            <div className="text-left">
              <span className="block font-black text-xs uppercase text-txt-main">
                Subir captura
              </span>
              <span className="block text-[10px] text-txt-muted font-medium">
                Desde galería o PC
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center gap-2.5 p-3.5 rounded-xl border-2 border-dashed border-stroke hover:border-andrew-primary bg-surface-card hover:bg-andrew-primary/10 text-txt-main transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-andrew-primary/15 text-andrew-primary flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
              <Camera size={18} />
            </div>
            <div className="text-left">
              <span className="block font-black text-xs uppercase text-txt-main">
                Tomar foto
              </span>
              <span className="block text-[10px] text-txt-muted font-medium">
                Usar cámara ahora
              </span>
            </div>
          </button>
        </div>
      ) : (
        <div className="bg-surface-card border-2 border-andrew-primary rounded-2xl p-3 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            {comprobanteFile?.type === 'application/pdf' ? (
              <div className="w-14 h-14 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-stroke shrink-0 bg-surface-sub">
                <img
                  src={comprobantePreview}
                  alt="Vista previa voucher"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-xs font-black text-txt-main block truncate font-['Montserrat',sans-serif]">
                {comprobanteFile?.name || 'Voucher adjunto'}
              </span>
              <span className="text-[11px] text-andrew-primary font-extrabold flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={12} /> Voucher listo para validar
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] font-extrabold text-txt-main bg-surface-sub hover:bg-input-bg border border-stroke px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Cambiar
          </button>
        </div>
      )}

      {/* Inputs de Operación y Titular */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div>
          <label className="block text-[11px] font-black uppercase text-andrew-primary font-['Montserrat',sans-serif] mb-1">
            N° DE OPERACIÓN {comprobantePreview ? '(OPCIONAL)' : '*'}:
          </label>
          <input
            type="text"
            value={codigoOperacion}
            onChange={(e) => setCodigoOperacion(e.target.value)}
            placeholder="Ej: 084920"
            className="w-full bg-input-bg border border-stroke rounded-xl px-3 py-2 font-mono text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-andrew-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-black uppercase text-txt-muted font-['Montserrat',sans-serif] mb-1">
            TITULAR QUE ABONÓ (OPCIONAL):
          </label>
          <input
            type="text"
            value={titularCuentaPago}
            onChange={(e) => setTitularCuentaPago(e.target.value)}
            placeholder="Nombre en Yape / Banco"
            className="w-full bg-input-bg border border-stroke rounded-xl px-3 py-2 text-xs sm:text-sm text-txt-main placeholder:text-txt-muted/60 outline-none focus:border-andrew-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
