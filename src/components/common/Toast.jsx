import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="text-[#22c55e] shrink-0" size={20} />,
    error: <AlertCircle className="text-red-500 shrink-0" size={20} />,
    info: <Info className="text-blue-400 shrink-0" size={20} />,
  };

  const borders = {
    success: 'border-[#22c55e]/30 shadow-[#22c55e]/10',
    error: 'border-red-500/30 shadow-red-500/10',
    info: 'border-blue-400/30 shadow-blue-400/10',
  };

  return (
    <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-4 max-w-sm glass-panel rounded-none border shadow-2xl transition-all duration-300 animate-fade-in-up ${borders[type]}`}>
      {icons[type]}
      <div className="flex-1">
        <p className="text-sm font-semibold text-white tracking-wide">{message}</p>
      </div>
      <button 
        type="button" 
        onClick={onClose} 
        className="text-gray-400 hover:text-white transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={16} />
      </button>
    </div>
  );
}
