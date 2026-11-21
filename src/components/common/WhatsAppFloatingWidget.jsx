import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

export default function WhatsAppFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const adminPhone = `${SITE_CONFIG.whatsapp.codigoPais}${SITE_CONFIG.whatsapp.numeroRaw}`;

  const handleOpenWhatsApp = (texto) => {
    const msg = texto || '¡Hola Andrew Camisetas! Tengo una consulta sobre una camiseta de fútbol del catálogo oficial...';
    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none">
      {/* Ventana de chat rápida */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm max-h-[calc(100dvh-6rem)] overflow-y-auto bg-surface-card border border-stroke rounded-3xl shadow-2xl backdrop-blur-2xl animate-fade-in-up transition-colors">
          {/* Cabecera */}
          <div className="bg-gradient-to-r from-[#1da851] to-[#22c55e] p-4 text-black flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-white p-0.5 overflow-hidden shadow">
                  <img src="/brand/logo_andrew_v2.webp" alt="Andrew Camisetas" className="w-full h-full object-contain rounded-full" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-700 border-2 border-white rounded-full"></span>
              </div>
              <div className="min-w-0">
                <h4 className="font-display font-black text-xs uppercase tracking-wider leading-none text-black truncate">
                  ANDREW CAMISETAS
                </h4>
                <p className="text-[10px] font-bold text-black/80 mt-1 truncate">
                  En línea · Asesoría Oficial Perú
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar ventana de WhatsApp"
              className="w-10 h-10 rounded-full bg-black/15 hover:bg-black/30 flex items-center justify-center text-black cursor-pointer transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mensaje de bienvenida */}
          <div className="p-4 space-y-3 bg-surface-card text-xs text-txt-main">
            <div className="p-3 bg-surface-sub border border-stroke rounded-2xl rounded-tl-sm text-txt-main font-medium">
              ¡Hola crack! ⚽ ¿Tienes dudas con tu talla, quieres consultar stock de alguna camiseta histórica o hacer un pedido personalizado?
            </div>

            {/* Opciones rápidas */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => handleOpenWhatsApp('Hola, quisiera consultar la disponibilidad y stock de una camiseta.')}
                className="text-left p-2.5 bg-andrew-primary/15 hover:bg-andrew-primary/25 border border-andrew-primary/35 rounded-xl text-andrew-primary text-[11px] font-bold transition-all cursor-pointer flex items-center justify-between"
              >
                <span>📦 Consultar stock de camisetas</span>
                <span>→</span>
              </button>
              <button
                onClick={() => handleOpenWhatsApp('Hola, deseo pedir una camiseta con estampado y dorsal personalizado.')}
                className="text-left p-2.5 bg-surface-sub hover:bg-input-bg border border-stroke rounded-xl text-txt-main text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-between"
              >
                <span>✎ Pedido personalizado (Nombre y dorsal)</span>
                <span>→</span>
              </button>
              <button
                onClick={() => handleOpenWhatsApp('Hola, quiero verificar el costo de envío a mi ciudad.')}
                className="text-left p-2.5 bg-surface-sub hover:bg-input-bg border border-stroke rounded-xl text-txt-main text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-between"
              >
                <span>🚚 Costo y tiempo de envío (Lima / Shalom)</span>
                <span>→</span>
              </button>
            </div>

            {/* Input para mensaje propio */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOpenWhatsApp(customMsg);
              }}
              className="flex items-center gap-2 pt-2"
            >
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Escribe tu consulta aquí..."
                className="flex-1 bg-input-bg border border-stroke rounded-xl px-3 py-2 text-xs text-txt-main placeholder:text-txt-muted outline-none focus:border-andrew-primary"
              />
              <button
                type="submit"
                className="p-2.5 bg-[#22c55e] text-black rounded-xl hover:bg-[#1fa75d] transition-all cursor-pointer shrink-0 shadow-md shadow-[#22c55e]/25"
                title="Enviar por WhatsApp"
              >
                <Send size={14} strokeWidth={2.5} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Botón flotante principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative min-h-11 flex items-center gap-2.5 bg-[#22c55e] hover:bg-[#1fa75d] text-black font-display font-black text-xs uppercase tracking-wider px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-[0_8px_30px_rgba(34,197,94,0.45)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full"></span>
        <MessageCircle size={20} strokeWidth={2.5} className="fill-black/10" />
        <span className="hidden sm:inline">¿DUDAS? ESCRÍBENOS</span>
      </button>
    </div>
  );
}
