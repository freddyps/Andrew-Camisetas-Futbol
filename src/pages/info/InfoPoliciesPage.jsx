import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronDown, 
  ShoppingBag,
  CreditCard
} from 'lucide-react';

/**
 * InfoPoliciesPage:
 * Vista oficial unificada de Preguntas Frecuentes (FAQ) y Términos / Garantías de Compra
 * para Andrew Camisetas de Fútbol.
 */
export default function InfoPoliciesPage({ 
  initialTab = 'faq', // 'faq' | 'terminos'
  onBackToHome = () => {},
  onExploreCatalog = () => {}
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const faqs = [
    {
      pregunta: '¿Cómo funciona la reserva con adelanto de S/ 40.00?',
      respuesta: 'Para camisetas bajo pedido o personalizadas con tu nombre y número, abonas únicamente S/ 40.00 por prenda para iniciar la confección e importación. En 2 a 4 días te enviamos fotos y videos reales de tu camiseta lista para despacho, y el saldo restante lo cancelas recién cuando el pedido llega a Perú antes de enviártelo.'
    },
    {
      pregunta: '¿Cuánto demora en llegar mi camiseta?',
      respuesta: 'Si la prenda figura como "EN STOCK", la entrega en Lima Metropolitana se realiza en 24 a 48 horas (vía motorizado InDrive / Yango) y a provincias de 2 a 3 días hábiles por agencia Shalom u Olva. Si es "BAJO PEDIDO" de importación, el tiempo estimado es de 19 a 25 días calendario con seguimiento continuo.'
    },
    {
      pregunta: '¿Qué diferencia hay entre Versión Jugador y Versión Hincha?',
      respuesta: 'La Versión Jugador (Player Issue / Slim Fit) tiene corte atlético ceñido al cuerpo, tela microperforada ultraligera y escudos termosellados en 3D idénticos a los de cancha (recomendamos pedir una talla más si prefieres ajuste suelto). La Versión Hincha (Fan / Regular Fit) tiene corte recto clásico y escudos bordados de alta durabilidad.'
    },
    {
      pregunta: '¿El estampado de nombre y número tiene costo adicional?',
      respuesta: '¡Es 100% GRATIS en tus pedidos bajo reserva! Podemos estampar el nombre de tu jugador favorito o tu propio nombre y dorsal con la tipografía oficial de la competición (La Liga, Premier League, Champions o Mundial 2026).'
    },
    {
      pregunta: '¿Qué métodos de pago aceptan y cómo validan mi compra?',
      respuesta: 'Aceptamos pagos directos por Yape y Plin. Al finalizar tu pedido en nuestro Checkout, escaneas el código QR oficial e ingresas el número de operación o adjuntas tu captura de pago para que nuestro equipo lo valide de inmediato y active tu orden.'
    }
  ];

  const terminos = [
    {
      titulo: '1. CALIDAD A1 GARANTIZADA',
      detalle: 'Todas nuestras camisetas cuentan con acabados de primera calidad, tejidos transpirables de alto rendimiento, costuras reforzadas y parches/escudos de alta definición.'
    },
    {
      titulo: '2. POLÍTICA DE ADELANTOS Y RESERVAS (S/ 40)',
      detalle: 'Todo pedido por encargo o personalizado se separa con S/ 40.00 por unidad. Una vez confirmado el estampado personalizado (nombre/dorsal específico del cliente), la orden entra a taller de confección y no es cancelable, garantizando la entrega íntegra en los plazos acordados.'
    },
    {
      titulo: '3. ENVÍOS A LIMA Y PROVINCIAS',
      detalle: 'Los despachos en Lima se coordinan mediante motorizado directo o recojo acordado. Para provincias, trabajamos con agencias Shalom y Olva Courier, enviando siempre el voucher/clave de seguimiento y foto del paquete embalado.'
    },
    {
      titulo: '4. CAMBIOS Y GARANTÍA DE CONFORMIDAD',
      detalle: 'Antes de despachar cualquier prenda, enviamos evidencia fotográfica real. Si una prenda en stock presenta algún defecto de fábrica, realizamos el cambio inmediato sin costo adicional.'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-base text-txt-main pt-36 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6 lg:px-10 xl:px-12 select-none transition-colors">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stroke">
          <div>
            <div className="inline-flex items-center gap-2 bg-andrew-primary/15 border border-andrew-primary/30 px-3.5 py-1 rounded-full text-andrew-primary text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck size={15} />
              <span>CENTRO DE AYUDA & GARANTÍA OFICIAL</span>
            </div>
            <h1 className="font-['Montserrat',sans-serif] font-black text-3xl sm:text-4xl uppercase tracking-tight text-txt-main">
              {activeTab === 'faq' ? (
                <>PREGUNTAS <span className="text-andrew-primary">FRECUENTES</span></>
              ) : (
                <>TÉRMINOS Y <span className="text-andrew-primary">GARANTÍAS</span></>
              )}
            </h1>
            <p className="text-txt-muted text-sm mt-1">
              Todo lo que necesitas saber sobre envíos, tallas, reservas con S/ 40 y calidad A1.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="self-start sm:self-auto bg-surface-card hover:bg-surface-sub border border-stroke text-txt-main font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft size={16} className="text-andrew-primary" />
            <span>VOLVER AL INICIO</span>
          </button>
        </div>

        {/* Selector de Pestañas */}
        <div className="grid grid-cols-2 gap-3 max-w-md bg-surface-card p-1.5 rounded-2xl border border-stroke shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-4 rounded-xl font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'faq'
                ? 'bg-andrew-primary text-black shadow-md'
                : 'text-txt-muted hover:text-txt-main'
            }`}
          >
            <HelpCircle size={16} />
            <span>Preguntas Frecuentes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terminos')}
            className={`py-3 px-4 rounded-xl font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'terminos'
                ? 'bg-andrew-primary text-black shadow-md'
                : 'text-txt-muted hover:text-txt-main'
            }`}
          >
            <ShieldCheck size={16} />
            <span>Términos y Garantías</span>
          </button>
        </div>

        {/* Contenido según pestaña */}
        {activeTab === 'faq' ? (
          <div className="space-y-4">
            {faqs.map((item, idx) => {
              const abierto = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`bg-surface-card border rounded-2xl overflow-hidden transition-all shadow-md ${
                    abierto ? 'border-andrew-primary' : 'border-stroke hover:border-stroke-hover'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(abierto ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-['Montserrat',sans-serif] font-black text-sm sm:text-base uppercase text-txt-main">
                      {item.pregunta}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-andrew-primary shrink-0 transition-transform duration-200 ${
                        abierto ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {abierto && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-stroke text-sm text-txt-muted leading-relaxed font-medium">
                      {item.respuesta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {terminos.map((t, idx) => (
              <div
                key={idx}
                className="bg-surface-card border border-stroke rounded-2xl p-6 space-y-3 shadow-md"
              >
                <div className="flex items-center gap-2 text-andrew-primary">
                  <CheckCircle2 size={20} />
                  <h3 className="font-['Montserrat',sans-serif] font-black text-sm sm:text-base uppercase text-txt-main">
                    {t.titulo}
                  </h3>
                </div>
                <p className="text-sm text-txt-muted leading-relaxed font-medium">
                  {t.detalle}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Banner final de llamada a la acción */}
        <div className="bg-surface-card border border-stroke rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-['Montserrat',sans-serif] font-black text-lg sm:text-xl uppercase text-txt-main">
              ¿LISTO PARA ELEGIR TU CAMISETA OFICIAL?
            </h3>
            <p className="text-xs sm:text-sm text-txt-muted font-medium">
              Explora todos los modelos en stock y de colección con envío garantizado a todo el Perú.
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreCatalog}
            className="bg-andrew-primary hover:bg-[#1fa75d] text-black font-['Montserrat',sans-serif] font-black text-xs sm:text-sm uppercase px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-md hover:scale-105 shrink-0"
          >
            <ShoppingBag size={16} />
            <span>VER CATÁLOGO</span>
          </button>
        </div>

      </div>
    </div>
  );
}

