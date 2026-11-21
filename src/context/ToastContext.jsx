import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((mensaje, tipo = 'success', duracion = 3200) => {
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

      {/* Contenedor flotante de notificaciones Toasts */}
      <div className="toast-container fixed bottom-6 left-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.tipo} pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl animate-bounce-short transition-all ${
              toast.tipo === 'success'
                ? 'bg-[#0f1f14]/95 border-[#22c55e]/50 text-white shadow-[#22c55e]/20'
                : toast.tipo === 'error'
                ? 'bg-[#220d0d]/95 border-red-500/50 text-white shadow-red-500/20'
                : 'bg-[#151515]/95 border-white/20 text-white shadow-black/40'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.tipo === 'success' ? (
                <div className="w-7 h-7 rounded-full bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
              ) : toast.tipo === 'error' ? (
                <div className="w-7 h-7 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <AlertCircle size={16} />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/10 text-gray-300 flex items-center justify-center shrink-0">
                  <Info size={16} />
                </div>
              )}
              <p className="text-xs font-semibold leading-snug line-clamp-2">
                {toast.mensaje}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white shrink-0 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X size={14} />
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
