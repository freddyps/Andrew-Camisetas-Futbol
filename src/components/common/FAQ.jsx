import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, ShieldAlert, Sparkles, Truck, RefreshCw } from 'lucide-react';

export default function FAQ({ onBack }) {
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    {
      title: "📦 Envíos y Tiempos de Entrega",
      icon: <Truck size={18} className="text-[#22c55e]" />,
      questions: [
        {
          q: "¿Cuánto tiempo tarda en llegar mi pedido?",
          a: "Para Lima Metropolitana, el envío express tarda entre 24 y 48 horas. Para envíos a provincias a nivel nacional, trabajamos con Olva Courier y Shalom, tardando entre 2 a 4 días hábiles dependiendo de la localidad."
        },
        {
          q: "¿Hacen envíos de camisetas personalizadas?",
          a: "Sí, pero las camisetas que requieren personalización de nombre y número oficiales tardan de 24 a 48 horas adicionales en su preparación para garantizar que el fijado térmico sea óptimo antes del empaque."
        },
        {
          q: "¿Cuáles son los costos de envío?",
          a: "El envío en Lima Metropolitana cuesta S/ 10. Para provincias el costo es de S/ 15. ¡Ofrecemos envíos totalmente gratuitos a todo el país en compras a partir de S/ 180!"
        }
      ]
    },
    {
      title: "🧼 Cuidado y Lavado de Camisetas",
      icon: <Sparkles size={18} className="text-[#22c55e]" />,
      questions: [
        {
          q: "¿Cómo debo lavar mi camiseta para que no se arruine?",
          a: "Para mantener los parches y números en perfecto estado, sigue estas pautas:\n1. Lava la camiseta al revés (con los estampados hacia adentro).\n2. Usa agua fría (máximo 30°C).\n3. No uses suavizante de telas ni blanqueador.\n4. Lávala a mano o en ciclo delicado dentro de una bolsa de lavado.\n5. NUNCA uses secadora. Seca la prenda colgada a la sombra."
        },
        {
          q: "¿Se pueden planchar los estampados personalizados?",
          a: "Nunca pases la plancha directamente sobre el vinilo o los parches de silicona. Si necesitas quitar arrugas, coloca un paño de algodón limpio o papel manteca encima del estampado y plancha a temperatura baja sin vapor."
        }
      ]
    },
    {
      title: "👕 Personalización y Tallas",
      icon: <HelpCircle size={18} className="text-[#22c55e]" />,
      questions: [
        {
          q: "¿Cuál es la diferencia entre Versión Fan y Versión Jugador?",
          a: "La Versión Fan es de corte recto (Regular Fit) con los escudos y logos bordados, ideal para uso diario o ir al estadio. La Versión Jugador (Slim Fit) es entallada al cuerpo, ultra ligera, transpirable y lleva los escudos termosellados en vinilo flexible para evitar roces en el rendimiento deportivo."
        },
        {
          q: "¿Qué talla debería comprar?",
          a: "Si compras Versión Fan, elige tu talla habitual. Si vas a comprar la Versión Jugador (Slim Fit), te recomendamos comprar una talla más de la que usas normalmente, ya que el corte es atlético y ceñido."
        }
      ]
    },
    {
      title: "🔄 Cambios y Devoluciones",
      icon: <RefreshCw size={18} className="text-[#22c55e]" />,
      questions: [
        {
          q: "¿Puedo realizar cambios de talla?",
          a: "Sí, tienes hasta 7 días calendario desde que recibes el producto para solicitar un cambio de talla. El polo debe estar con sus etiquetas originales intactas y sin signos de uso."
        },
        {
          q: "¿Las camisetas personalizadas tienen cambio?",
          a: "Las camisetas que han sido estampadas con nombres y números personalizados (ya sea tu propio nombre o el de un jugador) NO están sujetas a cambios ni devoluciones, a menos que exista una falla de fabricación demostrable por nuestra parte."
        }
      ]
    }
  ];

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Convertimos las preguntas a un arreglo plano para manejar los índices abiertos fácilmente
  let globalIndex = 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* BOTÓN VOLVER */}
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-xs font-display font-black uppercase tracking-[0.08em] text-[#22c55e] hover:text-[#1fa75d] transition-colors"
        >
          <ArrowLeft size={16} /> Volver al Inicio
        </button>

        {/* CABECERA */}
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-[#22c55e] text-xs font-black uppercase tracking-[0.1em] mb-2 glow-text-green">
            <HelpCircle size={14} /> SOPORTE AL CLIENTE
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-white">Preguntas Frecuentes</h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-2 leading-relaxed">
            Resuelve tus dudas sobre envíos, cuidado de tus camisetas premium, cambios de talla y personalización.
          </p>
        </div>

        {/* CONTENEDOR FAQ */}
        <div className="space-y-8 animate-fade-in-up">
          {categories.map((cat, catIdx) => (
            <div key={catIdx} className="glass-panel border border-white/5 p-6 bg-white/[0.01]">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
                {cat.icon}
                <h2 className="text-sm sm:text-base font-display font-black uppercase tracking-wider text-white">
                  {cat.title}
                </h2>
              </div>
              
              <div className="divide-y divide-white/5">
                {cat.questions.map((qAndA, qIdx) => {
                  const currentGlobalIdx = globalIndex++;
                  const isOpen = openIndex === currentGlobalIdx;
                  
                  return (
                    <div key={qIdx} className="py-4 first:pt-1 last:pb-1">
                      <button
                        onClick={() => handleToggle(currentGlobalIdx)}
                        className="w-full flex justify-between items-center text-left text-xs sm:text-sm font-semibold text-gray-200 hover:text-[#22c55e] transition-colors"
                      >
                        <span>{qAndA.q}</span>
                        {isOpen ? <ChevronUp size={16} className="text-[#22c55e]" /> : <ChevronDown size={16} />}
                      </button>
                      
                      {isOpen && (
                        <div className="mt-3 text-[11px] sm:text-xs text-gray-400 leading-relaxed font-semibold whitespace-pre-line pl-2 border-l border-[#22c55e]/30">
                          {qAndA.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* BANNER NOTA INFORMATIVA */}
        <div className="mt-8 border border-yellow-500/20 bg-yellow-500/5 p-4 flex gap-3 rounded-lg">
          <ShieldAlert className="text-yellow-500 shrink-0" size={20} />
          <div>
            <h4 className="text-xs font-display font-black uppercase text-yellow-500 mb-1">Importante sobre el Cuidado de Estampados</h4>
            <p className="text-[10px] sm:text-xs text-gray-400 font-semibold leading-relaxed">
              No dejes tu camiseta remojando por horas ni la exprimas con fuerza después del lavado. Seguir las recomendaciones de lavado asegura que el dorsal personalizado y los patrocinadores duren por años.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
