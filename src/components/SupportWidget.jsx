import { MessageCircle, Mail, Phone, X, Send } from 'lucide-react';
import { useState } from 'react';

// ============================================================================
// COMPONENTE: SupportWidget (Widget flotante de soporte)
// Descripción: Widget flotante en la esquina inferior derecha para contacto
//              Incluye WhatsApp, Email, Teléfono y formulario de mensaje
// Props: ninguno (componente independiente)
// ============================================================================

export default function SupportWidget() {
  // ===== ESTADOS =====
  const [isOpen, setIsOpen] = useState(false); // ¿Widget abierto?
  const [selectedContact, setSelectedContact] = useState(null); // Tipo de contacto seleccionado
  const [message, setMessage] = useState(''); // Mensaje del usuario

  // ===== DATOS DE CONTACTO =====
  const contactOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      description: 'Chat instantáneo',
      phone: '+51987654321',
      link: 'https://wa.me/51987654321?text=Hola%20Andrew%20Camisetas%2C%20tengo%20una%20pregunta',
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-blue-500',
      description: 'Respuesta en 24h',
      email: 'info@andrewcamisetas.com',
      link: 'mailto:info@andrewcamisetas.com?subject=Consulta%20desde%20la%20tienda',
    },
    {
      id: 'phone',
      name: 'Llamada',
      icon: Phone,
      color: 'bg-purple-500',
      description: 'Soporte directo',
      phone: '+51987654321',
      link: 'tel:+51987654321',
    },
  ];

  // ===== FUNCIONES =====
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Enviar mensaje a WhatsApp
      window.open(
        `https://wa.me/51987654321?text=${encodeURIComponent(message)}`,
        '_blank'
      );
      setMessage('');
      setSelectedContact(null);
    }
  };

  return (
    <>
      {/* ===== WIDGET FLOTANTE - CERRADO ===== */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-[#22c55e] shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-black font-black text-2xl"
          title="¿Necesitas ayuda?"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {/* ===== WIDGET FLOTANTE - ABIERTO ===== */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-full max-w-sm bg-white rounded-none border-2 border-gray-200 shadow-2xl overflow-hidden">
          
          {/* HEADER */}
          <div className="bg-[#22c55e] text-black p-6 flex items-center justify-between">
            <div>
              <h3 className="font-black uppercase tracking-[0.08em] text-lg">¿Necesitas ayuda?</h3>
              <p className="text-xs text-black/70 mt-1 uppercase tracking-[0.1em]">Estamos disponibles 24/7</p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedContact(null);
                setMessage('');
              }}
              className="text-black hover:bg-white/20 p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="p-6">
            
            {/* VISTA 1: Opciones de contacto */}
            {!selectedContact ? (
              <div className="space-y-3">
                {contactOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (option.id === 'whatsapp' || option.id === 'email' || option.id === 'phone') {
                          if (option.id === 'whatsapp') {
                            setSelectedContact('whatsapp');
                          } else {
                            window.open(option.link, '_blank');
                            setIsOpen(false);
                          }
                        }
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-none border-2 border-gray-200 bg-white hover:border-[#22c55e] hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className={`h-10 w-10 rounded-full ${option.color} flex items-center justify-center text-white`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-black uppercase tracking-[0.05em] text-sm">{option.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              // VISTA 2: Formulario de mensaje para WhatsApp
              <form onSubmit={handleSendMessage} className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">Escribe tu mensaje y nos contactaremos por WhatsApp</p>
                
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  rows={4}
                  className="w-full rounded-none border-2 border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#22c55e] resize-none"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedContact(null);
                      setMessage('');
                    }}
                    className="flex-1 py-2 rounded-none border-2 border-gray-200 font-black text-sm uppercase tracking-[0.08em] text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="flex-1 py-2 rounded-none bg-[#22c55e] font-black text-sm uppercase tracking-[0.08em] text-black hover:bg-[#1fa75d] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={16} /> Enviar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* FOOTER con info de contacto */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 text-center">
            <p className="text-xs text-gray-600 font-medium">
              📍 Lima, Perú · 🕐 Lunes a Domingo 9:00 - 22:00
            </p>
          </div>
        </div>
      )}
    </>
  );
}
