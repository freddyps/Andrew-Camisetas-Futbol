import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, X, Send } from 'lucide-react';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');

  const contactOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 text-black',
      description: 'Chatea en vivo 24/7',
      link: 'https://wa.me/51934353097?text=Hola%20Andrew%20Camisetas%2C%20tengo%20una%20pregunta',
    },
    {
      id: 'email',
      name: 'Correo Electrónico',
      icon: Mail,
      color: 'bg-[#22c55e] text-black',
      description: 'Respuesta en menos de 24h',
      link: 'mailto:info@andrewcamisetas.com?subject=Consulta%20desde%20la%20tienda',
    },
    {
      id: 'phone',
      name: 'Soporte Telefónico',
      icon: Phone,
      color: 'bg-white/10 text-white border border-white/10',
      description: 'Llámanos directamente',
      link: 'tel:+51934353097',
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      window.open(
        `https://wa.me/51934353097?text=${encodeURIComponent(message)}`,
        '_blank'
      );
      setMessage('');
      setSelectedContact(null);
    }
  };

  return (
    <>
      {/* BOTÓN FLOTANTE CERRADO */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-[#22c55e] shadow-lg hover:shadow-[#22c55e]/50 hover:scale-110 transition-all duration-300 flex items-center justify-center text-black glow-green-sm hover:rotate-12 cursor-pointer"
          title="¿Necesitas ayuda? Chatea con nosotros"
        >
          <MessageCircle size={26} strokeWidth={2.5} />
        </button>
      )}

      {/* MODAL DE SOPORTE INTEGRADO */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm glass-panel text-white shadow-2xl overflow-hidden border border-white/10 animate-fade-in-up">
          
          {/* Encabezado */}
          <div className="bg-[#22c55e] text-black px-6 py-5 flex items-center justify-between shadow-lg glow-green-sm">
            <div>
              <h3 className="font-display font-black uppercase tracking-[0.08em] text-sm leading-none">Centro de Ayuda</h3>
              <p className="text-[9px] text-black/80 mt-1 uppercase font-bold tracking-[0.12em]">Soporte Andrew Camisetas</p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedContact(null);
                setMessage('');
              }}
              className="text-black hover:bg-black/10 p-1.5 transition-colors"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Cuerpo */}
          <div className="p-6">
            
            {/* Opción 1: Listado de canales */}
            {!selectedContact ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-400 font-semibold mb-4 uppercase tracking-wider">¿Cómo deseas contactarnos?</p>
                {contactOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (option.id === 'whatsapp') {
                          setSelectedContact('whatsapp');
                        } else {
                          window.open(option.link, '_blank');
                          setIsOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-4 p-4 border border-white/5 bg-white/[0.02] hover:border-[#22c55e]/30 hover:bg-white/[0.04] transition-all duration-300 text-left cursor-pointer group"
                    >
                      <div className={`h-10 w-10 shrink-0 rounded-none flex items-center justify-center ${option.color} group-hover:scale-105 transition-transform`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-extrabold uppercase tracking-wide text-xs text-white group-hover:text-[#22c55e] transition-colors">
                          {option.name}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              // Opción 2: Formulario WhatsApp
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <p className="text-xs text-[#22c55e] font-bold uppercase tracking-wider mb-1">Escribe tu consulta</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-4">Responderemos inmediatamente vía WhatsApp con uno de nuestros agentes en línea.</p>
                </div>
                
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hola Andrew Camisetas, me interesa personalizar la camiseta del Real Madrid..."
                  rows={4}
                  required
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-white placeholder:text-gray-500 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e]/20 resize-none transition-all"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedContact(null);
                      setMessage('');
                    }}
                    className="flex-1 py-2.5 border border-white/10 bg-white/5 font-display font-black text-2xs uppercase tracking-[0.1em] text-white hover:bg-white/10 transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#22c55e] hover:bg-[#1fa75d] font-display font-black text-2xs uppercase tracking-[0.1em] text-black transition-colors flex items-center justify-center gap-1.5 glow-green-sm"
                  >
                    <Send size={12} /> Enviar Chat
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer de información */}
          <div className="border-t border-white/5 px-6 py-4 bg-white/[0.01] text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              📍 Lima, Perú · Lunes a Domingo 9:00 - 22:00
            </p>
          </div>
        </div>
      )}
    </>
  );
}
