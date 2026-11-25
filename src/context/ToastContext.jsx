import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((mensaje, tipo = 'success', duracion = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duracion);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Contenedor flotante de notificaciones — debajo del navbar, centrado */}
      <div
        className="toast-container fixed left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-3 w-full max-w-lg px-4 pointer-events-none select-none"
        style={{ top: '72px', minWidth: 340 }}
      >
        {toasts.map((toast) => {
          const isSuccess = toast.tipo === 'success';
          const isError = toast.tipo === 'error';
          const bg = isSuccess ? '#0b1911' : isError ? '#1f0b0b' : '#111827';
          const border = isSuccess ? '#22c55e' : isError ? '#ef4444' : '#475569';
          const accent = isSuccess ? '#22c55e' : isError ? '#f87171' : '#94a3b8';
          const iconBg = isSuccess
            ? 'rgba(34, 197, 94, 0.18)'
            : isError
            ? 'rgba(239, 68, 68, 0.18)'
            : 'rgba(148, 163, 184, 0.18)';

          return (
            <div
              key={toast.id}
              style={{
                backgroundColor: bg,
                borderColor: border,
                color: '#ffffff',
                boxShadow: isSuccess
                  ? '0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(34,197,94,0.25)'
                  : '0 10px 30px rgba(0,0,0,0.35)'
              }}
              className="pointer-events-auto w-full flex items-center justify-between gap-4 px-5 py-3.5 rounded-2xl border-2 transition-all animate-bounce-short"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  style={{ backgroundColor: iconBg, color: accent }}
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                >
                  {isSuccess ? (
                    <CheckCircle2 size={20} />
                  ) : isError ? (
                    <AlertCircle size={20} />
                  ) : (
                    <Info size={20} />
                  )}
                </div>
                <p style={{ color: '#ffffff' }} className="text-sm font-bold leading-snug tracking-wide">
                  {toast.mensaje}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                style={{ color: '#cbd5e1' }}
                className="hover:text-white shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar notificación"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de un ToastProvider');
  }
  return context;
}
