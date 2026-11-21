import React from 'react';
import { Check, FileText, MessageSquare, Ruler } from 'lucide-react';
import ProductReviewsSection from '../../../components/product/ProductReviewsSection';

const VENTAJAS = [
  { titulo: 'Tejido transpirable', texto: 'Secado rápido y ventilación constante.' },
  { titulo: 'Costuras reforzadas', texto: 'Acabados resistentes al roce.' },
  { titulo: 'Escudos y detalles 3D', texto: 'Termosellado en relieve.' },
  { titulo: 'Garantía de talla', texto: 'Cambio asegurado y atención personalizada.' }
];

const MEDIDAS = [
  { talla: 'S', pecho: '50 - 52 cm', largo: '70 - 72 cm', estatura: '1.60 - 1.70 m' },
  { talla: 'M', pecho: '52 - 54 cm', largo: '72 - 74 cm', estatura: '1.70 - 1.78 m' },
  { talla: 'L', pecho: '54 - 56 cm', largo: '74 - 76 cm', estatura: '1.78 - 1.85 m' },
  { talla: 'XL', pecho: '56 - 58 cm', largo: '76 - 78 cm', estatura: '1.85 - 1.92 m' }
];

export default function ProductTechnicalTabs({ tabActiva, setTabActiva, producto }) {
  const tabs = [
    { id: 'description', label: 'Descripción', icon: FileText },
    { id: 'reviews', label: `Reseñas (${producto.reviewsCount || 0})`, icon: MessageSquare },
    { id: 'sizechart', label: 'Guía de tallas', icon: Ruler }
  ];

  return (
    <div className="mt-10 sm:mt-12 pt-8 border-t border-stroke">
      <div className="bg-surface-card border border-stroke rounded-2xl shadow-sm overflow-hidden transition-colors">
        {/* Pestañas integradas en la cabecera de la tarjeta */}
        <div className="flex items-center gap-1 border-b border-stroke px-3 sm:px-5 overflow-x-auto">
          {tabs.map((tab) => {
            const activa = tabActiva === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTabActiva(tab.id)}
                className={`flex items-center gap-1.5 font-['Montserrat',sans-serif] text-xs font-bold uppercase tracking-wide px-3 sm:px-4 py-3.5 border-b-2 -mb-px whitespace-nowrap transition-colors cursor-pointer ${
                  activa
                    ? 'border-andrew-primary text-txt-main'
                    : 'border-transparent text-txt-muted hover:text-txt-main'
                }`}
              >
                <Icon size={14} className={activa ? 'text-andrew-primary' : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contenido */}
        <div className="p-5 sm:p-6">
          {tabActiva === 'description' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 space-y-2.5">
                <h3 className="font-['Montserrat',sans-serif] font-black text-base sm:text-lg uppercase text-txt-main tracking-tight">
                  Sobre esta prenda
                </h3>
                {producto.descripcion && (
                  <p className="text-sm text-txt-main font-medium leading-relaxed">{producto.descripcion}</p>
                )}
                <p className="text-sm text-txt-muted leading-relaxed">
                  Fabricada con tecnología de absorción y microfibra. Escudos y patrocinadores con sellado térmico que resiste múltiples lavados sin perder nitidez ni color.
                </p>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {VENTAJAS.map((v) => (
                  <div key={v.titulo} className="flex items-start gap-2.5 bg-surface-sub/70 border border-stroke p-3 rounded-xl">
                    <span className="w-6 h-6 rounded-lg bg-andrew-primary/15 flex items-center justify-center shrink-0">
                      <Check size={13} className="text-andrew-primary" strokeWidth={3} />
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-['Montserrat',sans-serif] font-bold text-xs uppercase text-txt-main">{v.titulo}</h4>
                      <p className="text-[11px] text-txt-muted mt-0.5 leading-snug">{v.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tabActiva === 'reviews' && (
            <ProductReviewsSection
              productoId={producto.id}
              productoNombre={producto.nombre}
            />
          )}

          {tabActiva === 'sizechart' && (
            <div className="space-y-3">
              <div>
                <h3 className="font-['Montserrat',sans-serif] font-black text-base sm:text-lg uppercase text-txt-main">
                  Tabla de medidas (cm)
                </h3>
                <p className="text-xs sm:text-sm text-txt-muted mt-1">
                  Medidas aproximadas de axila a axila y largo total. Para un ajuste más holgado, pide una talla más.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-stroke">
                <table className="w-full text-left text-xs sm:text-sm font-['Montserrat',sans-serif]">
                  <thead className="bg-surface-sub">
                    <tr className="text-txt-muted">
                      <th className="py-2.5 px-4 uppercase font-bold">Talla</th>
                      <th className="py-2.5 px-4 uppercase font-bold">Pecho / ancho</th>
                      <th className="py-2.5 px-4 uppercase font-bold">Largo total</th>
                      <th className="py-2.5 px-4 uppercase font-bold">Estatura sugerida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stroke text-txt-main font-medium">
                    {MEDIDAS.map((m) => (
                      <tr key={m.talla}>
                        <td className="py-2.5 px-4 font-black text-andrew-primary">{m.talla}</td>
                        <td className="py-2.5 px-4">{m.pecho}</td>
                        <td className="py-2.5 px-4">{m.largo}</td>
                        <td className="py-2.5 px-4">{m.estatura}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
