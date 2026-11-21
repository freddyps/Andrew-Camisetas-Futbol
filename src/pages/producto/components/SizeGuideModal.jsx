import React, { useState } from 'react';
import { Ruler, X, Info } from 'lucide-react';

/**
 * SizeGuideModal:
 * Ventana modal interactiva con la tabla de medidas anatómicas (Pecho/Ancho, Largo, Estatura/Peso)
 * y comparador entre Versión Jugador (Slim Fit) y Versión Hincha (Regular Fit).
 */
export default function SizeGuideModal({
  isOpen,
  onClose,
  equipoNombre = 'fútbol'
}) {
  const [corteSeleccionado, setCorteSeleccionado] = useState('jugador'); // 'jugador' | 'hincha'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-md select-none animate-fade-in transition-colors">
      <div className="bg-surface-card border border-stroke rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-sub hover:bg-andrew-primary hover:text-black text-txt-main flex items-center justify-center transition-colors cursor-pointer border border-stroke"
        >
          <X size={16} />
        </button>

        {/* Cabecera */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-andrew-primary/15 border border-andrew-primary/40 flex items-center justify-center text-andrew-primary">
            <Ruler size={24} />
          </div>
          <div>
            <h3 className="font-['Montserrat',sans-serif] font-black text-xl uppercase tracking-tight text-txt-main">
              GUÍA OFICIAL DE MEDIDAS & TALLAS
            </h3>
            <p className="text-txt-muted text-xs">
              Encuentra tu ajuste perfecto para la camiseta de {equipoNombre}
            </p>
          </div>
        </div>

        {/* Selector de Versión: Jugador vs Hincha */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase text-txt-main font-['Montserrat',sans-serif] block">
            SELECCIONA EL TIPO DE CORTE:
          </span>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCorteSeleccionado('jugador')}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                corteSeleccionado === 'jugador'
                  ? 'border-andrew-primary bg-andrew-primary/15 text-txt-main shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'border-stroke bg-surface-sub text-txt-muted hover:text-txt-main'
              }`}
            >
              <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase block text-andrew-primary">
                Versión Jugador (Slim Fit)
              </span>
              <span className="text-[10px] text-txt-muted block mt-0.5">
                Ajuste atlético al cuerpo, elástico y ceñido como en cancha.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCorteSeleccionado('hincha')}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                corteSeleccionado === 'hincha'
                  ? 'border-andrew-primary bg-andrew-primary/15 text-txt-main shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'border-stroke bg-surface-sub text-txt-muted hover:text-txt-main'
              }`}
            >
              <span className="font-['Montserrat',sans-serif] font-black text-xs uppercase block text-andrew-primary">
                Versión Hincha (Regular Fit)
              </span>
              <span className="text-[10px] text-txt-muted block mt-0.5">
                Corte recto tradicional, más suelto y cómodo para el día a día.
              </span>
            </button>
          </div>
        </div>

        {/* Alerta de recomendación según corte */}
        <div className="p-3 bg-andrew-primary/10 border border-andrew-primary/30 rounded-2xl flex items-start gap-2.5 text-xs text-txt-main">
          <Info size={16} className="text-andrew-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {corteSeleccionado === 'jugador' ? (
              <span>
                <strong className="text-andrew-primary">Recomendación Jugador:</strong> Al ser corte ceñido (Player Version), si no te gusta muy pegada al cuerpo, <strong>te sugerimos pedir una talla más</strong> de la que usas habitualmente.
              </span>
            ) : (
              <span>
                <strong className="text-andrew-primary">Recomendación Hincha:</strong> El corte es estándar americano. Pide con confianza tu talla usual de polo.
              </span>
            )}
          </p>
        </div>

        {/* Tabla de Medidas en cm */}
        <div className="overflow-x-auto rounded-2xl border border-stroke bg-surface-sub">
          <table className="w-full text-left text-xs font-['Montserrat',sans-serif]">
            <thead>
              <tr className="bg-surface-card border-b border-stroke text-andrew-primary">
                <th className="py-3 px-4 uppercase font-black">TALLA</th>
                <th className="py-3 px-4 uppercase font-black">ANCHO (AXILA A AXILA)</th>
                <th className="py-3 px-4 uppercase font-black">LARGO TOTAL</th>
                <th className="py-3 px-4 uppercase font-black">PESO / ESTATURA SUGERIDA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke text-txt-muted font-medium">
              {corteSeleccionado === 'jugador' ? (
                <>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">S</td>
                    <td className="py-3 px-4">46 - 48 cm</td>
                    <td className="py-3 px-4">68 - 70 cm</td>
                    <td className="py-3 px-4">50 - 62 kg (1.60 - 1.64 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">M</td>
                    <td className="py-3 px-4">48 - 50 cm</td>
                    <td className="py-3 px-4">70 - 72 cm</td>
                    <td className="py-3 px-4">62 - 75 kg (1.64 - 1.69 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">L</td>
                    <td className="py-3 px-4">51 - 53 cm</td>
                    <td className="py-3 px-4">72 - 74 cm</td>
                    <td className="py-3 px-4">75 - 79 kg (1.70 - 1.74 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">XL</td>
                    <td className="py-3 px-4">53 - 55 cm</td>
                    <td className="py-3 px-4">74 - 76 cm</td>
                    <td className="py-3 px-4">79 - 85 kg (1.75 - 1.79 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">2XL</td>
                    <td className="py-3 px-4">55 - 57 cm</td>
                    <td className="py-3 px-4">77 - 79 cm</td>
                    <td className="py-3 px-4">85 - 90 kg (1.80 - 1.86 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">3XL</td>
                    <td className="py-3 px-4">57 - 59 cm</td>
                    <td className="py-3 px-4">78 - 81 cm</td>
                    <td className="py-3 px-4">90 - 95 kg (1.86 - 1.90 m)</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">S</td>
                    <td className="py-3 px-4">48 - 50 cm</td>
                    <td className="py-3 px-4">69 - 71 cm</td>
                    <td className="py-3 px-4">50 - 62 kg (1.62 - 1.69 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">M</td>
                    <td className="py-3 px-4">50 - 52 cm</td>
                    <td className="py-3 px-4">71 - 73 cm</td>
                    <td className="py-3 px-4">62 - 77 kg (1.70 - 1.75 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">L</td>
                    <td className="py-3 px-4">52 - 54 cm</td>
                    <td className="py-3 px-4">73 - 75 cm</td>
                    <td className="py-3 px-4">77 - 82 kg (1.75 - 1.80 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">XL</td>
                    <td className="py-3 px-4">54 - 56 cm</td>
                    <td className="py-3 px-4">75 - 77 cm</td>
                    <td className="py-3 px-4">82 - 89 kg (1.81 - 1.89 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">2XL</td>
                    <td className="py-3 px-4">56 - 58 cm</td>
                    <td className="py-3 px-4">77 - 80 cm</td>
                    <td className="py-3 px-4">89 - 96 kg (1.90 - 1.95 m)</td>
                  </tr>
                  <tr className="hover:bg-andrew-primary/5 transition-colors">
                    <td className="py-3 px-4 font-black text-txt-main">3XL</td>
                    <td className="py-3 px-4">58 - 61 cm</td>
                    <td className="py-3 px-4">80 - 82 cm</td>
                    <td className="py-3 px-4">97 - 105 kg (1.95 - 1.98 m)</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-txt-muted italic text-center">
          (*) Valores no absolutos pueden tener ligeras variaciones.
        </p>

        {/* Botón de Confirmación rápida */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-andrew-primary hover:bg-[#16a34a] text-black font-['Montserrat',sans-serif] font-black text-xs uppercase py-3 px-6 rounded-xl cursor-pointer transition-all shadow-md shadow-[#22c55e]/30"
          >
            ENTENDIDO, VOLVER A LA PRENDA
          </button>
        </div>

      </div>
    </div>
  );
}
