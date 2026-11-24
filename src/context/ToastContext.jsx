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
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.tipo} pointer-events-auto w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl shadow-2xl transition-all animate-bounce-short ${
              toast.tipo === 'success'
                ? 'bg-[#16a34a] text-white shadow-[0_8px_40px_rgba(22,163,74,0.5)]'
                : toast.tipo === 'error'
                ? 'bg-[#dc2626] text-white shadow-[0_8px_40px_rgba(220,38,38,0.5)]'
                : 'bg-[#1e293b] text-white shadow-[0_8px_40px_rgba(0,0,0,0.5)]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {toast.tipo === 'success' ? (
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} />
                </div>
              ) : toast.tipo === 'error' ? (
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <AlertCircle size={22} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                  <Info size={22} />
                </div>
              )}
              <p className="text-sm font-bold leading-snug tracking-wide">
                {toast.mensaje}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/70 hover:text-white shrink-0 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ))}
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
